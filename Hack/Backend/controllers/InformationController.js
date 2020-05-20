const { Information } = require("../models/InformationModel.js");
var mongoose = require("mongoose");

exports.getAllInformations = async(req, res) => {
    try {
        if(req.query.type == "action" && req.query.language != null){
            let information = await Information.find({ type: req.query.type , language:req.query.language});
            res.status(200).send(information);
        } else if (req.query.type == "action") {
            let information = await Information.find({ type: req.query.type , language:"English"});
            res.status(200).send(information);
        } else if (req.query.language != null && req.query.title != null) {
            let information = await Information.find({ language: req.query.language, title: req.query.title, type: null });
            res.status(200).send(information);
        } else if (req.query.language != null) {
            let information = await Information.find({ language: req.query.language, type: null });
            res.status(200).send(information);
        } else if (req.query.title != null) {
            let information = await Information.find({ title: req.query.title,language:"English", type: null });
            res.status(200).send(information);
        } else {
            let information = await Information.find({ type: null, language:"English" });
            res.status(200).send(information);
        }

    } catch (error) {
        res.status(500).send(error);
    }
};

exports.postInformations = async(req, res) => {
    let information = new Information({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        language: req.body.language,
        image: req.body.image,
        type: req.body.type,
        description: req.body.description
    });

    try {
        await information.save();
        res.status(200).send(information);

    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};

exports.updateInformation = async(req, res) => {
    try {
        let information = await Information.findOneAndUpdate(req.params._id, req.body);
        if (information) {
            let updatedInfromation = await Information.findById(information._id);
            res.send(updatedInfromation);
        } else {
            res.send("Information not found");
        }
    } catch (error) {
        console.log("error is " + error);
        res.status(500).send(error);
    }
};

exports.deleteInformation = async(req, res) => {
    try {
        let information = await Information.findByIdAndRemove(req.body._id);
        if (!information) {
            res.status(404).send("information not found");
        }
        res.status(200).send(information);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};