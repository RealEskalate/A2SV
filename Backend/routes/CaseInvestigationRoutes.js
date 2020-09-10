var express = require("express");
var router = express.Router();

var caseInvestigationController = require('../controllers/CaseInvestigationController');
const verifyToken = require("../middlewares/auth.js").verifyToken;

router.get('/api/case_investigations', verifyToken, caseInvestigationController.getCaseInvestigations)
router.get('/api/case_investigations/patients/', verifyToken, caseInvestigationController.get_patients_by_status)
router.get('/api/case_investigations/:id', verifyToken, caseInvestigationController.getCaseInvestigationById)
router.patch('/api/case_investigations/', verifyToken, caseInvestigationController.addOrUpdateCaseInvestigation)
router.delete('/api/case_investigations/:id', verifyToken, caseInvestigationController.deleteCaseInvestigation)

module.exports = router;
