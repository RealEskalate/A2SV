var express = require("express");
var router = express.Router();
// const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var ethiopiaDataController = require("../controllers/EthiopiaDataController");

router.get("/api/ethiopia", ethiopiaDataController.get_ethiopia_data);
module.exports = router;
