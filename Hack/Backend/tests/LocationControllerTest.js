process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Location = require("../models/LocationModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Location Users API", () => {
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
      await Location.collection.drop();
    });
    it("It should Get locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not Get locations", async () => {
      let response = await chai
        .request(server)
        .get("/api/locationssss/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should Get location by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not Get location by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should Get location Risk by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location._id)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not Get location risk by ID", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/5e904cce7a1c6b627ae9f507")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should Get location by coordinates", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/" + location.longitude + "/" + location.latitude)
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not Get location by coordinates", async () => {
      let response = await chai
        .request(server)
        .get("/api/locations/0/0")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        );
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
      await Location.collection.drop();
    });
    it("It should save location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: mongoose.Types.ObjectId(),
          latitude: 12,
          longitude: 10,
          place_name: "Random Non Sequitor",
        });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
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
      await Location.collection.drop();
    });
    it("It should not save location but instead retrieve existing location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not save location", async () => {
      let response = await chai
        .request(server)
        .post("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should patch location", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
    beforeEach(async () => {
      location = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 10,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      let location_2 = new Location({
        _id: mongoose.Types.ObjectId(),
        latitude: 12,
        longitude: 10,
        place_name: "Random Non Sequitor",
      });
      await location.save();
      await location_2.save();
    });
    afterEach(async () => {
      await Location.collection.drop();
    });
    it("It should delete existing location and retrieve existing location with the patched coordinates", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not patch location", async () => {
      let response = await chai
        .request(server)
        .patch("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should delete location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
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
      await Location.collection.drop();
    });
    it("It should not delete location", async () => {
      let response = await chai
        .request(server)
        .delete("/api/locations/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6IkZFTUFMRSIsImFnZV9ncm91cCI6IlVOREVSXzMwIiwiX2lkIjoiNWU5MDRjY2U3YTFjNmI2MjdhZTlmNWY3IiwidXNlcm5hbWUiOiJUZXN0aW5nIiwicGFzc3dvcmQiOiIkMmEkMTAkZWZteG01bzF2LmluSS5lU3RHR3hnTzF6SGsuTDZVb0E5TEV5WXJSUGhXa21UUVBYOC5OS08iLCJfX3YiOjB9LCJpYXQiOjE1ODczNjUxMTJ9.QUPJHBixUI7nu2CJGi1a6vBPOInmYuO4lVPIryHM2go"
        )
        .send({
          _id: "5e904cce7a1c6b627ae9f507",
        });
      expect(response).to.have.status(404);
    });
  });  
});
