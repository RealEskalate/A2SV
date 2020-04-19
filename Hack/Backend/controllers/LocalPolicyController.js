const {LocalPolicy} = require("./../models/LocalPolicyModel");
const mongoose = require("mongoose");
const XLSX = require('xlsx');
var path = require('path');
var root = path.dirname(require.main.filename);

// Get all local policies
exports.get_all_local_policies = async (req, res) => {
    const localPolicies = await LocalPolicy.find();
    
    if(await LocalPolicy.countDocuments() == 0){
        populateDatabase();
    }

    try{
        res.send(localPolicies);
    }catch (err){
        res.status(500).send(err.toString());
    }
};

// Get all local policies for a country
exports.get_country_policies = async (req, res) => {

    const localPolicies = await LocalPolicy.find({ "location.country" : req.params.current_country });

    try{
        res.send(localPolicies);
    }catch (err){
        res.status(500).send(err.toString());
    }
}

// Post a local policy
exports.post_local_policy = async (req, res) => {
    const localPolicy = new LocalPolicy({
        location: {
            country: req.body.country,
            region: req.body.region
        },
        action: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        },
        source: {
            source_name: req.body.source_name,
            source_type: req.body.source_type,
            link: req.body.link
        }
    });

    try{
        await localPolicy.save();
        res.send(localPolicy);
    }catch (err) {
        res.status(500).send(err.toString());
    }
}

function populateDatabase(){
    var workbook = XLSX.readFile(root + '/assets/20200416-acaps-covid-19-goverment-measures-dataset-v8.xlsx', {sheetStubs: true, cellDates: true});
    
    var worksheet = workbook.Sheets["Database"];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        var col = z[0];
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;

        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }
    
        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
    }
    
    data.shift();
    data.shift();
    console.log(data);
}
