const { NewCitizenSymptoms, NewCitizenSymptomsDemo } = require("../models/NewCitizenSymptomsModel");
const { SymptomUserHistory } = require("../models/SymptomUserHistoryModel");
const { User } = require("../models/UserModel");
const { PatientLog, PatientLogDemo } = require("../models/PatientLog.js");
const { SymptomLog, SymptomLogDemo } = require("../models/SymptomLogModel");
const { DistrictModel } = require("../models/DistrictModel");
const _ = require("lodash");

const mongoose = require("mongoose");

function setStartDate(req) {
    if (req.query.start_date != null) {
        return "" + new Date(req.query.start_date).toISOString().slice(0, 10);
    } else {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return "" + date.toISOString().slice(0, 10);
    }
}

function setEndDate(req) {
    let end_date = new Date(req.query.end_date);
    let date = new Date();
    date.setHours(date.getHours() - 7 + date.getTimezoneOffset() / 60);

    if (req.query.end_date != null && end_date < date) {
        return "" + end_date.toISOString().slice(0, 10);
    } else {
        return "" + date.toISOString().slice(0, 10);
    }
}

exports.get_new_citizens_with_symptoms = async (req, res) => {
    let startDate = new Date(Date.parse(setStartDate(req) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z"));

    let newCitizenModel = (req.query.demo) ? NewCitizenSymptomsDemo : NewCitizenSymptoms;

    const new_citizens = await newCitizenModel.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    }).sort("date");
    try {
        res.send(new_citizens);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

//[Repopulation Function]
exports.prepop = async () => {
    //Fetch all symptom histories
    const symptom_histories = await SymptomUserHistory.find({});
    const dict = {};
    //For each symptomhistory entry, filter out unique dates and add them into
    //a temporary placeholder before aggregating them into the total
    symptom_histories.forEach((histories) => {
        temp = {};
        histories.events.forEach((history) => {
            date = new Date(history.start).toISOString().slice(0, 10);
            date = new Date(Date.parse(date + "T21:00:00.000Z"));
            temp[date] = 1;
        });
        Object.keys(temp).forEach((key) => {
            if (!dict[key]) {
                dict[key] = 0;
            }
            dict[key] += 1;
        });
    });
    //Convert the dictionary into a list of entries before saving them
    let prepop = Object.keys(dict).map((key) => {
        return new NewCitizenSymptoms({
            date: key,
            total: dict[key],
        });
    });

    try {
        await NewCitizenSymptoms.collection.drop();
    } catch (err) {
        console.log(err.toString);
    }
    try {
        await NewCitizenSymptoms.insertMany(prepop);
    } catch (err) {
        console.log(err.toString);
    }
};

// for new confirmed, death & test administered 
exports.ephi_test_stats = async (req, res) => {

    let filter = {
        date: {
            $gte: new Date(Date.parse(setStartDate(req) + "T21:00:00.000Z")),
            $lte: new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z")),
        }
    }

    let patientLogModel = (req.query.demo) ? PatientLogDemo : PatientLog;
    let patientLogs = await patientLogModel.find(filter).sort({ "date": 1 });
    let result = {};

    for (var index in patientLogs) {
        let log = patientLogs[index];
        let date = log.date.toISOString().slice(0, 10);

        // Populating 0s for the web graph to render
        if (!(date in result)) {
            result[date] = {
                positive: 0,
                negative: 0,
                death: 0,
                recovered: 0,
                administered: 0
            };
        }
        if (log.test_status == "Positive") {
            result[date].positive += log.count;
            result[date].administered += log.count;
        } else if (log.test_status == "Negative") {
            result[date].negative += log.count;
            result[date].administered += log.count;
        } else if (log.test_status == "Recovered") {
            result[date].recovered += log.count;
        } else if (log.test_status == "Died") {
            result[date].death += log.count;
            result[date].administered += log.count;
        }
    }
    // Populating if a date is skipped - again for the sake of the web graph
    const endDate = new Date(req.query.end_date);
    const nextDate = new Date(req.query.start_date);
    while (nextDate <= endDate) {
        const dateKey = "" + nextDate.toISOString().slice(0, 10);
        if (!(dateKey in result)) {
            result[dateKey] = {
                positive: 0,
                negative: 0,
                death: 0,
                recovered: 0,
                administered: 0
            };
        }
        nextDate.setDate(nextDate.getDate() + 1);
    }

    // Sorting the dates
    const sorted = {};
    const keys = Object.keys(result);
    keys.sort();
    keys.forEach(function (item, index) {
        sorted[item] = result[item];
    });

    return res.send(sorted);
}


exports.symptoms_count_in_district = async (req, res) => {
    let SymptomLogModel = (req.query.demo) ? SymptomLogDemo : SymptomLog

    let districts = await DistrictModel.find({}).select('name');
    let symptomLogs = await SymptomLogModel.find({}).select('current_symptoms.location.district');

    let districtDict = {}

    districts.forEach(district => districtDict[district._id] = district.name)

    let symptomsCount = {}

    symptomLogs.forEach(log => {
        if (districtDict[log.current_symptoms.location.district] in symptomsCount) {
            symptomsCount[districtDict[log.current_symptoms.location.district]] += 1
        } else {
            symptomsCount[districtDict[log.current_symptoms.location.district]] = 1
        }

    })


    let districtCount = []

    for (var name in symptomsCount) {
        if (name != "undefined") {
            districtCount.push({
                region: name,
                count: symptomsCount[name]
            })
        }

    }

    districtCount.sort((a, b) => a.count - b.count)

    res.send(districtCount)
}


