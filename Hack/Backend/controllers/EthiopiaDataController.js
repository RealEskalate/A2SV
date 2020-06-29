const EthiopiaData = require("../models/EthiopiaDataModel");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const mongoose = require("mongoose");

exports.get_ethiopia_data = async (req, res) => {
  let filter = {};
  let regions = null;

  if (req.query.language) {
    regions = await StatisticsResource.findOne({
      language: req.query.language,
      title: "ethiopia-regions",
    });
    if (regions) {
      regions = regions.fields[0];
    }
  }

  if (req.query.test) {
    filter.test = { $ne: null };
  } else {
    filter.test = null;
  }
  if (req.query.region_code) {
    filter.region_code = req.query.region_code;
  }
  try {
    var ethiopiaData = await EthiopiaData.find(filter);

    for (var index = 0; index < ethiopiaData.length; index++) {
      let data = ethiopiaData[index];
      if (regions) {
        data.region = regions[data.region_code];
      }
    }
    res.send(ethiopiaData);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
