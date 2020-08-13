const CitizenSymptom = require("../models/CitizenSymptomsModel");
const mongoose = require("mongoose");
const { SymptomUser } = require("../models/SymptomUser");
const { SymptomUserHistory } = require("../models/SymptomUserHistoryModel");
const { User } = require("../models/UserModel");

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

function parse_date(date) {
    return new Date(
        Date.parse(date.toISOString().slice(0, 10) + "T21:00:00.000Z")
    );
}
function getDates(startDate, endDate) {
    let dates = [];
    let currentDate = parse_date(startDate);
    var addDays = function (days) {
        var date = parse_date(new Date(this.valueOf()));
        date.setDate(date.getDate() + days);
        return date;
    };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}
exports.get_citizens_with_symptoms = async (req, res) => {
    let startDate = new Date(Date.parse(setStartDate(req) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z"));

    const citizens = await CitizenSymptom.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    }).sort("date");
    try {
        res.send(citizens);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

//[Repopulation Function]
exports.prepop = async () => {
    //Fetch all users
    const users = await User.distinct("_id");

    const dict = {};
    const symptom_user_histories = await SymptomUserHistory.find({});
    const symptom_users = await SymptomUser.find({});

    const user_dict = {};
    symptom_user_histories.forEach((history) => {
        history.events.forEach((event) => {
            const dates = getDates(event.start, event.end);
            if (user_dict[`${history.user_id}`] === undefined) {
                user_dict[`${history.user_id}`] = {};
            }
            dates.forEach(
                (item) => (user_dict[`${history.user_id}`][`${item}`] = 1)
            );
            user_dict[`${history.user_id}`][`${parse_date(event.start)}`] = 1;
            user_dict[`${history.user_id}`][`${parse_date(event.end)}`] = 1;
        });
    });
    symptom_users.forEach((symptom) => {
        const dates = getDates(symptom.timestamp, new Date());
        if (user_dict[`${symptom.user_id}`] === undefined) {
            user_dict[`${symptom.user_id}`] = {};
        }
        dates.forEach(
            (item) => (user_dict[`${symptom.user_id}`][`${item}`] = 1)
        );
        user_dict[`${symptom.user_id}`][`${parse_date(symptom.timestamp)}`] = 1;
        user_dict[`${symptom.user_id}`][`${parse_date(new Date())}`] = 1;
    });

    Object.keys(user_dict).forEach((key) => {
        Object.keys(user_dict[key]).forEach((item) => {
            if (dict[`${item}`] === undefined) {
                dict[`${item}`] = 0;
            }
            dict[`${item}`] += 1;
        });
    });
    //Convert the dictionary into a list of entries before saving them
    let prepop = Object.keys(dict).map((key) => {
        return new CitizenSymptom({
            date: key,
            total: dict[`${key}`],
        });
    });
    try {
        await CitizenSymptom.collection.drop();
    } catch (err) {
        console.log(err.toString);
    }
    try {
        await CitizenSymptom.insertMany(prepop);
    } catch (err) {
        console.log(err.toString);
    }
};
