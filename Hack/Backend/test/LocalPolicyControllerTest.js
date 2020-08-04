process.env.NODE_ENV = "test";
var chai = require("chai");
var { LocalPolicy } = require("../models/LocalPolicyModel");
var { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../index");
const { expect } = chai;

let mongoose = require("mongoose");
chai.use(chaiHttp);

describe("LocalPolicy API", function () {
  let local_policy;
  let new_local_policy;
  let user;
  var tokens;
  beforeEach(async () => {
    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      age_group: "21-30",
      current_country: "Ethiopia"
    });
    await user.save();

    try {
      jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
        tokens = token;
      });
    } catch (err) {}

    local_policy = new LocalPolicy({
      _id: mongoose.Types.ObjectId(),
      title: "Local Policy 1",
      description: "Local policy 1 description",
      country: "Ethiopia",
    });
    new_local_policy = new LocalPolicy({
        _id: mongoose.Types.ObjectId(),
    });
    await local_policy.save();
  });

  afterEach(async () => {
    await LocalPolicy.findByIdAndDelete(local_policy._id);
    await LocalPolicy.findByIdAndDelete(new_local_policy._id);
    await User.findByIdAndDelete(user._id);
  });
  

  it("should list all local policies on /api/local_policy GET", async () => {
    let response = await chai
      .request(server)
      .get("/api/local_policy")
    expect(response).to.have.status(200);
    expect(response.body.data[0]).to.have.property("country", "Ethiopia");
    expect(response.body.page_size).to.equal(15);
    expect(response.body.current_page).to.equal(1);
  });

  it("should list a single local policy by id on /local_policy/:id GET", async () => {
    let response = await chai
      .request(server)
      .get("/api/local_policy/" + local_policy._id)
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("title", "Local Policy 1");
  });

  it("should list all local policies for logged in user on /api/local_policy/user GET", async () => {
    let response = await chai
      .request(server)
      .get("/api/local_policy/user")
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
    expect(response.body.data[0]).to.have.property("country", "Ethiopia");
    expect(response.body.page_size).to.equal(15);
    expect(response.body.current_page).to.equal(1);
  });

//   it("should add a local policy on /local_policy POST", async () => {
//     let response = await chai.request(server).post("/api/local_policy/").send({
//       title: "Test Title",
//       description: "Test Description",
//       country: "Test Country"
//     });
//     expect(response).to.have.status(201);
//     expect(response.body).to.be.a("object");
//     expect(response.body).to.have.property("_id");
//     expect(response.body).to.have.property("title", "Test Title");
//     expect(response.body).to.have.property("description", "Test Description");
//     expect(response.body).to.have.property("country", "Test Country");

//     new_local_policy = response.body;
//   });

//   it("should update a local policy on /local_policy PATCH", async () => {
//     let response = await chai.request(server).patch("/api/local_policy/").send({
//       id: local_policy._id,  
//       title: "Local Policy 1 Edited"
//     });
//     expect(response).to.have.status(201);
//     expect(response.body).to.be.a("object");
//     expect(response.body).to.have.property("_id");
//     expect(response.body).to.have.property("title", "Local Policy 1 Edited");
//     expect(response.body).to.have.property("description", "Local policy 1 description");
//   });

//   it("should delete a local policy on /local_policy DELETE", async () => {
//     let response = await chai.request(server).delete("/api/local_policy/").send({
//       id: local_policy._id,  
//     });
//     expect(response).to.have.status(201);
//   });
});
