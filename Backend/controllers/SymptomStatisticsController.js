const {SymptomUser} = require("../models/SymptomUser");
const { LocationUser } = require("../models/LocationUserModel");
const { User } = require("../models/UserModel");
const {DistrictModel} = require("../models/DistrictModel");
const { Symptom } = require("../models/Symptom");
const { SymptomLog } = require("../models/SymptomLogModel");

exports.get_symptom_number = async (req, res) => {

    let date = req.query.date ? new Date(req.query.date) : new Date()
    // set date to 24 hours ago
    date.setHours(date.getHours() - 24);
    let total = 0;
    if(req.query.district){
        let district = await DistrictModel.findOne({name: req.query.district});
        let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
        total =  await SymptomUser.countDocuments({user_id: {$in : locationUsers}, timestamp : { $gt: date }});
    }else if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        let locationUsers = await (await LocationUser.find({'location.district' : {$in : districts}})).distinct("user_id");
        total = await SymptomUser.countDocuments({user_id: {$in : locationUsers}, timestamp : { $gt: date }});
    }else if(req.query.country){
        let users = await User.find({current_country : req.query.country}).distinct("_id");
        total = await SymptomUser.countDocuments({user_id: {$in : users}, timestamp : { $gt: date }});
    }else{
        total = await SymptomUser.countDocuments({timestamp : { $gt: date }});
    }

    try {
        res.send({result: total});
    } catch (err) {
        res.status(500).send(err.toString());
    }

}

exports.get_most_common = async (req, res) => {
    let symptomUsers = [];
    let symptomCounts = {};
    let date = req.query.date ? new Date(req.query.date) : new Date()
    // set date to 24 hours ago
    date.setHours(date.getHours() - 24);
    if(req.query.district){
        let district = await DistrictModel.findOne({name: req.query.district});
        let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
        symptomUsers =  await SymptomUser.find({user_id: {$in : locationUsers}, timestamp : { $gt: date }});
    }else if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        let locationUsers = await (await LocationUser.find({'location.district' : {$in : districts}})).distinct("user_id");
        symptomUsers = await SymptomUser.find({user_id: {$in : locationUsers}, timestamp : { $gt: date }});
    }else if(req.query.country){
        let users = await User.find({current_country : req.query.country}).distinct("_id");
        symptomUsers = await SymptomUser.find({user_id : {$in: users}, timestamp : { $gt: date }})
    }else{
        symptomUsers = await SymptomUser.find({timestamp : { $gt: date }});
    }

    for(var i = 0; i < symptomUsers.length; i++){
        if(symptomCounts[symptomUsers[i].symptom_id]){
            symptomCounts[symptomUsers[i].symptom_id] += 1;
        }else{
            symptomCounts[symptomUsers[i].symptom_id] = 1;
        }
    }

    sorted = Object.keys(symptomCounts).sort(function(a,b){return symptomCounts[b]-symptomCounts[a]});
    sorted = await Promise.all(sorted.map(async (item) => await Symptom.findById(item)));

    try {
        res.send(sorted);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_people_with_symptoms = async (req, res) => {

    let date = req.query.date ? new Date(req.query.date) : new Date()
    // set date to 24 hours ago
    date.setHours(date.getHours() - 24);
    let symptomUsers;
    if(req.query.district){
        let district = await DistrictModel.findOne({name: req.query.district});
        let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
        symptomUsers =  await SymptomUser.find({user_id: {$in : locationUsers}, timestamp : { $gt: date }}).distinct("user_id");
    }else if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        let locationUsers = await (await LocationUser.find({'location.district' : {$in : districts}})).distinct("user_id");
        symptomUsers = await SymptomUser.find({user_id: {$in : locationUsers}, timestamp : { $gt: date }}).distinct("user_id");
    }else if(req.query.country){
        let users = await User.find({current_country : req.query.country}).distinct("_id");
        symptomUsers = await SymptomUser.find({user_id: {$in : users}, timestamp : { $gt: date }}).distinct("user_id");
    }else{
        symptomUsers = await SymptomUser.find({timestamp : { $gt: date }}).distinct("user_id");
    }

    try {
        res.send({result: symptomUsers.length});
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_symptom_logs = async (req, res) => {

    let filter = {
        status: {$ne : "SYMPTOMS_REMOVED"}
    }

    if(req.query.status){
        filter.status = req.query.status
    }

    if(req.query.country){
        filter["current_symptoms.location.country"] = req.query.country;
    }

    if(req.query.district){
        let district = await DistrictModel.findOne({name : req.query.district});
        filter["current_symptoms.location.district"] = district._id;
    }

    if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        filter["current_symptoms.location.district"] = {$in : districts};
    }

    if(req.query.date){
        filter["current_symptoms.date"] = {$lte : new Date(req.query.date)}
    }

    let logs = await SymptomLog.find(filter);

    try {
        res.send(logs);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_logs_by_user_id = async (req, res) => {
    let log = await SymptomLog.findOne({user_id : req.params.user_id});
    if(!log){
        res.status(404).send("Log Not Found");
    }else{
        try {
            res.send(log);
        } catch (err) {
            res.status(500).send(err.toString());
        }
    }
    
}

