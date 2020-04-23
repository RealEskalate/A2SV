const { MedicalHistoryUser } = require("../models/MedicalHistoryUser.js");
const { User } = require("../models/UserModel.js");
const { MedicalHistory } = require("../models/MedicalHistory.js");

exports.get_all_medicalhistory_user = async (req, res) => {
    try {
        let medicalhistory_user = await MedicalHistoryUser.find();
        res.status(200).send(medicalhistory_user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get MedicalHistoryUser by user_id
exports.get_medicalhistory_user_by_user_id = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            res.status(200).send("User not found");
        }
        let medicalhistory_user = await MedicalHistoryUser.findOne({ user_id: req.params.id });
        if (medicalhistory_user) {
            res.status(200).send(medicalhistory_user);
        }
        res.status(400).send("Medical History User Pair not found");
    } catch (error) {
        res.status(500).send(error);
    }

};


// Get MedicalHistoryUser by medicalhistory_id
exports.get_medicalhistory_user_by_medicalhistory_id = async (req, res) => {
    try {
        let medicalhistory = await MedicalHistory.find(req.params.id);
        if (!medicalhistory) {
            res.status(200).send("Medical History not found");
        }
        let medicalhistory_user = await MedicalHistoryUser.findOne({ medicalhistory_id: req.params.id });
        if (medicalhistory_user) {
            res.status(200).send(medicalhistory_user);
        }
        res.status(400).send("Medical History User Pair not found");
    } catch (error) {
        res.status(500).send(error);
    }

};

// Post MedicalHistoryUser 
exports.post_medicalhistory_user = async (req, res) => {
    const medicalhistory_user = new MedicalHistoryUser({
        user_id: req.body.user_id,
        medicalhistory_id: req.body.medicalhistory_id
    });

    // Check if user and symptom exists
    User.findById(medicalhistory_user.user_id, (err) => {
        if (err) {
            return res.status(400).json({ message: 'User ID not found' });
        }
    });
    MedicalHistory.findById(medicalhistory_user.medicalhistory_id, (err) => {
        if (err) {
            return res.status(400).json({ message: 'Medical history ID not found' });
        }
    });

    try {
        await medicalhistory_user.save();
        res.status(200).send(medicalhistory_user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.update_medicalhistory_user = async (req, res) => {
    try {
        const medicalhistory_user = await MedicalHistoryUser.findByIdAndUpdate(req.body._id, req.body);
        if (!medicalhistory_user) {
            res.status(400).send("Medical History User Pair not found");
        }
        res.status(200).send(medicalhistory_user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.delete_medicalhistory_user = async (req, res) => {
    try {
        const medicalhistory_user = await MedicalHistoryUser.findByIdAndRemove({ _id: req.body._id });
        if (!medicalhistory_user) {
            res.send("Medical History User Pair not found");
        }
        res.send(medicalhistory_user);
    } catch (err) {
        res.status(500).send(err);
    }
};
