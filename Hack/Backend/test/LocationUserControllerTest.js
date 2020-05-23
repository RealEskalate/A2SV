process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let {Location} = require("../models/LocationModel");
let {User} = require("../models/UserModel");
let {LocationUser} = require("../models/LocationUserModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Location Users API", () => {
  //Get Location Users - Valid Route
  describe("GET /api/user_locations", () => {
    let user_location;
    beforeEach(async () => {
        user_location = new LocationUser({
            user_id: mongoose.Types.ObjectId(),
            location_id: mongoose.Types.ObjectId(),
            TTL: 10000
        });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
    });
    it("It should Get user locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Location Users - InValid Route
  describe("GET /api/user_locationssss", () => {
    let user_location;
    beforeEach(async () => {
        user_location = new LocationUser({
            user_id: mongoose.Types.ObjectId(),
            location_id: mongoose.Types.ObjectId(),
            TTL: 10000
        });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
    });
    it("It should not Get location users", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locationsssss/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Get Location User By Location ID - Valid Location User
  describe("GET /api/user_locations/location/:location_id", () => {
    let user_location;
    beforeEach(async () => {
        user_location = new LocationUser({
            user_id: mongoose.Types.ObjectId(),
            location_id: mongoose.Types.ObjectId(),
            TTL: 10000
        });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
    });
    it("It should Get user location by location id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/location/"+user_location.location_id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('array');
      expect(response.body[0].user_id).to.equal(""+user_location.user_id);
    });
  });

  //Get Location User By Location ID - Invalid Location User
  describe("GET /api/user_locations/location/:location_id", () => {
    let user_location;
    beforeEach(async () => {
        user_location = new LocationUser({
            user_id: mongoose.Types.ObjectId(),
            location_id: mongoose.Types.ObjectId(),
            TTL: 10000
        });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
    });
    it("It should not Get user location by location id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/location/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('array');
      expect(response.body).to.have.lengthOf(0)
    });
  });
//Get Location User By User ID - Valid Location User
describe("GET /api/user_locations/user/:user_id", () => {
  let user_location;
  beforeEach(async () => {
      user_location = new LocationUser({
          user_id: mongoose.Types.ObjectId(),
          location_id: mongoose.Types.ObjectId(),
          TTL: 10000
      });
    await user_location.save();
  });
  afterEach(async () => {
    await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
  });
  it("It should Get user location by user id", async () => {
    let response = await chai
      .request(server)
      .get("/api/user_locations/user/"+user_location.user_id)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
    expect(response).to.have.status(200);
    expect(response.body).to.be.a('array');
  });
});

//Get Location User By User ID - Invalid Location User
describe("GET /api/user_locations/user/:user_id", () => {
  let user_location;
  beforeEach(async () => {
      user_location = new LocationUser({
          user_id: mongoose.Types.ObjectId(),
          location_id: mongoose.Types.ObjectId(),
          TTL: 10000
      });
    await user_location.save();
  });
  afterEach(async () => {
    await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
  });
  it("It should not Get user location by user id", async () => {
    let response = await chai
      .request(server)
      .get("/api/user_locations/user/5e904cce7a1c6b627ae9f507")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
        expect(response).to.have.status(200);
        expect(response.body).to.be.a('array');
        expect(response.body).to.have.lengthOf(0)
    });
});  

//Get Location User by ID - valid Location User
describe("GET /api/user_locations/:id", () => {
  let location_user;
  beforeEach(async() =>{
    location_user = new LocationUser({
      _id: mongoose.Types.ObjectId(),
      location_id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      TTL: 50000
    });
    await location_user.save();
  });
  afterEach(async() => {
    await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
  });
  it("It should send location_user", async () => {
    let response = await chai
    .request(server)
    .get("/api/user_locations/"+location_user._id)
    .set(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
      );
    
    expect(response).to.have.status(200);
    expect(response.body).to.have.property("_id");
  });
});
//Get Location User by ID - valid Location User
describe("GET /api/user_locations/:id", () => {
  let location_user;
  beforeEach(async() =>{
    location_user = new LocationUser({
      _id: mongoose.Types.ObjectId(),
      location_id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      TTL: 50000
    });
    await location_user.save();
  });
  afterEach(async() => {
    await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
  });
  it("It should not send location_user", async () => {
    let response = await chai
    .request(server)
    .get("/api/user_locations/" + mongoose.Types.ObjectId())
    .set(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
      );
    
    expect(response).to.have.status(404);
  });
});

  //Post Location User - Old API Location User - Invalid
  describe("POST /api/user_locations", () => {
    let location_user;
    let location;
    let newUser;
    beforeEach(async () => {
      location_user = new LocationUser({
        user_id: mongoose.Types.ObjectId(),
        location_id: mongoose.Types.ObjectId(),
        TTL: 10000
      });
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [10, 10],
        }
      });
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
      await location_user.save();
      await location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
      await Location.findByIdAndDelete(location._id);
      await User.findByIdAndDelete(newUser._id);
    });
    it("It should not insert user location now", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          location_id: location._id,
          user_id: newUser._id,
          TTL:10000
        });
      expect(response).to.have.status(400);
    });
  });

  //Post Location User - New API Location User - Valid
  describe("POST /api/user_locations", () => {
    let newUser;
    let new_location_user;
    let new_location_id;
    beforeEach(async () => {
      newUser = new User({
        _id : mongoose.Types.ObjectId(),
        username:"Testing",
        password:"$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender:"FEMALE",
        age_group:"21-30",
      });
      await newUser.save();
    });
    afterEach(async () => {
      await User.findByIdAndDelete(newUser._id);
      await Location.findByIdAndDelete(new_location_id);
      await LocationUser.deleteOne({user_id: new_location_user.user_id, location_id: new_location_user.location_id});
    });
    it("It should insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          latitude: 10,
          longitude: 21,
          user_id: newUser._id,
          TTL:10000
        });
      console.log(response.error);
      
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('location_id');
      expect(response.body).to.have.property('user_id');
      new_location_user = response.body;
      new_location_id = new_location_user.location_id;
    });
  });
  //Post Location User - Invalid Location User
  describe("POST /api/user_locations", () => {
    let user_location;
    beforeEach(async () => {
        user_location = new LocationUser({
            user_id: mongoose.Types.ObjectId(),
            location_id: mongoose.Types.ObjectId(),
            TTL: 10000
        });
      await user_location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: user_location.user_id, location_id: user_location.location_id});
    });
    it("It should not insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          user_id: mongoose.Types.ObjectId(),
          location_id: mongoose.Types.ObjectId(),
          TTL: 10000
        });
      expect(response).to.have.status(400);
    });
  });

  //Patch Location User - Valid Location User
  describe("PATCH /api/user_locations", () => {
    let location_user;
    let location;
    beforeEach(async () => {
      location_user = new LocationUser({
        user_id: mongoose.Types.ObjectId(),
        location_id: mongoose.Types.ObjectId(),
        TTL: 10000
      });
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [10, 10],
        }
      });
      await location_user.save();
      await location.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
      await Location.findByIdAndRemove(location._id);
    });
    it("It should update location user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: location_user._id,
          location_id: location._id
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('location_id');
      expect(response.body).to.have.property('user_id');
    });
  });

  //Patch Location User - Invalid Entries
  describe("PATCH /api/user_locations", () => {
    let location_user;
    beforeEach(async () => {
      location_user = new LocationUser({
        user_id: mongoose.Types.ObjectId(),
        location_id: mongoose.Types.ObjectId(),
        TTL: 10000
    });
      await location_user.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
    });
    it("It should not update location user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          id: location_user._id,
          user_id: mongoose.Types.ObjectId(),
          location_id: mongoose.Types.ObjectId(),
        });
      expect(response).to.have.status(400);
    });
  });

  //Delete Location User - Valid Location User
  describe("DELETE /api/user_locations/", () => {
    let location_user;
    beforeEach(async () => {
      location_user = new LocationUser({
        user_id: mongoose.Types.ObjectId(),
        location_id: mongoose.Types.ObjectId(),
        TTL: 10000
    });
      await location_user.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          _id: location_user._id,
        });
      expect(response).to.have.status(201);
    });
  });

  //Delete Location User - Invalid Location User
  describe("DELETE /api/user_locations/", () => {
    let location_user;
    beforeEach(async () => {
        location_user = new LocationUser({
        user_id: mongoose.Types.ObjectId(),
        location_id: mongoose.Types.ObjectId(),
        TTL: 10000
    });
      await location_user.save();
    });
    afterEach(async () => {
      await LocationUser.deleteOne({user_id: location_user.user_id, location_id: location_user.location_id});
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
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
