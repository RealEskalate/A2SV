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

exports.get_all_medicalhistory_user_by_id = async (req, res) => {
    try {
        let medicalhistory_user = await MedicalHistoryUser.findById(req.params.id);
        res.status(200).send(medicalhistory_user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get MedicalHistoryUser by user_id
exports.get_medicalhistory_user_by_user_id = async (req, res) => {
    try {
        let medicalhistory_user = await User.find({ user_id: req.params.user_id });
        if (!medicalhistory_user) {
            // console.log("User not found continuing though id recived " + req.params.user_id);
            res.status(400).send("User not found");
        } else {
            let medicalhistory_user = await MedicalHistoryUser.find({ user_id: req.params.user_id });
            if (medicalhistory_user) {
                res.status(200).send(medicalhistory_user);
            } else {
                res.status(400).send("Medical History User Pair not found");
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }

};


// Get MedicalHistoryUser by medicalhistory_id
exports.get_medicalhistory_user_by_medicalhistory_id = async (req, res) => {
    console.log("Getting mh by mid");
    try {
        let medicalhistory = await MedicalHistory.find({ medicalhistory_id: req.params.medicalhistory_id });
        if (!medicalhistory) {
            res.status(400).send("Medical History not found");
        } else {
            let medicalhistory_user = await MedicalHistoryUser.find({ medicalhistory_id: req.params.medicalhistory_id });
            if (medicalhistory_user) {
                res.status(200).send(medicalhistory_user);
            } else {
                console.log("Pair not found");
                res.status(400).send("Medical History User Pair not found");
            }
        }
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
        } else {
            res.status(200).send(medicalhistory_user);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.delete_medicalhistory_user_by_pair = async (req, res) => {
    try {
        const medicalhistory_user = await MedicalHistoryUser.findByIdAndRemove(req.body._id);
        if (!medicalhistory_user) {
            res.status(400).send("Medical History User Pair not found");
        } else {
            res.status(200).send(medicalhistory_user);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
