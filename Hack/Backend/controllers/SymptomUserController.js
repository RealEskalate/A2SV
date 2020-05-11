const { SymptomUser, validateSymptomUser } = require("../models/SymptomUser");
const { Symptom, validateSymptom } = require("../models/Symptom");
const UserSchema = require("./../models/UserModel");
const User = UserSchema.User;
const jwt = require("jsonwebtoken");

// Display list of all symptoms.
exports.get_all_symptomusers = async (req, res) => {

  const symptomusers = await SymptomUser.find();

  try {
    res.send(symptomusers);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Post a symptomuser
exports.post_symptomuser = async (req, res) => {

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
  try {
    const symptomuser = await SymptomUser.find({
      symptom_id: req.body.loggedInUser,
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

  try {
    console.log("logged in user " + req.body.loggedInUser);
    const symptomuser = await SymptomUser.find({ user_id: req.body.loggedInUser });
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

//Update a symptomuser by id
exports.update_symptomuser = async (req, res) => {

  try {
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
