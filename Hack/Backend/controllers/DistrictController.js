const {DistrictModel} = require("../models/DistrictModel");
const {User} = require("../models/UserModel");
const {SymptomUser} = require("../models/SymptomUser");

exports.getSymptomUsersByDistrict = async(req, res) => {
    if (!req.param.district){
        return res.status(400).send("District name not specified.");
    }

    try {
        const districtResult = await DistrictModel.findOne({name: req.param.district});
        if (districtResult){
            const resultInDistrict = await User.find({district: districtResult._id});
            resultInDistrict.map(async(user) => await SymptomUser.find({user_id: user._id}))
            return res.send(resultInDistrict);
        }
        return res.status(404).send("No district by that name")
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}