var Location = require("../models/LocationModel.js");
var mongoose = require("mongoose");
const LocationUser = require("./../models/LocationUserModel");
const {SymptomUser} = require("./../models/SymptomUser");
const {Symptom} = require("./../models/Symptom");
const jwt = require("jsonwebtoken");

// Display list of all locations.
exports.get_all_locations = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  const locations = await Location.find({});
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Post a location
exports.post_location = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  const location = new Location({
    _id: mongoose.Types.ObjectId(),
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    place_name: req.body.place_name,
  });
  try {
    await location.save();
    res.send(location);
  } catch (err) {
    res.status(500).send(err);
  }
};

//Get a specific Location by id
exports.get_location_by_id = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  const location = await Location.findById(req.params.id);
  try {
    res.send(location);
  } catch (err) {
    res.status(500).send(err);
  }
};
//Get a specific Location by latitude and longitude
exports.get_location_by_coordinates = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  const locations = await Location.find({
    latitude: { $eq: req.params.latitude },
    longitude: { $eq: req.params.longitude },
  });
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err);
  }
};
//Update a location by id
exports.update_location = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });

  try {
    await Location.findByIdAndUpdate(req.body._id, req.body);
    const location = await Location.save();
    await Location.save();
    res.send(location);
  } catch (err) {
    res.status(500).send(err);
  }
};
//Delete a location
exports.delete_location = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });
  
  try {
    const location = await Location.findByIdAndDelete(req.body._id);
    if (!location) {
      res.status(404).send("No item found");
    }
    else{
      res.status(204).send(location);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

//Get risk factor of specific location by id
const get_risk_by_location_id = async (id) => {

  //Get users at the location
  const results = await LocationUser.find({
    location_id: {$eq: id}
  });
  
  // Risk factor variables initiated
  let riskFactor = 0;
  const riskAssessmentModel = {
    "HIGH": 1/2,
    "MEDIUM": 1/4,
    "LOW": 1/6
  };
  const Symptoms = {};
  
  // Get Symptoms for each user and store in Symptoms
  for (let i = 0; i < results.length; i++){
    
    try {
      const symptomuser = await SymptomUser.find({ user_id: results[i].user_id });
      if (!symptomuser) {
        console.log("GOT HERE 2");
        throw new Error("InternalError: Unknown UserID stored in locationUser");
      }
      
      // Stores as symptom_id: frequency
      symptomuser.forEach((row) => {
        if (!(row.symptom_id in Symptoms)) {
          Symptoms[row.symptom_id] = 1;
        }
        else {
          Symptoms[row.symptom_id]++;
        }
      });
    }
    catch (err) {
      throw err;
    }
  }


  // Calculate the risk factor for each of the symptoms
  for (key in Symptoms) {
    const symptom = await Symptom.findById(key);
    
    riskFactor += riskAssessmentModel[symptom.relevance] * Symptoms[key];
  }

  return riskFactor;
  
};

//Get risk factor of specific location by id API
exports.get_location_risk_by_id = async (req, res) => {
  jwt.verify(req.token, 'secretkey', (err,authData) =>{
    if (err){
        res.status(401).send("Incorrect authentication key");
    }
  });
    
  try {
    let riskFactor = await get_risk_by_location_id(req.params.id);
    
    res.json({"risk": riskFactor});
  } catch (err) {
    res.status(500).send(err.toString());
  }
};