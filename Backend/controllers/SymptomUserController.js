const SymptomUserModel = require("./../models/SymptomUser");
const UserModels = require("./../models/UserModel");
const SymptomUserHistoryModel = require("./../models/SymptomUserHistoryModel");
const { Symptom } = require("../models/Symptom");
const jwt = require("jsonwebtoken");
const ProbabilityCalculator = require("../services/ProbabilityCalculator");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const SymptomLogRegistration = require("../services/SymptomLogRegistration.js");


// Display list of all symptoms. - [DEPRECATED: The information is too sensitive to share with API consumers]
exports.get_all_symptomusers = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = DemoSymptomUser;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
  } else {
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
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  // Check if user and symptom exists
  const symptoms = [req.body.symptom_id]
  const user = await User.findById(req.body.loggedInUser);
  if (!user || !symptoms) {
    return res.status(400).send("Invalid request");
  }
  user.last_symptom_update = new Date(Date.now());
  await user.save();
  try {
    const existingSymptoms = await SymptomUser.find({
        user_id: req.body.loggedInUser,
    }).populate("symptom_id");
    const difference = existingSymptoms.filter(
      (x) =>
        x.symptom_id != null && !symptoms.includes(x.symptom_id._id.toString())
    );
    let history = await SymptomUserHistory.findOne({
      user_id: req.body.loggedInUser,
    });
    if (!history) {
      history = new SymptomUserHistory({
        user_id: req.body.loggedInUser,
        events: [],
      });
    }
    const currentDate = new Date(Date.now());
    const toBeRemoved = [];
    for (let ix in difference) {
      toBeRemoved.push(difference[ix]._id);
      history.events.push({
        symptom_id: difference[ix].symptom_id._id,
        start: difference[ix].timestamp,
        end: currentDate,
        relevance: difference[ix].symptom_id.relevance,
        type: "TERMINATED",
      });
    }
    await SymptomUser.deleteMany({ _id: {$in: toBeRemoved} });
    await history.markModified("events");
    await history.save();
    const existingEntries = existingSymptoms.map(
      (symptomuser) => symptomuser.symptom_id._id.toString()
    );
    let todaySymptoms = [];
    history.events.map(
      (symptom) =>{
        if (symptom.end.getDate() == currentDate.getDate() &&
        symptom.end.getMonth() == currentDate.getMonth() &&
        symptom.end.getFullYear() == currentDate.getFullYear() &&
        symptoms.includes(symptom.symptom_id.toString())){
          todaySymptoms.push(symptom);
        }
      });
    let inserted = []
    todaySymptoms.forEach( // Save symptom with start set to the previous start and remove entry from history
      async (symptom) => {
        await SymptomUserHistory.findByIdAndUpdate(history._id, 
          {"$pull": {"events": {_id: symptom._id}}},
          { safe: true, upsert: true })
        let symptomuser = new SymptomUser({
          symptom_id: symptom.symptom_id,
          user_id: req.body.loggedInUser,
          timestamp: symptom.start
        });
        try {
          if (!inserted.includes(symptom.symptom_id.toString())){
            inserted.push(symptom.symptom_id.toString());
            existingEntries.push(symptom.symptom_id.toString());
            await symptomuser.save();
          }
        } catch (error) {
          console.log(error.toString());
        }
    });

  for (let index in symptoms) {
    let id = symptoms[index];
    let symptomuser = new SymptomUser({
      symptom_id: id,
      user_id: req.body.loggedInUser,
    });

    // Check if user and symptom exists
    const symptomExists = await Symptom.findById(id);
    if (!symptomExists || existingEntries.includes(id)) {
      continue;
    } 
    try {
      inserted.push(symptomuser.symptom_id.toString())
      await symptomuser.save();
    } catch (error) {
      console.log(error.toString());
    }
  }   
    // await symptomuser.save();
    // let symptom = await Symptom.findById(symptomuser.symptom_id);
    // let result = {
    //   _id: symptomuser._id,
    //   symptom_id: symptomuser.symptom_id,
    //   user_id: symptomuser.user_id,
    //   timestamp: symptomuser.timestamp,
    //   _v: symptomuser.__v,
    //   Symptom: symptom,
    // };
    // res.send(result);

    await SymptomLogRegistration.registerLog(user._id, symptoms, currentDate, req.body.source);

    return res.status(201).send("Symptoms registered successfully");
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Post multiple symptoms given userId  and list of symptomsIds
exports.post_multiple_symptoms = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  const user = await User.findById(req.body.loggedInUser);
  const symptoms = req.body.symptoms;
  if (!user || !symptoms) {
    return res.status(400).send("Invalid request");
  }
  
  user.last_symptom_update = new Date(Date.now());
  await user.save();

  const existingSymptoms = await SymptomUser.find({
    user_id: req.body.loggedInUser,
  }).populate("symptom_id");
  const difference = existingSymptoms.filter(
    (x) =>
      x.symptom_id != null && !symptoms.includes(x.symptom_id._id.toString())
  );
  let history = await SymptomUserHistory.findOne({
    user_id: req.body.loggedInUser,
  });
  if (!history) {
    history = new SymptomUserHistory({
      user_id: req.body.loggedInUser,
      events: [],
    });
  }
  const currentDate = new Date(Date.now());
  const toBeRemoved = [];
  for (let ix in difference) {
    toBeRemoved.push(difference[ix]._id);
    history.events.push({
      symptom_id: difference[ix].symptom_id._id,
      start: difference[ix].timestamp,
      end: currentDate,
      relevance: difference[ix].symptom_id.relevance,
      type: "TERMINATED",
    });
  }
  await SymptomUser.deleteMany({ _id: {$in: toBeRemoved} });
  await history.markModified("events");
  await history.save();
  const existingEntries = existingSymptoms.map(
    (symptomuser) => symptomuser.symptom_id._id.toString()
  );
  let todaySymptoms = [];
  history.events.map(
    (symptom) =>{
      let hi = symptom.symptom_id.toString()
      if (symptom.end.getDate() == currentDate.getDate() &&
      symptom.end.getMonth() == currentDate.getMonth() &&
      symptom.end.getFullYear() == currentDate.getFullYear() &&
      symptoms.includes(symptom.symptom_id.toString())){
        todaySymptoms.push(symptom);
      }
    });
  let inserted = []
  todaySymptoms.forEach( // Save symptom with start set to the previous start and remove entry from history
    async (symptom) => {
      await SymptomUserHistory.findByIdAndUpdate(history._id, 
        {"$pull": {"events": {_id: symptom._id}}},
        { safe: true, upsert: true })
      let symptomuser = new SymptomUser({
        symptom_id: symptom.symptom_id,
        user_id: req.body.loggedInUser,
        timestamp: symptom.start
      });
      try {
         if (!inserted.includes(symptom.symptom_id.toString())){
           inserted.push(symptom.symptom_id.toString());
           existingEntries.push(symptom.symptom_id.toString());
           await symptomuser.save();
         }
      } catch (error) {
        console.log(error.toString());
      }
  });

  for (let index in symptoms) {
    let id = symptoms[index];
    let symptomuser = new SymptomUser({
      symptom_id: id,
      user_id: req.body.loggedInUser,
    });

    // Check if user and symptom exists
    const symptomExists = await Symptom.findById(id);
    if (!symptomExists || existingEntries.includes(id)) {
      continue;
    } 
    try {
      inserted.push(symptomuser.symptom_id.toString())
      await symptomuser.save();
    } catch (error) {
      console.log(error.toString());
    }
  }

  await SymptomLogRegistration.registerLog(user._id, symptoms, currentDate, req.body.source);

  return res.status(201).send("Symptoms registered successfully");
};

//Get a symptomuser by symptom_id
exports.get_symptomuser_by_symptom_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
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
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  try {
    const symptomuser = await SymptomUser.find({
      user_id: req.params.user_id,
    }).populate("user_id");
    if (!symptomuser) {
      res.status(400).send("Symptom User Pair not found");
    }
    let result = [];
    let language = null;

    if (req.query.language) {
      language = await StatisticsResource.findOne({
        language: req.query.language,
        title: "sypmtom-list",
      });
      if (language) {
        language = language.fields[0];
      }
    }
    let symptoms_name = [];

    for (let i = 0; i < symptomuser.length; i++) {
      let symptom = await Symptom.findById(symptomuser[i].symptom_id);
      symptoms_name.push(symptom.name);
      if (language && language[symptom._id]) {
        symptom.name = language[symptom._id].name;
        symptom.description = language[symptom._id].description;
        symptom.relevance = language[symptom._id].relevance;
      }

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

    // sending probability
    let country;
    if (req.query.iso == null){
      const user = await User.findById(req.params.user_id);
      country = user.current_country;
    }
    if (req.query.probability != null) {
      let probability = await ProbabilityCalculator.calculateProbability(
        symptoms_name,
        req.query.iso ? req.query.iso : country
      );
      res.status(200).send({ probability: probability, symptom_info: result });
    } else {
      // sending normal one
      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err.toString());
    res.status(500).send(err.toString());
  }
};

//Update a symptomuser by id
exports.update_symptomuser = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if (symptomuserCheck.user_id.toString() !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " +
            req.body.loggedInUser
        );
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
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if (symptomuserCheck.user_id.toString() !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " +
            req.body.loggedInUser
        );
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
