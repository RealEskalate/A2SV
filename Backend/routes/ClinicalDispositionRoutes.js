var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");
const grant_access = require("../middlewares/auth.js").grant_access;

// Require controller modules.
var clinical_disposition = require("../controllers/ClinicalDispositionController.js");

router.get("/api/clinicalDisposition", verifyToken.verifyToken, clinical_disposition.get_all);
router.post("/api/clinicalDisposition", verifyToken.verifyToken, clinical_disposition.post);
router.patch("/api/clinicalDisposition/:id", verifyToken.verifyToken, clinical_disposition.update);
router.delete("/api/clinicalDisposition/:id", verifyToken.verifyToken, clinical_disposition.delete);

module.exports = router;