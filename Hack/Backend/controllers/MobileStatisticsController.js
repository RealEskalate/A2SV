const {MobileStatistics} = require("../models/MobileStatistics");
const mongoose = require("mongoose");

// return all info with optional query
exports.get_mobile_info = async (req, res) => {
    let filter = {};
    if (req.query.filter){
        filter.filter = req.query.filter;
    }
    if (req.query.language){
        filter.language = req.query.language;
    } else{
        filter.language = "English";
    }
    if (req.query.title){
        filter['descriptions.title']=req.query.title;
    }

    try{
        let documents = await MobileStatistics.find(filter);
        res.send(documents);
    }catch (err){
        res.status(500).send(err.toString());
    }
    
};

// get info by info id
exports.get_info_by_id = async (req, res) => {
    try {
        const mobileStatistics = await MobileStatistics.findById(req.params.id);
        if (!mobileStatistics){
            return res.status(400).send("Information not found")
        }
        res.send(mobileStatistics);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

// update info
exports.change_info = async (req, res) => {

    try{
        let mobileStatistics = await MobileStatistics.findOneAndUpdate(req.query.id, req.body);
        if (!mobileStatistics){
            return res.status(400).send("Parent information not found");
        }
        res.send(mobileStatistics);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

// adds fields or criterias into an information object
exports.delete_info = async (req, res) => {
    try{
        let parent = await MobileStatistics.findByIdAndDelete(req.query.id);
        if (!parent){
            return res.status(400).send("Parent information not found")
        }
        return res.status(204).send();
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.post_info = async (req, res) => {
    let mobileStatistics = new MobileStatistics({
        _id: mongoose.Types.ObjectId(),
        filter: req.body.filter,
        descriptions: req.body.descriptions,
        language: req.body.language,
    })
    try{
        await mobileStatistics.save();
        res.send(mobileStatistics);
    } catch(err){
        res.status(500).send(err.toString());
    }
}