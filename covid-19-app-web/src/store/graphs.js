import axios from "axios";
import moment from "moment";

const converter = {
  "Test Count": "Test",
  "Confirmed Cases": "Confirmed",
  "Death Count": "Deaths",
  "Recovery Count": "Recovered",

  "Positive Rate": "Confirmed_Rate",
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
      "Death Count": [],
      "Recovery Count": []
    },
    displayRates: {
      "Positive Rate": [],
      "Recovery Rate": [],
      "Death Rate": []
    },
    countryCompare: {
      one: [],
      two: []
    },
    countryResources: null,
    diseaseCompare: null
  },
  getters: {
    getDisplayCounts(state) {
      return state.displayCounts;
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
    }
  },
  mutations: {
    setDisplayCounts(state, { key, payload }) {
      state.displayCounts[key] = payload;
    },
    setDisplayRates(state, { key, payload }) {
      state.displayRates[key] = payload;
    },
    setCountryResources(state, payload) {
      state.countryResources = payload;
    },
    setCountryCompare(state, { key, payload }) {
      state.countryCompare[key] = payload;
    },
    setDiseaseCompare(state, payload) {
      state.diseaseCompare = {
        labels: [
          "Confirmed Cases",
          "Death Count",
          "Recovered Count",
          "Affected Countries"
        ],
        datasets: payload
      };
    }
  },
  actions: {
    setDisplayData(
      { commit },
      { criteria, country, start_date, end_date, mode }
    ) {
      for (let i = 0; i < criteria.length; i++) {
        let cr = criteria[i];
        axios
          .get(`${process.env.VUE_APP_BASE_URL}/statistics`, {
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
          });
      }
    },
    setCountryResources({ commit }, { country }) {
      // const info = [
      //   { key: "Testing Strategy", value: "Test Homes" },
      //   { key: "Hospitals", value: 10000 },
      //   { key: "Doctors", value: 423 },
      //   { key: "Medical Workers", value: 26322 },
      //   { key: "Ventilators", value: 262 },
      //   { key: "Hospital Beds", value: 262 },
      //   { key: "ICU Beds", value: 262 },
      //   { key: "Protection Gears", value: 262 }
      // ];
      //

      axios
        .get(`${process.env.VUE_APP_BASE_URL}/publicResources/${country}`)
        .then(response => {
          let data = [];
          for (let i in response.data) {
            let val = response.data[i];
            let one = val.TimeSeries["2017"]
              ? val.TimeSeries["2017"].toFixed(2)
              : null;
            let two = val.TimeSeries["2015"]
              ? val.TimeSeries["2015"].toFixed(2)
              : null;
            data.push({
              key: val.Indicator.split("(")[0],
              value: one || two
            });
          }
          commit("setCountryResources", data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    setCountryCompare(
      { commit },
      { criteria, country, start_date, end_date, mode }
    ) {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/statistics`, {
          params: {
            criteria: converter[criteria],
            country: country,
            start_date: start_date,
            end_date: end_date
          }
        })
        .then(response => {
          let data = [];
          for (let i in response.data) {
            let val = response.data[i];
            data.push({
              x: `Day ${moment(val.t).diff(moment(start_date), "days")}`,
              y: val.y
            });
          }
          commit("setCountryCompare", { key: mode, payload: data });
        })
        .catch(error => {
          console.log(error);
        });
    },

    setDiseaseCompare({ commit }, { makeDataSet }) {
      let diseaseColors = {
        "COVID-19": [121, 134, 203],
        EBOLA: [220, 231, 117],
        SARS: [77, 208, 225],
        MERS: [240, 98, 146],
        "Seasonal flu": [220, 231, 117]
      };

      axios.get(`${process.env.VUE_APP_BASE_URL}/diseases`).then(
        response => {
          let collection = [];
          response.data.forEach(function(load) {
            let input = {
              label: load.title,
              color: diseaseColors[load.title],
              data: [
                { x: "Confirmed Cases", y: load.confirmed },
                { x: "Death Count", y: load.deaths },
                { x: "Recovered Count", y: load.recovered },
                { x: "Affected Countries", y: load.affected }
              ]
            };
            collection.push(makeDataSet(input, "bar"));
          });
          commit("setDiseaseCompare", collection);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
};
