const https = require("https");
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const Statistics = require("../models/StatisticsModel");
const healthParser = require("../services/HealthApiParser");


// Updates db with the latest csv
let update_db = async function() {
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

    let workbook = XLSX.readFile(path.join(__dirname, 'assets', 'owid-covid-data.xlsx'), { sheetStubs: true, cellDates: true });

    let worksheet = workbook.Sheets["Sheet1"];
    let headers = {};
    let curr_location;
    let curr_date;

    for (let z in worksheet) {
        if (z[0] === '!' || worksheet[z].v === undefined) continue;
        let criteria = '';
        let row = parseInt(z.substring(1));
        let value = worksheet[z].v;
        let col = z[0];

        // Populate headers dictonary if first row
        if (row === 1 && value) {
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
            let new_stat = new Statistics({
                country: curr_location,
                age_group: "ALL",
                criteria: criteria,
                value: parseInt(value),
                date: curr_date,
            });
            if (curr_location === "World") {
                console.log("YAYYY");
            }
            await new_stat.save();
        }
    }
    console.log("Finished uploading testing stat");
};
// Fetchs the latest csv
let fetchTestingInfo = async function() {
    const file = fs.createWriteStream(path.join(__dirname, 'assets', "owid-covid-data.xlsx"));
    https.get("https://covid.ourworldindata.org/data/owid-covid-data.xlsx", async function(response) {
        response.pipe(file).on('finish', async function() {
            console.log("Finished downloading covid testing data");
            await update_db();
        });
    });
};

// Schedules fetching everyday
const run_updates = () => {
    schedule.scheduleJob('0 0 * * *', async function() {
        await fetchTestingInfo();
    });
};

const run_updates_on_country = () => {
    // update by the hour
    schedule.scheduleJob('0 * * * *', async function() {
        await healthParser.populate_db_daily();
    });
};

// in the future we can call this in index.js
exports.run_updates = run_updates;
run_updates();
run_updates_on_country();

exports.get_statistics = async(req, res) => {
    if (["Confirmed", "Recovered", "Deaths", "Active", "All"].includes(req.query.criteria)) {
        healthParser.getHealthStatistics(req, res, respond);
    } else if (["Confirmed_Rate", "Recovered_Rate", "Deaths_Rate", "Active_Rate"].includes(req.query.criteria)) {
        req.query.criteria = req.query.criteria.split("_")[0];
        healthParser.getHealthStatistics(req, res, respond, true);
    } else if (["Hospitalization", "ICU"].includes(req.query.criteria)) {
        healthParser.getCriticalStatistics(req, res, respond);
    } else if (req.query.criteria === "Test") {
        let filter = {
            country: req.query.country || "World",
            date: {
                $gte: req.query.start_date !== undefined ? new Date(req.query.start_date) : new Date(new Date() - 7 * 24 * 3600 * 1000),
                $lte: req.query.end_date !== undefined ? new Date(req.query.end_date) : new Date(new Date() - 24 * 3600 * 1000)
            },
            criteria: req.query.criteria.toUpperCase()
        };

        // Apply filter and send results
        const results_from_db = await Statistics.find(filter);
        const date_formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
        let results = [];
        results_from_db.forEach((element) => {
            let date = date_formatter.formatToParts(element.date);
            date = date[4]["value"] + "-" + date[0]["value"] + "-" + date[2]["value"];
            results.push({
                t: date,
                y: element.value
            });
        });
        try {
            respond(res, results)
        } catch (err) {
            respond(res, err, 500);
        }

    } else {
        respond(res, null, 400);
    }
};



function respond(res, payload, status = 200) {
    res.status(status).send(payload);
}



exports.get_country_slugs = async(req, res) => {
    // if (["Confirmed", "Recovered", "Deaths", "All"].includes(req.query.criteria)) {

    url = "https://api.covid19api.com/countries"
    name = "Country"
    field = "ISO2"
    await healthParser.countrySlugList(url, name, field, res, respond);

}