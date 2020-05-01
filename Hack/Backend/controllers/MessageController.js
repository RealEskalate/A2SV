const { Message } = require("../models/MessageModel.js");

exports.getAllMessages = async(req, res) => {
    const messages = await Message.find({});
    try {
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send("Messages not found");
    }
};

exports.postMessage = async(req, res) => {
    let message = new Message({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    try {
        await message.save();
        res.status(200).send(message);

    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};


exports.getMessageByEmail = async(req, res) => {
    try {
        let messages = await Message.find({ email: req.params.email });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.deleteMessages = async(req, res) => {
    try {
        let message = await Message.findByIdAndRemove(req.body._id);
        if (!message) {
            res.status(404).send("Message not found");
        }
        res.status(200).send(message);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};