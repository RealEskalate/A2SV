const { ClinicalDisposition } = require("../models/ClinicalDisposition.js");
var mongoose = require("mongoose");

// getting all
exports.get_all = async (req, res) => {
    let filter = {};

    if(req.query.patient_id){
        filter.patient_id = req.query.patient_id;
    }

    if(req.query.interview_id){
        filter.interview_id = req.query.interview_id;
    }

    if(req.query.disposition){
        filter.disposition = req.query.disposition;
    }

    if(req.query.start_date){
        filter.created_at = {$gte : new Date(req.query.start_date)}
    }

    if(req.query.end_date){
        let date = new Date(req.query.end_date)
        date.setHours(23)

        if(filter.created_at!=undefined){
            Object.assign(filter.created_at, {$lte : date});
        }else{
            filter.created_at =  {$lte : date}
        }
    }

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    const clinicalDisposition = await ClinicalDisposition.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("patient_id").populate("interview_id");

    let result = {
        data_count: await ClinicalDisposition.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: clinicalDisposition,
    };

    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

// Post 
exports.post = async (req, res) => {

    const object = new ClinicalDisposition({
        _id: mongoose.Types.ObjectId(),
        patient_id: req.body.patient_id,
        interview_id:req.body.interview_id,
        disposition: req.body.disposition,
        notes: req.body.notes,
    });

    try {
        await object.save();
        return res.send(object);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// updating
exports.update = async (req, res) => {
    try {
        let clinicalDisposition = await ClinicalDisposition.update({ _id: mongoose.Types.ObjectId(req.params.id) },req.body);
        clinicalDisposition = await ClinicalDisposition.findById(req.params.id);
        
        return res.status(202).send(clinicalDisposition);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting
exports.delete = async (req, res) => {

    try {
        const result = await ClinicalDisposition.findByIdAndRemove(req.params.id);
        if (!result) {
            res.status(404).send("Not found!");
        } else {
            res.status(204).send(result);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};