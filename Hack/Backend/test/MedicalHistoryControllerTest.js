process.env.NODE_ENV = "test";
var chai = require("chai");
var { MedicalHistory } = require("../models/MedicalHistory");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
var chaiHttp = require("chai-http");
var server = require("../index");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Medical History API", () => {
  describe("GET /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should list all medical histories on /api/medicalhistory GET", async () => {
      let response = await chai
        .request(server)
        .get("/api/medicalhistory")
        .set("Authorization", "Bearer " + tokens);
      //Because we don't want to allow data for all users to be shown right now, status will be 404
      expect(response).to.have.status(404);
    });
  });

  describe("POST /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should add a medical history on /medicalhistory POST", async () => {
      let response = await chai
        .request(server)
        .post("/api/medicalhistory")
        .set("Authorization", "Bearer " + tokens)
        .send({
          name: "Pneumonia",
          description: "inflammatory condition of lung",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("description");
    });
  });

  describe("GET /api/medicalhistory/:id", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should list a single medical history by id on /medicalhistory/:id GET", function (done) {
      chai
        .request(server)
        .get("/api/medicalhistory/" + medicalHistory._id)
        .set("Authorization", "Bearer " + tokens)
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("name");
          expect(response.body).to.have.property("description");
          expect(response.body).to.have.property("_id");
          done();
        });
    });
  });

  describe("GET /api/medicalhistory/name/:name", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should list a single medical history by name on /medicalhistory/name/:name GET", function (done) {
      chai
        .request(server)
        .get("/api/medicalhistory/name/" + medicalHistory.name)
        .set("Authorization", "Bearer " + tokens)
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          expect(response.body.name).to.be.equal(medicalHistory.name);
          done();
        });
    });
  });

  describe("PATCH /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should update a single medical history on api/medicalhistory/ PATCH", function (done) {
      chai
        .request(server)
        .patch("/api/medicalhistory/" + medicalHistory._id)
        .send({ name: "FAILURE OF THE KIDNEY" })
        .set("Authorization", "Bearer " + tokens)
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          done();
        });
    });
  });

  describe("DELETE /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should delete a single medical history on api/medicalhistory/ DELETE", function (done) {
      chai
        .request(server)
        .delete("/api/medicalhistory/")
        .set("Authorization", "Bearer " + tokens)
        .send({ _id: medicalHistory._id })
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          done();
        });
    });
  });
  describe("GET /api/medicalhistory/name/:name", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should list a single medical history by name on /medicalhistory/name/:name GET", function (done) {
      chai
        .request(server)
        .get("/api/medicalhistory/name/" + medicalHistory.name)
        .set("Authorization", "Bearer " + tokens)
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          done();
        });
    });
  });

  describe("PATCH /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should update a single medical history on api/medicalhistory/ PATCH", function (done) {
      chai
        .request(server)
        .patch("/api/medicalhistory/" + medicalHistory._id)
        .send({ name: "FAILURE OF THE KIDNEY" })
        .set("Authorization", "Bearer " + tokens)
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          done();
        });
    });
  });

  describe("DELETE /api/medicalhistory", () => {
    let medicalHistory;
    let user;
    let tokens;
    beforeEach(async () => {
      // MedicalHistory.collection.drop();
      medicalHistory = new MedicalHistory({
        _id: mongoose.Types.ObjectId(),
        name: "HyperTens.",
        description: "High blood pressure",
      });
      await medicalHistory.save();
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()}`,
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
        console.log(err.toString());
      }
      await user.save();
    });

    afterEach(async () => {
      await MedicalHistory.findByIdAndDelete(medicalHistory._id);
      await User.findByIdAndDelete(user._id);
    });

    it("should delete a single medical history on api/medicalhistory/ DELETE", function (done) {
      chai
        .request(server)
        .delete("/api/medicalhistory/")
        .set("Authorization", "Bearer " + tokens)
        .send({ _id: medicalHistory._id })
        .end(function (err, response) {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property("_id");
          expect(response.body).to.have.property("name");
          done();
        });
    });
  });
});
