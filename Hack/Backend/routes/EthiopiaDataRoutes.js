var express = require("express");
var router = express.Router();
// const verifyToken = require("../middlewares/auth.js");

// Require controller modules.
var ethiopiaDataController = require("../controllers/EthiopiaDataController");

router.get("/api/ethiopia", ethiopiaDataController.get_ethiopia_data);
router.get("/api/ethiopia/:id", ethiopiaDataController.get_ethiopia_data_by_id);
router.get("/api/ethiopia/region/:region", ethiopiaDataController.get_ethiopia_data_by_region);
router.post("/api/ethiopia", ethiopiaDataController.post_ethiopia_data);
router.patch("/api/ethiopia", ethiopiaDataController.patch_ethiopia_data);
router.delete("/api/ethiopia", ethiopiaDataController.delete_ethiopia_data);

module.exports = router;
