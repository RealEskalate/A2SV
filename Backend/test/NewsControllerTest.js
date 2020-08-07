process.env.NODE_ENV = "test";

// var rewire = require('rewire');
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { News } = require("../models/NewsModel");
let { User } = require("../models/UserModel");
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
        type: "Government Measure",
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
        .query({ page: 1, size: 10 });
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
      let response = await chai.request(server).get("/api/newss");
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
        type: "Government Measure",
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
        .query({ country: "Ethiopia" });
      expect(response).to.have.status(200);
      response.body.data.forEach((news) => {
        expect(news).to.have.property("country", "Ethiopia");
      });
    });

    it("It should Get all news of the specified source", async () => {
      let response = await chai
        .request(server)
        .get("/api/news")
        .query({ source: "CNN,BBC News" });
      expect(response).to.have.status(200);
      response.body.data.forEach((news) => {
        expect(news)
          .to.have.deep.property("source")
          .that.is.oneOf(["CNN", "BBC News"]);
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
        type: "Government Measure",
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
        .query({ source: "CN,BBC ews" });
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
        type: "Government Measure",
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
      let response = await chai.request(server).get("/api/news/sources");
      expect(response).to.have.status(200);
      response.body.forEach((item) => {
        expect(default_sources).to.include(item.source);
      });
    });
  });

  // Get All Sources - Invalid Route
  describe("GET /api/source", () => {
    it("It should not get sources", async () => {
      let response = await chai.request(server).get("/api/source");
      expect(response).to.have.status(404);
    });
  });

  //Post News - Valid News
  describe("POST /api/news", () => {
    let news;
    let new_news;
    let user;
    beforeEach(async () => {
      user = new User({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
        country: "Test Country",
      });
      await user.save();
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        source: "Test Source",
        type: "Government Measure",
        description: "Test Description",
        date: Date.now(),
        country: "Test Country",
        reference_link: "test.com",
      });
      await news.save();
    });
    afterEach(async () => {
      await News.findByIdAndDelete(news._id);
      await User.findByIdAndDelete(user._id);
      await News.findByIdAndDelete(new_news._id);
    });
    it("It should insert news", async () => {
      let response = await chai.request(server).post("/api/news/").send({
        title: "Test Title",
        source: "Test Source",
        type: "Government Measure",
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
    });
  });

  //Post News - Invalid News
  describe("POST /api/news", () => {
    let news;
    beforeEach(async () => {
      news = new News({
        _id: mongoose.Types.ObjectId(),
        title: "Test Title",
        type: "Government Measure",
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
      let response = await chai.request(server).post("/api/news/").send({});
      expect(response).to.have.status(500);
      expect(response.error.text).to.include(
        "ValidationError: title: Path `title` is required., source: Path `source` is required., type: Path `type` is required., description: Path `description` is required., date: Path `date` is required."
      );
    });
  });
});
