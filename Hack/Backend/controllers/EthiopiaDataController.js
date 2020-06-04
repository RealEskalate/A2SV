const EthiopiaData = require("../models/EthiopiaDataModel");
const axios = require("axios");
const schedule = require('node-schedule');
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const mongoose = require("mongoose");


exports.get_ethiopia_data = async (req, res) => {
    let filter = {};
    let regions=null;

    if (req.query.language){
        regions= await StatisticsResource.findOne({ language:req.query.language , title: 'ethiopia-regions'});
        if (regions){regions=regions.fields[0];}
    } 

    if(req.query.test){
        filter.test={ $ne: null };
    }else{
        filter.test=null;
    }
    if(req.query.region){
        filter.region=req.query.region;
    }

    let today=new Date();
    today.setHours(0,0,0,0);
    let yesterday= new Date( today.getFullYear(),today.getMonth(),today.getDate()-1)

    try {
        filter.date={ $gte: today};
        var ethiopiaData = await EthiopiaData.find(filter);
        if (!ethiopiaData.length){
            filter.date={ $gte: yesterday};
            ethiopiaData = await EthiopiaData.find(filter);
        }

        for (var index=0; index<ethiopiaData.length;index++){
            let data= ethiopiaData[index];
            if (regions){
                data.region=regions[data.region];
            }
        }
        res.send(ethiopiaData);
    }catch(err){
        res.status(500).send(err.toString());
    } 
};



let update_db = async function() {
    let phone_no= await StatisticsResource.findOne({ language: 'English', title: 'ethiopia-phone-call'});
    phone_no=phone_no.fields[0];

    let request_url = "https://covid19-ethiopia.qulph.com/api/data.json";
    let ethData = await axios.get(request_url);

    let data = ethData.data;
    if (data) {
        let date_str= data.tested[0].updatetimestamp.slice(0,10).split('/')
        let date= new Date(date_str[2],date_str[1]-1,date_str[0]);

        let exists= await EthiopiaData.findOne({ date: date})
        if (exists){
            await EthiopiaData.deleteMany({ date: { $gte:date} });
        }

        let test= new EthiopiaData({
            _id: mongoose.Types.ObjectId(),
            region:"Ethiopia",
            phone_number:phone_no["Ethiopia"],
            test: data.tested[0].totalindividualstested,
            date: date
        })
        await test.save();


        for (var index = 0; index < data.statewise.length; index++) {
            let case_data = data.statewise[index];
            let state=(case_data.state=="Total")? "Ethiopia": case_data.state;

            var ethiopia= new EthiopiaData({
                _id: mongoose.Types.ObjectId(),
                region: state,
                phone_number: phone_no[state],
                total:{
                    'confirmed': case_data.confirmed,
                    'recovered': case_data.recovered,
                    'deaths': case_data.deaths,
                    'active': case_data.active
                },
                daily:{
                    'confirmed': case_data.deltaconfirmed,
                    'recovered': case_data.deltarecovered,
                    'deaths': case_data.deltadeaths,
                },
                date: date
            })
            await ethiopia.save();
        }
    }
    console.log("update-completed")
};
// Schedules fetching every 4 hours
schedule.scheduleJob('0 */4 * * *', async function() {
    await update_db();
});