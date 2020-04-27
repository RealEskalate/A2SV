process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Alert = require("../models/AlertModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Alerts API", () => {
  //Get All Alerts - Valid Route
  describe("GET /api/alerts", () => {
    beforeEach(async () => {
      let alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should Get all alerts", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
    });
  });
  //Get All Alerts - InValid Route
  describe("GET /api/alertss", () => {
    beforeEach(async () => {
      let alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should Get all alert by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/alertss")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(404);
    });
  });
  //Get Alert By ID - Valid Alert
  describe("GET /api/alerts/:id", () => {
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should not Get all alerts", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts/"+alert._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('type');
      expect(response.body).to.have.property('degree');
    });
  });

  //Get Alert By ID - Invalid Alert
  describe("GET /api/alerts/:id", () => {
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should not Get alert by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(500);
    });
  });

  //Post Alert - Valid Alert
  describe("POST /api/alerts", ()=>{
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should insert alert", async () => {
      let response = await chai
        .request(server)
        .post("/api/alerts/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          title: "Testing2",
          type: "UPDATES",
          degree: "URGENT",
          content: "Random Non Sequitor2",
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("title");
        expect(response.body).to.have.property("type");
        expect(response.body).to.have.property("degree");
        expect(response.body).to.have.property("content");
    });
  });
  //Post Alert - Invalid Alert
  describe("POST /api/alerts", ()=>{
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should insert alert", async () => {
      let response = await chai
        .request(server)
        .post("/api/alerts/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          title: "Testing2",
          type: "UPDATES",
          degree: "URGENT222222",
          content: "Random Non Sequitor2",
        });
        expect(response).to.have.status(500);
    });
  });



  //Patch Alert - Valid Alert
  describe("PATCH /api/alerts", ()=>{
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should update alert", async () => {
      let response = await chai
        .request(server)
        .patch("/api/alerts/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: alert._id,
          title: "Testing2",
          type: "UPDATES",
          degree: "URGENT",
          content: "Random Non Sequitor2",
        });
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("title");
        expect(response.body).to.have.property("type");
        expect(response.body).to.have.property("degree");
        expect(response.body).to.have.property("content");
    });
  });

  //Patch Alert - Invalid Entry on Enum
  describe("PATCH /api/alerts", ()=>{
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should not update alert", async () => {
      let response = await chai
        .request(server)
        .patch("/api/alerts/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: alert._id,
          title: "Testing2",
          type: "UPDATESSSS",
          degree: "URGENT",
          content: "Random Non Sequitor2",
        });
        expect(response).to.have.status(500);
    });
  });

  
  //Delete Alert - Valid Alert
  describe("DELETE /api/alerts/", () => {
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should delete alert", async () => {
      let response = await chai
        .request(server)
        .delete("/api/alerts/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: alert._id
        });
      expect(response).to.have.status(201);
    });
  });
  //Delete Alert - Invalid Alert
  describe("DELETE /api/alerts/", () => {
    let alert;
    beforeEach(async () => {
        alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: "Testing",
        type: "UPDATES",
        degree: "URGENT",
        content: "Random Non Sequitor",
      });
      await alert.save();
    });
    afterEach(async () => {
      await Alert.collection.drop();
    });
    it("It should not delete alert", async () => {
      let response = await chai
        .request(server)
        .delete("/api/alerts/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: alert._id
        });
      expect(response).to.have.status(404);
    });
  });

});
