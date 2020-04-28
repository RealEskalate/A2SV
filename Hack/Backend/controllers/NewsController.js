const {News} = require("./../models/NewsModel");

const http = require('http');
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
    let news = []; 
    
    //also query for news from google news
    let news_google;
    if(req.query.country){
        news_google = await parser.parseURL(`https://news.google.com/rss/search?q=covid ${req.query.country}`);
    }else{
        news_google = await parser.parseURL(`https://news.google.com/rss/search?q=covid`);
    }
    
    news_google.items.forEach(element => {
        news.push(new News({
            title: element.title,
            source: element.source,
            description: element.description,
            date: element.pubDate,
            country: req.query.country || "Global",
            reference_link: element.link
        }));
    });

    // const policies = await News.find()
    const policies = await News.find();
    news = news.concat(policies);

    try{
        res.send(paginateAndFilter(news, req));
    }catch (err){
        res.status(500).send(err.toString());
    }
};

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
    
    var request = https.get("https://data.humdata.org/api/3/action/package_show?id=acaps-covid19-government-measures-dataset", function(response) {
        var result = "";
        response.on('data', function (chunk) {
            result += chunk;
        });
        
        response.on('end', function () {
            var download_url = JSON.parse(result).result.resources[1].download_url;

            request = http.get(download_url, function(response) {
                var location = response.headers.location;

                request = https.get(location, function(response) {
                    location = response.headers.location;
                    
                    request = https.get(location, function(response) {
                        response.pipe(file).on('finish', function () {
                            console.log("Finished");
                            populateDatabase();
                        });
                    });
                });                
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

function paginateAndFilter(data, req){
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 15;

    if(req.query.country){
        data = data.filter(
            (item) => item.country === req.query.country
        );
    }

    if(req.query.source){
        data = data.filter(
            (item) => item.source === req.query.source
        );
    }

    return data.slice((page - 1) * size, page * size);

}