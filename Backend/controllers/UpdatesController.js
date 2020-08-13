require("dotenv").config();
const updateFunctions = require("./../services/UpdateTasks");

exports.startUpdates = async (req, res) => {
    if (req.query.key != process.env.UPDATE_PASS) {
        return res
            .status(401)
            .send("You aren't authorized to access this route.");
    }
    if (req.query.interval == "hourly") {
        try {
            await updateFunctions.get_citizen_symptoms_updates();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.get_new_citizen_symptoms_updates();
        } catch (err) {
            console.log(err.toString());
        }
        return res.status(201).send("Hourly updates added");
    } else if (req.query.interval == "short") {
        try {
            await updateFunctions.update_ethiopian_statistics();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.update_location_grids();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.update_tests();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.update_world_statistics();
        } catch (err) {
            console.log(err.toString());
        }
        return res.status(201).send("4 hour updates added");
    } else if (req.query.interval == "daily") {
        try {
            await updateFunctions.update_government_resources();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.update_public_resources();
        } catch (err) {
            console.log(err.toString());
        }
        try {
            await updateFunctions.update_map_data();
        } catch (err) {
            console.log(err.toString());
        }
        return res.status(201).send("Daily updates added");
    } else if (req.query.interval == "monthly") {
        try {
            await updateFunctions.update_populations();
        } catch (err) {
            console.log(err.toString());
        }
        return res.status(201).send("Monthly updates added");
    } else {
        return res.status(400).send("Interval parameter not understood");
    }
};
