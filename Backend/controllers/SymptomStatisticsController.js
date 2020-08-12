const {SymptomUser} = require("../models/SymptomUser");
const { LocationUser } = require("../models/LocationUserModel");
const { User } = require("../models/UserModel");
const {DistrictModel} = require("../models/DistrictModel");
const { Symptom } = require("../models/Symptom");

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
        let districts = await DistrictModel.find({state : req.query.state}).distinct("_id");
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
        let districts = await DistrictModel.find({state : req.query.state}).distinct("_id");
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