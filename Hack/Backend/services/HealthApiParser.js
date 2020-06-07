const axios = require("axios");
const csvjson = require("csvjson");
const { Cases } = require("./../models/CasesModel");
const { MapData } = require("../models/MapDataModel");
const { Tests } = require("../models/TestModel");
const Papa = require("papaparse");
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const WorldDataModel = require("../models/WorldDataModel");

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
      console.log(err);
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

  if (req.query.country == "World") {
    let request_url =
      "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
    getWorldStat(request_url, startDate, endDate, req, res, respond, rates);
  } else {
    getCountryStat(startDate, endDate, req, res, respond, rates);
  }
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
  let countries = [
    { name: "World", slug: "World" },
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
    { name: "US", slug: "USA" },
    { name: "Uzbekistan", slug: "UZB" },
    { name: "Venezuela", slug: "VEN" },
    { name: "Vietnam", slug: "VNM" },
    { name: "West Bank and Gaza", slug: "PSE" },
    { name: "Western Sahara", slug: "ESH" },
    { name: "Yemen", slug: "YEM" },
    { name: "Zambia", slug: "ZMB" },
    { name: "Zimbabwe", slug: "ZWE" },
  ];

  if (req.query.sort != null) {
    countries = await sort_countries();
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
      caseData.sort((a, b) => (a.t > b.t ? 1 : -1));
      respond(res, caseData);
    }
  } catch (err) {
    console.log(err);
    respond(res, null, 500);
  }
};

const getWorldStat = (
  request_url,
  startDate,
  endDate,
  req,
  res,
  respond,
  rates
) => {
  const criteria = req.query.criteria;
  try {
    axios
      .get(request_url)
      .then((response) => {
        let data = response.data;
        if (!data) {
          respond(res, []);
        }

        let results = [];
        let dailyConfirmed = {};

        const options = { delimiter: ",", quote: '"' };
        data = csvjson.toObject(data, options);

        data.forEach((item) => {
          const date = new Date(item.Date);
          if (date >= startDate && date <= endDate) {
            if (rates) {
              dailyConfirmed[new Date(item.Date)] = item["Confirmed"];
            }
            if (criteria === "All") {
              results.push({
                t: new Date(item.Date),
                Confirmed: item["Confirmed"],
                Recovered: item["Recovered"],
                Deaths: item["Deaths"],
              });
            } else if (criteria === "Active") {
              results.push({
                t: new Date(item.Date),
                y: item["Confirmed"] - item["Recovered"] - item["Deaths"],
              });
            } else {
              if (item[criteria] != undefined && item[criteria] != null) {
                results.push({
                  t: new Date(item.Date),
                  y: item[criteria],
                });
              }
            }
          }
        });
        results.sort((a, b) => (a.t > b.t ? 1 : -1));
        if (criteria !== "All") {
          if (req.query.daily && req.query.daily === "true") {
            results = calculateDaily(results);
          }
          if (rates) {
            results = calculateRate(results, dailyConfirmed, criteria);
          }
        }
        results.sort((a, b) => (a.t > b.t ? 1 : -1));
        respond(res, results);
      })
      .catch((error) => {
        console.log(error);
        respond(res, null, 500);
      });
  } catch (err) {
    console.log(err);
  }
};

// exports.countrySlugList = (res, respond) => {
//     let dayQuery = new Date()
//     dayQuery.setDate(dayQuery.getDate() - 1)
//     dayQuery = new Date(dayQuery.toISOString().slice(0, 10))

//     Cases.find({ date: dayQuery })
//         .then((countryData) => {
//             let countries = [{ 'name': "World", 'slug': "World" }]
//             if (countryData) {
//                 countryData.sort((a, b) => (a.confirmed > b.confirmed) ? -1 : 1)
//                 for (var index in countryData) {
//                     let countryValue = countryData[index]
//                     countries.push({ "name": countryValue.country, "slug": countryValue.country })
//                 }
//             }
//             respond(res, countries)
//         })
//         .catch(e => {
//             respond(res, [])
//         });
// };

const getISO = (country_name) => {
  let countries = [
    { country: "Afghanistan", iso: "AFG" },
    { country: "Albania", iso: "ALB" },
    { country: "Algeria", iso: "DZA" },
    { country: "Andorra", iso: "AND" },
    { country: "Angola", iso: "AGO" },
    { country: "Antigua and Barbuda", iso: "ATG" },
    { country: "Argentina", iso: "ARG" },
    { country: "Armenia", iso: "ARM" },
    { country: "Australia", iso: "AUS" },
    { country: "Austria", iso: "AUT" },
    { country: "Azerbaijan", iso: "AZE" },
    { country: "Bahamas", iso: "BHS" },
    { country: "Bahrain", iso: "BHR" },
    { country: "Bangladesh", iso: "BGD" },
    { country: "Barbados", iso: "BRB" },
    { country: "Belarus", iso: "BLR" },
    { country: "Belgium", iso: "BEL" },
    { country: "Belize", iso: "BLZ" },
    { country: "Benin", iso: "BEN" },
    { country: "Bhutan", iso: "BTN" },
    { country: "Bolivia", iso: "BOL" },
    { country: "Bosnia and Herzegovina", iso: "BIH" },
    { country: "Botswana", iso: "BWA" },
    { country: "Brazil", iso: "BRA" },
    { country: "Brunei", iso: "BRN" },
    { country: "Bulgaria", iso: "BGR" },
    { country: "Burkina Faso", iso: "BFA" },
    { country: "Burma", iso: "MMR" },
    { country: "Burundi", iso: "BDI" },
    { country: "Cabo Verde", iso: "CPV" },
    { country: "Cambodia", iso: "KHM" },
    { country: "Cameroon", iso: "CMR" },
    { country: "Canada", iso: "CAN" },
    { country: "Central African Republic", iso: "CAF" },
    { country: "Chad", iso: "TCD" },
    { country: "Chile", iso: "CHL" },
    { country: "China", iso: "CHN" },
    { country: "Colombia", iso: "COL" },
    { country: "Comoros", iso: "COM" },
    { country: "Congo (Brazzaville)", iso: "COD" },
    { country: "Congo (Kinshasa)", iso: "COG" },
    { country: "Costa Rica", iso: "CRI" },
    { country: "Cote d'Ivoire", iso: "CIV" },
    { country: "Croatia", iso: "HRV" },
    { country: "Cuba", iso: "CUB" },
    { country: "Cyprus", iso: "CYP" },
    { country: "Czechia", iso: "CZE" },
    { country: "Denmark", iso: "DNK" },
    { country: "Diamond Princess", iso: "JPN" },
    { country: "Djibouti", iso: "DJI" },
    { country: "Dominica", iso: "DMA" },
    { country: "Dominican Republic", iso: "DOM" },
    { country: "Ecuador", iso: "ECU" },
    { country: "Egypt", iso: "EGY" },
    { country: "El Salvador", iso: "SLV" },
    { country: "Equatorial Guinea", iso: "GNQ" },
    { country: "Eritrea", iso: "ERI" },
    { country: "Estonia", iso: "EST" },
    { country: "Eswatini", iso: "SWZ" },
    { country: "Ethiopia", iso: "ETH" },
    { country: "Fiji", iso: "FJI" },
    { country: "Finland", iso: "FIN" },
    { country: "France", iso: "FRA" },
    { country: "Gabon", iso: "GAB" },
    { country: "Gambia", iso: "GMB" },
    { country: "Georgia", iso: "GEO" },
    { country: "Germany", iso: "DEU" },
    { country: "Ghana", iso: "GHA" },
    { country: "Greece", iso: "GRC" },
    { country: "Grenada", iso: "GRD" },
    { country: "Guatemala", iso: "GTM" },
    { country: "Guinea", iso: "GIN" },
    { country: "Guinea-Bissau", iso: "GNB" },
    { country: "Guyana", iso: "GUY" },
    { country: "Haiti", iso: "HTI" },
    { country: "Holy See", iso: "VAT" },
    { country: "Honduras", iso: "HND" },
    { country: "Hungary", iso: "HUN" },
    { country: "Iceland", iso: "ISL" },
    { country: "India", iso: "IND" },
    { country: "Indonesia", iso: "IDN" },
    { country: "Iran", iso: "IRN" },
    { country: "Iraq", iso: "IRQ" },
    { country: "Ireland", iso: "IRL" },
    { country: "Israel", iso: "ISR" },
    { country: "Italy", iso: "ITA" },
    { country: "Jamaica", iso: "JAM" },
    { country: "Japan", iso: "JPN" },
    { country: "Jordan", iso: "JOR" },
    { country: "Kazakhstan", iso: "KAZ" },
    { country: "Kenya", iso: "KEN" },
    { country: "Korea, South", iso: "PRK" },
    { country: "Kosovo", iso: "RKS" },
    { country: "Kuwait", iso: "KWT" },
    { country: "Kyrgyzstan", iso: "KGZ" },
    { country: "Laos", iso: "LAO" },
    { country: "Latvia", iso: "LVA" },
    { country: "Lebanon", iso: "LBN" },
    { country: "Liberia", iso: "LBR" },
    { country: "Libya", iso: "LBY" },
    { country: "Liechtenstein", iso: "LIE" },
    { country: "Lithuania", iso: "LTU" },
    { country: "Luxembourg", iso: "LUX" },
    { country: "Madagascar", iso: "MDG" },
    { country: "Malawi", iso: "MWI" },
    { country: "Malaysia", iso: "MYS" },
    { country: "Maldives", iso: "MDV" },
    { country: "Mali", iso: "MLI" },
    { country: "Malta", iso: "MLT" },
    { country: "Mauritania", iso: "MRT" },
    { country: "Mauritius", iso: "MUS" },
    { country: "Mexico", iso: "MEX" },
    { country: "Moldova", iso: "MDA" },
    { country: "Monaco", iso: "MCO" },
    { country: "Mongolia", iso: "MNG" },
    { country: "Montenegro", iso: "MNE" },
    { country: "Morocco", iso: "MAR" },
    { country: "Mozambique", iso: "MOZ" },
    { country: "MS Zaandam", iso: "USA" },
    { country: "Namibia", iso: "NAM" },
    { country: "Nepal", iso: "NPL" },
    { country: "Netherlands", iso: "NLD" },
    { country: "New Zealand", iso: "NZL" },
    { country: "Nicaragua", iso: "NIC" },
    { country: "Niger", iso: "NER" },
    { country: "Nigeria", iso: "NGA" },
    { country: "North Macedonia", iso: "MKD" },
    { country: "Norway", iso: "NOR" },
    { country: "Oman", iso: "OMN" },
    { country: "Pakistan", iso: "PAK" },
    { country: "Panama", iso: "PAN" },
    { country: "Papua New Guinea", iso: "PNG" },
    { country: "Paraguay", iso: "PRY" },
    { country: "Peru", iso: "PER" },
    { country: "Philippines", iso: "PHL" },
    { country: "Poland", iso: "POL" },
    { country: "Portugal", iso: "PRT" },
    { country: "Qatar", iso: "QAT" },
    { country: "Romania", iso: "ROU" },
    { country: "Russia", iso: "RUS" },
    { country: "Rwanda", iso: "RWA" },
    { country: "Saint Kitts and Nevis", iso: "KNA" },
    { country: "Saint Lucia", iso: "LCA" },
    { country: "Saint Vincent and the Grenadines", iso: "VCT" },
    { country: "San Marino", iso: "SMR" },
    { country: "Sao Tome and Principe", iso: "STP" },
    { country: "Saudi Arabia", iso: "SAU" },
    { country: "Senegal", iso: "SEN" },
    { country: "Serbia", iso: "SRB" },
    { country: "Seychelles", iso: "SYC" },
    { country: "Sierra Leone", iso: "SLE" },
    { country: "Singapore", iso: "SGP" },
    { country: "Slovakia", iso: "SVK" },
    { country: "Slovenia", iso: "SVN" },
    { country: "Somalia", iso: "SOM" },
    { country: "South Africa", iso: "ZAF" },
    { country: "South Sudan", iso: "SSD" },
    { country: "Spain", iso: "ESP" },
    { country: "Sri Lanka", iso: "LKA" },
    { country: "Sudan", iso: "SDN" },
    { country: "Suriname", iso: "SUR" },
    { country: "Sweden", iso: "SWE" },
    { country: "Switzerland", iso: "CHE" },
    { country: "Syria", iso: "SYR" },
    { country: "Taiwan*", iso: "TWN" },
    { country: "Tajikistan", iso: "TJK" },
    { country: "Tanzania", iso: "TZA" },
    { country: "Thailand", iso: "THA" },
    { country: "Timor-Leste", iso: "TLS" },
    { country: "Togo", iso: "TGO" },
    { country: "Trinidad and Tobago", iso: "TTO" },
    { country: "Tunisia", iso: "TUN" },
    { country: "Turkey", iso: "TUR" },
    { country: "Uganda", iso: "UGA" },
    { country: "Ukraine", iso: "UKR" },
    { country: "United Arab Emirates", iso: "ARE" },
    { country: "United Kingdom", iso: "GBR" },
    { country: "Uruguay", iso: "URY" },
    { country: "US", iso: "USA" },
    { country: "Uzbekistan", iso: "UZB" },
    { country: "Venezuela", iso: "VEN" },
    { country: "Vietnam", iso: "VNM" },
    { country: "West Bank and Gaza", iso: "PSE" },
    { country: "Western Sahara", iso: "ESH" },
    { country: "Yemen", iso: "YEM" },
    { country: "Zambia", iso: "ZMB" },
    { country: "Zimbabwe", iso: "ZWE" },
  ];
  for (let il = 0; il < countries.length; il++) {
    if (countries[il].country == country_name) {
      return countries[il].iso;
    }
  }
  return "";
};
const extractResult = async (url) => {
  let stringCsv;
  const result = await axios
    .get(url)
    .then((response) => {
      if (response.data) {
        stringCsv = response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  if (!stringCsv) {
    return res.status(500).send("Couldn't fetch data");
  }
  let r = Papa.parse(stringCsv, {
    header: true,
    delimiter: ",",
    dynamicTyping: true,
  });
  return r;
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

// Updates db with the latest csv
let update_db = async function () {
  // we will use the iso here
  console.log("Here");
  request_url = "https://covid.ourworldindata.org/data/owid-covid-data.csv";
  let testData = await axios.get(request_url);
  let data = testData.data;
  if (data) {
    let options = { delimiter: ",", quote: '"' };
    data = csvjson.toObject(data, options);
    for (var index = 0; index < data.length; index++) {
      let item = data[index];
      if (item.total_tests) {
        let test_data = await Tests.findOne({
          date: new Date(item.date),
          country_slug: item.iso_code,
        });
        if (!test_data) {
          let test = new Tests({
            _id: mongoose.Types.ObjectId(),
            country: item.location,
            country_slug: item.iso_code,
            tests: item.total_tests,
            date: item.date,
          });
          await test.save();
        }
      }
    }
  }
  console.log("Finished Saving Data");
};
// Schedules fetching everyday
schedule.scheduleJob("0 0 * * *", async function () {
  await update_db();
});

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
      $lt: endDate,
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

  return results;
};

let update_world_db = async function () {
  let request_url =
    "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
  let wldData = await axios.get(request_url);

  let data = wldData.data;
  if (data) {
    const options = { delimiter: ",", quote: '"' };
    data = csvjson.toObject(data, options);

    let caseData = [];
    for (var index = 0; index < data.length; index++) {
      let item = data[index];

      caseData.push(
        new WorldDataModel({
          _id: mongoose.Types.ObjectId(),
          Confirmed: item["Confirmed"],
          Recovered: item["Recovered"],
          Deaths: item["Deaths"],
          date: new Date(item.Date),
        })
      );
    }

    await WorldDataModel.collection.drop();
    await WorldDataModel.insertMany(caseData);
  }

  console.log("update-completed");
};

// Schedules fetching every day
schedule.scheduleJob("0 */4 * * *", async function () {
  await update_world_db();
});

let sort_countries = async () => {
  let date = new Date();
  date.setDate(date.getDate() - 2);
  let dateKey = date.toLocaleDateString().slice(0, -2);
  let data = await MapData.find({}).select(`Data.Country Data.${dateKey} -_id`);
  let countryDict = {};
  data.forEach(
    (item) => (countryDict[item["Data"]["Country"]] = item["Data"][dateKey][0])
  );

  let countries = [
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

  countries.sort((a, b) =>
    countryDict[isoConverter[a.slug]] > countryDict[isoConverter[b.slug]]
      ? -1
      : 1
  );
  countries.unshift({ name: "World", slug: "World" });

  return countries;
};
