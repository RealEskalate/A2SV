var express = require("express");
var router = express.Router();

const mapDataController = require("../controllers/MapDataController.js");

router.get("/api/mapData", mapDataController.getMapData);

module.exports = router;
