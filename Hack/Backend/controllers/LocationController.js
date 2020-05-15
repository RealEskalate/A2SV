var mongoose = require("mongoose");
var LocationModels = require("../models/LocationModel.js");
const LocationUserModels = require("./../models/LocationUserModel");
const SymptomUserModel = require("./../models/SymptomUser");
const { Symptom } = require("./../models/Symptom");
const UserModels = require("./../models/UserModel");
const axios = require("axios");
const geolib = require("geolib");

// Display list of all locations.
exports.get_all_locations = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }  
  const locations = await Location.find({});
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

exports.get_all_locations_with_symptoms = async (req, res) => {
  if (req.body.demo && req.body.demo == "true"){
    var Location = LocationModels.DemoLocation;
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var Location = LocationModels.Location;
    var LocationUser = LocationUserModels.LocationUser;
  }

  if(!req.body.longitude || !req.body.latitude){
    return res.status(400).send("Coordinates are not given");
  }
  let lat = req.body.latitude;
  let long = req.body.longitude;
  const locations = await Location.find({
    latitude: {
      $gte: Number(lat) - 0.11,
      $lte: Number(lat) + 0.11,      
    },
    longitude: {
      $gte: Number(long) - 0.11,
      $lte: Number(long) + 0.11,      
    }
  });  
  console.log(`Fetched ${locations.length} Locations from MongoDB`)
  let nearby_locations_dict = {}
  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    let distance = geolib.getDistance(
      { latitude: lat, longitude: long },
      { latitude: location.latitude, longitude: location.longitude },5)
    if(distance<1000){
      nearby_locations_dict[distance] = location._id
    }
  }
  let nearby_locations = []
  Object.keys(nearby_locations_dict).forEach((item)=> nearby_locations.push(nearby_locations_dict[item]))
  let result = []
  let user_known = [];
  console.log(`Filtered ${nearby_locations.length} Locations by Distance`)

  for (let i = 0; i < nearby_locations.length; i++) {
    let available_locations = await LocationUser.findOne({
      location_id: nearby_locations[i],
      user_id: {
        $nin: user_known
      }
    }).populate("location_id").populate("user_id")
    if(!available_locations){
      continue
    }
    let user = available_locations.user_id
    if(!user) continue
    user_known.push(user._id)      
    result.push({
      longitude: available_locations.location_id.longitude,
      latitude: available_locations.location_id.latitude,
      user_id: user._id,
      prevalence: available_locations.prevalence,
      age_group:  available_locations.user_id.age_group,
      gender:  available_locations.user_id.gender
    })
  }
  console.log(`Fetched ${result.length} Locations and Users according to filter`)
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(500).send("No locations with users and symptoms found.");
  }
};

// Post a location
exports.post_location = async (req, res) => {
  if (req.body.demo && req.body.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }

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
  if (req.body.demo && req.body.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }

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
  if (req.body.demo && req.body.demo == "true"){
    var Location = LocationModels.DemoLocation;
  }else{
    var Location = LocationModels.Location;
  }

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
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
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