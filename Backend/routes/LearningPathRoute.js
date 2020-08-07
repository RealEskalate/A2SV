var express = require("express");
var router = express.Router();
var learningPathController = require("../controllers/LearningPathController");

router.get("/api/resources/learning-path", learningPathController.getAllLearningPath);
router.get("/api/resources/learning-path/name", learningPathController.getLearningPathByName);
router.get("/api/resources/learning-path/id", learningPathController.getLearningPathById);
router.post("/api/resources/learning-path", learningPathController.postLearningPath);
router.patch("/api/resources/learning-path", learningPathController.updateLearningPath);
router.delete("/api/resources/learning-path", learningPathController.deleteLearningPath);
module.exports = router;