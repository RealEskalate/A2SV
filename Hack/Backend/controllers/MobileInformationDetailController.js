const {MobileInformationDetail} = require("../models/MobileInformationDetail");
const mongoose = require("mongoose");

// return all info with optional query
exports.get_mobile_info = async (req, res) => {
    let filter = {};
    if (req.query.link){
        filter.link = req.query.link;
    }
    if (req.query.language){
        filter.language = req.query.language;
    } else{
        filter.language = "English";
    }


    try{
        let documents = await MobileInformationDetail.find(filter);
        res.send(documents);
    }catch (err){
        res.status(500).send(err.toString());
    }
    
};

// get info by info id
exports.get_info_by_id = async (req, res) => {
    try {
        const mobileInfo = await MobileInformationDetail.findById(req.params.id);
        if (!mobileInfo){
            return res.status(400).send("Information not found")
        }
        res.send(mobileInfo);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

// update info
exports.change_info = async (req, res) => {

    try{
        let mobileInfo = await MobileInformationDetail.findOneAndUpdate(req.query.id, req.body);
        if (!mobileInfo){
            return res.status(400).send("Parent information not found");
        }
        res.send(mobileInfo);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

// adds fields or criterias into an information object
exports.delete_info = async (req, res) => {
    try{
        let parent = await MobileInformationDetail.findByIdAndDelete(req.query.id);
        if (!parent){
            return res.status(400).send("Parent information not found")
        }
        return res.status(204).send();
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.post_info = async (req, res) => {
    let mobileInfo = new MobileInformationDetail({
        _id: mongoose.Types.ObjectId(),
        link: req.body.link,
        resource: req.body.resource,
        language: req.body.language,
    })
    try{
        await mobileInfo.save();
        res.send(mobileInfo);
    } catch(err){
        res.status(500).send(err.toString());
    }
}