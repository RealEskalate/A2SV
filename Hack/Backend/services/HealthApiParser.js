const axios = require("axios");
const { MapData } = require("../models/MapDataModel");
const { Tests } = require("../models/TestModel");
const WorldDataModel = require("../models/WorldDataModel");

const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const Population = require("../models/PopulationModel");

const getRate = (criteria, startDate, endDate, res, respond) => {
  axios
    .get("https://covidtracking.com/api/v1/us/daily.json")
    .then((response) => {
      let stats = [];
      let datas = response.data;
      datas.forEach((data) => {
        let stat = {
          t: new Date(Date.parse(data.dateChecked)),
        };
        if (criteria === "Hospitalization") {
          stat.y = data.hospitalizedCurrently || 0;
        } else if (criteria === "ICU") {
          stat.y = data.inIcuCurrently || 0;
        }
        stats.push(stat);
      });

      let filteredStats = stats.filter(function (stat) {
        let date = new Date(stat.t);
        return date >= startDate && date <= endDate;
      });
      respond(res, filteredStats);
    })
    .catch((err) => {
      console.log(err.toString());
      respond(res, null, 500);
    });
};

exports.getCriticalStatistics = (req, res, respond) => {
  let startDate = new Date(Date.parse(setStartDate(req) + "T21:00:00.000Z"));
  let endDate = new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z"));
  getRate(req.query.criteria, startDate, endDate, res, respond);
};

exports.getHealthStatistics = (req, res, respond, rates = false) => {
  let startDate = new Date(Date.parse(setStartDate(req)));
  let endDate = new Date(Date.parse(setEndDate(req)));
  if (req.query.daily) {
    startDate.setDate(startDate.getDate() - 1);
  }
  getCountryStat(startDate, endDate, req, res, respond, rates);
};

function setStartDate(req) {
  if (req.query.start_date != null) {
    return "" + new Date(req.query.start_date).toISOString().slice(0, 10);
  } else {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return "" + date.toISOString().slice(0, 10);
  }
}

function setEndDate(req) {
  let end_date = new Date(req.query.end_date);
  let date = new Date();
  date.setHours(date.getHours() - 7 + date.getTimezoneOffset() / 60);

  if (req.query.end_date != null && end_date < date) {
    return "" + end_date.toISOString().slice(0, 10);
  } else {
    return "" + date.toISOString().slice(0, 10);
  }
}

exports.countrySlugList = async (req) => {
  let countries=null
  if(req.query.language){
    countries = await StatisticsResource.findOne({
      language: req.query.language,
      title: "countries-name",
    });
  }

  if (!countries) {
    countries = await StatisticsResource.findOne({
      language: "English",
      title: "countries-name",
    });
  }

  if (!countries){
    countries=countries_list
  }else{
    countries=countries.fields;
  }
  
  return countries;
};

const getCountryStat = async (startDate, endDate, req, res, respond, rates) => {
  let isoConverter = {
    AFG: "Afghanistan",
    ALB: "Albania",
    DZA: "Algeria",
    AND: "Andorra",
    AGO: "Angola",
    ATG: "Antigua and Barbuda",
    ARG: "Argentina",
    ARM: "Armenia",
    AUS: "Australia",
    AUT: "Austria",
    AZE: "Azerbaijan",
    BHS: "Bahamas",
    BHR: "Bahrain",
    BGD: "Bangladesh",
    BRB: "Barbados",
    BLR: "Belarus",
    BEL: "Belgium",
    BLZ: "Belize",
    BEN: "Benin",
    BTN: "Bhutan",
    BOL: "Bolivia",
    BIH: "Bosnia and Herzegovina",
    BWA: "Botswana",
    BRA: "Brazil",
    BRN: "Brunei",
    BGR: "Bulgaria",
    BFA: "Burkina Faso",
    MMR: "Burma",
    BDI: "Burundi",
    CPV: "Cabo Verde",
    KHM: "Cambodia",
    CMR: "Cameroon",
    CAN: "Canada",
    CAF: "Central African Republic",
    TCD: "Chad",
    CHL: "Chile",
    CHN: "China",
    COL: "Colombia",
    COM: "Comoros",
    COD: "Congo (Brazzaville)",
    COG: "Congo (Kinshasa)",
    CRI: "Costa Rica",
    CIV: "Cote d'Ivoire",
    HRV: "Croatia",
    CUB: "Cuba",
    CYP: "Cyprus",
    CZE: "Czechia",
    DNK: "Denmark",
    JPN: "Japan",
    DJI: "Djibouti",
    DMA: "Dominica",
    DOM: "Dominican Republic",
    ECU: "Ecuador",
    EGY: "Egypt",
    SLV: "El Salvador",
    GNQ: "Equatorial Guinea",
    ERI: "Eritrea",
    EST: "Estonia",
    SWZ: "Eswatini",
    ETH: "Ethiopia",
    FJI: "Fiji",
    FIN: "Finland",
    FRA: "France",
    GAB: "Gabon",
    GMB: "Gambia",
    GEO: "Georgia",
    DEU: "Germany",
    GHA: "Ghana",
    GRC: "Greece",
    GRD: "Grenada",
    GTM: "Guatemala",
    GIN: "Guinea",
    GNB: "Guinea-Bissau",
    GUY: "Guyana",
    HTI: "Haiti",
    VAT: "Holy See",
    HND: "Honduras",
    HUN: "Hungary",
    ISL: "Iceland",
    IND: "India",
    IDN: "Indonesia",
    IRN: "Iran",
    IRQ: "Iraq",
    IRL: "Ireland",
    ISR: "Israel",
    ITA: "Italy",
    JAM: "Jamaica",
    JOR: "Jordan",
    KAZ: "Kazakhstan",
    KEN: "Kenya",
    KOR: "Korea, South",
    RKS: "Kosovo",
    KWT: "Kuwait",
    KGZ: "Kyrgyzstan",
    LAO: "Laos",
    LVA: "Latvia",
    LBN: "Lebanon",
    LBR: "Liberia",
    LBY: "Libya",
    LIE: "Liechtenstein",
    LTU: "Lithuania",
    LUX: "Luxembourg",
    MDG: "Madagascar",
    MWI: "Malawi",
    MYS: "Malaysia",
    MDV: "Maldives",
    MLI: "Mali",
    MLT: "Malta",
    MRT: "Mauritania",
    MUS: "Mauritius",
    MEX: "Mexico",
    MDA: "Moldova",
    MCO: "Monaco",
    MNG: "Mongolia",
    MNE: "Montenegro",
    MAR: "Morocco",
    MOZ: "Mozambique",
    USA: "US",
    NAM: "Namibia",
    NPL: "Nepal",
    NLD: "Netherlands",
    NZL: "New Zealand",
    NIC: "Nicaragua",
    NER: "Niger",
    NGA: "Nigeria",
    MKD: "North Macedonia",
    NOR: "Norway",
    OMN: "Oman",
    PAK: "Pakistan",
    PAN: "Panama",
    PNG: "Papua New Guinea",
    PRY: "Paraguay",
    PER: "Peru",
    PHL: "Philippines",
    POL: "Poland",
    PRT: "Portugal",
    QAT: "Qatar",
    ROU: "Romania",
    RUS: "Russia",
    RWA: "Rwanda",
    KNA: "Saint Kitts and Nevis",
    LCA: "Saint Lucia",
    VCT: "Saint Vincent and the Grenadines",
    SMR: "San Marino",
    STP: "Sao Tome and Principe",
    SAU: "Saudi Arabia",
    SEN: "Senegal",
    SRB: "Serbia",
    SYC: "Seychelles",
    SLE: "Sierra Leone",
    SGP: "Singapore",
    SVK: "Slovakia",
    SVN: "Slovenia",
    SOM: "Somalia",
    ZAF: "South Africa",
    SSD: "South Sudan",
    ESP: "Spain",
    LKA: "Sri Lanka",
    SDN: "Sudan",
    SUR: "Suriname",
    SWE: "Sweden",
    CHE: "Switzerland",
    SYR: "Syria",
    TWN: "Taiwan*",
    TJK: "Tajikistan",
    TZA: "Tanzania",
    THA: "Thailand",
    TLS: "Timor-Leste",
    TGO: "Togo",
    TTO: "Trinidad and Tobago",
    TUN: "Tunisia",
    TUR: "Turkey",
    UGA: "Uganda",
    UKR: "Ukraine",
    ARE: "United Arab Emirates",
    GBR: "United Kingdom",
    URY: "Uruguay",
    UZB: "Uzbekistan",
    VEN: "Venezuela",
    VNM: "Vietnam",
    PSE: "West Bank and Gaza",
    ESH: "Western Sahara",
    YEM: "Yemen",
    ZMB: "Zambia",
    ZWE: "Zimbabwe",
    USA: "US",
  };

  const criteria = req.query.criteria;
  const country = isoConverter[req.query.country];

  let caseData = [];
  let dailyConfirmed = {};

  if (criteria == "Tests") {
    let testData = await Tests.find({
      date: {
        $gte: new Date(Date.parse(startDate)),
        $lte: new Date(Date.parse(endDate)),
      },
      country_slug: req.query.country,
    });
    testData.forEach((test) => {
      var date =
        test.date.getMonth() +
        1 +
        "/" +
        test.date.getDate() +
        "/" +
        (test.date.getYear() + 1900 + "").slice(2, 4);
      caseData.push({
        t: new Date(date),
        y: test.tests,
      });
    });
  }
  let map_datas = await MapData.findOne({ "Data.Country": country });
  try {
    if (map_datas) {
      Object.keys(map_datas.Data).forEach((item) => {
        if (
          item == "Country" ||
          item == "Unique_Provinces" ||
          startDate > new Date(`${item}`) ||
          endDate < new Date(`${item}`)
        ) {
          // let k = 1;
        } else if (criteria === "All") {
          caseData.push({
            t: new Date(item),
            Confirmed: map_datas["Data"][`${item}`][0],
            Recovered: map_datas["Data"][`${item}`][2],
            Deaths: map_datas["Data"][`${item}`][1],
          });
        } else if (criteria === "Active") {
          caseData.push({
            t: new Date(item),
            y:
              map_datas["Data"][`${item}`][0] -
              map_datas["Data"][`${item}`][2] -
              map_datas["Data"][`${item}`][1],
          });
        } else {
          if (criteria.toLowerCase() == "confirmed") {
            caseData.push({
              t: new Date(item),
              y: map_datas["Data"][`${item}`][0],
            });
          } else if (criteria.toLowerCase() == "recovered") {
            caseData.push({
              t: new Date(item),
              y: map_datas["Data"][`${item}`][2],
            });
          } else if (criteria.toLowerCase() == "deaths") {
            caseData.push({
              t: new Date(item),
              y: map_datas["Data"][`${item}`][1],
            });
          }
        }

        if (rates) {
          dailyConfirmed[new Date(item)] = map_datas["Data"][`${item}`][0];
        }
      });
      caseData.sort((a, b) => (a.t > b.t ? 1 : -1));
      if (criteria !== "All") {
        if (req.query.daily && req.query.daily === "true") {
          caseData = calculateDaily(caseData);
        }
        if (rates) {
          caseData = calculateRate(caseData, dailyConfirmed, criteria);
        }
      }
      if (req.query.perMillion && req.query.perMillion === "true") {
        const pop = await Population.find({ iso3: req.query.country }).sort(
          "-Year"
        );
        if (pop && pop[0].population > 0) {
          caseData = calculatePopulation(caseData, pop[0].population, criteria);
        } else {
          caseData = [];
        }
      }
      caseData.sort((a, b) => (a.t > b.t ? 1 : -1));
      respond(res, caseData);
    }
  } catch (err) {
    console.log(err.toString());
    respond(res, null, 500);
  }
};

const calculateRate = (caseData, dailyConifrmed, criteria = null) => {
  let rateData = [];

  caseData.forEach((data) => {
    if (criteria && criteria == "Tests") {
      rateData.push({
        t: data.t,
        y: ((dailyConifrmed[data.t] / data.y) * 100).toFixed(2),
      });
    } else {
      rateData.push({
        t: data.t,
        y: ((data.y / dailyConifrmed[data.t]) * 100).toFixed(2),
      });
    }
  });

  return rateData;
};

const calculateDaily = (result) => {
  let dailyCaseArray = [];

  for (let index = 1; index < result.length; index++) {
    const uptoYesterday = result[index - 1].y;
    const uptoToday = result[index].y;

    let todays = uptoToday - uptoYesterday;

    dailyCaseArray.push({
      t: result[index].t,
      y: todays,
    });

    if (result.length === 1) {
      dailyCaseArray.push({
        t: result[index].t,
        y: todays,
      });
    }
  }
  return dailyCaseArray;
};

const calculatePopulation = (result, pop, criteria) => {
  if (criteria !== "All") {
    for (let index = 0; index < result.length; index++) {
      result[index].y = (result[index].y / pop) * 1000000;
    }
  } else {
    for (let index = 0; index < result.length; index++) {
      result[index].Confirmed = (result[index].Confirmed / pop) * 1000000;
      result[index].Recovered = (result[index].Recovered / pop) * 1000000;
      result[index].Deaths = (result[index].Deaths / pop) * 1000000;
    }
  }
  return result;
};
// Updates db with the latest csv

exports.getWorldStatistics = async (req, rates) => {
  let startDate = new Date(Date.parse(setStartDate(req)));
  let endDate = new Date(Date.parse(setEndDate(req)));
  let criteria = req.query.criteria;
  if (req.query.daily) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let caseData = await WorldDataModel.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  let dailyConfirmed = {};
  let results = [];

  for (var index = 0; index < caseData.length; index++) {
    let item = caseData[index];

    if (rates) {
      dailyConfirmed[new Date(item.date)] = item.Confirmed;
    }

    if (criteria === "All") {
      results.push(item);
    } else if (criteria === "Active") {
      results.push({
        t: new Date(item.date),
        y: item.Confirmed - item.Recovered - item.Deaths,
      });
    } else if (item[criteria] != undefined && item[criteria] != null) {
      results.push({
        t: new Date(item.date),
        y: item[criteria],
      });
    }
  }

  results.sort((a, b) => (a.t > b.t ? 1 : -1));
  if (criteria !== "All") {
    if (req.query.daily && req.query.daily === "true") {
      results = calculateDaily(results);
    }
    if (rates) {
      results = calculateRate(results, dailyConfirmed, criteria);
    }
  }
  if (req.query.perMillion && req.query.perMillion === "true") {
    const pop = await Population.find({ iso3: "WLD" }).sort("-Year");
    if (pop && pop[0].population > 0) {
      results = calculatePopulation(results, pop[0].population, criteria);
    } else {
      results = [];
    }
  }
  results.sort((a, b) => (a.t > b.t ? 1 : -1));
  return results;
};

// let sort_countries = async () => {
//   let date = new Date();
//   date.setDate(date.getDate() - 2);
//   let local = date.toLocaleDateString();
//   let dateKey =
//     local.slice(0, local.length - 4) + local.slice(local.length - 2);
//   let data = await MapData.find({}).select(`Data.Country Data.${dateKey} -_id`);
//   let countryDict = {};
//   data.forEach(
//     (item) => (countryDict[item["Data"]["Country"]] = item["Data"][dateKey][0])
//   );

let countries_list = [
    { name: "United States", slug: "USA" },
    { name: "Afghanistan", slug: "AFG" },
    { name: "Albania", slug: "ALB" },
    { name: "Algeria", slug: "DZA" },
    { name: "Andorra", slug: "AND" },
    { name: "Angola", slug: "AGO" },
    { name: "Antigua and Barbuda", slug: "ATG" },
    { name: "Argentina", slug: "ARG" },
    { name: "Armenia", slug: "ARM" },
    { name: "Australia", slug: "AUS" },
    { name: "Austria", slug: "AUT" },
    { name: "Azerbaijan", slug: "AZE" },
    { name: "Bahamas", slug: "BHS" },
    { name: "Bahrain", slug: "BHR" },
    { name: "Bangladesh", slug: "BGD" },
    { name: "Barbados", slug: "BRB" },
    { name: "Belarus", slug: "BLR" },
    { name: "Belgium", slug: "BEL" },
    { name: "Belize", slug: "BLZ" },
    { name: "Benin", slug: "BEN" },
    { name: "Bhutan", slug: "BTN" },
    { name: "Bolivia", slug: "BOL" },
    { name: "Bosnia and Herzegovina", slug: "BIH" },
    { name: "Botswana", slug: "BWA" },
    { name: "Brazil", slug: "BRA" },
    { name: "Brunei", slug: "BRN" },
    { name: "Bulgaria", slug: "BGR" },
    { name: "Burkina Faso", slug: "BFA" },
    { name: "Burma", slug: "MMR" },
    { name: "Burundi", slug: "BDI" },
    { name: "Cabo Verde", slug: "CPV" },
    { name: "Cambodia", slug: "KHM" },
    { name: "Cameroon", slug: "CMR" },
    { name: "Canada", slug: "CAN" },
    { name: "Central African Republic", slug: "CAF" },
    { name: "Chad", slug: "TCD" },
    { name: "Chile", slug: "CHL" },
    { name: "China", slug: "CHN" },
    { name: "Colombia", slug: "COL" },
    { name: "Comoros", slug: "COM" },
    { name: "Congo (Brazzaville)", slug: "COD" },
    { name: "Congo (Kinshasa)", slug: "COG" },
    { name: "Costa Rica", slug: "CRI" },
    { name: "Cote d'Ivoire", slug: "CIV" },
    { name: "Croatia", slug: "HRV" },
    { name: "Cuba", slug: "CUB" },
    { name: "Cyprus", slug: "CYP" },
    { name: "Czechia", slug: "CZE" },
    { name: "Denmark", slug: "DNK" },
    { name: "Djibouti", slug: "DJI" },
    { name: "Dominica", slug: "DMA" },
    { name: "Dominican Republic", slug: "DOM" },
    { name: "Ecuador", slug: "ECU" },
    { name: "Egypt", slug: "EGY" },
    { name: "El Salvador", slug: "SLV" },
    { name: "Equatorial Guinea", slug: "GNQ" },
    { name: "Eritrea", slug: "ERI" },
    { name: "Estonia", slug: "EST" },
    { name: "Eswatini", slug: "SWZ" },
    { name: "Ethiopia", slug: "ETH" },
    { name: "Fiji", slug: "FJI" },
    { name: "Finland", slug: "FIN" },
    { name: "France", slug: "FRA" },
    { name: "Gabon", slug: "GAB" },
    { name: "Gambia", slug: "GMB" },
    { name: "Georgia", slug: "GEO" },
    { name: "Germany", slug: "DEU" },
    { name: "Ghana", slug: "GHA" },
    { name: "Greece", slug: "GRC" },
    { name: "Grenada", slug: "GRD" },
    { name: "Guatemala", slug: "GTM" },
    { name: "Guinea", slug: "GIN" },
    { name: "Guinea-Bissau", slug: "GNB" },
    { name: "Guyana", slug: "GUY" },
    { name: "Haiti", slug: "HTI" },
    { name: "Holy See", slug: "VAT" },
    { name: "Honduras", slug: "HND" },
    { name: "Hungary", slug: "HUN" },
    { name: "Iceland", slug: "ISL" },
    { name: "India", slug: "IND" },
    { name: "Indonesia", slug: "IDN" },
    { name: "Iran", slug: "IRN" },
    { name: "Iraq", slug: "IRQ" },
    { name: "Ireland", slug: "IRL" },
    { name: "Israel", slug: "ISR" },
    { name: "Italy", slug: "ITA" },
    { name: "Jamaica", slug: "JAM" },
    { name: "Japan", slug: "JPN" },
    { name: "Jordan", slug: "JOR" },
    { name: "Kazakhstan", slug: "KAZ" },
    { name: "Kenya", slug: "KEN" },
    { name: "Korea, South", slug: "KOR" },
    { name: "Kosovo", slug: "RKS" },
    { name: "Kuwait", slug: "KWT" },
    { name: "Kyrgyzstan", slug: "KGZ" },
    { name: "Laos", slug: "LAO" },
    { name: "Latvia", slug: "LVA" },
    { name: "Lebanon", slug: "LBN" },
    { name: "Liberia", slug: "LBR" },
    { name: "Libya", slug: "LBY" },
    { name: "Liechtenstein", slug: "LIE" },
    { name: "Lithuania", slug: "LTU" },
    { name: "Luxembourg", slug: "LUX" },
    { name: "Madagascar", slug: "MDG" },
    { name: "Malawi", slug: "MWI" },
    { name: "Malaysia", slug: "MYS" },
    { name: "Maldives", slug: "MDV" },
    { name: "Mali", slug: "MLI" },
    { name: "Malta", slug: "MLT" },
    { name: "Mauritania", slug: "MRT" },
    { name: "Mauritius", slug: "MUS" },
    { name: "Mexico", slug: "MEX" },
    { name: "Moldova", slug: "MDA" },
    { name: "Monaco", slug: "MCO" },
    { name: "Mongolia", slug: "MNG" },
    { name: "Montenegro", slug: "MNE" },
    { name: "Morocco", slug: "MAR" },
    { name: "Mozambique", slug: "MOZ" },
    { name: "Namibia", slug: "NAM" },
    { name: "Nepal", slug: "NPL" },
    { name: "Netherlands", slug: "NLD" },
    { name: "New Zealand", slug: "NZL" },
    { name: "Nicaragua", slug: "NIC" },
    { name: "Niger", slug: "NER" },
    { name: "Nigeria", slug: "NGA" },
    { name: "North Macedonia", slug: "MKD" },
    { name: "Norway", slug: "NOR" },
    { name: "Oman", slug: "OMN" },
    { name: "Pakistan", slug: "PAK" },
    { name: "Panama", slug: "PAN" },
    { name: "Papua New Guinea", slug: "PNG" },
    { name: "Paraguay", slug: "PRY" },
    { name: "Peru", slug: "PER" },
    { name: "Philippines", slug: "PHL" },
    { name: "Poland", slug: "POL" },
    { name: "Portugal", slug: "PRT" },
    { name: "Qatar", slug: "QAT" },
    { name: "Romania", slug: "ROU" },
    { name: "Russia", slug: "RUS" },
    { name: "Rwanda", slug: "RWA" },
    { name: "Saint Kitts and Nevis", slug: "KNA" },
    { name: "Saint Lucia", slug: "LCA" },
    { name: "Saint Vincent and the Grenadines", slug: "VCT" },
    { name: "San Marino", slug: "SMR" },
    { name: "Sao Tome and Principe", slug: "STP" },
    { name: "Saudi Arabia", slug: "SAU" },
    { name: "Senegal", slug: "SEN" },
    { name: "Serbia", slug: "SRB" },
    { name: "Seychelles", slug: "SYC" },
    { name: "Sierra Leone", slug: "SLE" },
    { name: "Singapore", slug: "SGP" },
    { name: "Slovakia", slug: "SVK" },
    { name: "Slovenia", slug: "SVN" },
    { name: "Somalia", slug: "SOM" },
    { name: "South Africa", slug: "ZAF" },
    { name: "South Sudan", slug: "SSD" },
    { name: "Spain", slug: "ESP" },
    { name: "Sri Lanka", slug: "LKA" },
    { name: "Sudan", slug: "SDN" },
    { name: "Suriname", slug: "SUR" },
    { name: "Sweden", slug: "SWE" },
    { name: "Switzerland", slug: "CHE" },
    { name: "Syria", slug: "SYR" },
    { name: "Taiwan*", slug: "TWN" },
    { name: "Tajikistan", slug: "TJK" },
    { name: "Tanzania", slug: "TZA" },
    { name: "Thailand", slug: "THA" },
    { name: "Timor-Leste", slug: "TLS" },
    { name: "Togo", slug: "TGO" },
    { name: "Trinidad and Tobago", slug: "TTO" },
    { name: "Tunisia", slug: "TUN" },
    { name: "Turkey", slug: "TUR" },
    { name: "Uganda", slug: "UGA" },
    { name: "Ukraine", slug: "UKR" },
    { name: "United Arab Emirates", slug: "ARE" },
    { name: "United Kingdom", slug: "GBR" },
    { name: "Uruguay", slug: "URY" },
    { name: "Uzbekistan", slug: "UZB" },
    { name: "Venezuela", slug: "VEN" },
    { name: "Vietnam", slug: "VNM" },
    { name: "West Bank and Gaza", slug: "PSE" },
    { name: "Western Sahara", slug: "ESH" },
    { name: "Yemen", slug: "YEM" },
    { name: "Zambia", slug: "ZMB" },
    { name: "Zimbabwe", slug: "ZWE" },
  ];
//   let isoConverter = {
//     AFG: "Afghanistan",
//     ALB: "Albania",
//     DZA: "Algeria",
//     AND: "Andorra",
//     AGO: "Angola",
//     ATG: "Antigua and Barbuda",
//     ARG: "Argentina",
//     ARM: "Armenia",
//     AUS: "Australia",
//     AUT: "Austria",
//     AZE: "Azerbaijan",
//     BHS: "Bahamas",
//     BHR: "Bahrain",
//     BGD: "Bangladesh",
//     BRB: "Barbados",
//     BLR: "Belarus",
//     BEL: "Belgium",
//     BLZ: "Belize",
//     BEN: "Benin",
//     BTN: "Bhutan",
//     BOL: "Bolivia",
//     BIH: "Bosnia and Herzegovina",
//     BWA: "Botswana",
//     BRA: "Brazil",
//     BRN: "Brunei",
//     BGR: "Bulgaria",
//     BFA: "Burkina Faso",
//     MMR: "Burma",
//     BDI: "Burundi",
//     CPV: "Cabo Verde",
//     KHM: "Cambodia",
//     CMR: "Cameroon",
//     CAN: "Canada",
//     CAF: "Central African Republic",
//     TCD: "Chad",
//     CHL: "Chile",
//     CHN: "China",
//     COL: "Colombia",
//     COM: "Comoros",
//     COD: "Congo (Brazzaville)",
//     COG: "Congo (Kinshasa)",
//     CRI: "Costa Rica",
//     CIV: "Cote d'Ivoire",
//     HRV: "Croatia",
//     CUB: "Cuba",
//     CYP: "Cyprus",
//     CZE: "Czechia",
//     DNK: "Denmark",
//     JPN: "Japan",
//     DJI: "Djibouti",
//     DMA: "Dominica",
//     DOM: "Dominican Republic",
//     ECU: "Ecuador",
//     EGY: "Egypt",
//     SLV: "El Salvador",
//     GNQ: "Equatorial Guinea",
//     ERI: "Eritrea",
//     EST: "Estonia",
//     SWZ: "Eswatini",
//     ETH: "Ethiopia",
//     FJI: "Fiji",
//     FIN: "Finland",
//     FRA: "France",
//     GAB: "Gabon",
//     GMB: "Gambia",
//     GEO: "Georgia",
//     DEU: "Germany",
//     GHA: "Ghana",
//     GRC: "Greece",
//     GRD: "Grenada",
//     GTM: "Guatemala",
//     GIN: "Guinea",
//     GNB: "Guinea-Bissau",
//     GUY: "Guyana",
//     HTI: "Haiti",
//     VAT: "Holy See",
//     HND: "Honduras",
//     HUN: "Hungary",
//     ISL: "Iceland",
//     IND: "India",
//     IDN: "Indonesia",
//     IRN: "Iran",
//     IRQ: "Iraq",
//     IRL: "Ireland",
//     ISR: "Israel",
//     ITA: "Italy",
//     JAM: "Jamaica",
//     JOR: "Jordan",
//     KAZ: "Kazakhstan",
//     KEN: "Kenya",
//     KOR: "Korea, South",
//     RKS: "Kosovo",
//     KWT: "Kuwait",
//     KGZ: "Kyrgyzstan",
//     LAO: "Laos",
//     LVA: "Latvia",
//     LBN: "Lebanon",
//     LBR: "Liberia",
//     LBY: "Libya",
//     LIE: "Liechtenstein",
//     LTU: "Lithuania",
//     LUX: "Luxembourg",
//     MDG: "Madagascar",
//     MWI: "Malawi",
//     MYS: "Malaysia",
//     MDV: "Maldives",
//     MLI: "Mali",
//     MLT: "Malta",
//     MRT: "Mauritania",
//     MUS: "Mauritius",
//     MEX: "Mexico",
//     MDA: "Moldova",
//     MCO: "Monaco",
//     MNG: "Mongolia",
//     MNE: "Montenegro",
//     MAR: "Morocco",
//     MOZ: "Mozambique",
//     USA: "US",
//     NAM: "Namibia",
//     NPL: "Nepal",
//     NLD: "Netherlands",
//     NZL: "New Zealand",
//     NIC: "Nicaragua",
//     NER: "Niger",
//     NGA: "Nigeria",
//     MKD: "North Macedonia",
//     NOR: "Norway",
//     OMN: "Oman",
//     PAK: "Pakistan",
//     PAN: "Panama",
//     PNG: "Papua New Guinea",
//     PRY: "Paraguay",
//     PER: "Peru",
//     PHL: "Philippines",
//     POL: "Poland",
//     PRT: "Portugal",
//     QAT: "Qatar",
//     ROU: "Romania",
//     RUS: "Russia",
//     RWA: "Rwanda",
//     KNA: "Saint Kitts and Nevis",
//     LCA: "Saint Lucia",
//     VCT: "Saint Vincent and the Grenadines",
//     SMR: "San Marino",
//     STP: "Sao Tome and Principe",
//     SAU: "Saudi Arabia",
//     SEN: "Senegal",
//     SRB: "Serbia",
//     SYC: "Seychelles",
//     SLE: "Sierra Leone",
//     SGP: "Singapore",
//     SVK: "Slovakia",
//     SVN: "Slovenia",
//     SOM: "Somalia",
//     ZAF: "South Africa",
//     SSD: "South Sudan",
//     ESP: "Spain",
//     LKA: "Sri Lanka",
//     SDN: "Sudan",
//     SUR: "Suriname",
//     SWE: "Sweden",
//     CHE: "Switzerland",
//     SYR: "Syria",
//     TWN: "Taiwan*",
//     TJK: "Tajikistan",
//     TZA: "Tanzania",
//     THA: "Thailand",
//     TLS: "Timor-Leste",
//     TGO: "Togo",
//     TTO: "Trinidad and Tobago",
//     TUN: "Tunisia",
//     TUR: "Turkey",
//     UGA: "Uganda",
//     UKR: "Ukraine",
//     ARE: "United Arab Emirates",
//     GBR: "United Kingdom",
//     URY: "Uruguay",
//     UZB: "Uzbekistan",
//     VEN: "Venezuela",
//     VNM: "Vietnam",
//     PSE: "West Bank and Gaza",
//     ESH: "Western Sahara",
//     YEM: "Yemen",
//     ZMB: "Zambia",
//     ZWE: "Zimbabwe",
//     USA: "US",
//   };

//   countries.sort((a, b) =>
//     countryDict[isoConverter[a.slug]] > countryDict[isoConverter[b.slug]]
//       ? -1
//       : 1
//   );
//   countries.unshift({ name: "World", slug: "World" });

//   return countries;
// };
