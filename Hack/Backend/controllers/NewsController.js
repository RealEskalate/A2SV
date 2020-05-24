const { News } = require("./../models/NewsModel");
const AlertController = require("./AlertController");
const AlertUserController = require("./AlertUserController");
let Alert = require("./../models/AlertModel");
let AlertUser = require("./../models/AlertUserModel");
let { User } = require("./../models/UserModel");
const http = require("http");
const https = require("https");
const fs = require("fs");
let mongoose = require("mongoose");
const XLSX = require("xlsx");
var path = require("path");
var root = __dirname;

const schedule = require("node-schedule");

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
  let news = [];

  news = news.concat(await fetchGoogleNews(req));

  let policies;  
  if(req.query.country == "World"){
    news = news.concat(await fetchCDCNews());
  }else if(req.query.country){
    policies = await News.find({country: req.query.country}).select("-description");
  }else{
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
    { $group: { _id: "$source", reference_link: { $first: "$reference_link" } } },
  ]);
  let googleNews = await fetchGoogleNews(req);
  let map = new Map();
  for (let item of googleNews) {
      if(!map.has(item.source)){
          map.set(item.source, true);
          sources.push({
              source: item.source,
              reference_link: item.reference_link,
          });
      }
  }
  sources = sources.filter((item) => default_sources.includes(item.source))
                   .map((item) => { return {source: item.source, logo: clearBitLogo(item.reference_link)}});

  if(!req.query.country){
    sources.unshift({
      source: "CDC Newsroom",
      logo: "http://logo.clearbit.com/cdc.gov" 
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
    await saveAlert(news);
    res.status(201).send(news);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function saveAlert(news){
  try {
    let alert = new Alert({
      _id: mongoose.Types.ObjectId(),
      title: news.title,
      type: "NEWS",
      degree: "NORMAL",
      content: news.description,
      timestamp: news.date,
    });
    await alert.save();
    let users = await User.find({ current_country: news.country });
    for (let i = 0; i < users.length; i++) {
      const alert_user = new AlertUser({
        _id: mongoose.Types.ObjectId(),
        user_id: users[i]._id,
        alert_id: alert._id,
      });
      const check = await AlertUser.findOne({
        user_id: alert_user.user_id,
        alert_id: alert_user.alert_id,
      });
      if (!check) {
        await alert_user.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// fetch government measures every day
schedule.scheduleJob("0 0 * * *", function () {
  fetchGovernmentMeasures();
});

// download government measures dataset
async function fetchGovernmentMeasures() {
  const file = fs.createWriteStream(
    path.join(root, "assets", "government_measures_data.xlsx")
  );

  var request = https.get(
    "https://data.humdata.org/api/3/action/package_show?id=acaps-covid19-government-measures-dataset",
    function (response) {
      var result = "";
      response.on("data", function (chunk) {
        result += chunk;
      });

      response.on("end", function () {
        var download_url = JSON.parse(result).result.resources[1].download_url;

        request = http.get(download_url, function (response) {
          var location = response.headers.location;

          request = https.get(location, function (response) {
            location = response.headers.location;

            request = https.get(location, function (response) {
              console.log("Started");
              response.pipe(file).on("finish", function () {
                console.log("Finished");
                populateDatabase();
              });
            });
          });
        });
      });
    }
  );
}

// populate database with data from excel sheet
async function populateDatabase() {  
  let week = new Date().setDate(new Date().getDate() - 7);
  await News.deleteMany({date : { $lt : week}});

  var workbook = XLSX.readFile(
    path.join(root, "assets", "government_measures_data.xlsx"),
    { sheetStubs: true, cellDates: true }
  );

  var worksheet = workbook.Sheets["Database"];
  var headers = {};
  var currentRow = 0;
  var currentPolicy;
  for (z in worksheet) {
    if (z[0] === "!" || worksheet[z].v == undefined) continue;
    var col = z[0];
    var row = parseInt(z.substring(1));
    var value = worksheet[z].v;

    if (row == 1 && value) {
      headers[col] = value;
      continue;
    }

    if (row != currentRow) {
      if (
        currentPolicy &&
        !(await News.findOne({
          country: currentPolicy.country,
          title: currentPolicy.title,
          description: currentPolicy.description,
        })) &&
        currentPolicy.date > week
      ) {
        currentPolicy.save();
        await saveAlert(currentPolicy);
      }

      currentPolicy = new News({
        title: " ",
        source: " ",
        type: "Government Measure",
        description: " ",
        date: new Date(Date.now()),
        country: " ",
        reference_link: " ",
      });
      currentRow = row;
    }

    switch (headers[col]) {
      case "COUNTRY":
        currentPolicy.country = value;
        break;
      case "MEASURE":
        currentPolicy.title = value;
        break;
      case "COMMENTS":
        currentPolicy.description = value;
        break;
      case "ENTRY_DATE":
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

  if (
    !(await News.findOne({
      country: currentPolicy.country,
      title: currentPolicy.title,
      description: currentPolicy.description,
    })) &&
    currentPolicy.date > week
  ) {
    currentPolicy.save();
    await saveAlert(currentPolicy);
  }
}

function paginateAndFilter(data, req) {
  var page = parseInt(req.query.page) || 1;
  var size = parseInt(req.query.size) || 15;

  if (req.query.source) {
    data = data.filter((item) => req.query.source.split(",").includes(item.source)
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