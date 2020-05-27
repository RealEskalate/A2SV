const Alert = require("../models/AlertModel");
const { User } = require("../models/UserModel");
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
      res.status(201).send(check);
    } else {
      const alertCheck = await Alert.findById(req.body.alert_id);
      if (!alertCheck) {
        return res.status(400).send("Alert does not exist");
      }
      const userCheck = await User.findById(req.body.user_id);
      if (!userCheck) {
        return res.status(400).send("User does not exist");
      }
      await alert_user.save();
      res.send(alert_user);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
// Patch an alert
exports.patch_alert_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });
  try {
    const check = await AlertUser.findById(req.body._id);
    if (req.body.alert_id) {
      const alertCheck = await Alert.findById(req.body.alert_id);
      if (!alertCheck) {
        return res.status(400).send("Alert does not exist");
      }
    }
    if (req.body.user_id) {
      const userCheck = await User.findById(req.body.user_id);
      if (!userCheck) {
        return res.status(400).send("User does not exist");
      }
    }
    check.set(req.body);
    await check.save();
    res.send(check);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
// Delete an alert
exports.delete_alert_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });
  try {
    const alert_user = await AlertUser.findByIdAndDelete(req.body._id);
    if (!alert_user) {
      return res.status(404).send("No item found");
    }
    res.status(201).send(alert_user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
//Get an alert_users
exports.get_alert_user = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const alert_users = await AlertUser.find({});
  try {
    res.send(alert_users);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get an alert_user by id
exports.get_alert_user_by_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });
  try {
    const alert_user = await AlertUser.findById(req.params.id);
    if (!alert_user) {
      return res.status(400).send("Alert User Not Found");
    }
    res.send(alert_user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get alerts based on user_id
exports.get_alerts_by_user_id = async (req, res) => {
  // jwt.verify(req.token, 'secretkey', (err,authData) =>{
  //     if (err){
  //         res.status(401).send("Incorrect authentication key");
  //     }
  // });

  const alert_user = await AlertUser.find({ user_id: req.params.user_id });
  try {
    if (alert_user.length) {
      const alerts = [];
      for (var i = 0; i < alert_user.length; i++) {
        const alert = await Alert.findById(alert_user[i].alert_id);
        alerts.push(alert);
      }
      res.send({ alerts: alerts, user_id: req.params.user_id });
    } else {
      res.send({ alerts: [], user_id: req.params.user_id });
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
