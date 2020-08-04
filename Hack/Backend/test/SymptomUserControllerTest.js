process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { Symptom } = require("../models/Symptom");
let { SymptomUser } = require("../models/SymptomUser");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Symptom Users API", () => {
  // describe("GET /api/symptomuser", () => {
  let symptom_user;
  let user;
  let symptom;
  let tokens;
  beforeEach(async () => {
    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
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
  });

  it("It should add a new symptom user pair", async () => {
    let response = await chai
      .request(server)
      .post("/api/symptomuser/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptom_id: symptom._id,
        user_id: user._id,
      });
    expect(response).to.have.status(201);
    expect(response.body).to.be.a("object");
  });

  it("It should get a new symptom user pair", async () => {
    let response = await chai
      .request(server)
      .get("/api/symptomuser/symptom/" + symptom_user.symptom_id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });

  it("It should update symptom user", async () => {
    let response = await chai
      .request(server)
      .patch("/api/symptomuser/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: symptom_user._id,
        symptom_id: symptom._id,
      });

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("symptom_id");
    expect(response.body).to.have.property("user_id");
  });
  it("It should delete symptom user", async () => {
    let response = await chai
      .request(server)
      .delete("/api/symptomuser/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: symptom_user._id,
      });
    expect(response).to.have.status(200);
  });
});
