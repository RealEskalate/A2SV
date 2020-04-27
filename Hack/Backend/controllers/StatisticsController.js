const axios = require("axios");
let Statistics = require("../models/StatisticsModel");
const healthParser = require("../services/HealthApiParser");


exports.get_statistics = async (req, res) => {
    if (req.body.criteria=="Confirmed" || req.body.criteria=="Recovered" || req.body.criteria=="Death"){
        result= await healthParser.getHealthStatistics(req);
        return res.send(result);
    }
}
