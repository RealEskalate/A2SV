const SymptomUserHistoryModel = require("../models/SymptomUserHistoryModel");
const SymptomUserModel = require("../models/SymptomUser");

exports.get_symptomuser_history_by_user_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUser = SymtomUserModel.DemoSymptomUser;
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUser = SymptomUserModel.SymptomUser;
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  if (req.params.user_id !== req.body.loggedInUser) {
    return res
      .status(403)
      .send(
        "User not authorized to access this endpoint with id: " +
          req.params.user_id
      );
  }
  try {
    let history = await SymptomUserHistory.findOne({
      user_id: req.params.user_id,
    });
    if (!history) {
      history = new SymptomUserHistory({
        user_id: req.body.loggedInUser,
        events: [],
      });
    }
    const current_symptoms = await SymptomUser.find({
      user_id: req.params.user_id,
    }).populate("symptom_id");
    const date = new Date(Date.now());
    current_symptoms.forEach((item) => {
      history.events.push({
        name: item.symptom_id.name,
        start: item.timestamp,
        end: date,
        color: item.symptom_id.relevance,
      });
    });
    return res.status(200).send(history);
  } catch (err) {
    console.log(err.toString());
    return res.status(500).send(err.toString());
  }
};
exports.delete_symptomuser_history_by_user_id = async (req, res) => {
  if (req.query.demo && req.query.demo == "true") {
    var SymptomUserHistory = SymptomUserHistoryModel.DemoSymptomUserHistory;
  } else if (req.query.stress && req.query.stress == "true") {
    var SymptomUserHistory = SymptomUserHistoryModel.StressSymptomUserHistory;
  } else {
    var SymptomUserHistory = SymptomUserHistoryModel.SymptomUserHistory;
  }
  if (req.params.user_id !== req.body.loggedInUser) {
    return res
      .status(403)
      .send(
        "User not authorized to access this endpoint with id: " +
          req.params.user_id
      );
  }
  try {
    const deleted = await SymptomUserHistory.findOneAndDelete({
      user_id: req.params.user_id,
    });
    return res.status(200).send(deleted);
  } catch (err) {
    console.log(err.toString());
    return res.status(500).send(err.toString());
  }
};
