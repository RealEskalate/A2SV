const axios = require("axios");
const csvjson = require("csvjson");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const Papa = require("papaparse");
const path = require("path");
const XLSX = require("xlsx");

const LocationGridModels = require("./../models/LocationGridModel");
const LocationUserModels = require("./../models/LocationUserModel");
const { MapData } = require("../models/MapDataModel");
const { News } = require("./../models/NewsModel");
const { PublicResourcesData } = require("../models/PublicResourcesModel");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const { Symptom } = require("./../models/Symptom");
const SymptomUserModel = require("./../models/SymptomUser");
const { Tests } = require("../models/TestModel");
const UserModels = require("./../models/UserModel");
const WorldDataModel = require("../models/WorldDataModel");
const EthiopiaData = require("./../models/EthiopiaDataModel");
const Population = require("../models/PopulationModel");

var root = __dirname;

//Every 4 hours
exports.update_ethiopian_statistics = async () => {
  let phone_no = await StatisticsResource.findOne({
    language: "English",
    title: "ethiopia-phone-call",
  });
  phone_no = phone_no.fields[0];

  let request_url = "https://covid19-ethiopia.qulph.com/api/data.json";
  let ethData = await axios.get(request_url);

  let data = ethData.data;
  if (data) {
    let date_str = data.tested[0].updatetimestamp.slice(0, 10).split("/");
    let date = new Date(date_str[2], date_str[1] - 1, date_str[0]);

    let ethioStat = [];
    let test = new EthiopiaData({
      _id: mongoose.Types.ObjectId(),
      region: "Ethiopia",
      region_code: "ET",
      phone_number: phone_no["Ethiopia"],
      test: data.tested[0].totalindividualstested,
      date: date,
    });
    ethioStat.push(test);
    for (var index = 0; index < data.statewise.length; index++) {
      let case_data = data.statewise[index];
      let state = case_data.state == "Total" ? "Ethiopia" : case_data.state;
      let region_code =
        case_data.statecode == "TT" ? "ET" : case_data.statecode;

      ethioStat.push(
        new EthiopiaData({
          _id: mongoose.Types.ObjectId(),
          region: state,
          region_code: region_code,
          phone_number: phone_no[region_code],
          total: {
            confirmed: case_data.confirmed,
            recovered: case_data.recovered,
            deaths: case_data.deaths,
            active: case_data.active,
          },
          daily: {
            confirmed: case_data.deltaconfirmed,
            recovered: case_data.deltarecovered,
            deaths: case_data.deltadeaths,
          },
          date: date,
        })
      );
    }

    if (ethioStat.length > 1) {
      try {
        await EthiopiaData.collection.drop();
      } catch (err) {
        console.log(err.toString());
      }
      try {
        await EthiopiaData.insertMany(ethioStat);
      } catch (err) {
        console.log(err.toString());
      }
    }
  }
  console.log("update-completed");
};

//Every 4 hours
exports.update_location_grids = async (demo = false, stress = false) => {
  if (demo && demo == "true") {
    var LocationGrid = LocationGridModels.DemoLocationGrid;
    var LocationUser = LocationUserModels.DemoLocationUser;
    var SymptomUser = SymptomUserModel.DemoSymptomUser;
    var User = UserModels.DemoUser;
  } else if (stress && stress == "true") {
    var LocationGrid = LocationGridModels.StressLocationGrid;
    var LocationUser = LocationUserModels.StressLocationUser;
    var SymptomUser = SymptomUserModel.StressSymptomUser;
    var User = UserModels.StressUser;
  } else {
    var LocationGrid = LocationGridModels.LocationGrid;
    var LocationUser = LocationUserModels.LocationUser;
    var SymptomUser = SymptomUserModel.SymptomUser;
    var User = UserModels.User;
  }

  zoom = 10;
  let zoomLevels = { 10: 0.09, 111: 1, 1000: 9 };
  let equatorDgree = 111;
  let level = zoomLevels[zoom];

  let squareBoxes = {};

  const symptoms = await Symptom.find({});
  //Find all users and retrieve their recent locations. Latest location will help us find the specific
  //coordinates while Latest Location User will help us avoid db check if the user has any symptoms or not
  let location_users = await LocationUser.find({
    probability: {
      $gt: 0,
    },
  }).populate("user_id");
  for (let i = 0; i < location_users.length; i++) {
    console.log(
      i +
        " out of " +
        location_users.length +
        " and " +
        Object.keys(squareBoxes).length
    );
    let location_user = location_users[i];
    if (!location_user || !location_user.location || !location_user.user_id)
      continue;
    let loc = location_user.location;
    let user_id = location_user.user_id;
    //Calculate the center point of the grid after finding out the grid they place on
    let lat_index = Math.floor((loc.coordinates[1] + 90) / level);
    let latDistance = Math.sin(((-90 + lat_index * level) * Math.PI) / 180);
    let longKm = Math.cos(latDistance) * equatorDgree;
    let inc = 10 / longKm;
    let lon_index = Math.floor((loc.coordinates[0] + 180) / inc);
    let start_point_lat = -90 + lat_index * level;
    let start_point_lon = -180 + lon_index * inc;
    let end_point_lat = start_point_lat + level;
    let end_point_lon = start_point_lon + inc;
    let center_point_lat = (start_point_lat + end_point_lat) / 2;
    let center_point_lon = (start_point_lon + end_point_lon) / 2;
    let center = [center_point_lat, center_point_lon];

    //Fetch all the symptoms that user has
    const symptomuser = await SymptomUser.find({
      user_id: user_id._id,
    }).populate("symptom_id");
    const ages = User.schema.path("age_group").enumValues;
    const genders = User.schema.path("gender").enumValues;
    if (squareBoxes[center]) {
      symptomuser.forEach((item) => {
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      });
      squareBoxes[center].ages[`${user_id.age_group}`]++;
      squareBoxes[center].genders[`${user_id.gender}`]++;
    } else {
      squareBoxes[center] = new LocationGrid({
        _id: mongoose.Types.ObjectId(),
        location: {
          type: "Point",
          coordinates: [center_point_lon, center_point_lat],
        },
        value: {},
        ages: {},
        genders: {},
        zoom_level: 10,
      });
      symptoms.forEach((item) => {
        squareBoxes[center].value[`${item.name}`] = 0;
      });
      ages.forEach((item) => {
        squareBoxes[center].ages[`${item}`] = 0;
      });
      genders.forEach((item) => {
        squareBoxes[center].genders[`${item}`] = 0;
      });
      symptomuser.forEach((item) => {
        squareBoxes[center].value[`${item.symptom_id.name}`]++;
      });
      squareBoxes[center].ages[`${user_id.age_group}`]++;
      squareBoxes[center].genders[`${user_id.gender}`]++;
    }
  }
  var values = Object.keys(squareBoxes).map(function (key) {
    return squareBoxes[key];
  });
  try {
    await LocationGrid.collection.drop();
  } catch (err) {
    console.log(err.toString());
  }
  try {
    await LocationGrid.insertMany(values);
  } catch (err) {
    console.log(err.toString());
  }
};

//Every 6:30 GMT+3 time to match with John Hopkins
exports.update_map_data = async () => {
  let urls = [
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
  ];
  let map_datas = {};
  for (let ind = 0; ind < 3; ind++) {
    let url = urls[ind];
    let r = await extractResult(url);
    let date_keys = r.meta.fields.slice(4);
    let length = r.data.length;
    for (let i = 0; i < length; i++) {
      let data = r.data[i];
      if (!data["Country/Region"]) {
        continue;
      }
      let set = {};
      if (data["Province/State"]) {
        set[`${data["Province/State"]}`] = [data["Lat"], data["Long"]];
      } else {
        set[" "] = [data["Lat"], data["Long"]];
      }
      let item = new MapData({
        Data: {
          Country: data["Country/Region"],
          Unique_Provinces: set,
        },
      });
      if (!map_datas[`${data["Country/Region"]}`]) {
        date_keys.forEach((date) => {
          item.Data[`${date}`] = [data[`${date}`]];
        });
        map_datas[`${data["Country/Region"]}`] = item;
      } else {
        try {
          let current_data = map_datas[`${data["Country/Region"]}`].Data;
          date_keys.forEach((date) => {
            if (
              current_data[`${date}`] &&
              ind + 1 == current_data[`${date}`].length
            ) {
              if (!current_data[`${date}`][ind]) {
                current_data[`${date}`][ind] = 0;
              }
              current_data[`${date}`][ind] += data[`${date}`];
            } else if (!current_data[`${date}`]) {
              current_data[`${date}`] = [];
              current_data[`${date}`].push(data[`${date}`]);
            } else {
              current_data[`${date}`].push(data[`${date}`]);
            }
          });
          if (data["Province/State"]) {
            current_data.Unique_Provinces[`${data["Province/State"]}`] = [
              data["Lat"],
              data["Long"],
            ];
          } else {
            current_data.Unique_Provinces[" "] = [data["Lat"], data["Long"]];
          }
          map_datas[`${data["Country/Region"]}`].Data = current_data;
          console.log("Modified " + current_data.Country);
        } catch (err) {
          console.log(err.toString());
        }
      }
    }
    console.log("Iteration Finished");
  }
  console.log("Finished Saving Data");
  var values = Object.keys(map_datas).map(function (key) {
    return map_datas[key];
  });
  console.log(values.length);
  try {
    await MapData.collection.drop();
  } catch (err) {
    console.log(err.toString());
  }
  try {
    await MapData.insertMany(values);
  } catch (err) {
    console.log(err.toString());
  }
};

//Every day
exports.update_government_resources = async () => {
  if (!fs.existsSync(path.join(root, "assets"))) {
    fs.mkdirSync(path.join(root, "assets"));
  }

  try {
    const request = await axios.get(
      "https://data.humdata.org/api/3/action/package_show?id=acaps-covid19-government-measures-dataset"
    );
    if (request.data) {
      const download_url = request.data.result.resources[1].url;
      const result = await axios
        .get(download_url, {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "blob",
            "Keep-Alive": "true",
          },
        })
        .then((result) => {
          data = result.data;
        });
      const outputFilename = path.join(
        root,
        "assets",
        "government_measures_data" + ".xlsx"
      );
      // Create folder in current directory
      if (!fs.existsSync(path.join(root, "assets"))) {
        fs.mkdirSync(path.join(root, "assets"));
      }
      fs.writeFileSync(outputFilename, Buffer.from(data));
      await populateDatabase();
    }
  } catch (err) {
    console.log(err.toString());
  }
};

//Every day
exports.update_public_resources = async () => {
  let urls = [
    //Hospital beds (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.BEDS.ZS?downloadformat=excel",
    //Nurses and midwives (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.NUMW.P3?downloadformat=excel",
    //UHC service coverage index
    "https://api.worldbank.org/v2/en/indicator/SH.UHC.SRVS.CV.XD?downloadformat=excel",
    //Physicians (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.PHYS.ZS?downloadformat=excel",
  ];
  let data = [];
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    let url_data = await fetchResources(url);
    data.push(...url_data);
  }
  if (data.length > 0) {
    try {
      await PublicResourcesData.collection.drop();
    } catch (err) {
      console.log(err.toString());
    }
    try {
      await PublicResourcesData.insertMany(data);
    } catch (err) {
      console.log(err.toString());
    }
  }
  console.log("Finished Saving Data");
};

//Every 4 hours
exports.update_world_statistics = async () => {
  let request_url =
    "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
  let wldData = await axios.get(request_url);

  let data = wldData.data;
  if (data) {
    const options = { delimiter: ",", quote: '"' };
    data = csvjson.toObject(data, options);
    let caseData = [];
    console.log(data.length);
    for (var index = 0; index < data.length; index++) {
      let item = data[index];

      caseData.push(
        new WorldDataModel({
          _id: mongoose.Types.ObjectId(),
          Confirmed: item["Confirmed"],
          Recovered: item["Recovered"],
          Deaths: item["Deaths"],
          date: new Date(item.Date),
        })
      );
    }
    if (caseData.length > 0) {
      try {
        await WorldDataModel.collection.drop();
      } catch (err) {
        console.log(err.toString());
      }
      try {
        await WorldDataModel.insertMany(caseData, { ordered: false });
      } catch (err) {
        console.log(err.toString());
      }
    }
  }

  console.log("update-completed");
};

//Every 4 hours
exports.update_tests = async () => {
  // we will use the iso here
  request_url = "https://covid.ourworldindata.org/data/owid-covid-data.csv";
  let testData = await axios.get(request_url);
  let data = testData.data;
  let tests = [];
  if (data) {
    let options = { delimiter: ",", quote: '"' };
    data = csvjson.toObject(data, options);
    for (var index = 0; index < data.length; index++) {
      let item = data[index];
      if (item.total_tests) {
        let test = new Tests({
          _id: mongoose.Types.ObjectId(),
          country: item.location,
          country_slug: item.iso_code,
          tests: item.total_tests,
          date: item.date,
        });
        tests.push(test);
      }
    }
    if (tests.length > 0) {
      try {
        await Tests.collection.drop();
      } catch (err) {
        console.log(err.toString());
      }
      try {
        await Tests.insertMany(tests, { ordered: false });
      } catch (err) {
        console.log(err.toString());
      }
    }
  }
  console.log("Finished Saving Data");
};

exports.update_populations = async () => {
  let request_url = "https://datahub.io/core/population/r/population.json";
  let population_data = await axios.get(request_url);
  let data = population_data.data;
  if (data) {
    let populations = [];
    data.forEach((item) => {
      if (Number(item.Value) < 5) {
        console.log(item);
      } else {
        populations.push(
          new Population({
            _id: mongoose.Types.ObjectId(),
            country_name: item["Country Name"],
            population: item["Value"],
            iso3: item["Country Code"],
            Year: item["Year"],
          })
        );
      }
    });
    if (populations.length > 0) {
      try {
        await Population.collection.drop();
      } catch (err) {
        console.log(err.toString());
      }
      try {
        await Population.insertMany(populations);
      } catch (err) {
        console.log(err.toString());
      }
    }
  }
};

// Helper Fuctions

// download public resources dataset
async function fetchResources(url) {
  let data;
  let result = await axios
    .get(url, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "blob",
      },
    })
    .then((result) => {
      data = result.data;
    });
  const outputFilename = path.join(
    root,
    "assets",
    url.substring(45, 56) + ".xls"
  );
  // Create folder in current directory
  if (!fs.existsSync(path.join(root, "assets"))) {
    fs.mkdirSync(path.join(root, "assets"));
  }
  fs.writeFileSync(outputFilename, Buffer.from(data));
  let data_url = await populateResDatabase(url.substring(45, 56) + ".xls");
  return data_url;
}
// populate database with data from excel sheet
async function populateResDatabase(filePath) {
  var workbook = XLSX.readFile(path.join(root, "assets", filePath), {
    sheetStubs: true,
    cellDates: true,
  });

  var worksheet = workbook.Sheets["Data"];
  var headers = {};
  var currentRow = 0;
  var currentResource;

  var dict = {};
  // Iterate through each cell
  for (z in worksheet) {
    if (z[0] === "!" || worksheet[z].v == undefined) continue;
    if (isNaN(z[1])) {
      var col = z[0] + z[1];
      var row = parseInt(z.substring(2));
    } else {
      var col = z[0];
      var row = parseInt(z.substring(1));
    }

    var value = worksheet[z].v;

    if (isNaN(row) || row < 4) continue;
    // Headers are at row 4
    if (row == 4 && value) {
      headers[col] = value;
      continue;
    }
    if (row != currentRow) {
      // Save the previous resource
      if (
        currentResource &&
        currentResource.Country != " " &&
        currentResource.Indicator != " "
      ) {
        if (dict[`${currentResource.Country}`]) {
          dict[`${currentResource.Country}`].TimeSeries =
            currentResource.TimeSeries;
        } else {
          dict[`${currentResource.Country}`] = {
            Country: currentResource.Country,
            Indicator: currentResource.Indicator,
            TimeSeries: currentResource.TimeSeries,
          };
        }
      }
      currentResource = new PublicResourcesData({
        Country: " ",
        Indicator: " ",
        TimeSeries: {},
      });
      currentRow = row;
    }

    switch (headers[col]) {
      case "Country Name":
        currentResource.Country = value;
        break;
      case "Indicator Name":
        currentResource.Indicator = value;
        break;
    }
    // Handle the numbers bit
    if (!isNaN(headers[col])) {
      if (value) {
        currentResource.TimeSeries[headers[col]] = value;
      } else {
        currentResource.TimeSeries[headers[col]] = 0;
      }
    }
  }
  if (
    currentResource &&
    currentResource.Country !== " " &&
    currentResource.Indicator !== " "
  ) {
    if (dict[`${currentResource.Country}`]) {
      dict[`${currentResource.Country}`].TimeSeries =
        currentResource.TimeSeries;
    } else {
      dict[`${currentResource.Country}`] = {
        Country: currentResource.Country,
        Indicator: currentResource.Indicator,
        TimeSeries: currentResource.TimeSeries,
      };
    }
  }
  var values = Object.keys(dict).map(function (key) {
    return dict[key];
  });
  return values;
}
// populate news database
async function populateDatabase() {
  var workbook = XLSX.readFile(
    path.join(root, "assets", "government_measures_data.xlsx"),
    { sheetStubs: true, cellDates: true }
  );
  var worksheet = workbook.Sheets["Database"];
  var headers = {};
  var currentRow = 0;
  var currentPolicy;
  const news = [];
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
        currentPolicy.title !== " " &&
        currentPolicy.source != " " &&
        currentPolicy.country != " " &&
        currentPolicy.reference_link != " " &&
        currentPolicy.description != " "
      ) {
        news.push(currentPolicy);
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
    currentPolicy &&
    currentPolicy.title !== " " &&
    currentPolicy.source != " " &&
    currentPolicy.country != " " &&
    currentPolicy.reference_link != " " &&
    currentPolicy.description != " "
  ) {
    news.push(currentPolicy);
  }
  try {
    await News.collection.drop();
  } catch (err) {
    console.log(err.toString());
  }
  try {
    await News.insertMany(news, { ordered: false });
  } catch (err) {
    console.log(err.toString());
  }
}
// extract JHU data from csv
const extractResult = async (url) => {
  let stringCsv;
  const result = await axios
    .get(url)
    .then((response) => {
      if (response.data) {
        stringCsv = response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (!stringCsv) {
    return res.status(500).send("Couldn't fetch data");
  }
  let r = Papa.parse(stringCsv, {
    header: true,
    delimiter: ",",
    dynamicTyping: true,
  });
  return r;
};
