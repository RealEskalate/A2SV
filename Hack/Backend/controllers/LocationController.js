var mongoose = require("mongoose");
const LocationModels = require("../models/LocationModel.js");
const LocationUserModels = require("./../models/LocationUserModel");
const LocationGridModels = require("./../models/LocationGridModel");
const SymptomUserModel = require("./../models/SymptomUser");
const UserModel = require("../models/UserModel");
const { Symptom } = require("./../models/Symptom");
const axios = require("axios");
const geolib = require("geolib");
const schedule = require("node-schedule");

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
  if(!req.body.longitude || !req.body.latitude){
    return res.status(400).send("Coordinates are not given");
  }
  if(!req.body.top_left_bound || !req.body.top_right_bound || !req.body.bottom_left_bound || !req.body.bottom_right_bound){
    return res.status(400).send("Corner Coordinates are not given");
  }  
  let lat = req.body.latitude;
  let long = req.body.longitude;
  let top_left_end = req.body.top_left_bound;
  let top_right_end = req.body.top_right_bound;
  let bottom_right_end = req.body.bottom_right_bound;
  let bottom_left_end = req.body.bottom_left_bound;
  let distance_check = geolib.getDistance(
    {latitude: top_left_end[1], longitude: top_left_end[0]},
    {latitude: top_right_end[1], longitude: top_right_end[0]},
  )
  let zoom = 0;
  if(distance_check>10000){
    zoom = 10;
  }
  let result = [] 
  if(zoom!=0){
    let boundaries = [
      top_left_end, top_right_end, bottom_right_end, bottom_left_end
    ]
    result = await findGridNearbySymptomaticUsers(boundaries, req.query.demo);
  }
  else{
    result = await findAllNearbySymptomaticUsers(long, lat, req.query.demo);    
  }
  console.log(`Fetched ${result.length} Locations and Users according to filter`)
  if (result.length > 0) {
    res.send(result);
  } else {
    res.status(500).send("No locations with users and symptoms found.");
  }
}

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
    location: {
      $near:
      {
        $geometry: { type: "Point",  coordinates: [ req.body.longitude , req.body.latitude ] },
        $minDistance: 0,
        $maxDistance: 1
      }
    }
  });
  console.log(check)
  if (check) {
    return res.send(check);
  }
  else {
    let location = new Location({
      _id: mongoose.Types.ObjectId(),
      location: {
        type: "Point",
        coordinates: [req.body.longitude , req.body.latitude]
      },
      place_name: req.body.place_name,
    });
    try {
      const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.longitude},${req.body.latitude}.json?types=poi&access_token=pk.eyJ1IjoiZmVyb3g5OCIsImEiOiJjazg0czE2ZWIwNHhrM2VtY3Y0a2JkNjI3In0.zrm7UtCEPg2mX8JCiixE4g`)
        .then(response => {
          if (response.data) {
            if (response.data.features && response.data.features.length>0) {
              location.location.coordinates[0] = response.data.features[0].center[0];
              location.location.coordinates[1] = response.data.features[0].center[1];
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
    const locations = await Location.findOne({ 
      location: {
        $near:
        {
          $geometry: { type: "Point",  coordinates: [ req.body.longitude , req.body.latitude ] },
          $minDistance: 0,
          $maxDistance: 1
        }
      }
  });
    if(!locations || locations.length<1){
      return res.status(500).send("Location not found with the given coordinates");
    }
    res.send(locations);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//[DEPRACATED AND UNNECESSARY]
//Update a location by id
exports.update_location = async (req, res) => {
  try {
    let location = await Location.findById(req.body._id);
    if(!location){
      return res.status(500).send("Location doesnot exist");      
    }
    location.set(req.body);
    let check = await Location.findOne({
      "location.coordinates": [location.location.longitude, location.location.latitude],
    });
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

//[DEPRACATED]
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

//[DEPRACATED]
//Get risk factor of specific location by id API
exports.get_location_risk_by_id = async (req, res) => {
  try {
    let riskFactor = await get_risk_by_location_id(req.params.id);

    res.json({ risk: riskFactor });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};


const findAllNearbySymptomaticUsers = async(long, lat, demo)=>{
  if (demo && demo == "true"){
    var Location = LocationModels.DemoLocation;
    var User = UserModel.DemoUser;
  }else{
    var Location = LocationModels.Location;
    var User = UserModel.User;
  }
  const nearby_locations = await Location.find({
    location: {
      $near: {
        $maxDistance: 10000,
        $geometry: {
         type: "Point",
         coordinates: [long, lat]
        }
      }
    },
  });  
  let idSet = Array.from(new Set(nearby_locations.map(item => mongoose.Types.ObjectId(`${item._id}`))));
  console.log(`Fetched ${nearby_locations.length} Locations from MongoDB`)
  let result = []
  let traversed_locations = {}
  let users = await User.find({
    latest_location:{
      $in: idSet
    }
  }).populate('latest_location_user').populate('latest_location').populate({path:'latest_location_user', populate: {path: 'user_id'}})
  console.log(users.length);
  for(let i = 0; i<users.length; i++){
    let user = users[i];
    if(!user) continue
    if(!user.latest_location_user || !user.latest_location) continue
    let latest_location_user = user.latest_location_user.user_id
    if(traversed_locations[user.latest_location._id] || !latest_location_user){
      continue;    
    }
    if(user.latest_location_user.probability==0){
      continue;
    }
    traversed_locations[user.latest_location._id] = 1;
    result.push({
      longitude: user.latest_location.location.coordinates[0],
      latitude: user.latest_location.location.coordinates[1],
      user_id: user._id,
      probability: user.latest_location_user.probability,
      age_group:  latest_location_user.age_group,
      gender:  latest_location_user.gender
    })
  }
  return result;
}

const findGridNearbySymptomaticUsers = async(boundaries, demo)=>{
  // await updateDb(demo);
  if (demo && demo == "true"){
    var LocationGrid = LocationGridModels.DemoLocationGrid;
  }else{
    var LocationGrid = LocationGridModels.LocationGrid;
  }
  let result =  await LocationGrid.find({
    location: {
      $geoWithin: {
         $geometry: {
            type : "Polygon" ,
            coordinates: [[ boundaries[0], boundaries[1], boundaries[2], boundaries[3], boundaries[0]]]
         }
      }
    }
  });
  return result;
}
// Schedules grid calculation every hour
const run_updates = () => {
  var rule = new schedule.RecurrenceRule();
  rule.hour = 3;
  rule.minute = 0;
  schedule.scheduleJob(rule, async function () {
    await updateDb(false);
  });
};
const updateDb = async (demo) => {
  if (demo && demo == "true"){
    var LocationGrid = LocationGridModels.DemoLocationGrid;
    var User = UserModel.DemoUser;
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
  }else{
    var LocationGrid = LocationGridModels.LocationGrid;
    var User = UserModel.User;
    var SymptomUser = SymptomUserModel.SymptomUser;
  }
  await LocationGrid.collection.drop();

  zoom = 10;
  let zoomLevels= { 10: 0.09, 111:1 ,1000:9}
  let equatorDgree=111
  let level= zoomLevels[zoom]

  let squareBoxes={}

  const symptoms = await Symptom.find({});
  //Find all users and retrieve their recent locations. Latest location will help us find the specific 
  //coordinates while Latest Location User will help us avoid db check if the user has any symptoms or not
  let users = await User.find({}).populate('latest_location').populate('latest_location_user');
  for(let i = 0; i<users.length; i++){
    console.log(i + " out of " + users.length + " and " + Object.keys(squareBoxes).length);
    let user = users[i];
    let loc = user.latest_location;
    let user_loc = user.latest_location_user;
    //If the location expired, If the location doesn't exist or If the user has not sent their location data in a while, we will skip them
    if(user_loc==null || loc==null || user.expiresAt < Date.now()){
      continue;
    }
    //If the probability is also zero, then symptoms don't exist for that user, so we will skip
    if(user_loc.probability==0){
      continue;
    }
    //Calculate the center point of the grid after finding out the grid they place on
    let lat_index = Math.ceil(loc.location.coordinates[1] + 90)/level;
    let latDistance = Math.sin( (-90 + (lat_index*level)) * Math.PI / 180 )
    let longKm = Math.cos(latDistance) * equatorDgree
    let inc = 10/longKm;
    let lon_index = Math.ceil(loc.location.coordinates[0] + 180)/inc;
    let start_point_lat = -90 + lat_index * (level)
    let start_point_lon = -180 + lon_index * (inc)
    let end_point_lat = start_point_lat + level
    let end_point_lon = start_point_lon + inc
    let center_point_lat = (start_point_lat + end_point_lat)/2;
    let center_point_lon = (start_point_lon + end_point_lon)/2;
    let center = [center_point_lat, center_point_lon]

    //Fetch all the symptoms that user has
    const symptomuser = await SymptomUser.find({ user_id: user._id }).populate('symptom_id');
    if(squareBoxes[center]){
      symptomuser.forEach((item)=>{
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      })
    }
    else{
      squareBoxes[center] = new LocationGrid({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [center_point_lon , center_point_lat]
        },
        value: {},
        zoom_level: 10
      })
      symptoms.forEach((item)=>{
        squareBoxes[center].value[`${item.name}`] = 0;        
      })
      symptomuser.forEach((item)=>{
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      })
    }
  }
  var values = Object.keys(squareBoxes).map(function(key){
   return squareBoxes[key];
  });
  await LocationGrid.insertMany(values);
  // return squareBoxes
}

exports.run_updates = run_updates;
run_updates();

