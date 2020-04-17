const {News} = require("./../models/NewsModel");

// Get all news
exports.get_all_news = async (req, res) => {
    const news = await News.find();  // just fetches local policy
    // also query for news from google news
    try{
        res.send(news);
    }catch (err){
        res.status(500).send(err.toString());
    }
};

// Get all news for a country
exports.get_country_news = async (req, res) => {
    
    const news = await News.find({ "country" : req.params.current_country });
    // also query for news from google news
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