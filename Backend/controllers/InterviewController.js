const { Interview } = require("../models/InterviewModel");
const { validationSchema } = require("../models/InterviewModel");
const mongoose = require("mongoose");
const { trace } = require("@hapi/joi");

// Get Interview, by filters if any
exports.getInterviews = async (req, res) => {
    const filter = {};
    var selection = {};
    // We can add more filters upon request
    if (req.query.patient) {
        filter.patient_id = req.query.patient;
    }
    if (req.query.clinical_review) {
        filter.clinical_review = req.query.clinical_review;
    }
    if (req.query.completion_date) {
        filter.completion_date = { $gte: new Date(req.query.completion_date) };
    }
    if (req.query.interviewer_id) {
        filter["interview_report.interviewer_id"] = { $gte: new Date(req.query.completion_date) };
    }

    if (req.query.select) {
        selection[req.query.select] = 1;
    }
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 30;
    try {
        const interviews = await Interview.find(filter, selection, { skip: page - 1, limit: size * 1 });
        const populated = await Interview.populate(interviews, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'TestReport', path: 'test_report', select: '_id test_status' },
            { model: 'User', path: 'interview_report.interviewer_id', select: '_id username' }
        ]);
        const result = {
            data_count: await Interview.countDocuments(filter),
            page_size: size,
            current_page: page,
            data: populated
        };
        return res.send(result);
    } catch (error) {
        res.status(500).send(error.toString())
    }
}

// Get Interview by id
exports.getInterviewById = async (req, res) => {
    const { id } = req.params;
    var selection = {};

    if (req.query.select) {
        selection[req.query.select] = 1;
    }

    try {
        const interviews = await Interview.find({ _id: mongoose.Types.ObjectId(id) }, selection);
        const populated = await Interview.populate(interviews, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'TestReport', path: 'test_report', select: '_id test_status' },
            { model: 'User', path: 'interview_report.interviewer_id', select: '_id username' }
        ]);
        return res.send(populated);
    } catch (error) {
        res.status(500).send(error.toString())
    }
}

// Add a new interview
exports.addInterview = async (req, res) => {
    const isInvalid = validateInterview(req.body);
    if (isInvalid) {
        return res.status(422).send("The document format is invalid \n " + isInvalid);
    }
    try {
        const interview = new Interview(req.body);
        await interview.save();
        return res.status(201).send(interview);
    } catch (error) {
        return res.status(500).send(error.toString);
    }
}

// Update interview
exports.updateInterview = async (req, res) => {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) {
        return res.status(404).send("Interview is not found");
    }
    try {
        await Interview.update({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body);
        const interview = await Interview.findById(id);
        return res.status(200).send(interview);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

// Delete interview
exports.deleteInterview = async (req, res) => {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) {
        return res.status(404).send("Interview does not exist");
    }
    try {
        await interview.remove();
        return res.send(interview);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

// Interview object validator
function validateInterview(interview) {
    const { error } = validationSchema.validate(interview);
    return error;
}
