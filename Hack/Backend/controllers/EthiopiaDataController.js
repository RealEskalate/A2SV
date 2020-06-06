const EthiopiaData = require("../models/EthiopiaDataModel");
const axios = require("axios");
const schedule = require('node-schedule');
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const mongoose = require("mongoose");


exports.get_ethiopia_data = async (req, res) => {
    await update_db();
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
    if(req.query.region_code){
        filter.region_code=req.query.region_code;
    }

    try {
        var ethiopiaData = await EthiopiaData.find(filter);

        for (var index=0; index<ethiopiaData.length;index++){
            let data= ethiopiaData[index];
            if (regions){
                data.region=regions[data.region_code];
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

        await EthiopiaData.collection.drop();
       
        let test= new EthiopiaData({
            _id: mongoose.Types.ObjectId(),
            region:"Ethiopia",
            region_code:'ET',
            phone_number:phone_no["Ethiopia"],
            test: data.tested[0].totalindividualstested,
            date: date
        })
        await test.save();

        let ethioStat=[]

        for (var index = 0; index < data.statewise.length; index++) {
            let case_data = data.statewise[index];
            let state=(case_data.state=="Total")? "Ethiopia": case_data.state;
            let region_code= (case_data.statecode=="TT")? "ET":case_data.statecode;
            
            ethioStat.push( new EthiopiaData({
                _id: mongoose.Types.ObjectId(),
                region: state,
                region_code:region_code,
                phone_number: phone_no[region_code],
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
            }));
        }
        await EthiopiaData.insertMany(ethioStat);
    }
    console.log("update-completed")
};
// Schedules fetching every 4 hours
schedule.scheduleJob('0 */4 * * *', async function() {
    await update_db();
});