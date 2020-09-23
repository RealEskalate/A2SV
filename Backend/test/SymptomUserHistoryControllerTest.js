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

describe("Symptom User History API", () => {
  let symptom_user;
  let user;
  let symptom;
  let symptom2;
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
  });

  it("It should save a new symptom history", async () => {
    let save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptoms: [symptom2._id],
      });
    let response = await chai
      .request(server)
      .get("/api/symptomuserhistory/user/" + user._id)
      .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("user_id");
    expect(response.body.events).to.have.lengthOf(2);
  });
  it("It should not save multiple symptom history", async () => {
    let save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
          _id: mongoose.Types.ObjectId(),
          symptoms: [symptom2._id],
          source: "MOBILE",
      });
    save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptoms: [symptom._id],
        source: "WEB"
      });
    save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
          _id: mongoose.Types.ObjectId(),
          symptoms: [symptom2._id],
          source: "MOBILE",
      });
    save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
          _id: mongoose.Types.ObjectId(),
          symptoms: [symptom._id],
          source: "WEB",
      });
    let response = await chai
      .request(server)
      .get("/api/symptomuserhistory/user/" + user._id)
      .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("user_id");
    expect(response.body.events).to.have.lengthOf(2);
  });
  it("It should not save any new symptom history", async () => {
    let save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptoms: [symptom._id],
      });
    let response = await chai
      .request(server)
      .get("/api/symptomuserhistory/user/" + user._id)
      .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("user_id");
    expect(response.body.events).to.have.lengthOf(1);
  });
  it("It should delete all symptom histories", async () => {
    let save_symptoms = await chai
      .request(server)
      .post("/api/symptomuser/multiple/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptoms: [symptom2._id],
      });
    let response = await chai
      .request(server)
      .delete("/api/symptomuserhistory/user/" + user._id)
      .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("user_id");
    expect(response.body.events).to.have.lengthOf(1);
  });
  it("It should not delete symptom histories", async () => {
    let response = await chai
      .request(server)
      .delete("/api/symptomuserhistory/user/5ede6113c7386800179baebd")
      .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(403);
  });
});
