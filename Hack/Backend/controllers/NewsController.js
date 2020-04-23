const {News} = require("./../models/NewsModel");

const https = require('https');
const fs = require('fs');

const XLSX = require('xlsx');
var path = require('path');
var root = path.dirname(require.main.filename);

const schedule = require('node-schedule');

let Parser = require("rss-parser");
const parser = new Parser({
    customFields:{
        item: ['source', 'description']
    }
});

// Get all news
exports.get_all_news = async (req, res) => {    
    const news = await News.find();  // just fetches local policy
    
    //also query for news from google news
    const news_google = await parser.parseURL(`https://news.google.com/rss/search?q=covid`);
    news_google.items.forEach(element => {
        news.push(new News({
            title: element.title,
            source: element.source,
            description: element.description,
            date: element.pubDate,
            country: "Global",
            reference_link: element.link
        }));
    });
    try{
        res.send(news);
    }catch (err){
        res.status(500).send(err.toString());
    }
};

// Get all news for a country
exports.get_country_news = async (req, res) => {
    
    let news = await News.find({ "country" : req.params.current_country });
    // also query for news from google news
    const news_google = await parser.parseURL(`https://news.google.com/rss/search?q=covid ${req.params.current_country}`);
    news_google.items.forEach(element => {
        news.push(new News({
            title: element.title,
            source: element.source,
            description: element.description,
            date: element.pubDate,
            country: req.params.current_country,
            reference_link: element.link
        }));
    });
    try{
        res.send(news);
    }catch (err){
        res.status(500).send(err.toString());
    }
}

// Post a news (only for testing....)
exports.post_news = async (req, res) => {
    const news = new News({
        title: req.body.title,
        source: req.body.source,
        description: req.body.description,
        date: req.body.date,
        country: req.body.country,
        reference_link: req.body.reference_link
    });
    try{
        await news.save();
        res.send(news);
    }catch (err) {
        res.status(500).send(err.toString());
    }
}

// fetch government measures every day
schedule.scheduleJob('0 0 * * *', function (){
    fetchGovernmentMeasures();
});

// download government measures dataset
async function fetchGovernmentMeasures(){
    const file = fs.createWriteStream(path.join(root, 'assets', "government_measures_data.xlsx"));
    
    var request = https.get("https://data.humdata.org/dataset/e1a91ae0-292d-4434-bc75-bf863d4608ba/resource/e571077a-53b6-4941-9c02-ec3214d17714/download/20200421-acaps-covid-19-goverment-measures-dataset-v9.xlsx", function(response) {
        var location = response.headers.location;

        request = https.get(location, function(response) {
            response.pipe(file).on('finish', function () {
                console.log("Finished");
                populateDatabase();
            });
        });
    });    
}

// populate database with data from excel sheet
async function populateDatabase(){    
    var workbook = XLSX.readFile(path.join(root, 'assets', 'government_measures_data.xlsx'), {sheetStubs: true, cellDates: true});
    
    var worksheet = workbook.Sheets["Database"];
    var headers = {};
    var currentRow = 0;
    var currentPolicy;
    for(z in worksheet) {
        if(z[0] === '!' || worksheet[z].v == undefined) continue;
        var col = z[0];
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;

        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if(row != currentRow){
            if(currentPolicy && !await News.findOne({"country" : currentPolicy.country, "title" : currentPolicy.title, "description" : currentPolicy.description})){
                currentPolicy.save();
            }            
            
            currentPolicy = new News({
                title: " ",
                source: " ",
                description: " ",
                date: new Date(Date.now()),
                country: " ",
                reference_link: " "
            });
            currentRow = row;
        }

        switch(headers[col]){
            case "COUNTRY":
                currentPolicy.country = value;
                break;
            case "MEASURE":
                currentPolicy.title = value;
                break;
            case "COMMENTS":
                currentPolicy.description = value;
                break;
            case "DATE_IMPLEMENTED":
                currentPolicy.date = value;
                break;
            case "SOURCE":
                currentPolicy.source = value;
                break;
            case "LINK":
                currentPolicy.reference_link = value;
                break;
        }
    
    }

    if(!await News.findOne({"country" : currentPolicy.country, "title" : currentPolicy.title, "description" : currentPolicy.description})){        
        currentPolicy.save();
    }
}

