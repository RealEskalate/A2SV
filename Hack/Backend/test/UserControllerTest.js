process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let {User} = require("../models/UserModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {
  //Get All Users - Valid Route
  describe("GET /api/users", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should Get all users", async() => {
      let response = await chai.request(server)
        .get("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      
    });
  });    
  describe("GET /api/userss", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
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
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should Get user By ID", async() => {
      let response = await chai.request(server)
        .get("/api/users/"+newUser._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
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
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should not Get user By ID", async() => {
      let response = await chai.request(server)
        .get("/api/users/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response.body).to.not.have.property("username");
    });
  });

  //Get User By Credentials - Valid User
  describe("GET /api/auth/login", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should authenticate user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/login")
        .send({
          username: newUser.username,
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
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
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
    let newUser;
    let addedUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
      await User.findByIdAndDelete(addedUser._id);
    });  
    it("It should register user", async() => {
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

        addedUser = response.body;
    });
  });
  //Post User - Invalid User (Password Length)
  describe("POST /api/auth/register", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should not register user due to password length", async() => {
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
  });
  //Post User - Missing Fields
  describe("POST /api/auth/register", () => {
    let newUser
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should not register user due to missing fields", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "Testing " + Date.now(),
        });
        expect(response).to.have.status(500);
      });
  });
  //Post User - Existing User
  describe("POST /api/auth/register", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should not register user due to already existing user", async() => {
      let response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: newUser.username,
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
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should update user", async() => {
      let response = await chai.request(server)
        .patch("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: newUser._id,
          username:"Testing " + Date.now(),
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
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
      newUser2 = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser2.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
      await User.findByIdAndDelete(newUser2._id);
    });  
    it("It should not update user", async() => {
      let response = await chai.request(server)
        .patch("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: newUser2._id,
          username:newUser.username,
          password:"10000",
          gender:"FEMALE",
          age_group:"21-30",  
        });
        expect(response).to.have.status(400);
      });
  });

  //Delete User - Valid User
  describe("DELETE /api/users", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should delete user", async() => {
      let saved_response = await chai.request(server)
        .post("/api/auth/register")
        .send({
          username: "Testing " + Date.now(),
          password: "UnitTesting",
          gender: "MALE",
          age_group: "21-30",
        });
      let response = await chai.request(server)
        .delete("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: saved_response.body._id
        });
        expect(response).to.have.status(201);
      });
  });
  //Delete User - Invalid User
  describe("DELETE /api/users", () => {
    let newUser;
    beforeEach(async() => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing " + Date.now(),
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async()=>{
      await User.findByIdAndDelete(newUser._id);
    });  
    it("It should not delete user", async() => {
      let response = await chai.request(server)
        .delete("/api/users")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507"
        });
        expect(response).to.have.status(404);
      });
  });

});
