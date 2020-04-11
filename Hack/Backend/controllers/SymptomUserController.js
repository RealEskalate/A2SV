const { SymptomUser, validateSymptomUser } = require("../models/SymptomUser");
const { Symptom, validateSymptom } = require("../models/Symptom");
const UserSchema = require("./../models/UserModel")
const User=UserSchema.User
const jwt = require("jsonwebtoken");

// Display list of all locations.
exports.get_all_symptomusers = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const symptomusers = await SymptomUser.find();

    try {
        res.send(symptomusers);
    } catch (err) {
        res.status(500).send(err);
    }
};


// Post a symptomuser
exports.post_symptomuser = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const symptomuser = new SymptomUser({
        symptom_id: req.body.symptom_id,
        user_id: req.body.user_id,
    });

    // Check if user and symptom exists
    Symptom.findById(symptomuser.symptom_id, (err) => {
        if(err){
            return res.status(400).json({ message: 'Symptom ID not found' });
        }
    });
    User.findById(symptomuser.user_id, (err) => {
        if (err){
            return res.status(400).json({ message: 'User ID not found' });
        }
    });
    // var { error } = validateSymptomUser(symptomuser);
    // if (error) {
    //     res.status(400).send("Symptom User Pair not found");
    // }
    try {
        await symptomuser.save();
        res.send(symptomuser);
    } catch (err) {
        res.status(500).send(err);
    }
};


//Get a symptomuser by symptom_id
exports.get_symptomuser_by_symptom_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const symptomuser = await Symptom.findOne({ symptom_id: req.params.symptom_id });
        if (!symptomuser) {
            res.status(400).send("Symptom User Pair not found");
        }
        res.status(200).send(symptomuser);
    } catch (err) {
        res.status(500).send(err);
    }
};

//Get a symptomuser by user_id
exports.get_symptomuser_by_user_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const symptomuser = await Symptom.findOne({ user_id: req.params.user_id });
        if (!symptomuser) {
            res.status(400).send("Symptom User Pair not found");
        }
        res.status(200).send(symptomuser);
    } catch (err) {
        res.status(500).send(err);
    }
};


//Update a symptomuser by id
exports.update_symptomuser = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const symptomuser = await Symptom.findByIdAndUpdate(req.body._id, req.body);
        if (!symptomuser) {
            res.status(400).send("Symptom not found");
        }
        res.status(200).send(symptomuser);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Deleting a symptomuser
exports.delete_symptomuser = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    
    try {
        const symptomuser = await Symptom.findByIdAndRemove(req.body._id);
        if (!symptomuser) {
            res.status(404).send("Symptom User Pair not found");
        }
        res.status(200).send(symptomuser);
    } catch (err) {
        res.status(500).send(err);
    }
};