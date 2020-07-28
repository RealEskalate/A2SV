import ajax from "../auth/ajax";
import moment from "moment";
import { langConverter } from "./index";

const converter = {
  "Test Count": "Tests",
  "Confirmed Cases": "Confirmed",
  "Active Cases": "Active",
  "Death Count": "Deaths",
  "Recovery Count": "Recovered",

  "Daily Confirmed": "Confirmed",
  "Daily Deaths": "Deaths",
  "Daily Recovery": "Recovered",
  "Daily Active": "Active",

  "Positive Rate": "Confirmed_Rate",
  "Active Rate": "Active_Rate",
  "Recovery Rate": "Recovered_Rate",
  "Death Rate": "Deaths_Rate",
  "Hospitalization Rate": "Hospitalization",
  "ICU Rate": "ICU"
};

export default {
  state: {
    displayCounts: {
      "Test Count": [],
      "Confirmed Cases": [],
      "Active Cases": [],
      "Death Count": [],
      "Recovery Count": []
    },
    dailyCounts: {
      "Daily Confirmed": [],
      "Daily Deaths": [],
      "Daily Recovery": []
    },
    displayRates: {
      "Positive Rate": [],
      "Recovery Rate": [],
      "Active Rate": [],
      "Death Rate": []
    },
    countryCompare: {
      one: [],
      two: [],
      start_one: "2019-10-01",
      start_two: "2019-10-01"
    },
    countryResources: {
      World: null,
      AFG: null,
      ALB: null,
      DZA: null,
      AND: null,
      AGO: null,
      ATG: null,
      ARG: null,
      ARM: null,
      AUS: null,
      AUT: null,
      AZE: null,
      BHS: null,
      BHR: null,
      BGD: null,
      BRB: null,
      BLR: null,
      BEL: null,
      BLZ: null,
      BEN: null,
      BTN: null,
      BOL: null,
      BIH: null,
      BWA: null,
      BRA: null,
      BRN: null,
      BGR: null,
      BFA: null,
      MMR: null,
      BDI: null,
      CPV: null,
      KHM: null,
      CMR: null,
      CAN: null,
      CAF: null,
      TCD: null,
      CHL: null,
      CHN: null,
      COL: null,
      COM: null,
      COD: null,
      COG: null,
      CRI: null,
      CIV: null,
      HRV: null,
      CUB: null,
      CYP: null,
      CZE: null,
      DNK: null,
      DJI: null,
      DMA: null,
      DOM: null,
      ECU: null,
      EGY: null,
      SLV: null,
      GNQ: null,
      ERI: null,
      EST: null,
      SWZ: null,
      ETH: null,
      FJI: null,
      FIN: null,
      FRA: null,
      GAB: null,
      GMB: null,
      GEO: null,
      DEU: null,
      GHA: null,
      GRC: null,
      GRD: null,
      GTM: null,
      GIN: null,
      GNB: null,
      GUY: null,
      HTI: null,
      VAT: null,
      HND: null,
      HUN: null,
      ISL: null,
      IND: null,
      IDN: null,
      IRN: null,
      IRQ: null,
      IRL: null,
      ISR: null,
      ITA: null,
      JAM: null,
      JPN: null,
      JOR: null,
      KAZ: null,
      KEN: null,
      KOR: null,
      RKS: null,
      KWT: null,
      KGZ: null,
      LAO: null,
      LVA: null,
      LBN: null,
      LBR: null,
      LBY: null,
      LIE: null,
      LTU: null,
      LUX: null,
      MDG: null,
      MWI: null,
      MYS: null,
      MDV: null,
      MLI: null,
      MLT: null,
      MRT: null,
      MUS: null,
      MEX: null,
      MDA: null,
      MCO: null,
      MNG: null,
      MNE: null,
      MAR: null,
      MOZ: null,
      NAM: null,
      NPL: null,
      NLD: null,
      NZL: null,
      NIC: null,
      NER: null,
      NGA: null,
      MKD: null,
      NOR: null,
      OMN: null,
      PAK: null,
      PAN: null,
      PNG: null,
      PRY: null,
      PER: null,
      PHL: null,
      POL: null,
      PRT: null,
      QAT: null,
      ROU: null,
      RUS: null,
      RWA: null,
      KNA: null,
      LCA: null,
      VCT: null,
      SMR: null,
      STP: null,
      SAU: null,
      SEN: null,
      SRB: null,
      SYC: null,
      SLE: null,
      SGP: null,
      SVK: null,
      SVN: null,
      SOM: null,
      ZAF: null,
      SSD: null,
      ESP: null,
      LKA: null,
      SDN: null,
      SUR: null,
      SWE: null,
      CHE: null,
      SYR: null,
      TWN: null,
      TJK: null,
      TZA: null,
      THA: null,
      TLS: null,
      TGO: null,
      TTO: null,
      TUN: null,
      TUR: null,
      UGA: null,
      UKR: null,
      ARE: null,
      GBR: null,
      URY: null,
      USA: null,
      UZB: null,
      VEN: null,
      VNM: null,
      PSE: null,
      ESH: null,
      YEM: null,
      ZMB: null,
      ZWE: null
    },
    diseaseCompare: null,
    graphDescriptions: null
  },
  getters: {
    getDisplayCounts(state) {
      return state.displayCounts;
    },
    getDailyCounts(state) {
      return state.dailyCounts;
    },
    getDisplayRates(state) {
      return state.displayRates;
    },
    getCountryCompare(state) {
      return state.countryCompare;
    },
    getCountryResources(state) {
      return state.countryResources;
    },
    getDiseaseCompare(state) {
      return state.diseaseCompare;
    },
    getGraphDescriptions(state) {
      return state.graphDescriptions;
    }
  },
  mutations: {
    setDisplayCounts(state, { key, payload }) {
      state.displayCounts[key] = payload;
    },
    setDailyCounts(state, { key, payload }) {
      state.dailyCounts[key] = payload;
    },
    setDisplayRates(state, { key, payload }) {
      state.displayRates[key] = payload;
    },
    setCountryResources(state, { key, payload }) {
      state.countryResources[key] = payload;
    },
    setCountryCompare(state, { key, payload }) {
      state.countryCompare[key] = payload;
    },
    setDiseaseCompare(state, payload) {
      state.diseaseCompare = {
        labels: [
          "Confirmed Cases",
          "Death Count",
          "Recovery Count",
          "Affected Countries"
        ],
        datasets: payload
      };
    },
    setGraphDescriptions(state, payload) {
      state.graphDescriptions = payload;
    }
  },
  actions: {
    setDisplayData(
      { commit },
      { criteria, country, start_date, end_date, mode }
    ) {
      commit("resetGraphLoaders", mode);
      for (let i = 0; i < criteria.length; i++) {
        let cr = criteria[i];
        commit("incrementGraphLoaders", mode);
        ajax
          .get(`statistics`, {
            params: {
              criteria: converter[cr.label],
              country: country,
              start_date: start_date,
              end_date: end_date
            }
          })
          .then(response => {
            if (mode === "rates") {
              commit("setDisplayRates", {
                key: cr.label,
                payload: response.data
              });
            } else {
              commit("setDisplayCounts", {
                key: cr.label,
                payload: response.data
              });
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            commit("decrementGraphLoaders", mode);
          });
      }
    },
    setDailyCounts({ commit }, { criteria, country, start_date, end_date }) {
      commit("resetGraphLoaders", "daily");
      commit("incrementGraphLoaders", "daily");
      ajax
        .get(`statistics`, {
          params: {
            criteria: converter[criteria],
            country: country,
            start_date: start_date,
            end_date: end_date,
            daily: true
          }
        })
        .then(response => {
          commit("setDailyCounts", { key: criteria, payload: response.data });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          commit("decrementGraphLoaders", "daily");
        });
    },
    setCountryCompare(
      { commit, getters },
      { criteria, country, start_date, end_date, mode }
    ) {
      commit("incrementGraphLoaders", "countryCompare");
      ajax
        .get(`statistics`, {
          params: {
            criteria: converter[criteria],
            country: country,
            start_date: start_date,
            end_date: end_date
          }
        })
        .then(response => {
          let start = getters.getCountryCompare;
          let first = true;
          let data = [];
          for (let i in response.data) {
            let val = response.data[i];
            if (val.y && val.y > 0) {
              if (first) {
                commit("setCountryCompare", {
                  key: `start_${mode}`,
                  payload: val.t.slice(0, 10)
                });
                first = false;
              }
              data.push({
                x: `Day ${moment(val.t).diff(
                  moment(start[`start_${mode}`]),
                  "days"
                )}`,
                y: val.y
              });
            }
          }
          commit("setCountryCompare", { key: mode, payload: data });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          commit("decrementGraphLoaders", "countryCompare");
        });
    },
    setDiseaseCompare({ commit }, { makeDataSet }) {
      let diseaseColors = {
        "COVID-19": [121, 134, 203],
        EBOLA: [220, 231, 117],
        SARS: [77, 208, 225],
        MERS: [240, 98, 146],
        "SEASONAL FLU": [176, 190, 197]
      };
      commit("resetGraphLoaders", "diseaseCompare");
      commit("incrementGraphLoaders", "diseaseCompare");
      ajax
        .get(`diseases`)
        .then(response => {
          let collection = [];
          response.data.forEach(function(load) {
            let input = {
              label: load.title,
              color: diseaseColors[load.title],
              data: [
                { x: "Confirmed Cases", y: load.confirmed },
                { x: "Death Count", y: load.deaths },
                { x: "Recovery Count", y: load.recovered },
                { x: "Affected Countries", y: load.affected }
              ]
            };
            collection.push(makeDataSet(input, "bar"));
          });
          commit("setDiseaseCompare", collection);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          commit("decrementGraphLoaders", "diseaseCompare");
        });
    },
    setCountryResources({ commit }, { country, lang }) {
      commit("setGraphLoaders", { key: "countryResources", value: true });
      ajax
        .get(`publicResources/${country}`, {
          params: {
            language: langConverter[lang]
          }
        })
        .then(response => {
          let data = [];
          for (let i in response.data) {
            let val = response.data[i];
            let zero = val.TimeSeries["2019"]
              ? val.TimeSeries["2019"].toFixed(2)
              : null;
            let one = val.TimeSeries["2017"]
              ? val.TimeSeries["2017"].toFixed(2)
              : null;
            let two = val.TimeSeries["2015"]
              ? val.TimeSeries["2015"].toFixed(2)
              : null;
            data.push({
              key: val.Indicator.split("(")[0],
              value: zero || one || two
            });
          }
          commit("setCountryResources", { key: country, payload: data });
        })
        .catch(error => {
          console.log(error);
        })
        .finally(function() {
          commit("setGraphLoaders", { key: "countryResources", value: false });
        });
    },
    setGraphDescriptions({ commit }, { lang }) {
      commit("setGraphLoaders", { key: "descriptions", value: true });
      ajax
        .get(`resources/statistics-description`, {
          params: {
            language: langConverter[lang]
          }
        })
        .then(response => {
          let res = {};
          response.data.forEach(function(desc) {
            res[desc.title] = desc;
          });
          commit("setGraphDescriptions", res);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(function() {
          commit("setGraphLoaders", { key: "descriptions", value: false });
        });
    }
  }
};
