const { Symptom, validateSymptom } = require("../models/Symptom");

// Display list of all locations.
exports.get_all_symptoms = async (req, res) => {
    const symptoms = await Symptom.find({});

    try {
        res.send(symptoms);
    } catch (err) {
        res.status(500).send(err);
    }
};


// Post a symptom
exports.post_symptom = async (req, res) => {

    const symptom = new Symptom({
        name: req.body.name,
        relevance: req.body.relevance,
        description: req.body.description,
    });

    try {
        await symptom.save();
        res.send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};


//Get a symptom by id
exports.get_symptom_by_id = async (req, res) => {
    const symptom = await Symptom.findById(req.params.id);
    try {
        res.send(symptom);
    } catch (err) {
        res.status(500).send(err);
    }
};

//Update a symptom by id
exports.update_symptom = async (req, res) => {
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