const mongoose = require("mongoose");

const mobile_information_detail_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    link: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    resource: [{}]
});

const MobileInformationDetail = mongoose.model("MobileInformationDetail", mobile_information_detail_schema);
exports.MobileInformationDetail = MobileInformationDetail;