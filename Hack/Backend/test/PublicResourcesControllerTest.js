process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { PublicResource } = require("../models/PublicResourcesModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Public Resources API", () => {
    // Get All Public Resources - Valid Route
    describe("GET /api/PublicResources", () => {
        it("It should Get all public resources", async () => {
            let response = await chai
                .request(server)
                .get("/api/PublicResources/Ethiopia")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            expect(response).to.have.status(200);
        });
    });
    // Get All Public Resources - Invalid Route
    describe("GET /api/PublicResources", () => {
        it("It should not get public resources", async () => {
            let response = await chai
                .request(server)
                .get("/api/PublicResources")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            expect(response).to.have.status(404);
        });
    });
});
