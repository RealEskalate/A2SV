var LocationModels = require("../models/LocationModel.js");
var Location = LocationModels.Location;
var mongoose = require("mongoose");
const LocationUserModels = require("./../models/LocationUserModel");
const LocationUser = LocationUserModels.LocationUser;
const SymptomUserModel = require("./../models/SymptomUser");
const SymptomUser = SymptomUserModel.SymptomUser;
const { DemoSymptomUser } = require("./../models/DemoSymptomUserModel");
const { Symptom } = require("./../models/Symptom");
const UserModels = require("./../models/UserModel");
const User = UserModels.User;
const jwt = require("jsonwebtoken");
const axios = require("axios");
const geolib = require("geolib");

// Display list of all locations.
exports.get_all_locations = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var Location = LocationModels.DemoLocation;
    var SymptomUser = DemoSymptomUser;
    var LocationUser = LocationUserModels.DemoLocationUser;
    var User = UserModels.DemoUser;
  }else{
    var Location = LocationModels.Location;
    var SymptomUser = SymptomUserModel.SymptomUser;
    var LocationUser = LocationUserModels.LocationUser;
    var User = UserModels.User;
  }
  
  const locations = await Location.find({});
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

exports.get_all_locations_with_symptoms = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var Location = LocationModels.DemoLocation;
    var SymptomUser = DemoSymptomUser;
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var Location = LocationModels.Location;
    var SymptomUser = SymptomUserModel.SymptomUser;
    var LocationUser = LocationUserModels.LocationUser;
  }

  if(!req.body.longitude || !req.body.latitude){
    return res.status(400).send("Coordinates are not given");
  }
  let lat = req.body.latitude;
  let long = req.body.longitude;

  let dict = {};
  const locations = await Location.find(
    {
      longitude: {
        $gte:new Number(long) - 0.3,
        $lte:new Number(long) + 0.3
      },
      latitude: {
        $gte:new Number(lat) - 0.2,
        $lte:new Number(lat) + 0.2
      }
    }
  );  
  let nearby_locations = []
  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    if(geolib.getDistance(
      { latitude: lat, longitude: long },
      { latitude: location.latitude, longitude: location.longitude }
      )<6213.712){
        nearby_locations.push(location._id)
      }
  }
  console.log(nearby_locations.length)

  let LocationUsers = await LocationUser.find({
    location_id: {
      $in: nearby_locations
    }
  }).populate('location_id').populate('user_id')
  // Get Symptoms for each user and store in Symptoms
  for (let i = 0; i < LocationUsers.length; i++) {
    let userAtLocation = LocationUsers[i];
    let user = userAtLocation.user_id;
    let location = userAtLocation.location_id;    
    if(dict[`${user._id}`] && dict[`${user._id}`].TTL<userAtLocation.TTL){
      continue
    }
    let symptoms = [];
    const symptomusers = await SymptomUser.find({
      user_id: user._id
    }).populate('symptom_id');
    if(!symptomusers || symptomusers.length==0) continue;
    for (let j = 0; j < symptomusers.length; j++) {
      symptoms.push(symptomusers[j].symptom_id);
    }
    dict[`${user._id}`] = {
      Data: {
        longitude: location.longitude,
        latitude: location.latitude,
        symptoms: symptoms,
        age_group: user.age_group,
        gender: user.gender
      },
      TTL: userAtLocation.TTL
    };
    //Since we only need one user at a point
    break;
  }
  let result = []
  Object.keys(dict).forEach((item)=>{
    result.push({
      longitude: dict[`${item}`].Data.longitude,
      latitude: dict[`${item}`].Data.latitude,
      symptoms: dict[`${item}`].Data.symptoms,
      age_group: dict[`${item}`].Data.age_group,
      gender: dict[`${item}`].Data.gender
    })
  });
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(500).send("No locations with users and symptoms found.");
  }
};

// Post a location
exports.post_location = async (req, res) => {
  if(!req.body.longitude||!req.body.latitude){
    return res.status(500).send("Coordinates not given");
  }
  const check = await Location.findOne({
    longitude: { $eq: req.body.longitude },
    latitude: { $eq: req.body.latitude },
  });
  if (check) {
    res.send(check);
  }
  else {
    let location = new Location({
      _id: mongoose.Types.ObjectId(),
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      place_name: req.body.place_name,
    });
    try {
      const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?types=poi&access_token=pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g`)
        .then(response => {
          if (response.data) {
            if (response.data.features && response.data.features.length>0) {
              location.longitude = response.data.features[0].center[0];
              location.latitude = response.data.features[0].center[1];
              location.place_name = response.data.features[0].text;
            }
          }
          return location;
        })
        .catch(error => {
          console.log(error);
        });
      await result.save();
      res.send(result);
    } catch (err) {
      res.status(500).send(err.toString());
    }
  }
};
//Get a specific Location by id
exports.get_location_by_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }
  try {
    const location = await Location.findById(req.params.id);
    if(!location){
      return res.status(500).send("Location not found");
    }
    res.send(location);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
//Get a specific Location by latitude and longitude
exports.get_location_by_coordinates = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }
  try {
    const locations = await Location.find({
      latitude: { $eq: req.params.latitude },
      longitude: { $eq: req.params.longitude },
    });
    if(!locations || locations.length<1){
      return res.status(500).send("Location not found with the given coordinates");
    }
    res.send(locations);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
//Update a location by id
exports.update_location = async (req, res) => {
  try {
    let location = await Location.findById(req.body._id);
    if(!location){
      return res.status(500).send("Location doesnot exist");      
    }
    location.set(req.body);
    let check = await Location.findOne({latitude: location.latitude, longitude: location.longitude});
    if(!check){
      await location.save();
      return res.send(location);
    }
    await Location.findByIdAndDelete(location._id);
    res.send(check);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
//Delete a location
exports.delete_location = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.body._id);
    if (!location) {
      res.status(404).send("No item found");
    } else {
      res.status(204).send(location);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get risk factor of specific location by id
const get_risk_by_location_id = async (id) => {
  if (req.query.demo && req.query.demo == "true"){
    var SymptomUser = DemoSymptomUser;
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var SymptomUser = SymptomUserModel.SymptomUser;
    var LocationUser = LocationUserModels.LocationUser;
  }
  //Get users at the location
  const results = await LocationUser.find({
    location_id: { $eq: id },
  });

  // Risk factor variables initiated
  let riskFactor = 0;
  const riskAssessmentModel = {
    HIGH: 1 / 2,
    MEDIUM: 1 / 4,
    LOW: 1 / 6,
  };
  const Symptoms = {};

  // Get Symptoms for each user and store in Symptoms
  for (let i = 0; i < results.length; i++) {
    try {
      const symptomuser = await SymptomUser.find({
        user_id: results[i].user_id,
      });
      if (!symptomuser) {
        console.log("GOT HERE 2");
        throw new Error("InternalError: Unknown UserID stored in locationUser");
      }

      // Stores as symptom_id: frequency
      symptomuser.forEach((row) => {
        if (!(row.symptom_id in Symptoms)) {
          Symptoms[row.symptom_id] = 1;
        } else {
          Symptoms[row.symptom_id]++;
        }
      });
    } catch (err) {
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
  try {
    let riskFactor = await get_risk_by_location_id(req.params.id);

    res.json({ risk: riskFactor });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};