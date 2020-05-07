const axios = require("axios");
const csvjson = require('csvjson');
const { Cases } = require("./../models/CasesModel");
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

            let filteredStats = stats.filter(function(stat) {
                let date = new Date(stat.t);
                return (date >= startDate && date <= endDate);
            });
            respond(res, filteredStats)
        })
        .catch(err => {
            console.log(err);
            respond(res, null, 500)
        });
};

exports.getCriticalStatistics = (req, res, respond) => {
    let startDate = new Date(Date.parse(setStartDate(req) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z"));
    getRate(req.query.criteria, startDate, endDate, res, respond);
};

exports.getHealthStatistics = (req, res, respond, rates = false) => {
    let startDate = new Date(Date.parse(setStartDate(req)));
    let endDate = new Date(Date.parse(setEndDate(req)));

    if (req.query.country.toLowerCase() === "world") {
        let request_url = "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
        getWorldStat(request_url, startDate, endDate, req, res, respond, rates);
    } else {
        getCountryStat(startDate, endDate, req, res, respond, rates);
    }

};

function setStartDate(req) {
    if (req.query.start_date != null) {
        return "" + new Date(req.query.start_date).toISOString().slice(0, 10);
    } else {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return "" + date.toISOString().slice(0, 10);
    }
}


function setEndDate(req) {
    let end_date = new Date(req.query.end_date);
    let date = new Date();
    date.setHours(date.getHours() - 7 + (date.getTimezoneOffset() / 60));

    if (req.query.end_date != null && end_date < date) {
        return "" + end_date.toISOString().slice(0, 10);
    } else {
        return "" + date.toISOString().slice(0, 10)
    }
}


const getCountryStat = (startDate, endDate, req, res, respond, rates) => {
    const criteria = req.query.criteria;
    const country = req.query.country;

    let caseData = [];
    let dailyConfirmed = {};

    Cases.find({
        date: {
            $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
            $lte: new Date(new Date(endDate).setHours(23, 59, 59))
        },
        country: country
    }).then((results) => {
        results.forEach((item) => {
            if (criteria === "All") {
                caseData.push({
                    t: item["date"],
                    Confirmed: item['confirmed'],
                    Recovered: item['recovered'],
                    Deaths: item['deaths']
                });
            } else if (criteria === "Active") {
                caseData.push({
                    t: item.date,
                    y: (item['confirmed'] - item['recovered'] - item['deaths'])
                });
            } else {
                caseData.push({
                    t: item.date,
                    y: item[criteria.toLowerCase()]
                });
            }

            if (rates) {
                dailyConfirmed[item["date"]] = item['confirmed']
            }

        });

        if (criteria !== "All") {
            if (req.query.daily && req.query.daily === "true") {
                caseData = calculateDaily(caseData)
            }
            if (rates) {
                caseData = calculateRate(caseData, dailyConfirmed)
            }
        }
        respond(res, caseData)
    }).catch(err => {
        console.log(err);
        respond(res, null, 500)
    });

};


const getWorldStat = (request_url, startDate, endDate, req, res, respond, rates) => {
    const criteria = req.query.criteria;
    try {
        axios.get(request_url)
            .then(response => {
                let data = response.data;
                if (!data) {
                    respond(res, [])
                }

                let results = [];
                let dailyConfirmed = {};

                const options = { delimiter: ',', quote: '"' };
                data = csvjson.toObject(data, options);

                data.forEach((item) => {
                    const date = new Date(item.Date);
                    if (date >= startDate && date <= endDate) {
                        if (rates) {
                            dailyConfirmed[item.Date] = item['Confirmed'];
                        }
                        if (criteria === "All") {
                            results.push({
                                t: item.Date,
                                Confirmed: item['Confirmed'],
                                Recovered: item['Recovered'],
                                Deaths: item['Deaths']
                            });
                        } else if (criteria === "Active") {

                            results.push({
                                t: item.Date,
                                y: (item['Confirmed'] - item['Recovered'] - item['Deaths'])
                            });
                        } else {
                            results.push({
                                t: item.Date,
                                y: item[criteria]
                            });
                        }
                    }
                });

                if (criteria !== "All") {
                    if (req.query.daily && req.query.daily === "true") {
                        results = calculateDaily(results)
                    }
                    if (rates) {
                        results = calculateRate(results, dailyConfirmed)
                    }
                }

                respond(res, results)
            }).catch(error => {
                console.log(error);
                respond(res, null, 500)
            });
    } catch (err) {
        console.log(err);
    }
};


exports.countrySlugList = (res, respond) => {
    let dayQuery = new Date()
    dayQuery.setDate(dayQuery.getDate() - 1)
    dayQuery = new Date(dayQuery.toISOString().slice(0, 10))

    Cases.find({ date: dayQuery })
        .then((countryData) => {
            let countries = [{ 'name': "World", 'slug': "world" }]
            if (countryData) {
                countryData.sort((a, b) => (a.confirmed > b.confirmed) ? -1 : 1)
                for (var index in countryData) {
                    let countryValue = countryData[index]
                    countries.push({ "name": countryValue.country, "slug": countryValue.country })
                }
            }
            respond(res, countries)
        })
        .catch(e => {
            respond(res, [])
        });


};

exports.populate_db_daily = async() => {
    let request_url = "https://api.covid19api.com/summary";
    let response = await axios.get(request_url);

    if (response.data) {
        for (let i = 0; i < response.data.Countries.length; i++) {
            try {
                const c_cases = response.data.Countries[i];
                const c_case_date = new Date(Date.parse(c_cases.Date.substring(0, 10)));
                // fill db if new data is not already in the db
                // console.log(c_case_date.toUTCString());

                let record = await Cases.findOne({
                    country: { $eq: c_cases['Country'] },
                    date: { $eq: c_case_date }
                });

                if (!record) {
                    let c = new Cases({
                        _id: mongoose.Types.ObjectId(),
                        country: c_cases['Country'],
                        country_slug: c_cases['CountryCode'],
                        confirmed: c_cases['TotalConfirmed'],
                        deaths: c_cases['TotalDeaths'],
                        recovered: c_cases['TotalRecovered'],
                        date: c_case_date
                    });
                    await c.save();
                } else {
                    record.confirmed = c_cases['TotalConfirmed'] > 0 ? c_cases['TotalConfirmed'] : record.confirmed;
                    record.deaths = c_cases['TotalDeaths'] > 0 ? c_cases['TotalDeaths'] : record.deaths;
                    record.recovered = c_cases['TotalRecovered'] > 0 ? c_cases['TotalRecovered'] : record.recovered;
                    await record.save();
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    console.log("Done filling db for country stats...");
};



const calculateRate = (caseData, dailyConifrmed) => {
    let rateData = [];

    caseData.forEach((data) => {
        rateData.push({
            t: data.t,
            y: ((data.y / dailyConifrmed[data.t]) * 100).toFixed(2)
        })
    });

    return rateData;
};

const calculateDaily = (result) => {
    let dailyCaseArray = [];

    for (let index = 1; index < result.length; index++) {
        const uptoYesterday = result[index - 1].y;
        const uptoToday = result[index].y;

        let todays = uptoToday - uptoYesterday;


        dailyCaseArray.push({
            t: result[index].t,
            y: todays
        });

        if (result.length === 1) {
            dailyCaseArray.push({
                t: result[index].t,
                y: todays
            });
        }
    }
    return dailyCaseArray;
};