process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { Message } = require("../models/MessageModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Messages API", () => {
  /* GET and DELETE routes are deprecated
  //Get All Alerts - Valid Route
  describe("GET /api/messages", () => {
    let message;
    beforeEach(async () => {
      message = new Message({
        _id: mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test@example.com",
        message: "Test Message"
      });
      await message.save();
      console.log("Message saved");
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should Get all messages", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
  //Get All Messages - InValid Route
  describe("GET /api/message", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should not Get messages", async () => {
      let response = await chai
        .request(server)
        .get("/api/message")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Message By ID - Valid Id
  describe("GET /api/messages/:id", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should get message by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/" + message._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('name', 'Test Name');
      expect(response.body).to.have.property('email', 'test@example.com');
      expect(response.body).to.have.property('message', 'Test Message');
    });
  });

  //Get Message By ID - Invalid Id
  describe("GET /api/messages/:id", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should not Get message by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Message By Email - Valid Email
  describe("GET /api/messages/email/:email", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should get message by Email", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/email/" + message.email)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
        expect(response).to.have.status(200);
        expect(response.body).to.have.length.greaterThan(0);
    });
  });

  //Get Message By Email - Invalid Email
  describe("GET /api/messages/email/:email", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should not Get message by email", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/email/test@test.com")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.lengthOf(0);
    });
  });

  */
  //Post Message - Valid Message
  describe("POST /api/messages", () => {
    let message;
    let new_message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
      await Message.findByIdAndDelete(new_message._id);
    });
    it("It should insert message", async () => {
      let response = await chai
        .request(server)
        .post("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("name", "Test Name");
      expect(response.body).to.have.property("email", "test@example.com");
      expect(response.body).to.have.property("message", "Test Message");  
      new_message = response.body;    
    });
  });

  //Post Message - Invalid Message
  describe("POST /api/messages", () => {
    let message;
    beforeEach(async () => {
        message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should not insert message", async () => {
      let response = await chai
        .request(server)
        .post("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({});
      expect(response).to.have.status(500);
      expect(response.error.text).to.include("name: Path `name` is required., email: Path `email` is required., message: Path `message` is required.");
    });
  });
  
  /*
  //Delete Message - Valid Message
  describe("DELETE /api/messages/", () => {
    let message;
    beforeEach(async () => {
      message = new Message({
        _id: mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test@example.com",
        message: "Test Message"
      });
      await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should delete message", async () => {
      let response = await chai
        .request(server)
        .delete("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: message._id
        });
      expect(response).to.have.status(200);
    });
  });
  //Delete Message - Invalid Message
  describe("DELETE /api/messages/", () => {
    let message;
    beforeEach(async () => {
      message = new Message({
        _id: mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test@example.com",
        message: "Test Message"
      });
      await message.save();
    });
    afterEach(async () => {
      await Message.findByIdAndDelete(message._id);
    });
    it("It should not delete message", async () => {
      let response = await chai
        .request(server)
        .delete("/api/messages/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: message._id
        });
      expect(response).to.have.status(404);
    });
  });
  */
});
