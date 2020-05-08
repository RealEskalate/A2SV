var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

const MessageController = require("../controllers/MessageController.js");

router.get("/api/messages/", MessageController.getAllMessages);
router.get("/api/messages/email/:email", MessageController.getMessageByEmail);
router.get("/api/messages/:id", MessageController.getMessageById);

router.post("/api/messages", MessageController.postMessage);
router.delete("/api/messages/", MessageController.deleteMessages);

module.exports = router;