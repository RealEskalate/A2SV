process.env.NODE_ENV = "test";

// var rewire = require('rewire');
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { News } = require("../models/NewsModel");
let { User } = require("../models/UserModel");
let Alert = require("../models/AlertModel");
let AlertUser = require("../models/AlertUserModel");
let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("News API", () => {
  // Get All News - Valid Route
  describe("GET /api/news", () => {
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "Test Source",
        description: "Test Description",
        date: Date.now(),
        country: "Test Country",
        reference_link: "test.com",
      });
      await news.save();
      console.log("News saved");
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
    });
    it("It should Get all news", async () => {
      let response = await chai
        .request(server)
        .get("/api/news")
        .query({page : 1, size : 10})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body.data[0]).to.have.property("title", "Test Title");
      expect(response.body.data).to.have.lengthOf(10);
      expect(response.body.page_size).to.equal(10);
      expect(response.body.current_page).to.equal(1);
    });
  });
  // Get All News - Invalid Route
  describe("GET /api/newss", () => {
    it("It should not get news", async () => {
      let response = await chai
        .request(server)
        .get("/api/newss")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  // Get All News with filters - Valid filters
  describe("GET /api/news?country=&source=", () => {
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "CNN",
        description: "Test Description",
        date: Date.now(),
        country: "Ethiopia",
        reference_link: "test.com",
      });
      await news.save();
      console.log("News saved");
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
    });
    it("It should Get all news of the specified country", async () => {
      let response = await chai
        .request(server)
        .get("/api/news")
        .query({country : "Ethiopia"})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      response.body.data.forEach(news => {
        expect(news).to.have.property("country", "Ethiopia");
      });
    });

    it("It should Get all news of the specified source", async () => {
      let response = await chai
        .request(server)
        .get("/api/news")
        .query({source : "CNN,BBC News"})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      response.body.data.forEach(news => {
        expect(news).to.have.deep.property('source').that.is.oneOf(["CNN", "BBC News"]);
      });
    });
  });
  // Get All News with filters - Invalid filters
  describe("GET /api/news?country=&source=", () => {
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "CNN",
        description: "Test Description",
        date: Date.now(),
        country: "Ethiopia",
        reference_link: "test.com",
      });
      await news.save();
      console.log("News saved");
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
    });

    it("It should not Get all news of the specified source", async () => {
      let response = await chai
        .request(server)
        .get("/api/news")
        .query({source : "CN,BBC ews"})
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(response.body.data).to.have.lengthOf(0);      
    });
  });

  // Get All Sources - Valid Route
  describe("GET /api/news/sources", () => {
    let default_sources = [
      "CDC Newsroom",
      "CNN",
      "BBC News",
      "NPR",
      "EU News",
      "World Health Organization",
      "The Guardian",
      "Global News",
      "Science Daily",
      "MIT News",
    ];
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "CNN",
        description: "Test Description",
        date: Date.now(),
        country: "Test Country",
        reference_link: "test.com",
      });
      await news.save();
      console.log("News saved");
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
    });
    it("It should Get all news source", async () => {
      let response = await chai
        .request(server)
        .get("/api/news/sources")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(200);
      expect(default_sources).to.contain.members(response.body);
    });
  });

  // Get All Sources - Invalid Route
  describe("GET /api/source", () => {
    it("It should not get sources", async () => {
      let response = await chai
        .request(server)
        .get("/api/source")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        );
      expect(response).to.have.status(404);
    });
  });

  //Post News - Valid News
  describe("POST /api/news", () => {
    let news;
    let user;
    let alert;
    let alert_user;
    let new_news;
    beforeEach(async () => {
        news = new News({
          _id: mongoose.Types.ObjectId(),
          title: "Test Title",
          source: "Test Source",
          description: "Test Description",
          date: Date.now(),
          country: "Test Country",
          reference_link: "test.com",
        });
        user = new User({
          _id: mongoose.Types.ObjectId(),
          username: "Testing",
          password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
          gender: "FEMALE",
          age_group: "21-30",
          current_country: "Test Country" 
        });
        await news.save();
        await user.save();
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
      await User.findByIdAndDelete(user._id);
      await News.findByIdAndDelete(new_news._id);
      await Alert.findByIdAndDelete(alert._id);
      await AlertUser.findByIdAndDelete(alert_user._id);
    });
    it("It should insert news", async () => {
      let response = await chai
        .request(server)
        .post("/api/news/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({
          title: "Test Title",
          source: "Test Source",
          description: "Test Description",
          date: Date.now(),
          country: "Test Country",
          reference_link: "test.com",
        });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("title", "Test Title");
      expect(response.body).to.have.property("source", "Test Source");
      expect(response.body).to.have.property("description", "Test Description");
      expect(response.body).to.have.property("country", "Test Country");
      expect(response.body).to.have.property("reference_link", "test.com"); 

      new_news = response.body;

      expect(await Alert.find()).to.have.length.greaterThan(0);
      expect(await AlertUser.find()).to.have.length.greaterThan(0);

      alert = await Alert.find({"title" : news.title});
      alert_user = await AlertUser.find({user_id : user._id, alert_id: alert._id});

      expect(alert).to.be.not.a('null');
      expect(alert_user).to.be.not.a('null');
        
    });
  });

  //Post News - Invalid News
  describe("POST /api/news", () => {
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "Test Source",
        description: "Test Description",
        date: Date.now(),
        country: "Test Country",
        reference_link: "test.com",
      });
      await news.save();
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
    });
    it("It should not insert news", async () => {
      let response = await chai
        .request(server)
        .post("/api/news/")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImdlbmRlciI6Ik1BTEUiLCJhZ2VfZ3JvdXAiOiI-OTAiLCJfaWQiOiI1ZWI3ZjMwYzNlMmE4ODRhYzgzYWE3NjAiLCJ1c2VybmFtZSI6ImF1dGh0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkYjJmYTZHTTJMTDlLVlJ4UzhVVEkzdS5SQ2JjUWw0WXc5OExaWVVHUHRnUVdBdVFGOERqNXUiLCJfX3YiOjAsImN1cnJlbnRfY291bnRyeSI6IiJ9LCJpYXQiOjE1ODkxODc5Mjd9.ZJQHbK7cVmDOf87uuhUttlnyAFYe5KA0Afnq0iBptF0"
        )
        .send({});
      expect(response).to.have.status(500);
      expect(response.error.text).to.include("title: Path `title` is required., source: Path `source` is required., description: Path `description` is required., date: Path `date` is required.");
    });
  });
});
