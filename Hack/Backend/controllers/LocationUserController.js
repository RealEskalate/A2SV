const LocationUser = require("../models/LocationUserModel");
const Location = require("./../models/LocationModel");
const User = require("./../models/UserModel")

const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


exports.post_location_user = async (req, res) => {
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

    let location_id =  req.body.location_id;
    let user_id =  req.body.user_id;
    let TTL = req.body.TTL;

    // Check if user and location exists
    Location.findById(location_id, (err) => {
        return res.status(400).json({ message: 'Location ID not found' });
    });
    User.findById(user_id, (err) => {
        return res.status(400).json({ message: 'User ID not found' });
    })

    const location_user = new LocationUser({
        user_id,
        location_id,
        TTL
        });
    try {
        await location_user.save();
        res.send(location_user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_by_location_id = async (req, res) => {
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

    const results = await LocationUser.find({
        location_id: {$eq: req.params.location_id}
    });
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_all_location_users = async (req,res) => {
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

    const results = await LocationUser.find({});
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.get_by_user_id = async (req, res) => {
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

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
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

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
    jwt.verify(req.token, 'secretkey', (err,authData) =>{
        if (err){
            res.status(401).send("Incorrect authentication key");
        }
    });

    try {
        await LocationUser.findByIdAndUpdate(req.body._id, req.body);
        const locationUser = await LocationUser.save();
        res.send(locationUser);
      } catch (err) {
        res.status(500).send(err);
      }
};