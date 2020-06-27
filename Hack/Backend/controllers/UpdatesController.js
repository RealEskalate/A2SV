require("dotenv").config();
const updateFunctions = require('./../services/UpdateTasks');

exports.startUpdates = async (req, res) => {
    if (req.body.key != process.env.UPDATE_PASS){
        return res.status(401).send("You aren't authorized to access this route.");
    }
    if (req.query.interval == "short"){
        await updateFunctions.update_ethiopian_statistics();
        await updateFunctions.update_location_grids();
        await updateFunctions.update_ethiopian_statistics();
        await updateFunctions.update_tests();
        return res.status(201).send("4 hour updates added")
    }else if (req.query.interval == "daily"){
        await updateFunctions.update_government_resources();
        await updateFunctions.update_public_resources();
        return res.status(201).send("Daily hour updates added")
    }else if (req.query.interval == "JHU"){
        await updateFunctions.update_map_data();
        return res.status(201).send("JHU updates added")
    }else{
        return res.status(400).send("Interval parameter not understood");
    }
}
