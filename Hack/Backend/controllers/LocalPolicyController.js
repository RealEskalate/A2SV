const {LocalPolicy} = require("./../models/LocalPolicyModel");
const mongoose = require("mongoose");

// Get all local policies
exports.get_all_local_policies = async (req, res) => {
    const localPolicies = await LocalPolicy.find();

    try{
        res.send(localPolicies);
    }catch (err){
        res.status(500).send(err.toString());
    }
};

// Get all local policies for a country
exports.get_country_policies = async (req, res) => {

    const localPolicies = await LocalPolicy.find({ "location.country" : req.params.current_country });

    try{
        res.send(localPolicies);
    }catch (err){
        res.status(500).send(err.toString());
    }
}

// Post a local policy
exports.post_local_policy = async (req, res) => {
    const localPolicy = {
        location: {
            country: req.body.country,
            region: req.body.region
        },
        action: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        },
        source: {
            source_name: req.body.source_name,
            source_type: req.body.source_type,
            link: req.body.link
        }
    };

    try{
        await localPolicy.save();
        res.send(localPolicy);
    }catch (err) {
        res.status(500).send(err.toString());
    }
}