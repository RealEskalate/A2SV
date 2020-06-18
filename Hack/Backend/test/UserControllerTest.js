process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
let mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const config = require("config");
const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {

  let user;
  var tokens;
  beforeEach(async () => {

    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
      password:
        "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      age_group: "21-30",
    });

    try {
      jwt.sign({ user }, config.get("secretkey"), (err, token) => {
        tokens = token;
      });
    } catch (err) {
      console.log('err ' + err.toString())
    }
    await user.save();
  });

  afterEach(async () => {
    await User.findByIdAndDelete(user._id);
  });

  /* /api/users is deprecated

  it("It should Get all users", async () => {
    let response = await chai.request(server)
      .get("/api/users")
      .set(
        "Authorization",
        "Bearer " + tokens
      );
    expect(response).to.have.status(200);

    // });
  });

  //   //Get All Users - Invalid Route
  it("It should not Get all users", async () => {
    let response = await chai.request(server)
      .get("/api/userss");
    expect(response).to.have.status(404);
  });

  */

  it("It should Get user By ID", async () => {
    let response = await chai.request(server)
      .get("/api/users/" + user._id)
      .set(
        "Authorization",
        "Bearer " + tokens
      );
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });


  it("It should not Get user By ID", async () => {
    let response = await chai.request(server)
      .get("/api/users/5e904cce7a1c6b627ae9f507")
      .set(
        "Authorization",
        "Bearer " + tokens
      );
    expect(response.body).to.not.have.property("username");
  });

  it("It should authenticate user", async () => {
    let response = await chai.request(server)
      .post("/api/auth/login")
      .send({
        username: user.username,
        password: "10000",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.nested.property("user.username");
    expect(response.body).to.have.nested.property("user.password");
    expect(response.body).to.have.nested.property("user.gender");
    expect(response.body).to.have.nested.property("user.age_group");
  });

  it("It should register user", async () => {
    let response = await chai.request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");

  });

  it("It should not register user due to password length", async () => {
    let response = await chai.request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
        password: "U",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(500);
  });

  it("It should not register user due to missing fields", async () => {
    let response = await chai.request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
      });
    expect(response).to.have.status(500);
  });

  it("It should not register user due to already existing user", async () => {
    let response = await chai.request(server)
      .post("/api/auth/register")
      .send({
        username: user.username,
        password: "10000",
      });
    expect(response).to.have.status(500);
  });

  it("It should update user", async () => {
    let response = await chai.request(server)
      .patch("/api/users")
      .set(
        "Authorization",
        "Bearer " + tokens
      )
      .send({
        _id: user._id,
        username: "Testing " + Date.now(),
        password: "10000",
        gender: "FEMALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  // //Update User - Invalid User - Duplicate Username
  describe("PATCH /api/users", () => {
    let newUser;
    beforeEach(async () => {
      newUser = new User({
        _id: mongoose.Types.ObjectId(),
        username: "Testing " + Date.now(),
        password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await newUser.save();
    });
    afterEach(async () => {
      await User.findByIdAndDelete(newUser._id);
    });
    it("It should not update user", async () => {
      let response = await chai.request(server)
        .patch("/api/users")
        .set(
          "Authorization",
          "Bearer " + tokens
        )
        .send({
          _id: user._id,
          username: newUser.username,
          password: "10000",
          gender: "FEMALE",
          age_group: "21-30",
        });
      expect(response).to.have.status(400);
    });
  });

  it("It should delete user", async () => {
    let username = "Testing " + Date.now();
    let saved_response = await chai.request(server)
      .post("/api/auth/register")
      .send({
        username,
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    let request = await chai.request(server)
      .post("/api/auth/login")
      .send({
        username,
        password: "UnitTesting",
      });
    let response = await chai.request(server)
      .delete("/api/users")
      .set(
        "Authorization",
        "Bearer " + request.body.token
      )
      .send({
        _id: saved_response.body._id
      });
    expect(response).to.have.status(201);
  });

  it("It should not delete user", async () => {
    let response = await chai.request(server)
      .delete("/api/users")
      .set(
        "Authorization",
        "Bearer " + tokens
      )
      .send({
        _id: "5e904cce7a1c6b627ae9f507"
      });
    expect(response).to.have.status(403);
  });

});
