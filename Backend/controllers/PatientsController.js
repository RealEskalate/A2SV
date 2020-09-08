const { Patient } = require("../models/Patient.js");
var mongoose = require("mongoose");

// getting all patients
exports.get_all_patients = async (req, res) => {
    let filter = {};

    if(req.query.user_id){
        filter.user_id = req.query.user_id;
    }

    if(req.query.name){
        let re = new RegExp(req.query.name, 'i') 
        Object.assign(filter,
            {$or:[
                {first_name : { $regex: re }},
                {last_name : { $regex: re }}
            ]}
        );
    }

    if(req.query.phone_number){
        filter.phone_number = req.query.phone_number;
    }

    if(req.query.language){
        filter.language = req.query.language;
    }

    if(req.query.gender){
        filter.gender = req.query.gender;
    }

    if(req.query.location){
        let re = new RegExp(req.query.location, 'i') 

        Object.assign(filter,
            {$or:[
                {woreda : { $regex: re }},
                {street_address : { $regex: re }},
                {city : { $regex: re }},
                {state : { $regex: re }}
            ]}
        );
    }

    if(req.query.below_age){
        let date = new Date(2020,0,1);
        date.setFullYear(date.getFullYear() - req.query.below_age )
        filter.dob = {$gte : date}
    }

    if(req.query.above_age){
        let date = new Date(2020,11,31);
        date.setFullYear(date.getFullYear() - req.query.above_age )
        filter.dob = {$lte : date}
    }

    if(req.query.sms_status!=undefined){
        filter.sms_status = req.query.sms_status
    }

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    const patients = await Patient.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("user_id");

    let result = {
        data_count: await Patient.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: patients,
    };

    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

// get single patient
exports.get_patient_by_id = async(req,res) => {
    const patient = await Patient.findById(req.params.id);

    try {
        return res.send(patient);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};

// Post a patient
exports.post_patient_data = async (req, res) => {

    const patient = new Patient(req.body);
    patient._id= mongoose.Types.ObjectId();

    try {
        await patient.save();
        return res.send(patient);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// update a patient
exports.update_patient = async (req, res) => {
    try {
        let oldData = await Patient.findById(req.params.id);
        let patient = await Patient.update({ _id: mongoose.Types.ObjectId(req.params.id) },req.body);
        patient = await Patient.findById(req.params.id);
        // history

        if( patient.status != oldData.status && oldData.updated_at != patient.updated_at ){
            patient.history.push({
                start_date:oldData.updated_at,
                end_date:patient.updated_at,
                status:oldData.status,
            })
            patient.save();
        }
        
        return res.status(202).send(patient);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting a patient
exports.delete_patient = async (req, res) => {

    try {
        const patient = await Patient.findByIdAndRemove(req.params.id);
        if (!patient) {
            res.status(404).send("Patient doesnt exist!");
        } else {
            res.status(204).send(patient);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};