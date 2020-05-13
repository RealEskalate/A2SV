const { Symptom, validateSymptom } = require("../models/Symptom");
const jwt = require("jsonwebtoken");

// Display list of all locations.
exports.get_all_symptoms = async (req, res) => {
    const symptoms = await Symptom.find({});

    try {
        content = [];
        for (let i = 0; i < symptoms.length; i++){
            content.push(symptoms[i]._id.toString())
        }
        res.send({content});
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

// Post a symptom
exports.post_symptom = async (req, res) => {
    const symptom = new Symptom({
        name: req.body.name,
        relevance: req.body.relevance,
        description: req.body.description,
    });

    var { error } = validateSymptom({
        name: req.body.name,
        relevance: req.body.relevance,
        description: req.body.description,
    });
    if (error) {
        console.log('validation error ' + error)
        return res.status(400).send("Invalid request");
    }

    try {
        const symptomExists = await Symptom.findOne({ name: symptom.name, relevance: symptom.relevance });
        if (symptomExists) {
            return res.send(symptomExists);
        }
        else {
            await symptom.save();
            return res.send(symptom);
        }
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};

exports.symptom_many_add = async (req, res) =>{
    let content = []
    for (let i = 0 ; i < req.body.listed.length; i++){
      let element = req.body.listed[i];
      const symptom = new Symptom({
        name: element.name,
        relevance: element.relevance,
        description: element.description,
    });

    var { error } = validateSymptom(element);
    if (error) {
        res.status(400).send("Symptom not found");
    }
    try {
        await symptom.save();
        content.push(symptom._id.toString());
    } catch (err) {
        console.log(err.toString())
    }
      console.log(symptom);
    }
    res.json({content});
}
//Get a symptom by id
exports.get_symptom_by_id = async (req, res) => {

    const symptom = await Symptom.findById(req.params.id);
    try {
        res.send(symptom);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

//Update a symptom by id
exports.update_symptom = async (req, res) => {

    try {
        let symptom = await Symptom.findOneAndUpdate(req.params.symptom_id, req.body);
        if (symptom) {
            let updatedSymptom = await Symptom.findById(symptom._id);
            res.status(200).send(updatedSymptom);
        } else {
            res.status(400).send("Symptom not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

// Deleting a symptom
exports.delete_symptom = async (req, res) => {

    try {
        const symptom = await Symptom.findByIdAndRemove(req.body._id);
        if (!symptom) {
            res.status(404).send("Symptom not found");
        } else {
            res.status(200).send(symptom);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};