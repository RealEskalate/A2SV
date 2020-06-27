const Papa = require("papaparse");
const axios = require("axios");
const { MapData } = require("../models/MapDataModel");

const schedule = require("node-schedule");
//Populate DB once
exports.getMapData = async (req, res) => {
  try {
    let map_data = await MapData.find({});
    if (!map_data || map_data.length == 0) {
      await updateDb();
      map_data = await MapData.find();
    }
    let result = [];
    for (let i = 0; i < map_data.length; i++) {
      let data = map_data[i];
      if (data.Data.Country != null) {
        let provinces = data.Data.Unique_Provinces;
        let lat = 0;
        let long = 0;
        Object.keys(provinces).forEach((item) => {
          lat += provinces[item][0];
          long += provinces[item][1];
        });
        lat /= Object.keys(provinces).length;
        long /= Object.keys(provinces).length;
        let map_data_item = data.Data;
        map_data_item.lat = lat;
        map_data_item.long = long;
        delete map_data_item["Unique_Provinces"];
        result.push(map_data_item);
      }
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err.toString());
    return res.status(500).send(err);
  }
};

// Schedules fetching everyday
const run_updates = () => {
  let rule = new schedule.RecurrenceRule();
  rule.hour = 6;
  rule.minute = 30;
  rule.tz = "Africa/Nairobi";
  schedule.scheduleJob(rule, async function () {
    await updateDb();
  });
};
exports.run_updates = run_updates;
run_updates();

updateDb = async () => {
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
