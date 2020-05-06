var Location = require("../models/LocationModel.js");
var mongoose = require("mongoose");
const LocationUser = require("./../models/LocationUserModel");
const { SymptomUser } = require("./../models/SymptomUser");
const { Symptom } = require("./../models/Symptom");
const { User } = require("./../models/UserModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const geolib = require("geolib");

// Display list of all locations.
exports.get_all_locations = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

  const locations = await Location.find({});
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.get_all_locations_with_symptoms = async (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(401).send("Incorrect authentication key");
    }
  });
  if(!req.body.longitude || !req.body.latitude){
    return res.status(500).send("Coordinates are not given");
  }
  let lat = req.body.latitude;
  let long = req.body.longitude;

  let result = [];
  const locations = await Location.find({});  
  // Get Symptoms for each user and store in Symptoms
  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    let isInRadius = geolib.isPointWithinRadius(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: lat, longitude: long },      
      10000*0.621371
    )
    if(!isInRadius){
      continue;
    }

    const users = await LocationUser.find({
      location_id: { $eq: location._id }
    });
    for (let k = 0; k < users.length; k++) {
      let userAtLocation = users[k];
      if (userAtLocation) {
        const symptomusers = await SymptomUser.find({
          user_id: userAtLocation.user_id
        });
        const user = await User.findById(userAtLocation.user_id);
        let symptoms = [];
        for (let j = 0; j < symptomusers.length; j++) {
          if (symptomusers[j]) {
            const symptom = await Symptom.findById(
              symptomusers[j].symptom_id
            );
            if (symptom) {
              symptoms.push(symptom);
            }
          }
        }
        if (symptoms.length > 0) {
          result.push({
            longitude: location.longitude,
            latitude: location.latitude,
            symptoms: symptoms,
            age_group: user.age_group,
            gender: user.gender
          });
          //This break line will be removed later onwards.
          break;
        }
      }
    }
  }
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(500).send("No locations with users and symptoms found.");
  }
};

// Post a location
exports.post_location = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });
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
      res.status(500).send(err);
    }
  }
};
//Get a specific Location by id
exports.get_location_by_id = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

  try {
    const location = await Location.findById(req.params.id);
    if(!location){
      return res.status(500).send("Location not found");
    }
    res.send(location);
  } catch (err) {
    res.status(500).send(err);
  }
};
//Get a specific Location by latitude and longitude
exports.get_location_by_coordinates = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

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
    res.status(500).send(err);
  }
};
//Update a location by id
exports.update_location = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

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
    res.status(500).send(err);
  }
};
//Delete a location
exports.delete_location = async (req, res) => {
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

  try {
    const location = await Location.findByIdAndDelete(req.body._id);
    if (!location) {
      res.status(404).send("No item found");
    } else {
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
  // jwt.verify(req.token, "secretkey", (err, authData) => {
  //   if (err) {
  //     res.status(401).send("Incorrect authentication key");
  //   }
  // });

  try {
    let riskFactor = await get_risk_by_location_id(req.params.id);

    res.json({ risk: riskFactor });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
