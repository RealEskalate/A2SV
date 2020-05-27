const EthiopiaData = require("../models/EthiopiaDataModel");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

exports.post_ethiopia_data = async (req, res) => {
    const ethiopiaData = new EthiopiaData({
        _id: mongoose.Types.ObjectId(),
        region: req.body.region,
        amharic_region: req.body.amharic_region,
        phone_number: req.body.phone_number,
        total: req.body.total,
        recovered: req.body.recovered,
        death: req.body.death,
        active: req.body.active
    });
    try{
        await ethiopiaData.save();
        res.send(ethiopiaData);    
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.patch_ethiopia_data = async (req, res) => {
    try{
        let ethiopiaData = await EthiopiaData.findOne({region : req.body.region}) || await EthiopiaData.findById(req.body._id);
        if (!ethiopiaData){
            return res.status(400).send("Data not found")
        }
        ethiopiaData.set(req.body);
        await ethiopiaData.save();
        res.send(ethiopiaData);    
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.delete_ethiopia_data = async (req, res) => {
    try {
        const ethiopiaData = await EthiopiaData.findByIdAndDelete(req.body._id);
        if (!ethiopiaData) {
          return res.status(404).send("No item found");
        }
        res.status(201).send(ethiopiaData);
      } catch (err) {
        res.status(500).send(err.toString());
      }
    };

exports.get_ethiopia_data = async (req, res) => {
    const ethiopiaData = await EthiopiaData.find({});
    try {
        res.send(ethiopiaData);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.get_ethiopia_data_by_id = async (req, res) => {
    try {
        const ethiopiaData = await EthiopiaData.findById(req.params.id);
        if(!ethiopiaData){
            return res.status(500).send("Data Not Found");
        }
        res.send(ethiopiaData);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.get_ethiopia_data_by_region = async (req, res) => {
    try {
        const ethiopiaData = await EthiopiaData.findOne({region : req.params.region});
        if(!ethiopiaData){
            return res.status(500).send("Data Not Found");
        }
        res.send(ethiopiaData);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}
