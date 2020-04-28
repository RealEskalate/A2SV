var express = require("express");
var router = express.Router();

const publicResourcesController = require("../controllers/PublicResourcesController.js");

router.get("/api/publicResources/:criteria", publicResourcesController.getPublicResources);

module.exports = router;
