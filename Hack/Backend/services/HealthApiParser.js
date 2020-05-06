const axios = require("axios");
const csvjson = require('csvjson');
const {Cases} = require("./../models/CasesModel");
const mongoose = require("mongoose");

const getRate = (criteria, startDate, endDate, res, respond) => {
    axios.get('https://covidtracking.com/api/v1/us/daily.json')
        .then(response => {
            let stats = [];
            let datas = response.data;
            datas.forEach(data => {
                let stat = {
                    t: new Date(Date.parse(data.dateChecked))
                };
                if (criteria === "Hospitalization") {
                    stat.y = data.hospitalizedCurrently || 0;
                } else if (criteria === "ICU") {
                    stat.y = data.inIcuCurrently || 0;
                }
                stats.push(stat);
            });

            let filteredStats = stats.filter(function (stat) {
                let date = new Date(stat.t);
                console.log(date >= startDate && date <= endDate);
                return (date >= startDate && date <= endDate);
            });
            respond(res, filteredStats, true)
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCriticalStatistics = (req, res, respond) => {
    let startDate = new Date(Date.parse(set_start_date_for_countries(req).slice(6) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(set_end_date_for_countries(req).slice(4) + "T21:00:00.000Z"));
    getRate(req.query.criteria, startDate, endDate, res, respond);
};

exports.getHealthStatistics = (req, res, respond, rates = false) => {
    if (req.query.country.toLowerCase() === "world") {
        // request_url="https://datahub.io/core/covid-19/r/worldwide-aggregated.json"
        let request_url = "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
        let start_date = new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        let end_date = new Date(Date.parse(set_end_date_for_countries(req).slice(4)));
        parse_csv_data(request_url, start_date, end_date, req.query.criteria, res, respond, rates);
    } else {
        const request_url = `https://api.covid19api.com/total/country/${req.query.country.toLowerCase()}`;
        const start_date = new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        const end_date = new Date(Date.parse(set_end_date_for_countries(req).slice(4)));
        do_api_call(request_url, req.query.criteria, start_date, end_date, res, respond, rates);
    }

};

function set_start_date_for_countries(req) {
    if (req.query.start_date != null) {
        return "?from=" + req.query.start_date;
    } else {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return "?from=" + date.toISOString().slice(0, 10)
    }
}


function set_end_date_for_countries(req) {
    // let set the end date for today since we are not yet able to do projection
    let end_date = new Date(req.query.end_date);
    let date = new Date();
    date.setHours(date.getHours() - 7 + (date.getTimezoneOffset() / 60));

    if (req.query.end_date != null && end_date < date) {
        return "&to=" + req.query.end_date;
    } else {
        return "&to=" + date.toISOString().slice(0, 10)
    }
}


const do_api_call = (request_url, criteria, start_date, end_date, res, respond, needRates) => {
    console.log(criteria, request_url);
    try {
        axios.get(request_url)
            .then(response => {
                if (!response.data) {
                    respond(res, [], needRates)
                } else if (criteria === "All") {
                    let results = [];
                    response.data.forEach((item) => {
                        const date = new Date(item.Date);

                        if (date >= start_date && date <= end_date) {
                            results.push({
                                "t": item.Date,
                                "Confirmed": item['Confirmed'],
                                "Recovered": item['Recovered'],
                                "Deaths": item['Deaths']
                            });
                        }
                    });
                    console.log("Fetched everything " + results);
                    respond(res, results, needRates)
                } else {
                    let results = [];
                    response.data.forEach((item) => {
                        const date = new Date(item.Date);
                        if (date >= start_date && date <= end_date) {
                            results.push({
                                "t": item.Date,
                                "y": item[`${criteria}`]
                            });
                        }
                    });
                    respond(res, results, needRates)
                }
            })
            .catch(error => {
                console.log(error);
            });
    } catch (err) {
        console.log(err);
    }
};


const parse_csv_data = (request_url, start_date, end_date, criteria, res, respond, rates) => {
    console.log(request_url);
    try {
        axios.get(request_url)
            .then(response => {
                let data = response.data;
                if (!data) {
                    respond(res, [], rates)
                }
                let results = [];
                const options = { delimiter: ',', quote: '"' };
                data = csvjson.toObject(data, options);
                data.forEach((item) => {
                    const date = new Date(item.Date);
                    if (date >= start_date && date <= end_date) {
                        if (criteria == "All") {
                            results.push({
                                t: item.Date,
                                Confirmed: item['Confirmed'],
                                Recovered: item['Recovered'],
                                Deaths: item['Deaths']
                            });
                        } else {
                            results.push({
                                t: item.Date,
                                y: item[criteria]
                            });
                        }
                    }
                });
                respond(res, results, rates)
            }).catch(error => {
                console.log(error);
            });
    } catch (err) {
        console.log(err);
    }
};


exports.countrySlugList = async (request_url, name, field, res, respond) => {
    console.log(field, request_url);
    try {
        let results = []
        let response = await axios.get(request_url)

        if (response.data) {
            response.data.forEach((item) => {
                results.push({
                    'name': item[name],
                    'slug': item[field]
                });
            });
        }
        results.push({
            'name': "World",
            'slug': "world"
        });
        results.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return respond(res, results)


    } catch (err) {
        console.log(err);
    }
    respond(res, [])
};

exports.populate_db_daily = async () => {
    let request_url = "https://api.covid19api.com/summary";
    let response = await axios.get(request_url)

    if (response.data) {
        for(let i = 0; i<response.data.Countries.length;i++){
            try{
                let c_cases = response.data.Countries[i];
                c_case_date = new Date(Date.parse(c_cases.Date.substring(0,10)));
                // fill db if new data is not already in the db
                // console.log(c_case_date.toUTCString());
                
                let record = await Cases.find({
                    country: {$eq: c_cases['Country']}, 
                    date: {$eq: c_case_date}
                });           
                
                if ( !record || record.length == 0 ){
                    let c = new Cases({
                        _id: mongoose.Types.ObjectId(),
                        country: c_cases['Country'],
                        country_slug: c_cases['CountryCode'],
                        confirmed: c_cases['NewConfirmed'],
                        deaths: c_cases['NewDeaths'],
                        recovered: c_cases['NewRecovered'],
                        date: c_case_date
                    });
                    await c.save();
                }
            }
            catch(err){
                console.log(err);
            }
        }
    }

    console.log("Done filling db for country stats...");
};
