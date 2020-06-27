const Disease = require("../models/DiseasesModel");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const axios = require("axios");

// Get diseases
exports.get_diseases = async(req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    let request_url = "https://corona.lmao.ninja/v2/all?yesterday";
    let diseases = [];
    try{
        let response = await axios.get(request_url)
        let covid = new Disease({
            title: "COVID-19",
            confirmed: response.data.cases,
            deaths: response.data.deaths,
            recovered: response.data.recovered,
            affected: response.data.affectedCountries
        });
        diseases.push(covid);
    }
    catch(err){
        console.log(err.toString());
    }
    diseases.push(
        new Disease({
            title: "SEASONAL FLU",
            confirmed: 4000000,
            deaths: 470000,
            recovered: 3530000,
            affected: 195,
        })
    );
    //Ebola
    diseases.push(
        new Disease({
            title: "EBOLA",
            confirmed: 28610,
            deaths: 11310,
            recovered: 17300,
            affected: 19,
        })
    );
    //Sars
    diseases.push(
        new Disease({
            title: "SARS",
            confirmed: 8098,
            deaths: 774,
            recovered: 7324,
            affected: 29,
        })
    );
    //Mers
    diseases.push(
        new Disease({
            title: "MERS",
            confirmed: 2494,
            deaths: 858,
            recovered: 1636,
            affected: 27,
        })
    );
    res.send(diseases);
};
