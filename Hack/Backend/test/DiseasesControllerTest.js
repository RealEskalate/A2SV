process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let Disease = require("../models/DiseasesModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Diseases API", () => {
    // Get All Diseases - Valid Route
    describe("GET /api/diseases", () => {
        it("It should Get all diseases", async () => {
            let response = await chai
                .request(server)
                .get("/api/diseases")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            console.log("response from all diseases");
            expect(response).to.have.status(200);
            expect(response.body).to.have.lengthOf(5);
            expect(response.body[0]).to.have.property('title', 'COVID-19');
            expect(response.body[0].confirmed).to.be.above(3747292);
        });
    });
    // Get All Diseases - Invalid Route
    describe("GET /api/diieases", () => {
        it("It should not get diseases", async () => {
            let response = await chai
                .request(server)
                .get("/api/alertss")
                .set(
                    "Authorization",
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
                );
            expect(response).to.have.status(404);
        });
    });
});
