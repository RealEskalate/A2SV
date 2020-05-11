process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

let { MedicalHistory } = require("../models/MedicalHistory");
let { MedicalHistoryUser } = require("../models/MedicalHistoryUser");
let { User } = require("../models/UserModel");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

//Get Medical History Users 
describe("Medical History Users API", () => {

    describe("GET /api/medicalhistoryuser", () => {
        let medicalhistory_user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId()
            });
            await medicalhistory_user.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
        });
        it("It should Get medicalhistory users", async () => {
            let response = await chai
                .request(server)
                .get("/api/medicalhistoryuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    );
            expect(response).to.have.status(200);
            expect(response.body).to.be.a('array');
        });
    });


    //Get Medicalhistory User By ID
    describe("GET /api/medicalhistoryuser/:id", () => {
        let medicalhistory_user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            await medicalhistory_user.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
        });
        it("It should Get medical history user by id", async () => {
            let response = await chai
                .request(server)
                .get("/api/medicalhistoryuser/" + medicalhistory_user._id)
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    );
            expect(response).to.have.status(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.property('user_id');
            expect(response.body).to.have.property('medicalhistory_id');
        });
    });

    // Should get medical history user pair by user id
    describe("Get /api/medicalhistoryuser/user/:id", () => {
        let medicalhistory_user;
        let medicalhistory;
        let user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            medicalhistory = new MedicalHistory({
                _id: mongoose.Types.ObjectId(),
                name: "Pneumonia",
                description: "Infection of the lung"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await medicalhistory_user.save();
            await medicalhistory.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
            await MedicalHistory.findByIdAndDelete(medicalhistory._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should get a new medicalhistory user pair", async () => {
            let response = await chai
                .request(server)
                .get("/api/medicalhistoryuser/user/" + medicalhistory_user.user_id)
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    )
            expect(response).to.have.status(200);
        });
    });


    // Should get medical history user pair by medicalhistory id
    describe("Get /api/medicalhistoryuser/medicalhistory/:id", () => {
        let medicalhistory_user;
        let medicalhistory;
        let user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            medicalhistory = new MedicalHistory({
                name: "Pneumonia",
                description: "Infection of the lung"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await medicalhistory_user.save();
            await medicalhistory.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
            await MedicalHistory.findByIdAndDelete(medicalhistory._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should get a new medicalhistory user pair", async () => {
            let response = await chai
                .request(server)
                .get("/api/medicalhistoryuser/medicalhistory/" + medicalhistory_user.medicalhistory_id)
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    )
            expect(response).to.have.status(200);
        });
    });

    // Post Medicalhistory User 
    describe("POST /api/medicalhistoryuser", () => {
        let medicalhistory_user;
        let medicalhistory;
        let user;
        let new_medicalhistory_user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            medicalhistory = new MedicalHistory({
                _id: mongoose.Types.ObjectId(),
                name: "Pneumonia",
                description: "Lung infection"
            });
            user = new User({
                _id: mongoose.Types.ObjectId(),
                username: "Testing",
                password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
                gender: "FEMALE",
                age_group: "21-30",
            });
            await user.save();
            await medicalhistory_user.save();
            await medicalhistory.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
            await MedicalHistoryUser.findByIdAndDelete(new_medicalhistory_user._id);
            await MedicalHistory.findByIdAndDelete(medicalhistory._id);
            await User.findByIdAndDelete(user._id);
        });
        it("It should add a new medical history user", async () => {
            let response = await chai
                .request(server)
                .post("/api/medicalhistoryuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    )
                .send({
                    _id: mongoose.Types.ObjectId(),
                    medicalhistory_id: medicalhistory._id,
                    user_id: user._id
                });
            expect(response).to.have.status(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.property('medicalhistory_id');
            expect(response.body).to.have.property('user_id');
            new_medicalhistory_user = response.body;
        });
    });

    // Patch MedicalHistory
    describe("PATCH /api/medicalhistoryuser/", () => {
        let medicalhistory_user;
        let medicalhistory;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            medicalhistory = new MedicalHistory({
                _id: mongoose.Types.ObjectId(),
                name: "Pneumonia",
                description: "Lung infection"
            });
            await medicalhistory_user.save();
            await medicalhistory.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
            await MedicalHistory.findByIdAndDelete(medicalhistory._id);
        });

        it("It should update medicalhistory user", async () => {
            let response = await chai
                .request(server)
                .patch("/api/medicalhistoryuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    )
                .send({
                    _id: medicalhistory_user._id,
                    medicalhistory_id: medicalhistory._id
                });

            expect(response).to.have.status(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.property('medicalhistory_id');
            expect(response.body).to.have.property('user_id');
        });
    });

    //Delete medicalhistoryuser
    describe("DELETE /api/medicalhistoryuser/", () => {
        let medicalhistory_user;
        beforeEach(async () => {
            medicalhistory_user = new MedicalHistoryUser({
                _id: mongoose.Types.ObjectId(),
                user_id: mongoose.Types.ObjectId(),
                medicalhistory_id: mongoose.Types.ObjectId(),
            });
            await medicalhistory_user.save();
        });
        afterEach(async () => {
            await MedicalHistoryUser.findByIdAndDelete(medicalhistory_user._id);
        });
        it("It should delete medical history user", async () => {
            let response = await chai
                .request(server)
                .delete("/api/medicalhistoryuser/")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                    )
                .send({
                    _id: medicalhistory_user._id
                });
            expect(response).to.have.status(200);
        });
    });

});