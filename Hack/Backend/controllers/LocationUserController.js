const LocationUserModels = require("./../models/LocationUserModel");
const LocationModels = require("../models/LocationModel.js");
const UserModels = require("./../models/UserModel");
const SymptomUserModels = require("../models/SymptomUser");
const ProbabilityCalculator = require("../services/ProbabilityCalculator");
const axios = require("axios");
const mongoose = require("mongoose");

//Post a user location
exports.post_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var User = UserModels.DemoUser;
    var LocationUser = LocationUserModels.DemoLocationUser
    var Location = LocationModels.DemoLocation
    var SymptomUser = SymptomUserModels.DemoSymptomUser
  }else{
    var User = UserModels.User;
    var LocationUser = LocationUserModels.LocationUser
    var Location = LocationModels.Location
    var SymptomUser = SymptomUserModels.SymptomUser
  }

  if (!req.body.longitude || !req.body.latitude) {
    return res.status(400).send("Coordinates not given");
  }
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  const check = await Location.findOne({ 
    location: {
      $near:
      {
        $geometry: { type: "Point",  coordinates: [ longitude , latitude ] },
        $minDistance: 0,
        $maxDistance: 1
      }
    }
  });
  let location_id;
  if (check) {
    location_id = check._id
  }
  else {
    try{
      let location = new Location({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [longitude , latitude]
        }
      });
      await location.save();
      location_id = location._id;
    } catch (err) {
      return res.status(400).send("Location could not be saved");
    }
  }

  let user_id = req.body.user_id;
  let TTL = req.body.TTL;

  const location_user = new LocationUser({
    user_id,
    location_id,
    TTL,
  });
  try {
    // Check if user exists
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("User ID not found");
    }

    let country = '';
    let iso = ''
    try {
      const result = await axios.get('http://www.geoplugin.net/json.gp?ip=' + req.connection.remoteAddress.substring(2))
        .then(response => {
          if (response.data) {
            country = response.data.geoplugin_countryName
            iso = response.data.geoplugin_countryCode
          }
        })
        .catch(error => {
          console.log(error);
        });
      user.set({
        current_country: country
      });
      await user.save();
    }
    catch (err) {
      console.log(err);
    }
    let symptomsList = await SymptomUser.find({user_id: user_id}).populate('symptom_id')
    let symptoms = []
    symptomsList.forEach((item)=> symptoms.push(item.symptom_id.name))
    let probability = await ProbabilityCalculator.calculateProbability(symptoms, iso)
    let check = await LocationUser.findOne({
      location_id: location_id,
      user_id: user_id
    })
    if (check) {
      check.TTL = Number(TTL)
      check.probability = probability
      await check.save()
      return res.send(check);
    }
    location_user.probability = probability;
    await location_user.save();
    user.latest_location = location_user.location_id
    user.latest_location_user = location_user._id
    await user.save();
    return res.send(location_user);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.toString());
  }
}

//Get specific location_user by id
exports.get_location_user_by_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }

  try {
    const locationUser = await LocationUser.findById(req.params.id);
    if (!locationUser) {
      return res.status(500).send("User Location not found");
    }
    res.send(locationUser);
  } catch (err) {
    res.status(500).send(err.toString());
  }
}

//Get location_user by location_id
exports.get_by_location_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  try {
    const results = await LocationUser.find({
      location_id: { $eq: req.params.location_id },
    });
    if (!results || results.length < 1) {
      return res.status(500).send("No User Locations found.");
    }
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get all location_users
exports.get_all_location_users = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }

  const results = await LocationUser.find({});
  try {
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get location_user by user_id
exports.get_by_user_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }

  try {
    const results = await LocationUser.find({
      user_id: { $eq: req.params.user_id },
    });
    if (!results || results.length < 1) {
      return res.status(500).send("No User Locations found.");
    }
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Delete location_user with id
exports.delete_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }

  try {
    const location_user = await LocationUser.findByIdAndDelete(req.body._id);
    if (!location_user) {
      return res.status(404).send("No item found");
    }
    res.status(201).send(location_user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Update location_user with id
exports.update_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }

  try {
    let locationUser = await LocationUser.findById(req.body._id);
    if (!locationUser) {
      return res.status(500).send("User Location Not Found");
    }
    locationUser.set(req.body);
    await locationUser.save();
    res.send(locationUser);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};


