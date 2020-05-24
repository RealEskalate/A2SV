const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
var mongoose = require("mongoose");

exports.postStatisticsResource = async(req, res) => {
    let statisticsResource = new StatisticsResource({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        fields: req.body.fields,
        criteria: req.body.criteria,
    });

    try {
        await statisticsResource.save();
        res.status(200).send(statisticsResource);

    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};

exports.getStatisticsResourceById = async(req, res) => {
    try {
        let statisticsResource = await StatisticsResource.findById({ _id: req.params.id });
        res.status(200).send(statisticsResource);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getStatisticsResourceByFields = async(req, res) => {
    try {
        if (req.query.language != null && req.query.title != null) {
            let statisticsResource = await StatisticsResource.find({ language: req.query.language, title: req.query.title });
            res.status(200).send(statisticsResource);
        } else if (req.query.language != null) {
            let statisticsResource = await StatisticsResource.find({ language: req.query.language });
            res.status(200).send(statisticsResource);
        } else if (req.query.title != null) {
            let statisticsResource = await StatisticsResource.find({ title: req.query.title,language:"English" });
            res.status(200).send(statisticsResource);
        } else {
            let statisticsResource = await StatisticsResource.find({language:"English"});
            res.status(200).send(statisticsResource);
        }

    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateStatisticsResource = async(req, res) => {
    try {
        let statisticsResource = await StatisticsResource.findOneAndUpdate(req.params._id, req.body);
        if (statisticsResource) {
            let updatedStatisticsResource = await StatisticsResource.findById(statisticsResource._id);
            res.send(updatedStatisticsResource);
        } else {
            res.send("stat resource not found");
        }
    } catch (error) {
        console.log("error is " + error);
        res.status(500).send(error);
    }
};

exports.deleteStatisticsResource = async(req, res) => {
    try {
        let statisticsResource = await StatisticsResource.findByIdAndRemove(req.body._id);
        if (!statisticsResource) {
            res.status(404).send("stat resource not found");
        }
        res.status(200).send(statisticsResource);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};