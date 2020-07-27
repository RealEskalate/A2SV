const { PublicResourcesData } = require("../models/PublicResourcesModel");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
exports.getPublicResources = async (req, res) => {
  let isoToCountry= await StatisticsResource.findOne({
    language: "English",
    title: "countries-name-public-resource",
  });
  
  isoToCountry= isoToCountry.fields[0]
  req.params.country= isoToCountry[ req.params.country ]
  // end of country translation

  let titles = null;
  if (req.query.language) {
    titles = await StatisticsResource.findOne({
      language: req.query.language,
      title: "public-resource",
    });
  }
  if (!titles) {
    titles = await StatisticsResource.findOne({
      language: "English",
      title: "public-resource",
    });
  }
  if (titles) {
    titles = titles.fields[0];
  } else {
    titles = {
      "Physicians (per 1,000 people)": "Physicians",
      "Nurses and midwives (per 1,000 people)": "Health Workers",
      "Hospital beds (per 1,000 people)": "Hospital Beds",
      "UHC service coverage index": "UHC service coverage index",
    };
  }

  let result;
  try {
    result = await PublicResourcesData.find({ Country: req.params.country });
    let reorderedResult = [{}, {}, {}, {}];
    result.forEach((item) => {
      switch (item.Indicator) {
        case "Physicians (per 1,000 people)":
          item.Indicator = titles[item.Indicator];
          reorderedResult[0] = item;
          break;
        case "Nurses and midwives (per 1,000 people)":
          item.Indicator = titles[item.Indicator];
          reorderedResult[1] = item;
          break;
        case "Hospital beds (per 1,000 people)":
          item.Indicator = titles[item.Indicator];
          reorderedResult[2] = item;
          break;
        case "UHC service coverage index":
          item.Indicator = titles[item.Indicator];
          reorderedResult[3] = item;
      }
    });
    return res.send(reorderedResult);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
