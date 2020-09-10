const { CaseInvestigation } = require("../models/CaseInvestigation.js");
const mongoose = require("mongoose")
const _ = require("lodash");
const { Patient } = require("../models/Patient.js");

// Fetch all case investigations, with filters if any
exports.getCaseInvestigations = async (req, res) => {
    const filter = {};
    if (req.query.patient) {
        filter.patient_id = req.query.patient;
    }
    if (req.query.assignee) {
        filter.assigned_to = req.query.assignee;
    }
    if (req.query.assigned) {
        filter.assigned_to = req.query.assigned ? { $ne: null } : { $eq: null }
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const investigations = await CaseInvestigation.find(filter, {}, { skip: page - 1, limit: size * 1 });
        const populated = await CaseInvestigation.populate(investigations, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'User', path: 'assigned_to', select: '_id username' }
        ]);
        const result = {
            data_count: await CaseInvestigation.countDocuments(filter),
            page_size: size,
            current_page: page,
            data: populated
        };
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

// Fetch a case investigation by id
exports.getCaseInvestigationById = async (req, res) => {
    const { id } = req.params;
    try {
        const investigations = await CaseInvestigation.find({ _id: id });
        const result = await CaseInvestigation.populate(investigations, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'User', path: 'assigned_to', select: '_id username' }
        ]);
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

// Update or add a case investigation
exports.addOrUpdateCaseInvestigation = async (req, res) => {
    const id = req.query.id || null;
    try {
        const investigation = await CaseInvestigation.findById(id);
        if (!investigation) {
            const investigation = new CaseInvestigation(_.pick(req.body, ["patient_id", "assigned_to", "notes"]));
            investigation._id = mongoose.Types.ObjectId();
            await investigation.save();
            return res.status(201).send(investigation);
        }
        investigation.set(req.body);
        await investigation.save();
        return res.send(investigation)
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

// Delete case investigation
exports.deleteCaseInvestigation = async (req, res) => {
    const { id } = req.params;
    try {
        const investigation = await CaseInvestigation.findById(id);
        if (!investigation) {
            return res.status(404).send('The case investigation does not exist');
        }
        await investigation.remove();
        return res.send(investigation);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

exports.get_patients_by_status = async (req, res) => {

    const { assignee } = req.query;
    const { status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const selectedPatients = await CaseInvestigation.find({ assigned_to: mongoose.Types.ObjectId(assignee) })
        const patientIds = []

        for (var i = 0; i < selectedPatients.length; i++) {
            patientIds.push(selectedPatients[i].patient_id);
        }
        const filter = { status: status, _id: { $in: patientIds } };
        const patients = await Patient.find(filter, {}, { skip: page - 1, limit: size * 1 });

        const result = {
            data_count: await Patient.countDocuments(filter),
            page_size: size,
            current_page: page,
            data: patients
        };
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}
