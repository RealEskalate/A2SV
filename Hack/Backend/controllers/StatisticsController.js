const https = require("https");
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const Statistics = require("../models/StatisticsModel");
const healthParser = require("../services/HealthApiParser");


exports.get_statistics = async (req, res) => {
    console.log("getting statistics");
    if (req.query.criteria == "Confirmed_Rate") {
        req.query.criteria = "Tests_Rate";
    }
    if (["Confirmed", "Recovered", "Deaths", "Active", "Tests", "All"].includes(req.query.criteria)) {
        healthParser.getHealthStatistics(req, res, respond);
    } else if (["Tests_Rate", "Recovered_Rate", "Deaths_Rate", "Active_Rate"].includes(req.query.criteria)) {
        req.query.criteria = req.query.criteria.split("_")[0];
        healthParser.getHealthStatistics(req, res, respond, true);
    } else if (["Hospitalization", "ICU"].includes(req.query.criteria)) {
        healthParser.getCriticalStatistics(req, res, respond);
    } else {
        respond(res, null, 400);
    }
};



function respond(res, payload, status = 200) {
    res.status(status).send(payload);
}



exports.get_country_slugs = async (req, res) => {

    healthParser.countrySlugList(res, respond);

};



exports.getWorldStats= async (req,res) => {
    let rates=false;
    if (["Tests_Rate", "Recovered_Rate", "Deaths_Rate", "Active_Rate"].includes(req.query.criteria)) {
        req.query.criteria = req.query.criteria.split("_")[0];
        rates=true;
    }
    try{
        let results=await healthParser.getWorldStatistics(req,rates);
        res.status(200).send(results);
    }catch(err){
        res.status(500).send(err)
    }
}