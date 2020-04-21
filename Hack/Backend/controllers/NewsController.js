const {News} = require("./../models/NewsModel");

const XLSX = require('xlsx');
var path = require('path');
var root = path.dirname(require.main.filename);

let Parser = require("rss-parser");
const parser = new Parser({
    customFields:{
        item: ['source', 'description']
    }
});

// Get all news
exports.get_all_news = async (req, res) => {
    if(await News.countDocuments() == 0){ // populating database will be done only once when the database is empty
        populateDatabase();
    }
    
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
    if(await News.countDocuments() == 0){ // populating database will be done only once when the database is empty
        populateDatabase();
    }
    
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

// populate database with data from excel sheet
function populateDatabase(){
    var workbook = XLSX.readFile(path.join(root, 'assets', '20200416-acaps-covid-19-goverment-measures-dataset-v8.xlsx'), {sheetStubs: true, cellDates: true});
    
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
            if(currentPolicy){
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

    currentPolicy.save();
}