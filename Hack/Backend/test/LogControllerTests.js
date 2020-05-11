process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Log = require("../models/LogModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Logs API", () => {
  // Get All Logs - Valid Route
  describe("GET /api/logs", () => {
    let log;
    beforeEach(async () => {
      log = new Log({
        _id: mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        level: "info",
        message: "Test message",
        meta: {
          req: {
            url: "/api/logs",
            method: "GET",
            httpVersion: "1.1",
            originalUrl: "/api/logs",
            query: [],
          },
          res: {
            statusCode: 200
          },
          responseTime: 1000
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
    });
    it("It should Get all logs", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
  // Get All Logs - Invalid Route
  describe("GET /api/logss", () => {
    it("It should not get logs", async () => {
      let response = await chai
        .request(server)
        .get("/api/logss")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  // Get log by Id - Valid Id
  describe("GET /api/logs/:id", () => {
    let log;
    beforeEach(async () => {
      log = new Log({
        _id: mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        level: "info",
        message: "Test message",
        meta: {
          req: {
            url: "/api/logs",
            method: "GET",
            httpVersion: "1.1",
            originalUrl: "/api/logs",
            query: [],
          },
          res: {
            statusCode: 200
          },
          responseTime: 1000
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
    });
    it("It should get log by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs/" + log._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('level');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('meta');
    });
  });

  // Get log by Id - Invalid Id
  describe("GET /api/logs/:id", () => {
    let log;
    beforeEach(async () => {
      log = new Log({
        _id: mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        level: "info",
        message: "Test message",
        meta: {
          req: {
            url: "/api/logs",
            method: "GET",
            httpVersion: "1.1",
            originalUrl: "/api/logs",
            query: [],
          },
          res: {
            statusCode: 200
          },
          responseTime: 1000
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
    });
    it("It should not get log by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs/" + mongoose.Types.ObjectId())
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
        expect(response).to.have.status(404);
    });
  });

  // Get All Logs with filter - Valid parameters
  describe("GET /api/logs?statusCode=&url=", () => {
    let log;
    beforeEach(async () => {
      log = new Log({
        _id: mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        level: "info",
        message: "Test message",
        meta: {
          req: {
            url: "/api/logs",
            method: "GET",
            httpVersion: "1.1",
            originalUrl: "/api/logs",
            query: [],
          },
          res: {
            statusCode: 200
          },
          responseTime: 1000
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
    });
    it("It should Get all logs matching the given filter", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .query({statusCode : 200, url : '/api/logs'})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });

  // Get All Logs with filter - Invalid parameters
  describe("GET /api/logs", () => {
    let log;
    beforeEach(async () => {
      log = new Log({
        _id: mongoose.Types.ObjectId(),
        timestamp: Date.now(),
        level: "info",
        message: "Test message",
        meta: {
          req: {
            url: "/api/logs",
            method: "GET",
            httpVersion: "1.1",
            originalUrl: "/api/logs",
            query: [],
          },
          res: {
            statusCode: 200
          },
          responseTime: 1000
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
    });
    it("It should not get all logs matching the given filters", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .query({statusCode : 400, url : '/api/logs'})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.have.lengthOf(0);
    });
  });
});


