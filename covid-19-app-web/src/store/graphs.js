import axios from "axios";

const state = {
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
  countryResources: null,
  countryCompare: null,
  diseaseCompare: null
};

export default {
  state,
  getters: {
    getDisplayCounts() {
      return state.displayCounts;
    },
    getDisplayRates() {
      return state.displayRates;
    },
    getCountryResources() {
      return state.countryResources;
    },
    getCountryCompare() {
      return state.countryCompare;
    },
    getDiseaseCompare() {
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
    setCountryOne(state, payload) {
      if (!state.countryCompare) {
        state.countryCompare = {
          datasets: [payload]
        };
      } else if (state.countryCompare.datasets.length === 1) {
        state.countryCompare = {
          datasets: [payload, state.countryCompare.datasets[0]]
        };
      } else {
        state.countryCompare = {
          datasets: [payload, state.countryCompare.datasets[1]]
        };
      }
    },
    setCountryTwo(state, payload) {
      if (!state.countryCompare) {
        state.countryCompare = {
          datasets: [payload]
        };
      } else if (state.countryCompare.datasets.length === 1) {
        state.countryCompare = {
          datasets: [state.countryCompare.datasets[0], payload]
        };
      } else {
        state.countryCompare = {
          datasets: [state.countryCompare.datasets[0], payload]
        };
      }
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

      for (let i = 0; i < criteria.length; i++) {
        let cr = criteria[i];
        axios
          .get(`http://localhost:3000/api/statistics`, {
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
      // TODO fetch country resources here
      console.log(country);
      const info = [
        { key: "Testing Strategy", value: "Test Homes" },
        { key: "Hospitals", value: 10000 },
        { key: "Doctors", value: 423 },
        { key: "Medical Workers", value: 26322 },
        { key: "Ventilators", value: 262 },
        { key: "Hospital Beds", value: 262 },
        { key: "ICU Beds", value: 262 },
        { key: "Protection Gears", value: 262 }
      ];
      commit("setCountryResources", info);
    },
    setCountryCompare(
      { commit },
      { criteria, makeDataSet, country, color, mode }
    ) {
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
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/statistics`, {
          params: {
            criteria: converter[criteria],
            country: country
          }
        })
        .then(response => {
          let input = {
            label: country,
            color: color,
            data: response.data
          };
          if (mode === "one") {
            commit("setCountryOne", makeDataSet(input));
          } else {
            commit("setCountryTwo", makeDataSet(input));
          }
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
        MERS: [240, 98, 146]
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
