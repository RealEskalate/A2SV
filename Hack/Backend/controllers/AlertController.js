const Alert = require("../models/AlertModel");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

// Post an alert
exports.post_alert = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const alert = new Alert({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        type: req.body.type,
        degree: req.body.degree,
        content: req.body.content,
        timestamp: req.body.timestamp
    });
    try{
        await alert.save();
        res.send(alert);    
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

//Patch alert
exports.patch_alert = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    try{
        let alert = await Alert.findById(req.body._id);
        if (!alert || alert.length < 1){
            return res.status(400).send("Alert ID not found")
        }
        alert.set(req.body);
        await alert.save();
        res.send(alert);    
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

//Delete alert
exports.delete_alert = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    try {
        const alert = await Alert.findByIdAndDelete(req.body._id);
        if (!alert) {
          return res.status(404).send("No item found");
        }
        res.status(201).send(alert);
      } catch (err) {
        res.status(500).send(err.toString());
      }
    };

//Get all alerts
exports.get_alerts = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const alerts = await Alert.find({});
    try {
        res.send(alerts);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};
//Get an alert by id
exports.get_alert_by_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    try {
        const alert = await Alert.findById(req.params.id);
        if(!alert){
            return res.status(500).send("Alert Not Found");
        }
        res.send(alert);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};
