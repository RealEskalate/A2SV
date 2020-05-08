process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Location = require("../models/LocationModel");
let {User} = require("../models/UserModel");
let LocationUser = require("../models/LocationUserModel");
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
      await LocationUser.collection.drop();
    });
    it("It should Get user locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('array');
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
      await LocationUser.collection.drop();
    });
    it("It should not Get alert users", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locationsssss/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await LocationUser.collection.drop();
    });
    it("It should Get user location by location id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/location/"+user_location.location_id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await LocationUser.collection.drop();
    });
    it("It should not Get user location by location id", async () => {
      let response = await chai
        .request(server)
        .get("/api/user_locations/location/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
      expect(response).to.have.status(500);
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
    await LocationUser.collection.drop();
  });
  it("It should Get user location by user id", async () => {
    let response = await chai
      .request(server)
      .get("/api/user_locations/user/"+user_location.user_id)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
    await LocationUser.collection.drop();
  });
  it("It should not Get user location by user id", async () => {
    let response = await chai
      .request(server)
      .get("/api/user_locations/user/5e904cce7a1c6b627ae9f507")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
      );
    expect(response).to.have.status(500);
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
  afterEach(async() => await LocationUser.collection.drop());
  it("It should send location_user", async () => {
    let response = await chai
    .request(server)
    .get("/api/user_locations/"+location_user._id)
    .set(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
  afterEach(async() => await LocationUser.collection.drop());
  it("It should not send location_user", async () => {
    let response = await chai
    .request(server)
    .get("/api/user_locations/" + mongoose.Types.ObjectId())
    .set(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
    );
    
    expect(response).to.have.status(500);
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
        longitude: 10,
        latitude: 10,
        place_name: "Random Non Sequitor",
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
      await LocationUser.collection.drop();
      await Location.collection.drop();
      await User.collection.drop();
    });
    it("It should not insert user location now", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await User.collection.drop();
    });
    it("It should insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          latitude: 10,
          longitude: 21,
          user_id: newUser._id,
          TTL:10000
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('location_id');
      expect(response.body).to.have.property('user_id');
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
      await LocationUser.collection.drop();
    });
    it("It should not insert user location", async () => {
      let response = await chai
        .request(server)
        .post("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
        longitude: 10,
        latitude: 10,
        place_name: "ABCD"
      });
      await location_user.save();
      await location.save();
    });
    afterEach(async () => {
      await LocationUser.collection.drop();
      await Location.collection.drop();
    });
    it("It should update location user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await LocationUser.collection.drop();
    });
    it("It should not update alert user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          id: location_user._id,
          user_id: mongoose.Types.ObjectId(),
          location_id: mongoose.Types.ObjectId(),
        });
      expect(response).to.have.status(500);
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
      await LocationUser.collection.drop();
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await LocationUser.collection.drop();
    });
    it("It should delete user location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/user_locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507"
        });
      expect(response).to.have.status(404);
    });
  });
});
