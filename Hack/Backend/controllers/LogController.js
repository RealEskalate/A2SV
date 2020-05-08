const Log = require("../models/LogModel");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

//Get a log by a specific id
exports.get_log_by_id = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    const log = await Log.findById(req.params.id);
    try {
        if(!log){
            return res.status(404).send("Log Not Found");
        }
        res.send(log);
    } catch (err) {
        res.status(500).send(err);
    }
};


//Get all logs 
exports.get_logs = async(req, res)=>{
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });

    let filter = {};
    if(req.query.statusCode){
        filter['meta.res.statusCode'] = req.query.statusCode;
        
    }

    if(req.query.url){
        filter['meta.req.url'] = req.query.url;
    }
    
    const logs = await Log.find(filter);
    try {
        res.send(logs);
    } catch (err) {
        res.status(500).send(err);
    }
}

// //Get logs by specific status codes
// exports.get_logs_by_status_codes = async(req, res)=>{
//     // jwt.verify(req.token, 'secretkey', (err,authData) =>{
//     //     if (err){
//     //         res.status(401).send("Incorrect authentication key");
//     //     }
//     // });
//     const logs = await Log.find({'meta.res.statusCode': req.params.statusCode});
//     try {
//         res.send(logs);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

// //Get logs by specific urls
// exports.get_logs_by_urls = async(req, res)=>{
//     // jwt.verify(req.token, 'secretkey', (err,authData) =>{
//     //     if (err){
//     //         res.status(401).send("Incorrect authentication key");
//     //     }
//     // });
//     const logs = await Log.find({'meta.req.url': req.params.url});
//     try {
//         res.send(logs);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }
