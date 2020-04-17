const Alert = require("../models/AlertModel");
const AlertUser = require("../models/AlertUserModel");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

// Post an alert
exports.post_alert_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const alert_user = new AlertUser({
    _id: mongoose.Types.ObjectId(),
    user_id: req.body.user_id,
    alert_id: req.body.alert_id,
  });
  try {
    const check = await AlertUser.findOne({
      user_id: alert_user.user_id,
      alert_id: alert_user.alert_id,
    });
    if (check) {
      res.send(check);
    } else {
      await alert_user.save();
      res.send(alert_user);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

//Get an alert_user by id
exports.get_alert_user_by_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const alert_user = await AlertUser.findById(req.params.id);
  try {
    res.send(alert_user);
  } catch (err) {
    res.status(500).send(err);
  }
};

//Get alerts based on user_id
exports.get_alerts_by_user_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const alert_user = await AlertUser.find({user_id: req.params.user_id});
    try{        
        if(alert_user.length){
            const alerts = [];            
            for(var i = 0; i<alert_user.length; i++){
                const alert = await Alert.findById(alert_user[i].alert_id);
                console.log(alert);
                alerts.push(alert);
            }
            res.send({alerts: alerts, user_id: req.params.user_id});
        }
        else{
            res.status(500).send(err);
        }
    }
    catch (err){
        res.status(500).send(err);
    }
};
