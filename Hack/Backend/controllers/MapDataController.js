const Papa = require("papaparse")
const axios = require("axios");
const {MapData} = require("../models/MapDataModel");

const schedule = require('node-schedule');
//Populate DB once
exports.getMapData = async(req, res)=>{
    try{
        let map_data = await MapData.find({});
        if(!map_data || map_data.length==0){
            await populateDataOnce();
            map_data = await MapData.find();
        }
        return res.status(200).send(map_data);
    }
    catch(err){
        return res.status(500).send(err);
    }
}

// Schedules fetching everyday
const run_updates = () => {
    schedule.scheduleJob('0 0 * * *', async function () {
        await updateDb();
    });
};

updateDb = async()=>{
    let urls = [
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
    ];
    let criterias = [
        'CONFIRMED',
        'DEATHS',
        'RECOVERED'
    ];
    for(let i = 0; i<3; i++){
        let url = urls[i];
        let criteria = criterias[i];
        let r = await extractResult(url);
        let date_keys = r.meta.fields.slice(4);
        let last_date = date_keys[date_keys.length-1];
        let length = r.data.length;
        for(let i = 0; i<length; i++){
            let data = r.data[i];
            try{
                let map_data = await MapData.findOne({
                    State: data["Province/State"],
                    Country: data["Country/Region"],
                    Status: criteria, 
                });
                let ts = map_data.TimeSeries;
                ts[`${last_date}`] = data[`${last_date}`];
                map_data.set({
                    TimeSeries: ts
                })
                map_data.markModified('TimeSeries');
                await map_data.save();
                map_data = await MapData.findOne({
                    State: data["Province/State"],
                    Country: data["Country/Region"],
                    Status: criteria, 
                });                
            }
            catch(err){
                console.log(r.data[i]);
            }
        }
    }
    console.log("Finished Updating Data");
}


populateDataOnce = async()=>{
    let urls = [
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
    ];
    let criterias = [
        'CONFIRMED',
        'DEATHS',
        'RECOVERED'
    ];
    let check = await MapData.find({});
    if(check && check.length>0){
        await MapData.collection.drop();
    }
    for(let i = 0; i<3; i++){
        let url = urls[i];
        let criteria = criterias[i];
        let r = await extractResult(url);
        let date_keys = r.meta.fields.slice(4);
        let length = r.data.length;
        for(let i = 0; i<length; i++){
            let data = r.data[i];
            let item = new MapData({
                State: data["Province/State"],
                Country: data["Country/Region"],
                Lat: data["Lat"],
                Long: data["Long"],
                Status: criteria,
            });
            item.TimeSeries = {};
            date_keys.forEach((date)=>{
                item.TimeSeries[date] = data[`${date}`]
            });
            try{
                await item.save();            
            }
            catch(err){
                console.log(r.data[i]);
            }
        }
    }
    console.log("Finished Saving Data");
}

const extractResult = async(url) => {
    let stringCsv;
    const result = await axios.get(url)
        .then(response => {
        if (response.data) {
            stringCsv = response.data;
        }
        })
        .catch(error => {
            console.log(error);
        });
    if(!stringCsv){
        return res.status(500).send("Couldn't fetch data");
    }
    let r = Papa.parse(stringCsv,{
        header:true,
        delimiter: ',',
        dynamicTyping: true,
    });
    return r;
}
