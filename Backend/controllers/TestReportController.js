const { TestReport } = require("../models/TestReportModel.js");
var mongoose = require("mongoose");
var UserModels = require("../models/UserModel.js");
const User = UserModels.User;
const { PatientLog } = require("../models/PatientLog.js");

// getting all test reports
exports.get_all_test_reports = async (req, res) => {
    let filter = {};

    if(req.query.user_id){
        filter.user_id = req.query.user_id;
    }

    if(req.query.reporter_id){
        filter.healthcare_worker_id = req.query.reporter_id;
    }

    if(req.query.status){
        filter.test_status = req.query.status;
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


    if(req.query.username){
        let re = new RegExp(req.query.username, 'i') 
        let userId =await User.find({username : { $regex: re }}).select('_id')

        let listOfUserId = [];

        for(var user_id in userId){
            listOfUserId.push(userId[user_id]._id)
        }
        filter.user_id= { $in: listOfUserId };
    }



    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    const testReports = await TestReport.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("user_id").populate("healthcare_worker_id");

    let result = {
        data_count: await TestReport.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: testReports,
    };

    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

// Post a test report
exports.post_test_report = async (req, res) => {

    let reporter_id=req.body.loggedInUser

    const report = new TestReport({
        _id: mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        healthcare_worker_id: reporter_id,
        test_status: req.body.test_status
    });

    //------ saving updating logs --- //
    let date = new Date();
    date.setHours(0,0,0,0);
    
    let log =await PatientLog.findOne({date:date,test_status:req.body.test_status});

    if(log){
        log.count+=1;
        await log.save();
    }else{
        await new PatientLog({
            test_status:req.body.test_status,
            date: date
        }).save();
    }
    //------ end of saving updating logs --- //

    try {
        await report.save();
        return res.send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// update a test report
exports.update_test_report = async (req, res) => {
    try {
        const report = await TestReport.findById(req.body.test_id);

        //------ saving updating logs --- //
        let date = new Date();
        date.setHours(0,0,0,0);
        const log = await PatientLog.findOne({date:date,test_status:req.body.test_status});
        
        if(log){
            log.count+=1;
            log.save();
        }else{
            await new PatientLog({
                test_status:req.body.test_status,
                date: date
            }).save();
        }
        //------ end of saving updating logs --- //

        report.test_status = req.body.test_status
        await report.save();
        
        return res.status(202).send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting a test report
exports.delete_test_report = async (req, res) => {

    try {
        const report = await TestReport.findByIdAndRemove(req.params.id);
        if (!report) {
            res.status(404).send("Report doesnt exist!");
        } else {
            res.status(204).send(report);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};