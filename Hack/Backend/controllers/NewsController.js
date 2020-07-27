const { News } = require("./../models/NewsModel");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");

let Parser = require("rss-parser");
const parser = new Parser({
  customFields: {
    item: ["source", "description"],
  },
});

let default_sources = [
  "CDC Newsroom",
  "CNN",
  "BBC News",
  "NPR",
  "EU News",
  "World Health Organization",
  "The Guardian",
  "Global News",
  "Science Daily",
  "MIT News",
];

// Get all news
exports.get_all_news = async (req, res) => {
  // convert from iso 3 to country name our use the req.query.country as it is if it is not iso 3 code.
  let isoToCountry = await StatisticsResource.findOne({
    language: "English",
    title: "countries-name-dictionary",
  });
  
  if( isoToCountry)
    isoToCountry = isoToCountry.fields[0]
    
  if(isoToCountry && req.query.country in isoToCountry ){
    req.query.country = isoToCountry[ req.query.country ]
  }
  // end of conversion

  let news = [];

  news = news.concat(await fetchGoogleNews(req));

  let policies = [];
  if (req.query.country == "World") {
    news = news.concat(await fetchCDCNews());
  } else if (req.query.country) {
    policies = await News.find({ country: req.query.country }).select(
      "-description"
    );
  } else {
    policies = await News.find({}).select("-description");
  }

  news = news.concat(policies);

  try {
    res.send(paginateAndFilter(news, req));
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

exports.get_sources = async (req, res) => {
  let sources = await News.aggregate([
    {
      $group: { _id: "$source", reference_link: { $first: "$reference_link" } },
    },
  ]);
  let googleNews = await fetchGoogleNews(req);
  let map = new Map();
  for (let item of googleNews) {
    if (!map.has(item.source)) {
      map.set(item.source, true);
      sources.push({
        source: item.source,
        reference_link: item.reference_link,
      });
    }
  }
  sources = sources
    .filter((item) => default_sources.includes(item.source))
    .map((item) => {
      return { source: item.source, logo: clearBitLogo(item.reference_link) };
    });

  if (!req.query.country || req.query.country == "World") {
    sources.unshift({
      source: "CDC Newsroom",
      logo: "http://logo.clearbit.com/cdc.gov",
    });
  }

  try {
    res.send(sources);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Post a news (only for testing....)
exports.post_news = async (req, res) => {
  const news = new News({
    title: req.body.title,
    source: req.body.source,
    type: req.body.type,
    description: req.body.description,
    date: req.body.date,
    country: req.body.country,
    reference_link: req.body.reference_link,
  });
  try {
    await news.save();
    res.status(201).send(news);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

function paginateAndFilter(data, req) {
  var page = parseInt(req.query.page) || 1;
  var size = parseInt(req.query.size) || 15;

  if (req.query.source) {
    data = data.filter((item) =>
      req.query.source.split(",").includes(item.source)
    );
  }

  data.sort((a, b) => (a.date < b.date ? 1 : b.date < a.date ? -1 : 0));

  let paginated = data.slice((page - 1) * size, page * size);

  paginated.forEach((item) => {
    let link = item.reference_link;
    item.logo = clearBitLogo(link);
  });

  let result = {
    data_count: data.length,
    page_size: size,
    current_page: page,
    data: paginated,
  };

  return result;
}

async function fetchGoogleNews(req) {
  let news = [];

  let news_google;
  if (req.query.country) {
    news_google = await parser.parseURL(
      `https://news.google.com/rss/search?q=covid ${req.query.country}`
    );
  } else {
    news_google = await parser.parseURL(
      `https://news.google.com/rss/search?q=covid`
    );
  }

  news_google.items.forEach((element) => {
    news.push(
      new News({
        title: element.title,
        source: element.source,
        type: "News",
        date: element.pubDate,
        country: req.query.country || "Global",
        reference_link: element.link,
      })
    );
  });

  return news;
}

async function fetchCDCNews() {
  let news = [];

  let news_cdc;

  news_cdc = await parser.parseURL(
    `https://tools.cdc.gov/api/v2/resources/media/132608.rss`
  );

  news_cdc.items.forEach((element) => {
    if (element.categories.includes("COVID-19")) {
      news.push(
        new News({
          title: element.title,
          source: "CDC Newsroom",
          type: "News",
          date: element.pubDate,
          country: "World",
          reference_link: element.link,
        })
      );
    }
  });

  return news;
}

function clearBitLogo(link) {
  let domain = link.split("/")[2] || "";
  domain = domain.split(".");
  if (domain.length >= 3) domain.shift();
  return `https://logo.clearbit.com/${domain.join(".")}`;
}
