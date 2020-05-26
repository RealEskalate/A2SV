process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

let { Symptom } = require("../models/Symptom");
let { SymptomUser } = require("../models/SymptomUser");
let { User } = require("../models/UserModel");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Symptom Users API", () => {

    describe("GET /api/symptomuser", () => {
        let symptom_user;
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId()
            });
            await symptom_user.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
        });
        it("It should list symptom users", async () => {
            let response = await chai
                .request(server)
                .get("/api/symptomuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            expect(response).to.have.status(200);
            expect(response.body).to.be.a('array');
        });
    });


    // Post Symptom User 
    describe("POST /api/symptomuser", () => {
        let symptom_user;
        let symptom;
        let user;
        let new_symptom_user;
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId(),
            });
            symptom = new Symptom({
                _id: mongoose.Types.ObjectId(),
                name: "Fever",
                description: "High Temperature"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await symptom_user.save();
            await symptom.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
            await SymptomUser.findByIdAndDelete(new_symptom_user._id);
            await Symptom.findByIdAndDelete(symptom._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should add a new symptom user pair", async () => {
            let response = await chai
                .request(server)
                .post("/api/symptomuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                )
                .send({
                    _id: mongoose.Types.ObjectId(),
                    symptom_id: symptom._id,
                    user_id: user._id
                });
            expect(response).to.have.status(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.property('symptom_id');
            expect(response.body).to.have.property('user_id');

            new_symptom_user = response.body;
        });
    });


    // Should get symptom user  by symptom id
    describe("Get /api/symptomuser/symptom/:id", () => {
        let symptom_user;
        let symptom;
        let user;
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId(),
            });
            symptom = new Symptom({
                _id: mongoose.Types.ObjectId(),
                name: "Fever",
                description: "High Temperature"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await symptom_user.save();
            await symptom.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
            await Symptom.findByIdAndDelete(symptom._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should get a new symptom user pair", async () => {
            let response = await chai
                .request(server)
                .get("/api/symptomuser/symptom/" + symptom_user.symptom_id)
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                )
            expect(response).to.have.status(200);
        });
    });


    // Should get symptom by user id
    describe("Get /api/symptomuser/user/:id", () => {
        let symptom_user;
        let symptom;
        let user;
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId(),
            });
            symptom = new Symptom({
                _id: mongoose.Types.ObjectId(),
                name: "Fever",
                description: "High Temperature"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await symptom_user.save();
            await symptom.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
            await Symptom.findByIdAndDelete(symptom._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should get a new symptom user pair", async () => {
            let response = await chai
                .request(server)
                .get("/api/symptomuser/user/" + symptom_user.user_id)
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                )
            expect(response).to.have.status(200);
        });
    });

    // Patch Symptom User
    describe("PATCH /api/symptomuser/", () => {
        let symptom_user;
        let symptom;
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId(),
            });
            symptom = new Symptom({
                _id: mongoose.Types.ObjectId(),
                name: "Fever",
                description: "High body temperature"
            });
            await symptom_user.save();
            await symptom.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
            await Symptom.findByIdAndDelete(symptom._id);
        });

        it("It should update symptom user", async () => {
            let response = await chai
                .request(server)
                .patch("/api/symptomuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                )
                .send({
                    _id: symptom_user._id,
                    symptom_id: symptom._id
                });

            expect(response).to.have.status(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.property('symptom_id');
            expect(response.body).to.have.property('user_id');
        });
    });

    // Delete Symptom User
    describe("DELETE /api/symptomuser/", () => {
        beforeEach(async () => {
            symptom_user = new SymptomUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                symptom_id: mongoose.Types.ObjectId(),
            });
            await symptom_user.save();
        });
        afterEach(async () => {
            await SymptomUser.findByIdAndDelete(symptom_user._id);
        });
        it("It should delete symptom user", async () => {
            let response = await chai
                .request(server)
                .delete("/api/symptomuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                )
                .send({
                    _id: symptom_user._id
                });
            expect(response).to.have.status(200);
        });
    });
});

