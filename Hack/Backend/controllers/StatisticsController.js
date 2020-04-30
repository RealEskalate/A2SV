const https = require("https");
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const axios = require("axios");
const Statistics = require("../models/StatisticsModel");
const healthParser = require("../services/HealthApiParser");


// Updates db with the latest csv
let update_db = async function () {
    console.log("got here");

    /* -Unknown bug here (commented out because feature not necessary)-

    // find the most recent date to start filling after the date
    const recent_doc = await Statstics.findOne({}, {}, {sort: {date: -1}});

    // set update from date to yesterday if statistics db is empty
    const update_from_date = (recent_doc == undefined) ? new Date(new Date() - 24 * 3600 * 1000) : recent_doc.date;
    console.log(update_from_date);

    */

    // Updates for dates after this
    const update_from_date = new Date(new Date() - 24 * 3600 * 1000);

    var workbook = XLSX.readFile(path.join(__dirname, 'assets', 'owid-covid-data.xlsx'), { sheetStubs: true, cellDates: true });

    var worksheet = workbook.Sheets["Sheet1"];
    var headers = {};
    var curr_location;
    var curr_date;

    for (z in worksheet) {
        if (z[0] === '!' || worksheet[z].v == undefined) continue;
        var criteria = '';
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;
        var col = z[0];

        // Populate headers dictonary if first row
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }

        switch (headers[col]) {
            // If cell is location or date update relavant fields
            // If cell is other necessary fields, specify the criteria to save later
            case "location":
                curr_location = value;
                break;
            case "date":
                curr_date = new Date(value);
                break;
            case "new_cases":
                criteria = 'CONFIRMED';
                break;
            case "new_deaths":
                criteria = 'DEATH';
                break;
            case "new_tests":
                if (value === "") continue;
                criteria = "TEST";
                break;
        }

        // Create stat and save it in the db
        if (criteria !== '' && curr_date > update_from_date) {
            var new_stat = new Statstics({
                country: curr_location,
                age_group: "ALL",
                criteria: criteria,
                value: parseInt(value),
                date: curr_date,
            }
            );
            if (curr_location === "World") {
                console.log("YAYYY");
            }
            await new_stat.save();
        }
    }
    console.log("Finished uploading testing stat");
}
// Fetchs the latest csv
let fetchTestingInfo = async function () {
    const file = fs.createWriteStream(path.join(__dirname, 'assets', "owid-covid-data.xlsx"));
    https.get("https://covid.ourworldindata.org/data/owid-covid-data.xlsx", async function (response) {
        response.pipe(file).on('finish', async function () {
            console.log("Finished downloading covid testing data");
            await update_db();
        });
    });
}

// Schedules fetching everyday
const run_updates = () => {
    schedule.scheduleJob('0 0 * * *', async function () {
        await fetchTestingInfo();
    });
};


// in the future we can call this in index.js
exports.run_updates = run_updates;
run_updates();

exports.get_statistics = async (req, res) => {
    if (req.query.criteria == "Confirmed" || req.query.criteria == "Recovered" || req.query.criteria == "Deaths" || req.query.criteria == "All") {
        result = await healthParser.getHealthStatistics(req);
        return res.send(result);
    } else if (req.query.criteria == "Confirmed_Rate" || req.query.criteria == "Recovered_Rate" || req.query.criteria == "Deaths_Rate") {
        req.query.criteria = req.query.criteria.split("_")[0];
        result = await healthParser.getHealthStatistics(req);
        let rateResult = calculate_rate(result);
        return res.send(rateResult);
    }
    else if (req.query.criteria == "Hospitalization" || req.query.criteria == "ICU") {
        result = await healthParser.getCriticalStatistics(req);
        return res.send(result);
    }
    else if (req.query.criteria == "Test") {
        let filter = {};
        if (req.query.country !== undefined) {
            filter.country = req.query.country;
        } else {
            filter.country = "World"
        }

        filter.date = {
            $gte: req.query.start_date !== undefined ? new Date(req.query.start_date) : new Date(new Date() - 7 * 24 * 3600 * 1000),
            $lte: req.query.end_date !== undefined ? new Date(req.query.end_date) : new Date(new Date() - 24 * 3600 * 1000)
        }

        filter.criteria = req.query.criteria.toUpperCase();
        // Apply filter and send results
        const results_from_db = await Statistics.find(filter);
        date_formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
        let results = [];
        results_from_db.forEach((element) => {
            date = date_formatter.formatToParts(element.date);
            date = date[4]["value"] + "-" + date[0]["value"] + "-" + date[2]["value"];
            results.push({
                t: date,
                y: element.value
            });
        })
        try {
            res.send(results);
        } catch (err) {
            res.status(500).send(err);
        }

    } else {
        try {
            res.send([]);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}


calculate_rate = (result) => {
    let rateArray = [];
    for (let index = 1; index < result.length; index++) {
        const upto_yesterday = result[index - 1].y;
        const upto_today = result[index].y;
        let todaysDeath = upto_today - upto_yesterday;
        let rate = (todaysDeath / upto_today) * 100;
        rate = (Math.round(rate * 100) / 100).toFixed(2);
        rateArray.push({
            t: result[index].t,
            y: rate
        });
        if (index == 1) {
            rateArray.push({
                t: result[index].t,
                y: rate
            });
        }
    }
    return rateArray;
};
