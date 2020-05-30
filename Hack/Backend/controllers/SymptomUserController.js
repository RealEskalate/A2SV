const SymptomUserModel = require("./../models/SymptomUser");
const SymptomUser = SymptomUserModel.SymptomUser;
const DemoSymptomUser = SymptomUserModel.DemoSymptomUser;
const { Symptom, validateSymptom } = require("../models/Symptom");
const UserModels = require("./../models/UserModel");
const User = UserModels.User;
const jwt = require("jsonwebtoken");

// Display list of all symptoms.
exports.get_all_symptomusers = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = DemoSymptomUser;
  } else if (req.query.stress && req.query.stress == "true"){
    var SymptomUser = SymptomUserModel.DemoSymptomUser
  }else {
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

// Post multiple symptoms given userId  and list of symptomsIds
exports.post_multiple_symptoms = async (req, res) => {
  const user = await User.findById(req.body.loggedInUser)
  const symptoms = req.body.symptoms
  if (!user || !symptoms) {
    return res.status(400).send('Invalid request')
  }
  await SymptomUser.deleteMany({ user_id: req.body.loggedInUser })

  for (let index in symptoms) {
      let id= symptoms[index];
      let symptomuser = new SymptomUser({
        symptom_id: id,
        user_id: req.body.loggedInUser,
      });

      // Check if user and symptom exists
      const symptomExists = await Symptom.findById(id)
      if (!symptomExists) {
        continue
      }
      try {
        await symptomuser.save()
      } catch (error) {
        console.log(error.toString())
      }
    
  }

  return res.status(201).send('Symptoms registered successfully')
}

//Get a symptomuser by symptom_id
exports.get_symptomuser_by_symptom_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = DemoSymptomUser;
  } else if (req.query.stress && req.query.stress == "true"){
    var SymptomUser = SymptomUserModel.DemoSymptomUser
  }else {
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
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = DemoSymptomUser;
  } else if (req.query.stress && req.query.stress == "true"){
    var SymptomUser = SymptomUserModel.DemoSymptomUser
  }else {
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
    console.log(err.toString())
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
