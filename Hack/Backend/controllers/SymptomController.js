const { Symptom, validateSymptom } = require("../models/Symptom");
const jwt = require("jsonwebtoken");

// Display list of all locations.
exports.get_all_symptoms = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const symptoms = await Symptom.find({});

    try {
        res.send(symptoms);
    } catch (err) {
        res.status(500).send(err);
    }
};


// Post a symptom
exports.post_symptom = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const symptom = new Symptom({
        name: req.body.name,
        relevance: req.body.relevance,
        description: req.body.description,
    });

    var { error } = validateSymptom(req.body);
    if (error) {
        res.status(400).send("Invalid request");
    }

    try {
        const symptomExists = await Symptom.findOne({name: symptom.name, relevance: symptom.relevance});
        if(symptomExists){
            res.send(symptomExists);
        }
        else{
            await symptom.save();
            res.send(symptom);    
        }
    } catch (err) {
        res.status(500).send(err);
    }
};


//Get a symptom by id
exports.get_symptom_by_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const symptom = await Symptom.findById(req.params.id);
    try {
        res.send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};

//Update a symptom by id
exports.update_symptom = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const symptom = await Symptom.findByIdAndUpdate(req.body._id, req.body);
        if (!symptom) {
            res.status(400).send("Symptom not found");
        }
        res.send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Deleting a symptom
exports.delete_symptom = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const sympton = await Symptom.findByIdAndRemove(req.body._id);
        if (!symptom) {
            res.status(404).send("Symptom not found found");
        }
        res.status(200).send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};