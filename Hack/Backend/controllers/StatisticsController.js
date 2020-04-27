const https = require("https");
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Statstics = require("./../models/StatisticsModel");
const schedule = require('node-schedule');



// Updates db with the latest csv
let update_db = async function(){
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

    var workbook = XLSX.readFile(path.join(__dirname, 'assets', 'owid-covid-data.xlsx'), {sheetStubs: true, cellDates: true});
    
    var worksheet = workbook.Sheets["Sheet1"];
    var headers = {};
    var curr_location;
    var curr_date;

    for(z in worksheet) {
        if(z[0] === '!' || worksheet[z].v == undefined) continue;
        var criteria = '';
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;
        var col = z[0];

        // Populate headers dictonary if first row
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        switch(headers[col]){
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
        if (criteria !== '' && curr_date > update_from_date){
            var new_stat = new Statstics({
                    country: curr_location,
                    age_group: "ALL",
                    criteria: criteria,
                    value: parseInt(value),
                    date: curr_date,
                } 
            )
            new_stat.save();
        }
    }
    console.log("Finished uploading testing stat");
}
// Fetchs the latest csv
let fetchTestingInfo = async function() {
    const file = fs.createWriteStream(path.join(__dirname, 'assets', "owid-covid-data.xlsx"));
    https.get("https://covid.ourworldindata.org/data/owid-covid-data.xlsx", async function(response) {
        response.pipe(file).on('finish', async function () {
            console.log("Finished downloading covid testing data");
            await update_db();
        });
    });
}

// Schedules fetching everyday
const run_updates = () => {
    schedule.scheduleJob('0 0 * * *', async function (){
        fetchTestingInfo();
    });
};

run_updates();

// in the future we can call this in index.js
exports.run_updates = run_updates;


exports.get_statistics = async (req, res) => {
    // jwt.verify(req.token, 'secretkey', (err,authData) =>{
    //     if (err){
    //         res.status(401).send("Incorrect authentication key");
    //     }
    // });
    
    // Create a filter
    let filter = {};

    if (req.params.country !== undefined){
        filter.country = req.params.country;
    }
    if (req.params["start date"] !== undefined){
        filter.date = { $gte: new Date(req.params["start date"]) };
    }
    if (req.params["end date"] !== undefined){
        if (filter.date === undefined) filter.date = {};
        filter.date.$lte = new Date(req.params["end date"]);
    }
    if (req.params["criteria"] !== undefined){
        filter.criteria = req.params.criteria;
    }

    // Apply filter and send results
    const results = await Symptom.find(filter);
    try {
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }    
} 