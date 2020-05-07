process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { Message } = require("../models/MessageModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Messages API", () => {
  //Get All Alerts - Valid Route
  describe("GET /api/messages", () => {
    beforeEach(async () => {
      let message = new Message({
        _id: mongoose.Types.ObjectId(),
        name: "Test Name",
        email: "test@example.com",
        message: "Test Message"
      });
      await message.save();
      console.log("Message saved");
    });
    afterEach(async () => {
      await Message.collection.drop();
    });
    it("It should Get all messages", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
  //Get All Messages - InValid Route
  describe("GET /api/message", () => {
    beforeEach(async () => {
        let message = new Message({
            _id: mongoose.Types.ObjectId(),
            name: "Test Name",
            email: "test@example.com",
            message: "Test Message"
        });
        await message.save();
    });
    afterEach(async () => {
      await Message.collection.drop();
    });
    it("It should not Get messages", async () => {
      let response = await chai
        .request(server)
        .get("/api/message")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Message.collection.drop();
    });
    it("It should get message by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/" + message._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Message.collection.drop();
    });
    it("It should not Get message by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Message.collection.drop();
    });
    it("It should get message by Email", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/email/" + message.email)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Message.collection.drop();
    });
    it("It should not Get message by email", async () => {
      let response = await chai
        .request(server)
        .get("/api/messages/email/test@test.com")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.lengthOf(0);
    });
  });

  //Post Message - Valid Message
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
        await Message.collection.drop();
    });
    it("It should insert message", async () => {
      let response = await chai
        .request(server)
        .post("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
        await Message.collection.drop();
    });
    it("It should not insert message", async () => {
      let response = await chai
        .request(server)
        .post("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({});
      expect(response).to.have.status(500);
      expect(response.error.text).to.include("name: Path `name` is required., email: Path `email` is required., message: Path `message` is required.");
    });
  });

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
      await Message.collection.drop();
    });
    it("It should delete message", async () => {
      let response = await chai
        .request(server)
        .delete("/api/messages/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Message.collection.drop();
    });
    it("It should not delete message", async () => {
      let response = await chai
        .request(server)
        .delete("/api/messages/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: message._id
        });
      expect(response).to.have.status(404);
    });
  });

});
