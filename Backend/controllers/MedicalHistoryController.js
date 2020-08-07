const { MedicalHistory } = require("../models/MedicalHistory.js");

exports.get_all_medicalhistory = async (req, res) => {
    const medicalhistories = await MedicalHistory.find({});
    try {
        res.status(200).send(medicalhistories);
    } catch (error) {
        res.status(400).send("Medical History not found");
    }
};

exports.post_medicalhistory = async (req, res) => {
    let medicalhistory = new MedicalHistory({
        name: req.body.name,
        description: req.body.description
    });

    try {
        let existing_medicalhistory = await MedicalHistory.findOne({ name: medicalhistory.name });
        if (existing_medicalhistory) {
            res.status(200).send(existing_medicalhistory);
        } else {
            await medicalhistory.save();
            res.status(200).send(medicalhistory);
        }
    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};

// Get medical history by id
exports.get_medicalhistory_by_id = async (req, res) => {
    try {
        let medicalhistory = await MedicalHistory.findById({ _id: req.params.id });
        res.status(200).send(medicalhistory);
    } catch (error) {
        res.status(500).send(error);
    }
};

//  Get medical history by name
exports.get_medicalhistory_by_name = async (req, res) => {
    try {
        let medicalhistory = await MedicalHistory.findOne({ name: req.params.name });
        res.status(200).send(medicalhistory);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.update_medicalhistory = async (req, res) => {
    try {
        let medicalHistory = await MedicalHistory.findOneAndUpdate(req.params._id, req.body);
        if (medicalHistory) {
            let updatedMedicalHistory = await MedicalHistory.findById(medicalHistory._id);
            res.send(updatedMedicalHistory);
        } else {
            res.send("Medical History not found");
        }
    } catch (error) {
        console.log("error is " + error);
        res.status(500).send(error);
    }
};

exports.delete_medicalhistory = async (req, res) => {
    try {
        let medicalhistory = await MedicalHistory.findByIdAndRemove(req.body._id);
        if (!medicalhistory) {
            res.status(404).send("Medical history not found");
        }
        res.status(200).send(medicalhistory);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};