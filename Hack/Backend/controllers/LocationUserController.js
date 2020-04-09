const LocationUser = require("../models/LocationUserModel");
const Location = require("./../models/LocationModel");
const User = require("./../models/UserModel")

const mongoose = require('mongoose');

exports.post_location_user = async (req, res) => {
    let location_id =  req.body.location_id;
    let user_id =  req.body.user_id;

    // Check if user and location exists
    Location.findById(location_id, (err) => {
        return res.status(400).json({ message: 'Location ID not found' });
    });
    User.findById(user_id, (err) => {
        return res.status(400).json({ message: 'User ID not found' });
    })

    const location_user = new LocationUser({
        user_id,
        location_id
        });
    try {
        await location.save();
        res.send(location);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_by_location_id = async (req, res) => {
    const results = await LocationUser.find({
        location_id: {$eq: req.params.location_id}
    });
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_all_location_users = async (res, req) => {
    const results = await LocationUser.find({});
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_by_user_id = async (req, res) => {
    const results = await LocationUser.find({
        user_id: {$eq: req.params.user_id}
    });
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.delete_location_user = async (req, res) => {
    try {
        const location_user = await LocationUser.findByIdAndDelete(req.body._id);
        if (!location_user) {
          res.status(404).send("No item found");
        }
        res.status(200).send();
      } catch (err) {
        res.status(500).send(err);
      }
};

exports.update_location_user = async (req, res) => {
    try {
        await LocationUser.findByIdAndUpdate(req.body._id, req.body);
        await LocationUser.save();
        res.send(location);
      } catch (err) {
        res.status(500).send(err);
      }
};