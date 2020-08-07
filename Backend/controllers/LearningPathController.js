const { LearningPath } = require("../models/LearningPathModel.js");
var mongoose = require("mongoose");

exports.getAllLearningPath = async(req, res) => {
    try {
        if (req.query.language != null && req.query.age_group != null) {
            let learningPaths = await LearningPath.find({ language: req.query.language, age_group: req.query.age_group });
            res.status(200).send(learningPaths);
        } else if (req.query.language != null) {
            let learningPaths = await LearningPath.find({ language: req.query.language });
            res.status(200).send(learningPaths);
        } else if (req.query.age_group != null) {
            let learningPaths = await LearningPath.find({ age_group: req.query.age_group, language:"English" });
            res.status(200).send(learningPaths);
        } else {
            let learningPaths = await LearningPath.find({language:"English"});
            res.status(200).send(learningPaths);
        }

    } catch (error) {
        res.status(500).send(error);
    }
};

exports.postLearningPath = async(req, res) => {
    let learningPath = new LearningPath({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        what: req.body.what,
        why: req.body.why,
        time: req.body.time,
        how: req.body.how,
        action: req.body.action,
        age_group: req.body.age_group,
        language: req.body.language,
    });

    try {
        await learningPath.save();
        res.status(200).send(learningPath);

    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};

exports.getLearningPathById = async(req, res) => {
    try {
        let learningPath = await LearningPath.findById({ _id: req.params.id });
        res.status(200).send(learningPath);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getLearningPathByName = async(req, res) => {
    try {
        let learningPath = await LearningPath.findOne({ name: req.params.name });
        res.status(200).send(learningPath);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateLearningPath = async(req, res) => {
    try {
        let learningPath = await LearningPath.findOneAndUpdate(req.params._id, req.body);
        if (learningPath) {
            let updatedLearningPath = await LearningPath.findById(LearningPath._id);
            res.send(updatedLearningPath);
        } else {
            res.send("learning Path not found");
        }
    } catch (error) {
        console.log("error is " + error);
        res.status(500).send(error);
    }
};

exports.deleteLearningPath = async(req, res) => {
    try {
        let learningPath = await LearningPath.findByIdAndRemove(req.body._id);
        if (!learningPath) {
            res.status(404).send("Learning not found");
        }
        res.status(200).send(learningPath);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};