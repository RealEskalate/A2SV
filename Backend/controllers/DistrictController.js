const {DistrictModel} = require("../models/DistrictModel");
const {SymptomUser} = require("../models/SymptomUser");
const { LocationUser } = require("../models/LocationUserModel");

exports.getSymptomUsersByDistrict = async(req, res) => {
    if (!req.params.district){
        return res.status(400).send("District name not specified.");
    }

    try {
        const districtResult = await DistrictModel.findOne({name: req.params.district});
        if (districtResult){
            const resultInDistrict = await LocationUser.find({'location.district': districtResult._id});
            resultInDistrict.map(async(location_user) => await SymptomUser.find({user_id: location_user._id}))
            return res.send(resultInDistrict);
        }
        return res.status(404).send("No district by that name")
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}
