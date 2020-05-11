var express = require("express");
var router = express.Router();
const verifyToken = require("../middlewares/auth.js");

const MessageController = require("../controllers/MessageController.js");

router.get("/api/messages/", verifyToken.verifyToken, MessageController.getAllMessages);
router.get("/api/messages/email/:email", verifyToken.verifyToken, MessageController.getMessageByEmail);
router.get("/api/messages/:id", verifyToken.verifyToken, MessageController.getMessageById);

router.post("/api/messages", verifyToken.verifyToken, MessageController.postMessage);
router.delete("/api/messages/", verifyToken.verifyToken, MessageController.deleteMessages);

module.exports = router;