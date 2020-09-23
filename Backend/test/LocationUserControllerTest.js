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
const { DistrictModel } = require("../models/DistrictModel");
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
        .set("Authorization", `Bearer ${tokens}`);
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
        .set("Authorization", `Bearer ${tokens}`);
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
        .set("Authorization", `Bearer ${tokens}`);
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
        .set("Authorization", `Bearer ${tokens}`);

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
        .set("Authorization", `Bearer ${tokens}`);

      expect(response).to.have.status(404);
    });
  });

  //Post Location User - New API Location User - Valid
  describe("POST /api/user_locations", () => {
    let user_location;
    let user;
    let tokens;
    let symptom_user1;
    let symptom_user2;
    let symptom1;
    let symptom2;
    let district;
    beforeEach(async () => {
      symptom1 = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: "Headaches",
        relevance: "LOW",
        description: "Can be a sharp, throbbing or dull feeling across the head.",
        position: 11,
      });
      await symptom1.save();

      symptom2 = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: "Sneezing",
        relevance: "LOW",
        description: "It is a powerful, involuntary expulsion of air.",
        position: 10,
      });
      await symptom2.save();

      
      district = new DistrictModel({
        _id: mongoose.Types.ObjectId(),
        name: "Bole",
        state: "Addis Abeba",
        boundaries: {
            type: "Polygon",
            coordinates: [[38.77277374267584, 8.951707839965763], [38.7750511169433, 8.959457397461051], [38.76938629150402, 8.964635848999023], [38.76857757568365, 8.971710205078125], [38.76391220092779, 8.975526809692496], [38.76419830322271, 8.980051994323787], [38.769969940185604, 8.984671592712402], [38.774642944335994, 8.990886688232422], [38.77341461181652, 8.99995040893566], [38.775791168213004, 9.005511283874455], [38.774803161621094, 9.01102256774908], [38.77674102783209, 9.015738487243652], [38.783794403076286, 9.014875411987418], [38.792392730713004, 9.01681900024414], [38.798694610595646, 9.018692970275879], [38.808036804199276, 9.019802093505973], [38.81892013549799, 9.018701553344727], [38.829669952392635, 9.021367073059196], [38.840248107910156, 9.020879745483398], [38.85087585449219, 9.020322799682617], [38.85769271850586, 9.019966125488281], [38.87712860107433, 9.021015167236328], [38.88451766967785, 9.02137374877924], [38.889778137206974, 9.022211074829158], [38.89665985107422, 9.030497550964299], [38.90116119384777, 9.019584655761719], [38.90500259399414, 9.009499549865723], [38.90605545043957, 8.997531890869084], [38.904338836670036, 8.992156982421875], [38.90489959716797, 8.984115600585938], [38.90624237060547, 8.977418899536246], [38.90409469604498, 8.969542503357047], [38.90278625488281, 8.962411880493164], [38.89623641967779, 8.954837799072266], [38.90110015869146, 8.946141242981014], [38.89675903320318, 8.937026977539062], [38.891422271728516, 8.934331893920955], [38.88208007812506, 8.936197280883903], [38.869491577148494, 8.939620018005314], [38.861419677734375, 8.94267749786377], [38.85555648803711, 8.938292503356934], [38.84938430786144, 8.938275337219238], [38.841060638427734, 8.941080093383789], [38.83596801757824, 8.942173957824764], [38.82828903198242, 8.939469337463322], [38.82053756713873, 8.937870025634766], [38.81644439697271, 8.941584587097282], [38.8088836669923, 8.944089889526424], [38.80073547363281, 8.945956230163688], [38.79402923583979, 8.942293167114315], [38.785774230957145, 8.938777923583928], [38.78005981445324, 8.935907363891602], [38.7739372253418, 8.940291404724178], [38.771129608154354, 8.94519901275629], [38.77277374267584, 8.951707839965763]]
        }
      })
      await district.save()
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
      symptom_user1 = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        symptom_id: symptom1._id,
      });
      await symptom_user1.save();

      symptom_user2 = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        symptom_id: symptom2._id,
      });
      await symptom_user2.save();

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
      await DistrictModel.findByIdAndDelete(district._id);
    });
    it("It should insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set("Authorization", `Bearer ${tokens}`)
        .send({
          latitude: 8.985974,
          longitude: 38.796897,
          user_id: user._id,
          TTL: 10000,
        });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("user_id");
      expect(response.body).to.have.nested.property("location.district")
      expect(response.body.location.district).to.equal(district._id.toString());
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
        .set("Authorization", `Bearer ${tokens}`)
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
        .set("Authorization", `Bearer ${tokens}`)
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
        .set("Authorization", `Bearer ${tokens}`)
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
        .set("Authorization", `Bearer ${tokens}`)
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
        .set("Authorization", `Bearer ${tokens}`)
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
        probability: 0.5,
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
        .set("Authorization", `Bearer ${tokens}`)
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
        .set("Authorization", `Bearer ${tokens}`)
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
