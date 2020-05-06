const LocationUser = require("../models/LocationUserModel");
const Location = require("./../models/LocationModel");
const { User } = require("./../models/UserModel");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.post_location_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  if(!req.body.longitude||!req.body.latitude){
    return res.status(500).send("Coordinates not given");
  }
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  const check = await Location.findOne({
    longitude: { $eq: longitude },
    latitude: { $eq: latitude },
  });
  let location_id;
  if (check) {
    location_id = check._id
  }
  else{
    let location = new Location({
      _id: mongoose.Types.ObjectId(),
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      place_name: req.body.place_name,
    });
    try {
      let result1 = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?types=poi&access_token=pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g`)
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
      await result1.save();
      location_id = result1._id;
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
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
    // Check if user and location exists
    let location = await Location.findById(location_id);
    if (!location) {
      return res.status(400).send("Location ID not found");
    }
    let user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send("User ID not found");
    }

    let country = '';
    try{
      const result = await axios.get('http://www.geoplugin.net/json.gp?ip='+req.connection.remoteAddress.substring(2))
      .then(response => {
        if (response.data) {
          country = response.data.geoplugin_countryName
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
    catch(err){
      console.log(err);
    }
    await location_user.save();
    return res.send(location_user);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.get_by_location_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });
  try {
    const results = await LocationUser.find({
      location_id: { $eq: req.params.location_id },
    });
    if (!results || results.length<1) {
      return res.status(500).send("No User Locations found.");
    }
    res.send(results);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

exports.get_all_location_users = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const results = await LocationUser.find({});
  try {
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.get_by_user_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  try {
    const results = await LocationUser.find({
      user_id: { $eq: req.params.user_id },
    });
      if (!results || results.length<1) {
      return res.status(500).send("No User Locations found.");
    }
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.delete_location_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  try {
    const location_user = await LocationUser.findByIdAndDelete(req.body._id);
    if (!location_user) {
      return res.status(404).send("No item found");
    }
    res.status(201).send(location_user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.update_location_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  try {
    let locationUser = await LocationUser.findById(req.body._id);
    if(!locationUser){
      return res.status(500).send("User Location Not Found");
    }
    locationUser.set(req.body);
    await locationUser.save();
    res.send(locationUser);
  } catch (err) {
    res.status(500).send(err);
  }
};
