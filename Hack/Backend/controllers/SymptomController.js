const { Symptom, validateSymptom } = require("../models/Symptom");
const jwt = require("jsonwebtoken");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");

// Display list of all locations.
exports.get_all_symptoms = async (req, res) => {
    const symptoms = await Symptom.find({});
    let language=null;

    if (req.query.language){
        language= await StatisticsResource.findOne({ language:req.query.language , title: 'sypmtom-list'});
        if (language){language=language.fields[0];}
    } 
    for (var index=0; index<symptoms.length;index++){
        let data= symptoms[index];
        let key=data._id;
        if (language && language[key]){
            data.name=language[key].name;
            data.description= language[key].description
            data.relevance=language[key].relevance;
        }
    }

    try {
        return res.status(200).send(symptoms);
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

//Get a symptom by id
exports.get_symptom_by_id = async (req, res) => {

    const symptom = await Symptom.findById(req.params.id);

    if (req.query.language){
        let language= await StatisticsResource.findOne({ language:req.query.language , title: 'sypmtom-list'});
        let key=symptom._id;
        if (language && language.fields[0][key]){
            symptom.name=language.fields[0][key].name;
            symptom.description= language.fields[0][key].description
            symptom.relevance=language.fields[0][key].relevance;
        }
    } 

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