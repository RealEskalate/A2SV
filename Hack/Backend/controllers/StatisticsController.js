const https = require("https");
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const Statistics = require("../models/StatisticsModel");
const healthParser = require("../services/HealthApiParser");
const countries = {"Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Andorra":"AD","Angola":"AO","Antigua and Barbuda":"AG","Argentina":"AR","Armenia":"AM","Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bahamas":"BS","Bahrain":"BH","Bangladesh":"BD","Barbados":"BB","Belarus":"BY","Belgium":"BE","Belize":"BZ","Benin":"BJ","Bhutan":"BT","Bolivia":"BO","Bosnia and Herzegovina":"BA","Botswana":"BW","Brazil":"BR","Brunei":"BN","Bulgaria":"BG","Burkina Faso":"BF","Burma":"MM","Burundi":"BI","Cabo Verde":"CV","Cambodia":"KH","Cameroon":"CM","Canada":"CA","Central African Republic":"CF","Chad":"TD","Chile":"CL","China":"CN","Colombia":"CO","Congo (Brazzaville)":"CD","Congo (Kinshasa)":"CG","Costa Rica":"CR","Cote dIvoire":"CI","Croatia":"HR","Cuba":"CU","Cyprus":"CY","Czech Republic":"CZ","Czechia":"CZ","Denmark":"DK","Diamond Princess":"JP","Djibouti":"DJ","Dominica":"DO","Dominican Republic":"DO","Ecuador":"EC","Egypt":"EG","El Salvador":"SV","Equatorial Guinea ":"GQ","Eritrea":"ER","Estonia":"EE","Eswatini":"SZ","Ethiopia":"ET","Fiji":"FJ","Finland":"FI","France":"FR","Gabon":"GA","Gambia":"GM","Georgia":"GE","Germany":"DE","Ghana":"GH","Greece":"GR","Grenada":"GD","Guatemala":"GT","Guinea":"GN","Guinea-Bissau":"GW","Guyana":"GY","Haiti":"HT","Holy See":"VA","Honduras":"HN","Hong Kong":"HK","Hungary":"HU","Iceland":"IS","India":"IN","Indonesia":"ID","Iran":"IR","Iraq":"IQ","Ireland":"IE","Israel":"IL","Italy":"IT","Jamaica":"JM","Japan":"JP","Jordan":"JO","Kazakhstan":"JZ","Kenya":"KE","Korea":"KR","Kosovo":"XK","Kuwait":"KW","Kyrgyzstan":"KG","Laos":"LA","Latvia":"LV","Lebanon":"LB","Liberia":"LR","Libya":"LY","Liechtenstein":"LI","Lithuania":"LT","Luxembourg":"LU","Madagascar":"MG","Malawi":"MW","Malaysia":"MY","Maldives":"MV","Mali":"ML","Malta":"MT","Mauritania":"MR","Mauritius":"MU","Mexico":"MX","Moldova":"MD","Monaco":"MC","Mongolia":"MN","Montenegro":"ME","Morocco":"MA","Mozambique":"MZ","MS Zaandam":"US","Myanmar":"MM","Namibia":"NA","Nepal":"NP","Netherlands":"NL","New Zealand":"NZ","Nicaragua":"NI","Niger":"NE","Nigeria":"NG","North Macedonia":"MK","Norway":"NO","Oman":"OM","Pakistan":"PK","Panama":"PA","Papua New Guinea":"PG","Paraguay":"PY","Peru":"PE","Philippines":"PH","Poland":"PL","Portugal":"PT","Qatar":"QA","Romania":"RO","Russia":"RU","Rwanda":"RW","Saint Kitts and Nevis":"KN","Saint Lucia":"LC","Saint Vincent and the Grenadines":"VC","San Marino":"SM","Sao Tome and Principe":"ST","Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Seychelles":"SC","Sierra Leone":"SL","Singapore":"SG","Slovakia":"SK","Slovenia":"SI","Somalia":"SO","South Africa":"ZA","South Korea":"KP","South Sudan":"SS","Spain":"ES","Sri Lanka":"LK","Sudan":"SD","Suriname":"SR","Sweden":"SE","Switzerland":"CH","Syria":"SY","Taiwan":"TW","Taiwan*":"TW","Tanzania":"TZ","Thailand":"TH","Timor-Leste":"TL","Togo":"TG","Trinidad and Tobago":"TT","Tunisia":"TN","Turkey":"TR","Uganda":"UG","Ukraine":"UA","United Arab Emirates":"AE","United Kingdom":"GB","United States":"US","Uruguay":"UY","US":"US","Uzbekistan":"UZ","Venezuela":"VE","Vietnam":"VN","West Bank and Gaza":"PS","Western Sahara":"EH","Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW"}
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
            case "total_tests":
                if (value === "") continue;
                criteria = "TEST";
                break;
        }
        // Create stat and save it in the db
        if (criteria == "TEST" && curr_date > update_from_date) {
            let new_stat = new Statistics({
                country: countries[`${curr_location}`],
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



// in the future we can call this in index.js
exports.run_updates = run_updates;
run_updates();

exports.get_statistics = async(req, res) => {
    if (["Confirmed", "Recovered", "Deaths", "All"].includes(req.query.criteria)) {
        healthParser.fetch_criteria(req, res, respond);
    } else if (["Confirmed_Rate", "Recovered_Rate", "Deaths_Rate"].includes(req.query.criteria)) {
        req.query.criteria = req.query.criteria.split("_")[0];
        healthParser.fetch_criteria(req, res, respond, true);
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
            respond(res, err, false, 500);
        }

    } else {
        respond(res, null, false, 400);
    }
};


const calculate_rate = (result) => {
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
        if (index === 1) {
            rateArray.push({
                t: result[index].t,
                y: rate
            });
        }
    }
    return rateArray;
};

function respond(res, payload, rates = false, status = 200) {
    if (rates) {
        payload = calculate_rate(payload)
    }
    res.status(status).send(payload);
}



exports.get_country_slugs = async(req, res) => {
    await healthParser.countrySlugList( res, respond);
}

