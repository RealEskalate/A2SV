const {SymptomUser} = require("../models/SymptomUser");
const { LocationUser } = require("../models/LocationUserModel");
const { User } = require("../models/UserModel");
const {DistrictModel} = require("../models/DistrictModel");
const { Symptom } = require("../models/Symptom");
const { SymptomLog } = require("../models/SymptomLogModel");
const { requestWhitelist } = require("express-winston");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");

exports.get_most_common = async (req, res) => {
    let symptomCounts = {};
    let filter = {};
    if(req.query.date){
        let date = new Date(req.query.date);
        filter.timestamp = { $gt: date };
    }

    if(req.query.district){
        let district = await DistrictModel.findOne({name: req.query.district});
        let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
        filter.user_id = {$in : locationUsers};
    }else if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        let locationUsers = await (await LocationUser.find({'location.district' : {$in : districts}})).distinct("user_id");
        filter.user_id = {$in : locationUsers};
    }else if(req.query.country){
        let users = await User.find({current_country : req.query.country}).distinct("_id");
        filter.user_id = {$in : users};        
    }

    let symptomUsers = await SymptomUser.find(filter);

    for(var i = 0; i < symptomUsers.length; i++){
        if(symptomCounts[symptomUsers[i].symptom_id]){
            symptomCounts[symptomUsers[i].symptom_id] += 1;
        }else{
            symptomCounts[symptomUsers[i].symptom_id] = 1;
        }
    }
    let sorted = Object.keys(symptomCounts).sort(function(a,b){return symptomCounts[b]-symptomCounts[a]});
    let commonSymptoms = await Promise.all(sorted.map(async (item) => await Symptom.findById(item) ));
    commonSymptoms = commonSymptoms.map((symptom) => {
        return {
                count: symptomCounts[symptom._id],
                symptom : symptom
            };
        });

    // translation start
    let language = null
    if (req.query.language){
        language= await StatisticsResource.findOne({ language:req.query.language , title: 'sypmtom-list'});
        if (language){language=language.fields[0];}
    } 
    for (var index=0 in commonSymptoms){
        let symptom= commonSymptoms[index].symptom
        let key = symptom._id
        if (language && language[key]){
            symptom.name=language[key].name;
            symptom.description= language[key].description
            symptom.relevance=language[key].relevance;
        }
    }
    // translation end

    try {
        res.send({
            total: symptomUsers.length,
            data: commonSymptoms
        });
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_people_with_symptoms = async (req, res) => {

    let filter = {};
    if(req.query.date){
        let date = new Date(req.query.date);
        filter.timestamp = { $gt: date };
    }
    if(req.query.district){
        let district = await DistrictModel.findOne({name: req.query.district});
        let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
        filter.user_id = {$in : locationUsers};
    }else if(req.query.region){
        let districts = await DistrictModel.find({state : req.query.region}).distinct("_id");
        let locationUsers = await (await LocationUser.find({'location.district' : {$in : districts}})).distinct("user_id");
        filter.user_id = {$in : locationUsers};
    }else if(req.query.country){
        let users = await User.find({current_country : req.query.country}).distinct("_id");
        filter.user_id = {$in : users};
    }

    
    let symptomUsers =  await SymptomUser.find(filter).distinct("user_id");

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
        filter.status = req.query.status;
    }

    if(req.query.username){
        let users = await User.find({username : {$regex: req.query.username, $options: 'i'}}).distinct("_id");
        filter.user_id = {$in: users};
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

    if(req.query.start_date){
        filter["current_symptoms.date"] = {$gte : new Date(req.query.start_date)}
    }else{
        let date = new Date()
        date.setHours(date.getHours()-24)
        filter["current_symptoms.date"] = {$gte : date}
    }

    if(req.query.end_date){
        let date = new Date(req.query.end_date)
        date.setHours(23)
        Object.assign(filter["current_symptoms.date"], {$lte : date});
    }

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    let logs = await SymptomLog.find(
        filter,
        {},
        { skip: (page - 1) * size, limit: size * 1 }
    )
    .populate("user_id").populate({
        path: "current_symptoms.symptoms",
        model: "Symptom"
    }).populate({
        path: "history.symptoms",
        model: "Symptom"
    }).sort({"current_symptoms.date" : -1});


    // translation start
    let language = null
    let genderNames=null
    if (req.query.language){
        language= await StatisticsResource.findOne({ language:req.query.language , title: 'sypmtom-list'});
        genderNames= await StatisticsResource.findOne({ language:req.query.language , title: 'symptoms-name-list'});
        if (language){language=language.fields[0];}
        if (genderNames){genderNames=genderNames.criteria[0];}
    } 

    if (language){
        for (var index=0; index<logs.length;index++){
            let symptoms= logs[index].current_symptoms.symptoms;
            for(var symptomIndex in symptoms){
                let symptom=symptoms[symptomIndex]
                let key = symptom._id
                if(language[key]){
                    symptom.name=language[key].name;
                    symptom.description= language[key].description
                    symptom.relevance=language[key].relevance;
                }
            }
            if(genderNames){
                logs[index].user_id.gender= genderNames[logs[index].user_id.gender]
            }
            
        }
    }
    // translation end

    let result = {
        data_count: await SymptomLog.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: logs,
    };

    try {
        res.send(result);
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


