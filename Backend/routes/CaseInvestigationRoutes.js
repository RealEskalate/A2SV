var express = require("express");
var router = express.Router();

var caseInvestigationController = require('../controllers/CaseInvestigationController');

router.get('/api/case_investigation', caseInvestigationController.getCaseInvestigations)
router.get('/api/case_investigation/:id', caseInvestigationController.getCaseInvestigationById)
router.patch('/api/case_investigation/', caseInvestigationController.addOrUpdateCaseInvestigation)
router.delete('/api/case_investigation/:id', caseInvestigationController.deleteCaseInvestigation)

module.exports = router;
