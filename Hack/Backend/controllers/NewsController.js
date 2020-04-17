const {News} = require("./../models/NewsModel");
let Parser = require("rss-parser");
const parser = new Parser({
    customFields:{
        item: ['source', 'description']
    }
});

// Get all news
exports.get_all_news = async (req, res) => {
    const news = await News.find();  // just fetches local policy
    // also query for news from google news
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