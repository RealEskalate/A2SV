process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { MapData } = require("../models/MapDataModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("MapData API", () => {
    // Get All MapData - Valid Route
    describe("GET /api/mapData", () => {
        let mapData;
        beforeEach(async () => {
            mapData = new MapData({
                _id: mongoose.Types.ObjectId(),
                Data: {
                    Country: "Test Country",
                    Unique_Provinces: [33, 65]
                }
            });
            await mapData.save();
            console.log("MapData saved");
        });
        afterEach(async () => {
            await MapData.findByIdAndDelete(mapData._id);
        });
        it("It should Get all MapData", async () => {
            let response = await chai
                .request(server)
                .get("/api/mapData")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            console.log("response from all mapData");
            expect(response).to.have.status(200);
            expect(response.body).to.have.length.greaterThan(0);
        });
    });
    // Get All MapData - Invalid Route
    describe("GET /api/mapdata", () => {
        it("It should not get mapdata", async () => {
            let response = await chai
                .request(server)
                .get("/api/mapdatas")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            expect(response).to.have.status(404);
        });
    });
});
