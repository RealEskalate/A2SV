var express = require("express");
var router = express.Router();

var interviewController = require('../controllers/InterviewController');
const verifyToken = require("../middlewares/auth.js").verifyToken;

router.get('/api/interviews', verifyToken, interviewController.getInterviews);
router.get('/api/interviews/:id', verifyToken, interviewController.getInterviewById);
router.post('/api/interviews', verifyToken, interviewController.addInterview);
router.patch('/api/inteviews/:id', verifyToken, interviewController.updateInterview);
router.delete('/api/interviews/:id', verifyToken, interviewController.deleteInterview);

module.exports = router;
