process.env.NODE_ENV = "test";
require("dotenv").config();
let chai = require("chai");
let chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const { expect } = chai;

let server = require("../index");
let { User } = require("../models/UserModel");
let { Symptom } = require("../models/Symptom");
let { SymptomUser } = require("../models/SymptomUser");

chai.use(chaiHttp);

describe("New Citizen Symptom API", () => {
    let symptom_user;
    let user;
    let symptom;
    let symptom2;
    let tokens;
    beforeEach(async () => {
        user = new User({
            _id: mongoose.Types.ObjectId(),
            username: `${Date.now().toString()} ${Math.random()}`,
            password:
                "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
            gender: "FEMALE",
            age_group: "21-30",
        });

        try {
            jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
                tokens = token;
            });
        } catch (err) {
            console.log("ERROR " + err.toString());
        }

        await user.save();
        symptom = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Fever",
            description: "High Temperature",
        });
        await symptom.save();
        symptom2 = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Cold",
            description: "Low Temperature",
        });
        await symptom2.save();

        symptom_user = new SymptomUser({
            _id: mongoose.Types.ObjectId(),
            user_id: user._id,
            symptom_id: symptom._id,
        });
        await symptom_user.save();
    });

    afterEach(async () => {
        await User.findByIdAndDelete(user._id);
        await SymptomUser.findByIdAndDelete(symptom_user._id);
        await Symptom.findByIdAndDelete(symptom._id);
        await Symptom.findByIdAndDelete(symptom2._id);
    });

    it("It should save a new citizen symptom aggregation", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        let response = await chai
            .request(server)
            .get("/api/new_citizen_symptoms");

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
    });
});
