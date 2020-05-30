process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Alert = require("../models/AlertModel");
let { User } = require("../models/UserModel");
let mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { expect } = chai;
chai.use(chaiHttp);

describe("Alerts API", () => {
  //Get All Alerts - Valid Route
  describe("GET /api/alerts", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get all alerts", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts")
        .set(
          "Authorization",
          "Bearer " + tokens
        );
      expect(response).to.have.status(200);
    });
  });
  //Get All Alerts - InValid Route
  describe("GET /api/alertss", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get all alert by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/alertss")
        .set(
          "Authorization",
          "Bearer " + tokens
        );
      expect(response).to.have.status(404);
    });
  });
  //Get Alert By ID - Valid Alert
  describe("GET /api/alerts/:id", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not Get all alerts", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts/" + alert._id)
        .set(
          "Authorization",
          "Bearer " + tokens
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
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not Get alert by id", async () => {
      let response = await chai
        .request(server)
        .get("/api/alerts/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer " + tokens
        );
      expect(response).to.have.status(500);
    });
  });

  //Post Alert - Valid Alert
  describe("POST /api/alerts", () => {
    let alert;
    let new_alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await Alert.findByIdAndRemove(new_alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should insert alert", async () => {
      let response = await chai
        .request(server)
        .post("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
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

      new_alert = response.body;
    });
  });
  //Post Alert - Invalid Alert
  describe("POST /api/alerts", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not insert alert", async () => {
      let response = await chai
        .request(server)
        .post("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
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
  describe("PATCH /api/alerts", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should update alert", async () => {
      let response = await chai
        .request(server)
        .patch("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
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
      expect(response.body.content).to.equal("Random Non Sequitor2");
    });
  });

  //Patch Alert - Invalid Entry on Enum
  describe("PATCH /api/alerts", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not update alert", async () => {
      let response = await chai
        .request(server)
        .patch("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
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


  //Patch Alert - Invalid ObjectId
  describe("PATCH /api/alerts", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not update alert different ObjectId", async () => {
      let response = await chai
        .request(server)
        .patch("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          title: "Testing2",
          type: "UPDATESSSS",
          degree: "URGENT",
          content: "Random Non Sequitor2",
        });

      expect(response).to.have.status(400);
    });
  })


  //Delete Alert - Valid Alert
  describe("DELETE /api/alerts/", () => {
    let alert;
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should delete alert", async () => {
      let response = await chai
        .request(server)
        .delete("/api/alerts/")
        .set(
          "Authorization",
          "Bearer " + tokens
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
    let user;
    let tokens;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await user.save();
      try {
        jwt.sign({ user }, config.get("secretkey"), (err, token) => {
          tokens = token;
        });
      } catch (err) {
        console.log(err.toString());
      }
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
      await Alert.findByIdAndRemove(alert._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not delete alert", async () => {
      let response = await chai
        .request(server)
        .delete("/api/alerts/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer " + tokens
        )
        .send({
          _id: alert._id
        });
      expect(response).to.have.status(404);
    });
  });
});
