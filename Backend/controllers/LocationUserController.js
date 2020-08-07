const LocationGridModels = require("./../models/LocationGridModel");
const geolib = require("geolib");
const LocationUserModels = require("./../models/LocationUserModel");
const UserModels = require("./../models/UserModel");
const SymptomUserModels = require("../models/SymptomUser");
const ProbabilityCalculator = require("../services/ProbabilityCalculator");
const axios = require("axios");
const mongoose = require("mongoose");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const { DistrictModel } = require("../models/DistrictModel");

//Post a user location
exports.post_location_user = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var User = UserModels.DemoUser;
    var LocationUser = LocationUserModels.DemoLocationUser;
    var SymptomUser = SymptomUserModels.DemoSymptomUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var User = UserModels.StressUser;
    var LocationUser = LocationUserModels.StressLocationUser;
    var SymptomUser = SymptomUserModels.StressSymptomUser;
  } else {
    var User = UserModels.User;
    var LocationUser = LocationUserModels.LocationUser;
    var SymptomUser = SymptomUserModels.SymptomUser;
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
  let TTL = 1000 * 60 * 60 * 24 * 21;

  // Check if user exists
  let user = await User.findById(user_id);
  if (!user) {
    return res.status(400).send("User ID not found");
  }

  let check = await LocationUser.findOne({
    user_id: req.body.user_id,
  });
  if (!check) {
    check = new LocationUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user_id,
    });
  }
  check.location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };
  let country = "";
  let iso = "";
  try {
    const result = await axios
      .get(
        "http://www.geoplugin.net/json.gp?ip=" +
          req.connection.remoteAddress.substring(2)
      )
      .then((response) => {
        if (response.data) {
          country = response.data.geoplugin_countryName;
          iso = response.data.geoplugin_countryCode;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    user.set({
      current_country: country,
    });
    await user.save();
  } catch (err) {
    console.log(err.toString());
  }
  try {
    let symptomsList = await SymptomUser.find({ user_id: user_id }).populate(
      "symptom_id"
    );
    let symptoms = [];
    symptomsList.forEach((item) => symptoms.push(item.symptom_id.name));
    let probability = await ProbabilityCalculator.calculateProbability(
      symptoms,
      iso
    );

    check.TTL = Number(TTL);
    check.probability = probability;
    // Identify district and save info
    const district = await DistrictModel.findOne({
      boundaries: {
        $geoIntersects:{
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          }
        }
      }
    });
    if (district){
      check.location.district = district._id;
    }
    await check.markModified("location");
    await check.save();
    user.latest_location_user = check._id;
    await user.save();
    return res.send(check);
  } catch (err) {
    return res.status(404).send("Location User could not be posted");
  }
};

//Get specific location_user by id
exports.get_location_user_by_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
    var LocationUser = LocationUserModels.LocationUser;
  }
  if (!req.params.id) {
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
};

//Get all location_users
exports.get_all_location_users = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
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
  if (req.query.demo && req.query.demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
    var LocationUser = LocationUserModels.LocationUser;
  }
  if (!req.params.user_id) {
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
  if (req.query.demo && req.query.demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
    var LocationUser = LocationUserModels.LocationUser;
  }
  if (!req.body._id) {
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
  if (req.query.demo && req.query.demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
    var LocationUser = LocationUserModels.LocationUser;
  }
  if (!req.body._id) {
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
    await locationUser.markModified("location");
    await locationUser.save();
    res.send(locationUser);
  } catch (err) {
    res.status(404).send("Location User could not be updated");
  }
};

// Fetch list of all locations alongside their symptoms
exports.get_all_locations_with_symptoms = async (req, res) => {
  let limit = req.query.zoom_bound || 10000;
  if (!req.body.longitude || !req.body.latitude) {
    console.log("User coordinates not supplied");
    return res.status(400).send("Coordinates are not given");
  }
  if (
    !req.body.top_left_bound ||
    !req.body.top_right_bound ||
    !req.body.bottom_left_bound ||
    !req.body.bottom_right_bound
  ) {
    console.log("Boundary coordinates not supplied");
    return res.status(400).send("Corner Coordinates are not given");
  }
  let lat = req.body.latitude;
  let long = req.body.longitude;
  let top_left_end = req.body.top_left_bound;
  let top_right_end = req.body.top_right_bound;
  let bottom_left_end = req.body.bottom_left_bound;
  let bottom_right_end = req.body.bottom_right_bound;
  let distance_check = geolib.getDistance(
    {
      latitude: top_left_end[1],
      longitude: top_left_end[0],
    },
    {
      latitude: top_right_end[1],
      longitude: top_right_end[0],
    }
  );
  //Check radius between the corner coords and main user location
  let top_left_distance_check = geolib.getDistance(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: top_left_end[1],
      longitude: top_left_end[0],
    }
  );
  let top_right_distance_check = geolib.getDistance(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: top_right_end[1],
      longitude: top_right_end[0],
    }
  );
  let bottom_left_distance_check = geolib.getDistance(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: bottom_left_end[1],
      longitude: bottom_left_end[0],
    }
  );
  let bottom_right_distance_check = geolib.getDistance(
    {
      latitude: lat,
      longitude: long,
    },
    {
      latitude: bottom_right_end[1],
      longitude: bottom_right_end[0],
    }
  );
  let min_coord_distance = Math.min(
    top_left_distance_check,
    top_right_distance_check,
    bottom_left_distance_check,
    bottom_right_distance_check
  );
  let inPolygonCheck = min_coord_distance < 10000;
  let zoom = 0;
  let isDemo = false;
  if (req.body.demo && req.body.demo == true) {
    isDemo = true;
  }
  console.log("H");
  if (isDemo) {
    if (distance_check >= limit) {
      zoom = 10;
    }
  } else {
    if (distance_check >= limit && inPolygonCheck === false) {
      zoom = 10;
    }
  }
  console.log("I");
  try {
    let result = [];
    if (zoom != 0) {
      let boundaries = [
        top_left_end,
        top_right_end,
        bottom_right_end,
        bottom_left_end,
      ];
      result = await findGridNearbySymptomaticUsers(
        boundaries,
        req.query.demo,
        req.query.stress,
        req.query.language
      );
      console.log(`Fetched ${result.length} Grids according to filter`);
    } else {
      let boundaries = [
        top_left_end,
        top_right_end,
        bottom_right_end,
        bottom_left_end,
      ];
      result = await findAllNearbySymptomaticUsers(
        boundaries,
        req.query.demo,
        req.query.stress
      );
      console.log(
        `Fetched ${result.length} Locations and Users according to filter`
      );
    }
    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(500).send("No locations with users and symptoms found.");
    }
  } catch (err) {
    console.log(err.toString());
    res.status(500).send("No locations with users and symptoms found.");
  }
};
const findAllNearbySymptomaticUsers = async (boundaries, demo, stress) => {
  if (demo && demo == "true") {
    var LocationUser = LocationUserModels.DemoLocationUser;
  } else if (stress && stress == "true") {
    var LocationUser = LocationUserModels.StressLocationUser;
  } else {
    var LocationUser = LocationUserModels.LocationUser;
  }
  const location_users = await LocationUser.find({
    location: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              boundaries[0],
              boundaries[1],
              boundaries[2],
              boundaries[3],
              boundaries[0],
            ],
          ],
        },
      },
    },
    probability: {
      $ne: null,
      $gt: 0,
    },
  });

  return location_users;
};

const findGridNearbySymptomaticUsers = async (boundaries, demo, stress, language=null) => {
  // await updateDb(demo, stress);
  if (demo && demo == "true") {
    var LocationGrid = LocationGridModels.DemoLocationGrid;
  } else if (stress && stress == "true") {
    var LocationGrid = LocationGridModels.StressLocationGrid;
  } else {
    var LocationGrid = LocationGridModels.LocationGrid;
  }

  //... translation data .....
  let diseaseNames = null;
  let genderNames = null;

  if (language) {
    let gridNames = await StatisticsResource.findOne({
      language: language,
      title: "symptoms-name-list",
    });

    if (gridNames) {
      diseaseNames = gridNames.fields[0];
      genderNames = gridNames.criteria[0];
    }

  }
  //... end translation data .....

  let result = await LocationGrid.find({
    location: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [
            [
              boundaries[0],
              boundaries[1],
              boundaries[2],
              boundaries[3],
              boundaries[0],
            ],
          ],
        },
      },
    },
  });

  //... translate if data exists...
  if(diseaseNames!=null && genderNames!=null){
    for( var key in result){
      translateGridValues(diseaseNames,genderNames,result[key])      
    }
  }
  //... end of translation...

  return result;
};


const translateGridValues = (diseaseNames,genderNames, grid)=>{
  let translatedDiseaseNames = {}
  Object.entries(diseaseNames).forEach( item => translatedDiseaseNames[ item[1] ] = grid.value[item[0]] ) 
  grid.value = translatedDiseaseNames;

  let translatedGendersNames = {}
  Object.entries(genderNames).forEach( item => translatedGendersNames[ item[1] ] = grid.genders[item[0]] ) 
  grid.genders = translatedGendersNames;
  
}