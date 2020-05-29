const LocationGridModels = require("./../models/LocationGridModel");
const SymptomUserModel = require("./../models/SymptomUser");
const { Symptom } = require("./../models/Symptom");
const geolib = require("geolib");
const schedule = require("node-schedule");
const LocationUserModels = require("./../models/LocationUserModel");
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
    var SymptomUser = SymptomUserModels.DemoSymptomUser
  }else if (req.query.stress && req.query.stress == "true"){
    var User = UserModels.StressUser;
    var LocationUser = LocationUserModels.StressLocationUser
    var SymptomUser = SymptomUserModels.StressSymptomUser 
  }else{
    var User = UserModels.User;
    var LocationUser = LocationUserModels.LocationUser
    var SymptomUser = SymptomUserModels.SymptomUser
  }

  if (!req.body.longitude || !req.body.latitude) {
    return res.status(400).send("Coordinates not given");
  }
  if (!req.body.user_id) {
    return res.status(400).send("User ID not given");
  }
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let user_id = req.body.user_id;
  let TTL = 1000 * 60 * 60 * 2;

  // Check if user exists
  let user = await User.findById(user_id);
  if (!user) {
    return res.status(400).send("User ID not found");
  }
  
  let check = await LocationUser.findOne({ 
    user_id: req.body.user_id
  });
  if(!check){
    check = new LocationUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user_id
    });
  }
  check.location = {
    type: "Point",
    coordinates: [longitude , latitude]
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
  try{
    let symptomsList = await SymptomUser.find({user_id: user_id}).populate('symptom_id')
    let symptoms = []
    symptomsList.forEach((item)=> symptoms.push(item.symptom_id.name))
    let probability = await ProbabilityCalculator.calculateProbability(symptoms, iso)

    check.TTL = Number(TTL)
    check.probability = probability
    await check.markModified('location');
    await check.save()
    user.latest_location_user = check._id
    await user.save()
    return res.send(check);
  }
  catch (err) {
    return res.status(404).send("Location User could not be posted");
  }
}

//Get specific location_user by id
exports.get_location_user_by_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  if(!req.params.id){
    return res.status(400).send("User Location ID not provided");
  }
  try {
    const locationUser = await LocationUser.findById(req.params.id);
    if (!locationUser) {
      return res.status(404).send("User Location not found");
    }
    res.send(locationUser);
  } catch (err) {
    res.status(404).send("User Location not found");
  }
}

//Get all location_users
exports.get_all_location_users = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  const results = await LocationUser.find({});
  try {
    res.send(results);
  } catch (err) {
    res.status(404).send("No Location Users not found");
  }
};

//Get location_user by user_id
exports.get_by_user_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  if(!req.params.user_id){
    return res.status(400).send("User ID not provided");
  }
  try {
    const results = await LocationUser.find({
      user_id: { $eq: req.params.user_id },
    });
    res.send(results);
  } catch (err) {
    return res.status(404).send("User Locations filtered by User not found");
  }
};

//Delete location_user with id
exports.delete_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  if(!req.body._id){
    return res.status(400).send("User Location ID not given");
  }
  try {
    const location_user = await LocationUser.findByIdAndDelete(req.body._id);
    if (!location_user) {
      return res.status(404).send("User Location Not Found");
    }
    res.status(201).send(location_user);
  } catch (err) {
    res.status(404).send("Location User could not be deleted");
  }
};

//Update location_user with id
exports.update_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  if(!req.body._id){
    return res.status(400).send("ID not given");
  }
  if (!req.body.user_id) {
    return res.status(400).send("User ID not given");
  }
  if (!req.body.longitude || !req.body.latitude) {
    return res.status(400).send("Coordinates not given");
  }
  try {
    let locationUser = await LocationUser.findById(req.body._id);
    if (!locationUser) {
      return res.status(404).send("User Location Not Found");
    }
    locationUser.set(req.body);
    await locationUser.markModified('location')
    await locationUser.save();
    res.send(locationUser);
  } catch (err) {
    res.status(404).send("Location User could not be updated");
  }
};

// Fetch list of all locations alongside their symptoms
exports.get_all_locations_with_symptoms = async (req, res) => {
  if(!req.body.longitude || !req.body.latitude){
    console.log('User coordinates not supplied');
    return res.status(400).send("Coordinates are not given");
  }
  if(!req.body.top_left_bound || !req.body.top_right_bound || !req.body.bottom_left_bound || !req.body.bottom_right_bound){
    console.log('Boundary coordinates not supplied');
    return res.status(400).send("Corner Coordinates are not given");
  }  
  let lat = req.body.latitude;
  let long = req.body.longitude;
  let top_left_end = req.body.top_left_bound;
  let top_right_end = req.body.top_right_bound;
  let bottom_left_end = req.body.bottom_left_bound;
  let bottom_right_end = req.body.bottom_right_bound;
  let distance_check = geolib.getDistance(
    {latitude: top_left_end[1], longitude: top_left_end[0]},
    {latitude: top_right_end[1], longitude: top_right_end[0]},
  )
  let zoom = 0;
  if(distance_check>=10000){
    zoom = 10;
  }
  try{
    let result = [] 
    if(zoom!=0){
      let boundaries = [
        top_left_end, top_right_end, bottom_right_end, bottom_left_end
      ]
      result = await findGridNearbySymptomaticUsers(boundaries, req.query.demo);
      console.log(`Fetched ${result.length} Grids according to filter`)
    }
    else{
      result = await findAllNearbySymptomaticUsers(long, lat, req.query.demo, req.query.stress);    
      console.log(`Fetched ${result.length} Locations and Users according to filter`)
    }
    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(500).send("No locations with users and symptoms found.");
    }
  }
  catch(err){
    console.log(err.toString());
    res.status(500).send("No locations with users and symptoms found.");
  }
}
const findAllNearbySymptomaticUsers = async(long, lat, demo, stress)=>{
  if (demo && demo == "true"){
    var LocationUser = LocationUserModels.DemoLocationUser;
  }else if (stress && stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
  }else{
    var LocationUser = LocationUserModels.LocationUser;
  }
  const location_users = await LocationUser.find({
    location: {
      $near: {        
        $maxDistance: 10000,
        $geometry: {
         type: "Point",
         coordinates: [long, lat]
        }
      }
    },
    probability: {
      $gt: 0
    }
  });
  // var traversed_locations = {}
  // for(let i = 0; i<users.length; i++){
  //   let location_user = location_users[i];
  //   if(!location_user) continue
  //   if(location_user.probability==0){
  //     continue;
  //   }
    // if(traversed_locations[[location_user.location.coordinates[0], location_user.location.coordinates[1]]]){
    //   continue
    // }
    // traversed_locations[ [location_user.location.coordinates[0], location_user.location.coordinates[1]]] = {    
      // longitude: location_user.location.coordinates[0],
      // latitude: location_user.location.coordinates[1],
      // user_id: location_user.user_id._id,
      // probability: location_user.probability,
      // age_group:  location_user.user_id.age_group,
      // gender:  location_user.user_id.gender
    // }    
  // }
  return location_users;
}

const findGridNearbySymptomaticUsers = async(boundaries, demo)=>{
  // await updateDb(demo);
  if (demo && demo == "true"){
    var LocationGrid = LocationGridModels.DemoLocationGrid;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationUser = LocationUserModels.StressLocationUserModel 
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
// Schedules grid calculation every 3 hours
const run_updates = () => {
  var rule = new schedule.RecurrenceRule();
  rule.hour = 3;
  schedule.scheduleJob(rule, async function () {
    await updateDb(false);
  });
};
const updateDb = async (demo) => {
  if (demo && demo == "true"){
    var LocationGrid = LocationGridModels.DemoLocationGrid;
    var LocationUser = LocationUserModels.DemoLocationUser;
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
  }else if (req.query.stress && req.query.stress == "true"){
    var LocationGrid = LocationGridModels.StressLocationGrid;
    var LocationUser = LocationUserModels.StressLocationUser;
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
  }else{
    var LocationGrid = LocationGridModels.LocationGrid;
    var LocationUser = LocationUserModels.LocationUser;
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
  }

  zoom = 10;
  let zoomLevels= { 10: 0.09, 111:1 ,1000:9}
  let equatorDgree=111
  let level= zoomLevels[zoom]

  let squareBoxes={}

  const symptoms = await Symptom.find({});
  //Find all users and retrieve their recent locations. Latest location will help us find the specific 
  //coordinates while Latest Location User will help us avoid db check if the user has any symptoms or not
  let location_users = await LocationUser.find({
    probability:{
      $gt: 0
    }
  }).populate('user_id');
  for(let i = 0; i<location_users.length; i++){
    console.log(i + " out of " + location_users.length + " and " + Object.keys(squareBoxes).length);
    let location_user = location_users[i];
    if(!location_user || !location_user.location || !location_user.user_id) continue;
    let loc = location_user.location;
    let user_id = location_user.user_id;    
    //Calculate the center point of the grid after finding out the grid they place on
    let lat_index = Math.floor((loc.coordinates[1]+ 90)/level);
    let latDistance = Math.sin((-90 + (lat_index*level)) * Math.PI / 180)
    let longKm = Math.cos(latDistance) * equatorDgree
    let inc = 10/longKm;
    let lon_index = Math.floor((loc.coordinates[0] + 180)/inc);
    let start_point_lat = -90 + lat_index * (level)
    let start_point_lon = -180 + lon_index * (inc)
    let end_point_lat = start_point_lat + level
    let end_point_lon = start_point_lon + inc
    let center_point_lat = (start_point_lat + end_point_lat)/2;
    let center_point_lon = (start_point_lon + end_point_lon)/2;
    let center = [center_point_lat, center_point_lon]

    //Fetch all the symptoms that user has
    const symptomuser = await SymptomUser.find({ user_id: user_id._id }).populate('symptom_id');
    const ages = User.schema.path('age_group').enumValues;
    const genders = User.schema.path('gender').enumValues;
    if(squareBoxes[center]){
      symptomuser.forEach((item)=>{
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      })
      squareBoxes[center].ages[`${user_id.age_group}`]++;
      squareBoxes[center].genders[`${user_id.gender}`]++;
    }
    else{
      squareBoxes[center] = new LocationGrid({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [center_point_lon , center_point_lat]
        },
        value: {},
        ages: {},
        genders: {},
        zoom_level: 10
      })
      symptoms.forEach((item)=>{
        squareBoxes[center].value[`${item.name}`] = 0;        
      })
      ages.forEach((item)=>{
        squareBoxes[center].ages[`${item}`] = 0
      })
      genders.forEach((item)=>{
        squareBoxes[center].genders[`${item}`] = 0
      })
      symptomuser.forEach((item)=>{
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      })  
      squareBoxes[center].ages[`${user_id.age_group}`]++;
      squareBoxes[center].genders[`${user_id.gender}`]++;
    }
  }
  var values = Object.keys(squareBoxes).map(function(key){
   return squareBoxes[key];
  });
  await LocationGrid.collection.drop();
  await LocationGrid.insertMany(values);
}

exports.run_updates = run_updates;
run_updates();

