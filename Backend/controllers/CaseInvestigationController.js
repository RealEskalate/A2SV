const CaseInvestigation = require("../models/CaseInvestigation");

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
    const size = parseInt(req.query.size) || 30;
    try {
        const investigations = await CaseInvestigation.find(filter, {}, { skip: page - 1, limit: size })
        const result = await CaseInvestigation.populate(investigations, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'User', path: 'assigned_to', select: '_id username' }
        ]);
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
            const investigation = new CaseInvestigation(req.body);
            await investigation.save();
            return res.status(201).send(investigation);
        }
        investigation.set(req.body);
        await investigation.save();
        return res.send(investigation)
    } catch (error) {
        return res.status(500).send(err.toString());
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
        return res.status(500).send(err.toString());
    }
}





