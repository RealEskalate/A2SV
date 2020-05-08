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
    // https://api.covid19api.com/world/total
    let request_url = "https://covid19api.io/api/v1/AllReports";
    let diseases = [];
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

    diseases.push(
        new Disease({
            title: "SEASONAL FLU",
            confirmed: 4000000,
            deaths: 470000,
            recovered: 3530000,
            affected: 195,
        })
    );
    const result = await axios
        .get(request_url)
        .then((response) => {
            let data = response.data.reports[0];
            let affected_countries = data.table[0].length - 1;
            let confirmed = data.cases;
            let deaths = data.deaths;
            let recovered = data.recovered;
            let covid = new Disease({
                title: "COVID-19",
                confirmed: confirmed,
                deaths: deaths,
                recovered: recovered,
                affected: affected_countries,
            });
            diseases.push(covid);
        })
        .catch((err) => {
            console.log(err);
        });
    res.send(diseases);
};