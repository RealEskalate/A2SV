const NewCitizenSymptoms = require("../models/NewCitizenSymptomsModel");
const { SymptomUserHistory } = require("../models/SymptomUserHistoryModel");
const { User } = require("../models/UserModel");

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

    const new_citizens = await NewCitizenSymptoms.find({
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
const prepop = async () => {
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
