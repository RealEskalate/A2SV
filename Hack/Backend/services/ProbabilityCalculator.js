const { Tests } = require("../models/TestModel");
const { MapData } = require("../models/MapDataModel");
const axios = require("axios");
const HealthApiParser = require("./HealthApiParser");
const Population = require("./../models/PopulationModel")

const Ak = {
  cough: 0.861,
  fever: 0.85,
  "difficulty breathing": 0.8,
  myalgia: 0.344,
  diarrhea: 0.267,
  "sore throat": 0.178,
  headaches: 0.161,
  "runny nose": 0.161,
  "chest pain": 0.15,
  "abdominal pain": 0.083,
  wheezing: 0.067,
  nausea: 0.244,

  fatigue: 0.65,
  sneezing: 0.34,
  conjunctivitis: 0.12,
  chills: 0.44,
  pneumonia: 0.53,
  anosmia: 0.12,
};
const Sk = {
  fatigue: 0.355,
  headaches: 0.354,
  "runny nose": 0.344,
  cough: 0.283,
  myalgia: 0.231,
  "difficulty breathing": 0.132,
  diarrhea: 0.067,
  fever: 0.07,
  "abdominal pain": 0.117,
  anosmia: 0.04,
  "sore throat": 0.2,
  "chest pain": 0.1,
  wheezing: 0.04,
  nausea: 0.34,
  sneezing: 0.66,
  conjunctivitis: 0.15,
  chills: 0.52,
  pneumonia: 0.12,
};

exports.calculateProbability = async (symptoms, country) => {
  if(symptoms.length==0) return 0;
  if (symptoms.includes('High-grade Fever') && 
      symptoms.includes('Medium-grade Fever')){
        symptoms = symptoms.filter(symptom => symptom != 'Medium-grade Fever');
      }
  const prevalence = await getCountryStat(country);
  let total_prob = prevalence;
  for (let i = 0; i < symptoms.length; i++) {
    var symptom = `${symptoms[i]}`.toLowerCase();
    if (symptom == "persistent dry cough") {
      symptom = "cough";
    } else if (
      symptom == "high-grade fever" ||
      symptom == "medium-grade fever"
    ) {
      symptom = "fever";
    } else if (symptom == "repeated shaking with chills") {
      symptom = "chills";
    }
    total_prob *= Ak[symptom] / Sk[symptom];
  }
  console.log("Probabilty = " + total_prob);
  total_prob = total_prob > 100 ? 99 : total_prob
  return total_prob;
};
const setStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return "" + date.toISOString().slice(0, 10);
};
const getCountryStat = async (input_country) => {
  if(input_country == null || input_country == "World"){
    let probability = await world_probability();
    return probability;
  }

  let startDate = setStartDate();
  let iso3_country;
  if (Object.keys(iso3to2).includes(input_country)){
    iso3_country = iso3to2[input_country];
    input_country = isoConverter[iso3_country];
  }else{
    iso3_country = Object.keys(isoConverter).find(key => isoConverter[key] == input_country)
  }
  let result;
  let caseData = [];
  let dailyConfirmed = {};
  let testData = await Tests.find({
    date: {
      $gte: new Date(Date.parse(startDate)),
    },
    country_slug: iso3_country,
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
  let map_datas = await MapData.findOne({ "Data.Country": input_country });
  try {
    if (map_datas) {
      Object.keys(map_datas.Data).forEach((item) => {
        if (
          item == "Country" ||
          item == "Unique_Provinces" ||
          startDate > new Date(`${item}`)
        ) {
        } else {
          dailyConfirmed[new Date(item)] = map_datas["Data"][`${item}`][0];
        }
      });
      caseData = calculateRate(caseData, dailyConfirmed);
      caseData.sort((a, b) => (a.t > b.t ? 1 : -1));
      result = caseData[caseData.length - 1];
    }
  } catch (err) {
    console.log(err.toString());
  }
  if (result && result.y) {
    return result.y;
  }
  
  let probability= await world_probability();
  return probability
};

let world_probability= async ()=>{
  const latestConfirmed = (await HealthApiParser.getWorldStatistics({query: {criteria: "Confirmed"}})).pop().y;
  const latestPopuation = (await Population.find({ iso3: "WLD" }).sort("Year")).pop().population;
  return latestConfirmed/latestPopuation;
}

const calculateRate = (caseData, dailyConifrmed) => {
  let rateData = [];
  caseData.forEach((data) => {
    rateData.push({
      t: data.t,
      y: dailyConifrmed[data.t] / data.y,
    });
  });
  return rateData;
};



const isoConverter = {
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
};
const iso3to2 = {
  BD: "BGD",
  BE: "BEL",
  BF: "BFA",
  BG: "BGR",
  BA: "BIH",
  BB: "BRB",
  WF: "WLF",
  BL: "BLM",
  BM: "BMU",
  BN: "BRN",
  BO: "BOL",
  BH: "BHR",
  BI: "BDI",
  BJ: "BEN",
  BT: "BTN",
  JM: "JAM",
  BV: "BVT",
  BW: "BWA",
  WS: "WSM",
  BQ: "BES",
  BR: "BRA",
  BS: "BHS",
  JE: "JEY",
  BY: "BLR",
  BZ: "BLZ",
  RU: "RUS",
  RW: "RWA",
  RS: "SRB",
  TL: "TLS",
  RE: "REU",
  TM: "TKM",
  TJ: "TJK",
  RO: "ROU",
  TK: "TKL",
  GW: "GNB",
  GU: "GUM",
  GT: "GTM",
  GS: "SGS",
  GR: "GRC",
  GQ: "GNQ",
  GP: "GLP",
  JP: "JPN",
  GY: "GUY",
  GG: "GGY",
  GF: "GUF",
  GE: "GEO",
  GD: "GRD",
  GB: "GBR",
  GA: "GAB",
  SV: "SLV",
  GN: "GIN",
  GM: "GMB",
  GL: "GRL",
  GI: "GIB",
  GH: "GHA",
  OM: "OMN",
  TN: "TUN",
  JO: "JOR",
  HR: "HRV",
  HT: "HTI",
  HU: "HUN",
  HK: "HKG",
  HN: "HND",
  HM: "HMD",
  VE: "VEN",
  PR: "PRI",
  PS: "PSE",
  PW: "PLW",
  PT: "PRT",
  SJ: "SJM",
  PY: "PRY",
  IQ: "IRQ",
  PA: "PAN",
  PF: "PYF",
  PG: "PNG",
  PE: "PER",
  PK: "PAK",
  PH: "PHL",
  PN: "PCN",
  PL: "POL",
  PM: "SPM",
  ZM: "ZMB",
  EH: "ESH",
  EE: "EST",
  EG: "EGY",
  ZA: "ZAF",
  EC: "ECU",
  IT: "ITA",
  VN: "VNM",
  SB: "SLB",
  ET: "ETH",
  SO: "SOM",
  ZW: "ZWE",
  SA: "SAU",
  ES: "ESP",
  ER: "ERI",
  ME: "MNE",
  MD: "MDA",
  MG: "MDG",
  MF: "MAF",
  MA: "MAR",
  MC: "MCO",
  UZ: "UZB",
  MM: "MMR",
  ML: "MLI",
  MO: "MAC",
  MN: "MNG",
  MH: "MHL",
  MK: "MKD",
  MU: "MUS",
  MT: "MLT",
  MW: "MWI",
  MV: "MDV",
  MQ: "MTQ",
  MP: "MNP",
  MS: "MSR",
  MR: "MRT",
  IM: "IMN",
  UG: "UGA",
  TZ: "TZA",
  MY: "MYS",
  MX: "MEX",
  IL: "ISR",
  FR: "FRA",
  IO: "IOT",
  SH: "SHN",
  FI: "FIN",
  FJ: "FJI",
  FK: "FLK",
  FM: "FSM",
  FO: "FRO",
  NI: "NIC",
  NL: "NLD",
  NO: "NOR",
  NA: "NAM",
  VU: "VUT",
  NC: "NCL",
  NE: "NER",
  NF: "NFK",
  NG: "NGA",
  NZ: "NZL",
  NP: "NPL",
  NR: "NRU",
  NU: "NIU",
  CK: "COK",
  XK: "XKX",
  CI: "CIV",
  CH: "CHE",
  CO: "COL",
  CN: "CHN",
  CM: "CMR",
  CL: "CHL",
  CC: "CCK",
  CA: "CAN",
  CG: "COG",
  CF: "CAF",
  CD: "COD",
  CZ: "CZE",
  CY: "CYP",
  CX: "CXR",
  CR: "CRI",
  CW: "CUW",
  CV: "CPV",
  CU: "CUB",
  SZ: "SWZ",
  SY: "SYR",
  SX: "SXM",
  KG: "KGZ",
  KE: "KEN",
  SS: "SSD",
  SR: "SUR",
  KI: "KIR",
  KH: "KHM",
  KN: "KNA",
  KM: "COM",
  ST: "STP",
  SK: "SVK",
  KR: "KOR",
  SI: "SVN",
  KP: "PRK",
  KW: "KWT",
  SN: "SEN",
  SM: "SMR",
  SL: "SLE",
  SC: "SYC",
  KZ: "KAZ",
  KY: "CYM",
  SG: "SGP",
  SE: "SWE",
  SD: "SDN",
  DO: "DOM",
  DM: "DMA",
  DJ: "DJI",
  DK: "DNK",
  VG: "VGB",
  DE: "DEU",
  YE: "YEM",
  DZ: "DZA",
  US: "USA",
  UY: "URY",
  YT: "MYT",
  UM: "UMI",
  LB: "LBN",
  LC: "LCA",
  LA: "LAO",
  TV: "TUV",
  TW: "TWN",
  TT: "TTO",
  TR: "TUR",
  LK: "LKA",
  LI: "LIE",
  LV: "LVA",
  TO: "TON",
  LT: "LTU",
  LU: "LUX",
  LR: "LBR",
  LS: "LSO",
  TH: "THA",
  TF: "ATF",
  TG: "TGO",
  TD: "TCD",
  TC: "TCA",
  LY: "LBY",
  VA: "VAT",
  VC: "VCT",
  AE: "ARE",
  AD: "AND",
  AG: "ATG",
  AF: "AFG",
  AI: "AIA",
  VI: "VIR",
  IS: "ISL",
  IR: "IRN",
  AM: "ARM",
  AL: "ALB",
  AO: "AGO",
  AQ: "ATA",
  AS: "ASM",
  AR: "ARG",
  AU: "AUS",
  AT: "AUT",
  AW: "ABW",
  IN: "IND",
  AX: "ALA",
  AZ: "AZE",
  IE: "IRL",
  ID: "IDN",
  UA: "UKR",
  QA: "QAT",
  MZ: "MOZ",
};


