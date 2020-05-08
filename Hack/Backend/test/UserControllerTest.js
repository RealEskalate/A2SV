process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let {User} = require("../models/UserModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Users API", () => {
  //Get All Users - Valid Route
  describe("GET /api/users", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should Get all users", async() => {
      let response = await chai.request(server)
        .get("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      
    });
  });    
  describe("GET /api/userss", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    //Get All Users - Invalid Route
    it("It should not Get all users", async() => {
      let response = await chai.request(server)
        .get("/api/userss");
      expect(response).to.have.status(404);
    });
  });

  //Get User by ID - Valid User
  describe("GET /api/users/:id", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should Get user By ID", async() => {
      let response = await chai.request(server)
        .get("/api/users/"+newUser._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("username");
      expect(response.body).to.have.property("password");
      expect(response.body).to.have.property("gender");
      expect(response.body).to.have.property("age_group");
    });
  });

  //Get User by ID - Invalid User
  describe("GET /api/users/:id", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not Get user By ID", async() => {
      let response = await chai.request(server)
        .get("/api/users/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response.body).to.not.have.property("username");
    });
  });

  //Get User By Credentials - Valid User
  describe("GET /api/auth/login", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should authenticate user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/login")
        .send({
          username: "Testing",
          password: "10000",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.nested.property("user.username");
      expect(response.body).to.have.nested.property("user.password");
      expect(response.body).to.have.nested.property("user.gender");
      expect(response.body).to.have.nested.property("user.age_group");
    });
  });

  //Get User By Credentials - In Valid User
  describe("GET /api/auth/login", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not authenticate user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/login")
        .send({
          username: "Testing",
          password: "100",
        });
      expect(response).to.have.status(404);
    });
  });

  //Post User - Valid User
  describe("POST /api/auth/register", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should register user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "UnitTesting",
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
  });
  //Post User - Invalid User (Password Length)
  describe("POST /api/auth/register", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not register user due to password length", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "UnitTesting",
          password: "U",
          gender: "MALE",
          age_group: "21-30",
        });
        expect(response).to.have.status(500);
      });
  });
  //Post User - Missing Fields
  describe("POST /api/auth/register", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not register user due to missing fields", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "UnitTesting",
        });
        expect(response).to.have.status(500);
      });
  });
  //Post User - Existing User
  describe("POST /api/auth/register", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not register user due to already existing user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "Testing",
          password: "10000",
        });
        expect(response).to.have.status(500);
      });
  });

  //Update User - Valid User
  describe("PATCH /api/users", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should update user", async() => {
      let response = await chai.request(server)
        .patch("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: newUser._id,
          username:"Testing2",
          password:"10000",
          gender:"FEMALE",
          age_group:"21-30",  
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("username");
        expect(response.body).to.have.property("password");
        expect(response.body).to.have.property("gender");
        expect(response.body).to.have.property("age_group");
      });
  });


  //Update User - Invalid User - Duplicate Username
  describe("PATCH /api/users", () => {
    let newUser, newUser2;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
      newUser2 = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing2",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser2.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not update user", async() => {
      let response = await chai.request(server)
        .patch("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: newUser2._id,
          username:"Testing",
          password:"10000",
          gender:"FEMALE",
          age_group:"21-30",  
        });
        expect(response).to.have.status(400);
      });
  });

  //Delete User - Valid User
  describe("DELETE /api/users", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should delete user", async() => {
      let saved_response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "UnitTesting",
          password: "UnitTesting",
          gender: "MALE",
          age_group: "21-30",
        });
      let response = await chai.request(server)
        .delete("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: saved_response.body._id
        });
        expect(response).to.have.status(201);
      });
  });
  //Delete User - Invalid User
  describe("DELETE /api/users", () => {
    beforeEach(async() => {
      let newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.collection.drop();
    });  
    it("It should not delete user", async() => {
      let response = await chai.request(server)
        .delete("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507"
        });
        expect(response).to.have.status(404);
      });
  });

});
