const Papa = require("papaparse");
const axios = require("axios");
const { MapData } = require("../models/MapDataModel");

const schedule = require("node-schedule");
//Populate DB once
exports.getMapData = async (req, res) => {
  try {
    let map_data = await MapData.find({});
    if (!map_data || map_data.length == 0) {
      await populateDataOnce();
      map_data = await MapData.find();
    }
    let result = []
    for(let i = 0; i<map_data.length; i++){
      let data = map_data[i];
      if(data.Data.Country!=null){
        let provinces = data.Data.Unique_Provinces
        let lat = 0
        let long = 0
        Object.keys(provinces).forEach((item)=>{
          lat+=provinces[item][0]
          long+=provinces[item][1]
        })
        lat /= Object.keys(provinces).length
        long /= Object.keys(provinces).length
        let map_data_item = data.Data
        map_data_item.lat = lat
        map_data_item.long = long
        delete map_data_item["Unique_Provinces"]
        result.push(map_data_item)
      }
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
};

// Schedules fetching everyday
const run_updates = () => {
  schedule.scheduleJob({hour: 06, minute: 00}, async function () {
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
  const check = await extractResult(urls[0]);
  let check_date = check.meta.fields.slice(4)[check.meta.fields.slice(4).length-1];
  let already_in = await MapData.find({});
  for(let i = 0; i<already_in.length; i++){
    let map_item = already_in[i]
    let map_item_data = map_item.Data
    if(map_item_data[`${check_date}`]){
      delete map_item_data[`${check_date}`]
      map_item.set({
        Data: map_item_data
      })
      map_item.markModified("Data");
      await map_item.save();     
    }
  }
  console.log("Removed and Cleared Last Date Values");


  for (let ind = 0; ind < 3; ind++) {
    let url = urls[ind];
    let r = await extractResult(url);
    let date_keys = r.meta.fields.slice(4);
    let length = r.data.length;
    let last_date = date_keys[date_keys.length - 1];
    for (let i = 0; i < length; i++) {
      let data = r.data[i];
      let map_data = await MapData.findOne({
        "Data.Country": data["Country/Region"],
      });      
      if (map_data) {
        try {
          let current_data = map_data.Data
          if(current_data[`${last_date}`] && ind+1==current_data[`${last_date}`].length){
            if(!current_data[`${last_date}`][ind]){
              current_data[`${last_date}`][ind] = 0
            }
            current_data[`${last_date}`][ind]+=data[`${last_date}`];
          }
          else if(!current_data[`${last_date}`]){
            current_data[`${last_date}`]=[];
            current_data[`${last_date}`].push(data[`${last_date}`]);
          }
          else{
            current_data[`${last_date}`].push(data[`${last_date}`]);
          }
          map_data.set({
            Data: current_data
          })
          map_data.markModified("Data");
          await map_data.save();
        } catch (err) {
          console.log(err);
        }
      }
    }
    console.log("Iteration Finished");
  }
  console.log("Finished Saving Data");
};

populateDataOnce = async () => {
  let urls = [
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv",
  ];
  let check = await MapData.find({});
  if (check && check.length > 0) {
    await MapData.collection.drop();
  }
  for (let ind = 0; ind < 3; ind++) {
    let url = urls[ind];
    let r = await extractResult(url);
    let date_keys = r.meta.fields.slice(4);
    let length = r.data.length;
    for (let i = 0; i < length; i++) {
      let data = r.data[i];
      let set = {};
      if(data["Province/State"]){
        set[`${data['Province/State']}`] = [data["Lat"], data["Long"]]
      }
      else{
        set[' '] = [data["Lat"], data["Long"]]
      }
      let item = new MapData({
        Data: {
          Country: data["Country/Region"],
          Unique_Provinces: set
        }
      });
      if(!data["Country/Region"]){
        continue
      }
      let map_data = await MapData.findOne({
        "Data.Country": data["Country/Region"],
      });
      if (!map_data) {
        date_keys.forEach((date) => {
          item.Data[`${date}`] = [data[`${date}`]];
        });
        try {
          await item.save();
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          let current_data = map_data.Data
          date_keys.forEach((date) => {
            if(current_data[`${date}`] && ind+1==current_data[`${date}`].length){
              if(!current_data[`${date}`][ind]){
                current_data[`${date}`][ind] = 0
              }
              current_data[`${date}`][ind]+=data[`${date}`];
            }
            else if(!current_data[`${date}`]){
              current_data[`${date}`]=[];
              current_data[`${date}`].push(data[`${date}`]);
            }
            else{
              current_data[`${date}`].push(data[`${date}`]);
            }  
          });
          if(data["Province/State"]){
            current_data.Unique_Provinces[`${data['Province/State']}`] = [data["Lat"], data["Long"]]
          }
          else{
            current_data.Unique_Provinces[' '] = [data["Lat"], data["Long"]]
          }
          map_data.set({
            Data: current_data
          })
          map_data.markModified("Data");
          await map_data.save();
          console.log("Modified " + current_data.Country);
        } catch (err) {
          console.log(err);
        }
      }
    }
    console.log("Iteration Finished");
  }
  console.log("Finished Saving Data");
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
