const SymptomUserModel = require("./../models/SymptomUser");
const SymptomUser = SymptomUserModel.SymptomUser;
const DemoSymptomUser = SymptomUserModel.DemoSymptomUser;
const { Symptom, validateSymptom } = require("../models/Symptom");
const UserModels = require("./../models/UserModel");
const User = UserModels.User;
const jwt = require("jsonwebtoken");

// Display list of all symptoms. - [DEPRECATED: The information is too sensitive to share with API consumers]
exports.get_all_symptomusers = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var SymptomUser = DemoSymptomUser;
  }else{
    var SymptomUser = SymptomUserModel.SymptomUser;
  }
  const symptomusers = await SymptomUser.find();

  try {
    res.send(symptomusers);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Post a symptomuser
exports.post_symptomuser = async (req, res) => {
  if(req.body.user_id !== req.body.loggedInUser){
    return res.status(403).send("User not authorized to access this endpoint with id: " + req.body.loggedInUser);
  }
  let symptomuser = new SymptomUser({
    symptom_id: req.body.symptom_id,
    user_id: req.body.user_id,
  });

  // Check if user and symptom exists
  Symptom.findById(symptomuser.symptom_id, (err) => {
    if (err) {
      return res.status(400).json({ message: "Symptom ID not found" });
    }
  });
  User.findById(symptomuser.user_id, (err) => {
    if (err) {
      return res.status(400).json({ message: "User ID not found" });
    }
  });
  try {
    await symptomuser.save();
    let symptom = await Symptom.findById(symptomuser.symptom_id);
    let result = {
      _id: symptomuser._id,
      symptom_id: symptomuser.symptom_id,
      user_id: symptomuser.user_id,
      timestamp: symptomuser.timestamp,
      _v: symptomuser.__v,
      Symptom: symptom,
    };
    res.send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get a symptomuser by symptom_id
exports.get_symptomuser_by_symptom_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var SymptomUser = DemoSymptomUser;
  }else{
    var SymptomUser = SymptomUserModel.SymptomUser;
  }
  try {
    const symptomuser = await SymptomUser.find({
      symptom_id: req.params.symptom_id,
    });
    if (!symptomuser) {
      res.status(400).send("Symptom User Pair not found");
    }
    let result = [];
    for (let i = 0; i < symptomuser.length; i++) {
      let symptom = await Symptom.findById(symptomuser[i].symptom_id);
      result.push({
        _id: symptomuser[i]._id,
        symptom_id: symptomuser[i].symptom_id,
        user_id: symptomuser[i].user_id,
        timestamp: symptomuser[i].timestamp,
        _v: symptomuser[i].__v,
        Symptom: symptom,
      });
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }

};

//Get a symptomuser by user_id
exports.get_symptomuser_by_user_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true"){
    var SymptomUser = DemoSymptomUser;
  }else{
    var SymptomUser = SymptomUserModel.SymptomUser;
  }
  try {
    const symptomuser = await SymptomUser.find({ user_id: req.params.user_id }).populate('user_id');
    if (!symptomuser) {
      res.status(400).send("Symptom User Pair not found");
    }
    let result = [];
    for (let i = 0; i < symptomuser.length; i++) {
      let symptom = await Symptom.findById(symptomuser[i].symptom_id);
      result.push({
        _id: symptomuser[i]._id,
        symptom_id: symptomuser[i].symptom_id,
        user_id: symptomuser[i].user_id._id,
        gender: symptomuser[i].user_id.gender,
        age_group: symptomuser[i].user_id.age_group,
        timestamp: symptomuser[i].timestamp,
        _v: symptomuser[i].__v,
        Symptom: symptom,
      });
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }

};

//Update a symptomuser by id
exports.update_symptomuser = async (req, res) => {

  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if(symptomuserCheck._id !== req.body.loggedInUser){
      return res.status(403).send("User not authorized to access this endpoint with id: " + req.body.loggedInUser);
    }
    const symptomuser = await SymptomUser.findByIdAndUpdate(
      req.body._id,
      req.body
    );
    if (!symptomuser) {
      res.status(400).send("Symptom not found");
    }
    let symptom = await Symptom.findById(symptomuser.symptom_id);
    let result = {
      _id: symptomuser._id,
      symptom_id: symptomuser.symptom_id,
      user_id: symptomuser.user_id,
      timestamp: symptomuser.timestamp,
      _v: symptomuser.__v,
      Symptom: symptom,
    };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }

};

// Deleting a symptomuser
exports.delete_symptomuser = async (req, res) => {

  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if(symptomuserCheck._id !== req.body.loggedInUser){
      return res.status(403).send("User not authorized to access this endpoint with id: " + req.body.loggedInUser);
    }
    const symptomuser = await SymptomUser.findByIdAndDelete(req.body._id);
    if (!symptomuser) {
      return res.status(404).send("Symptom User Pair not found");
    }
    let symptom = await Symptom.findById(symptomuser.symptom_id);
    let result = {
      _id: symptomuser._id,
      symptom_id: symptomuser.symptom_id,
      user_id: symptomuser.user_id,
      timestamp: symptomuser.timestamp,
      _v: symptomuser.__v,
      Symptom: symptom,
    };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
