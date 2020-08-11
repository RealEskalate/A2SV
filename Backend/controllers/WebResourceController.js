const {WebResource} = require("../models/WebResourceModel");
const mongoose = require("mongoose");

exports.get_web_resource = async(req, res) => {
    const filter = {}
    if (req.query.language){
        filter.language = req.query.language;
    }else{
        filter.language = "English";
    }
    if (req.query.title){
        filter.title = req.query.title;
    }
    
    try{
        const result = await WebResource.find(filter);
        return res.send(result);
    }catch (err){
        return res.status(500).send(err.toString())
    }

}
