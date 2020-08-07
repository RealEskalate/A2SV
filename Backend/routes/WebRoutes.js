const express = require("express");
const router = express.Router();

const webResourceController = require("./../controllers/WebResourceController");

router.get("/api/web-resources", webResourceController.get_web_resource);

module.exports = router