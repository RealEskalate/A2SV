process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
let { LocationUser } = require("../models/LocationUserModel");
let { Symptom } = require("../models/Symptom");
let { SymptomUser } = require("../models/SymptomUser");
let mongoose = require("mongoose");
const { expect } = chai;
const jwt = require("jsonwebtoken");
const config = require("config");
chai.use(chaiHttp);

describe("Location Users API", () => {
  //Get Location Users - Valid Route
  describe("GET /api/user_locations", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get user locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/")
        .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(404);
    });
  });

  //Get Location Users - InValid Route
  describe("GET /api/user_locationssss", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not Get location users", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locationsssss/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Location User By User ID - Valid Location User
  describe("GET /api/user_locations/user/:user_id", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should Get user location by user id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/user/" + user_location.user_id)
        .set(
          "Authorization",
          `Bearer ${tokens}`
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
    });
  });

  //Get Location User By User ID - Invalid Location User
  describe("GET /api/user_locations/user/:user_id", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not Get user location by user id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/user/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
      expect(response.body).to.have.lengthOf(0);
    });
  });

  //Get Location User by ID - valid Location User
  describe("GET /api/user_locations/:id", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should send user_location", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/" + user_location._id)
        .set(
          "Authorization",
          `Bearer ${tokens}`
        );

      expect(response).to.have.status(200);
      expect(response.body).to.have.property("_id");
    });
  });
  //Get Location User by ID - valid Location User
  describe("GET /api/user_locations/:id", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not send user_location", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/" + mongoose.Types.ObjectId())
        .set(
          "Authorization",
          `Bearer ${tokens}`
        );

      expect(response).to.have.status(404);
    });
  });

  //Post Location User - New API Location User - Valid
  describe("POST /api/user_locations", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          latitude: 10,
          longitude: 21,
          user_id: user._id,
          TTL: 10000,
        });
      console.log(response.error);

      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("user_id");
    });
  });
  //Post Location User - Invalid Location User
  describe("POST /api/user_locations", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          user_id: mongoose.Types.ObjectId(),
        });
      expect(response).to.have.status(400);
    });
  });

  //Patch Location User - Valid Location User
  describe("PATCH /api/user_locations", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should update location user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          _id: user_location._id,
          user_id: user._id,
          longitude: 5,
          latitude: 10,
        });
      console.log(response.error);
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("user_id");
    });
  });

  //Patch Location User - Invalid Entries
  describe("PATCH /api/user_locations", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should not update location user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          id: user_location._id,
          user_id: mongoose.Types.ObjectId(),
        });
      expect(response).to.have.status(400);
    });
  });

  //Delete Location User - Valid Location User
  describe("DELETE /api/user_locations/", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          _id: user_location._id,
        });
      expect(response).to.have.status(201);
    });
  });

  //Delete Location User - Invalid Location User
  describe("DELETE /api/user_locations/", () => {
    let user_location;
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
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507",
        });
      expect(response).to.have.status(404);
    });
  });
  //Get All Locations with Symptoms - Valid Location
  describe("GET /api/locations_symptoms", () => {
    let user;
    let symptom;
    let symptomUser;
    let user_location;
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
      symptom = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: "Fever",
        description: "High body temperature",
        relevance: "MEDIUM",
      });
      symptomUser = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        symptom_id: symptom._id,
      });
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
        probability: 0.5
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
      await SymptomUser.findByIdAndRemove(symptomUser._id);
      await Symptom.findByIdAndRemove(symptom._id);
    });
    it("It should return location symptoms", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations_symptoms")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          latitude: 10,
          longitude: 10,
          top_left_bound: [9.999, 9.999],
          top_right_bound: [10.001, 9.999],
          bottom_left_bound: [9.999, 10.001],
          bottom_right_bound: [10.001, 10.001],
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
    });
  });

  //Get All Locations with Symptoms - Far Location
  describe("GET /api/locations_symptoms", () => {
    let user;
    let symptom;
    let symptomUser;
    let user_location;
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
      symptom = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: "Fever",
        description: "High body temperature",
        relevance: "MEDIUM",
      });
      await symptom.save();
      symptomUser = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        symptom_id: symptom._id,
      });
      await symptomUser.save();
      user_location = new LocationUser({
        user_id: user._id,
        location: {
          type: "Point",
          coordinates: [10, 10],
        },
        TTL: 10000,
      });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.findByIdAndDelete(user_location._id);
      await User.findByIdAndDelete(user._id);
      await SymptomUser.findByIdAndRemove(symptomUser._id);
      await Symptom.findByIdAndRemove(symptom._id);
    });
    it("It should return no location symptoms", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations_symptoms")
        .set(
          "Authorization",
          `Bearer ${tokens}`
        )
        .send({
          latitude: 9.999,
          longitude: 9.999,
          top_left_bound: [9.95, 9.95],
          top_right_bound: [10.01, 9.95],
          bottom_left_bound: [9.95, 10.01],
          bottom_right_bound: [10.01, 10.01],
        });
      expect(response).to.have.status(500);
    });
  });
});
