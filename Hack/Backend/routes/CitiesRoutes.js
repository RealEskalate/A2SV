var express = require("express");
var router = express.Router();
var citiesController = require("./../controllers/CitiesController");

router.get("/api/cities", citiesController.lookup_cities);
router.get("/api/cities/listed", citiesController.get_cities_list);

module.exports = router;