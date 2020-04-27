var express = require("express");
var router = express.Router();
var NewsController = require("../controllers/NewsController");

router.get("/api/news", NewsController.get_all_news);

router.post("/api/news", NewsController.post_news);

module.exports = router;