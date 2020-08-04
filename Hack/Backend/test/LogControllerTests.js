process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Log = require("../models/LogModel");
let mongoose = require("mongoose");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { expect } = chai;
chai.use(chaiHttp);

describe("Logs API", () => {
  // Get All Logs - Valid Route
  describe("GET /api/logs", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get all logs", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });
  // Get All Logs - Invalid Route
  describe("GET /api/logss", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not get logs", async () => {
      let response = await chai
        .request(server)
        .get("/api/logss")
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(404);
    });
  });

  // Get log by Id - Valid Id
  describe("GET /api/logs/:id", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should get log by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs/" + log._id)
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("level");
      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("meta");
    });
  });

  // Get log by Id - Invalid Id
  describe("GET /api/logs/:id", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not get log by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs/" + mongoose.Types.ObjectId())
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(404);
    });
  });

  // Get All Logs with filter - Valid parameters
  describe("GET /api/logs?statusCode=&url=", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get all logs matching the given filter", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .query({ statusCode: 200, url: "/api/logs" })
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  });

  // Get All Logs with filter - Invalid parameters
  describe("GET /api/logs", () => {
    let log;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
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
            statusCode: 200,
          },
          responseTime: 1000,
        },
      });
      await log.save();
      console.log("Log saved");
    });
    afterEach(async () => {
      await Log.findByIdAndDelete(log._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not get all logs matching the given filters", async () => {
      let response = await chai
        .request(server)
        .get("/api/logs")
        .query({ statusCode: 400, url: "/api/logs" })
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
      expect(response.body).to.have.lengthOf(0);
    });
  });
});
