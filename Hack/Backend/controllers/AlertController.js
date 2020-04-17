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
        res.status(500).send(err);
    }
};


//Get an alert by id
exports.get_alert_by_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    const alert = await Alert.findById(req.params.id);
    try {
        res.send(alert);
    } catch (err) {
        res.status(500).send(err);
    }
};
