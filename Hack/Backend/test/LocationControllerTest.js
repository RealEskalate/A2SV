process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Location = require("../models/LocationModel");
let {Symptom} = require("../models/Symptom");
let {User} = require("../models/UserModel");
let {SymptomUser} = require("../models/SymptomUser"); 
let LocationUser = require("../models/LocationUserModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Locations API", () => {
  //Get Locations - Valid Route
  describe("GET /api/locations", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should Get locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
    });
  });

  //Get Locations - InValid Route
  describe("GET /api/locationsss", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not Get locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/locationssss/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Locations By ID - Valid Location
  describe("GET /api/locations/:id", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should Get location by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("latitude");
      expect(response.body).to.have.property("longitude");
    });
  });

  describe("GET /api/locations/:id", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should Get location by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("latitude");
      expect(response.body).to.have.property("longitude");
    });
  });
  //Get Locations By ID - InValid Location
  describe("GET /api/locations/:id", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not Get location by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(500);
    });
  });

  //Get Locations Risk By ID - Valid Location
  describe("GET /api/locations_risk/:id", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should Get location Risk by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
    });
  });

  //Get Locations Risk By ID - InValid Location
  describe("GET /api/locations_risk/:id", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not Get location risk by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(500);
    });
  });

  //Get Locations By Latitude and Longitude Combination - Valid Location
  describe("GET /api/locations/:longitude/:latitude", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should Get location by coordinates", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location.longitude + "/" + location.latitude)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
    });
  });

  //Get Locations By Latitude and Longitude Combination - InValid Location
  describe("GET /api/locations/:longitude/:latitude", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not Get location by coordinates", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/0/0")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(500);
    });
  });

  //Post Location - Valid Location
  describe("POST /api/locations/", () => {
    let location;
    let new_location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
      await Location.findByIdAndRemove(new_location._id);
    });
    it("It should save location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          latitude: 12,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      new_location = response.body;
    });
  });

  //Get All Locations with Symptoms - Valid Location
  describe("GET /api/locations_symptoms", () => {
    let location;
    let user;
    let symptom;
    let symptomUser;
    let locationUser;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      user = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      symptom = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: 'Fever',
        description: 'High body temperature',
        relevance: 'MEDIUM'
      });
      symptomUser = new SymptomUser({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        symptom_id: symptom._id
      });
      locationUser = new LocationUser({
        _id: mongoose.Types.ObjectId(),
        location_id: location._id,
        user_id: user._id,
        TTL: 50000
      });
      await location.save();
      await user.save();
      await symptom.save()
      await symptomUser.save();
      await locationUser.save()
    });

    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
      await LocationUser.findByIdAndRemove(locationUser._id);
      await SymptomUser.findByIdAndRemove(symptomUser._id);
      await User.findByIdAndRemove(user._id);
      await Symptom.findByIdAndRemove(symptom._id);
    });
    it("It should return location symptoms", async () => {
      let response = await chai 
      .request(server)
      .post("/api/locations_symptoms")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
      .send({
        latitude: 10,
        longitude: 10
      });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("array");
    });
  });


    //Get All Locations with Symptoms - Far Location
    describe("GET /api/locations_symptoms", () => {
      let location;
      let user;
      let symptom;
      let symptomUser;
      let locationUser;
      beforeEach(async () => {
        location = new Location({
          _id: mongoose.Types.ObjectId(),
          latitude: 10,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
        user = new User({
          _id : mongoose.Types.ObjectId(),
          username:"Testing",
          password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
          gender:"FEMALE",
          age_group:"21-30",
        });
        symptom = new Symptom({
          _id: mongoose.Types.ObjectId(),
          name: 'Fever',
          description: 'High body temperature',
          relevance: 'MEDIUM'
        });
        symptomUser = new SymptomUser({
          _id: mongoose.Types.ObjectId(),
          user_id: user._id,
          symptom_id: symptom._id
        });
        locationUser = new LocationUser({
          _id: mongoose.Types.ObjectId(),
          location_id: location._id,
          user_id: user._id,
          TTL: 50000
        });
        await location.save();
        await user.save();
        await symptom.save()
        await symptomUser.save();
        await locationUser.save()
      });
  
      afterEach(async () => {
        await Location.findByIdAndRemove(location._id);
        await LocationUser.findByIdAndRemove(locationUser._id);
        await SymptomUser.findByIdAndRemove(symptomUser._id);
        await User.findByIdAndRemove(user._id);
        await Symptom.findByIdAndRemove(symptom._id);
      });
      it("It should return no location symptoms", async () => {
        let response = await chai 
        .request(server)
        .post("/api/locations_symptoms")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          latitude: 9.9,
          longitude: 9.9
        });
        expect(response).to.have.status(500);
      });
    });

  //Post Location - Valid Location
  describe("POST /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not save location but instead retrieve existing location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          latitude: 10,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
      
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
    });
  });

  //Post Location - InValid Location
  describe("POST /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not save location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          latitude: 12,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(500);
    });
  });

  //Patch Location - Valid Location
  describe("PATCH /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should patch location", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: location._id,
          latitude: 12,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
    });
  });
  //Patch Location - Valid Location
  describe("PATCH /api/locations/", () => {
    let location;
    let location_2;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      location_2 = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 12,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
      await location_2.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
      await Location.findByIdAndRemove(location_2._id);
    });
    it("It should delete existing location and retrieve existing location with the patched coordinates", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: location._id,
          latitude: 12,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
    });
  });
  //Patch Location - InValid Location
  describe("PATCH /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not patch location", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507",
          latitude: 12,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(500);
    });
  });

  //Delete Location - Valid Location
  describe("DELETE /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should delete location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: location._id
        });
      expect(response).to.have.status(204);
      expect(response.body).to.be.a("object");
    });
  });
  //Delete Location - InValid Location
  describe("DELETE /api/locations/", () => {
    let location;
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
    });
    afterEach(async () => {
      await Location.findByIdAndRemove(location._id);
    });
    it("It should not delete location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507",
        });
      expect(response).to.have.status(404);
    });
  });  
});
