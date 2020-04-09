var Location = require("../models/LocationModel.js");
var mongoose = require("mongoose");

// Display list of all locations.
exports.get_all_locations = async (req, res) => {
  const locations = await Location.find({});
  try {
    res.send(locations);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Post a location
exports.post_location = async (req, res) => {
  const location = new Location({
    _id: mongoose.Types.ObjectId(),
    longitude: req.body.longitude,
    latitude: req.body.latitude,
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
  const location = await Location.findById(req.params.id);
  try {
    res.send(location);
  } catch (err) {
    res.status(500).send(err);
  }
};
//Get a specific Location by latitude and longitude
exports.get_location_by_coordinates = async (req, res) => {
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
  try {
    const location = await Location.findByIdAndRemove(req.body._id);
    if (!location) {
      res.status(404).send("No item found");
    }
    else{
      res.status(204).send(location);Z
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
