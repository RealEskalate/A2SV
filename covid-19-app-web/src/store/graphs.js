import axios from "axios";

const state = {
  displayCounts: null,
  displayRates: null,
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
    setDisplayCounts(state, payload) {
      state.displayCounts = {
        datasets: payload
      };
    },
    setDisplayRates(state, payload) {
      state.displayRates = {
        datasets: payload
      };
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
    setDisplayData({ commit }, { criteria, makeDataSet, mode }) {
      const info = {
        "Test Count": [
          { t: "2018-11-24", y: 400 },
          { t: "2019-01-29", y: 530 },
          { t: "2019-10-02", y: 780 },
          { t: "2019-11-11", y: 120 }
        ],
        "Confirmed Cases": [
          { t: "2018-11-25", y: 343 },
          { t: "2019-03-30", y: 653 },
          { t: "2019-05-06", y: 212 },
          { t: "2020-01-13", y: 32 }
        ],
        "Death Count": [
          { t: "2018-11-25", y: 636 },
          { t: "2019-02-03", y: 356 },
          { t: "2019-10-06", y: 136 },
          { t: "2020-01-13", y: 145 }
        ],
        "Recovery Count": [
          { t: "2018-11-25", y: 457 },
          { t: "2019-05-30", y: 533 },
          { t: "2019-08-06", y: 234 },
          { t: "2020-01-13", y: 346 }
        ],

        "Positive Rate": [
          { t: "2018-11-24", y: 40 },
          { t: "2019-01-29", y: 53 },
          { t: "2019-10-02", y: 78 },
          { t: "2019-11-11", y: 12 }
        ],
        "Recovery Rate": [
          { t: "2018-11-25", y: 62 },
          { t: "2019-03-30", y: 53 },
          { t: "2019-05-06", y: 43 },
          { t: "2020-01-13", y: 24 }
        ],
        "Hospitalization Rate": [
          { t: "2018-11-25", y: 86 },
          { t: "2019-02-03", y: 45 },
          { t: "2019-10-06", y: 23 },
          { t: "2020-01-13", y: 31 }
        ],
        "ICU Rate": [
          { t: "2018-11-25", y: 34 },
          { t: "2019-05-30", y: 43 },
          { t: "2019-08-06", y: 55 },
          { t: "2020-01-13", y: 78 }
        ],
        "Death Rate": [
          { t: "2018-11-25", y: 97 },
          { t: "2019-05-30", y: 43 },
          { t: "2019-08-06", y: 11 },
          { t: "2020-01-13", y: 41 }
        ]
      };

      let collection = [];
      criteria.forEach(function(cr) {
        let input = {
          label: cr.label,
          color: cr.color,
          data: info[cr.label]
        };
        // TODO fetch the data from API here
        collection.push(makeDataSet(input));
      });

      if (mode === "rates") {
        commit("setDisplayRates", collection);
      } else {
        commit("setDisplayCounts", collection);
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
      const info = {
        "Test Count": {
          Ethiopia: [
            { t: "2018-11-24", y: 400 },
            { t: "2019-10-02", y: 356 }
          ],
          "United States": [
            { t: "2019-01-29", y: 32 },
            { t: "2019-11-11", y: 452 }
          ],
          World: [
            { t: "2019-01-29", y: 532 },
            { t: "2019-11-11", y: 346 }
          ]
        },
        "Confirmed Cases": {
          Ethiopia: [
            { t: "2018-11-24", y: 362 },
            { t: "2019-10-02", y: 434 }
          ],
          "United States": [
            { t: "2019-01-29", y: 234 },
            { t: "2019-11-11", y: 235 }
          ],
          World: [
            { t: "2019-01-29", y: 23 },
            { t: "2019-11-11", y: 42 }
          ]
        },
        "Death Count": {
          Ethiopia: [
            { t: "2018-11-24", y: 44 },
            { t: "2019-10-02", y: 323 }
          ],
          "United States": [
            { t: "2019-01-29", y: 530 },
            { t: "2019-11-11", y: 323 }
          ],
          World: [
            { t: "2019-01-29", y: 234 },
            { t: "2019-11-11", y: 424 }
          ]
        },
        "Recovery Count": {
          Ethiopia: [
            { t: "2018-11-24", y: 346 },
            { t: "2019-10-02", y: 234 }
          ],
          "United States": [
            { t: "2019-01-29", y: 456 },
            { t: "2019-11-11", y: 123 }
          ],
          World: [
            { t: "2019-01-29", y: 77 },
            { t: "2019-11-11", y: 93 }
          ]
        },

        "Positive Rate": {
          Ethiopia: [
            { t: "2018-11-24", y: 34 },
            { t: "2019-10-02", y: 64 }
          ],
          "United States": [
            { t: "2019-01-29", y: 23 },
            { t: "2019-11-11", y: 61 }
          ],
          World: [
            { t: "2019-01-29", y: 30 },
            { t: "2019-11-11", y: 78 }
          ]
        },
        "Recovery Rate": {
          Ethiopia: [
            { t: "2018-11-24", y: 34 },
            { t: "2019-10-02", y: 64 }
          ],
          "United States": [
            { t: "2019-01-29", y: 23 },
            { t: "2019-11-11", y: 61 }
          ],
          World: [
            { t: "2019-01-29", y: 30 },
            { t: "2019-11-11", y: 78 }
          ]
        },
        "Hospitalization Rate": {
          Ethiopia: [
            { t: "2018-11-24", y: 34 },
            { t: "2019-10-02", y: 64 }
          ],
          "United States": [
            { t: "2019-01-29", y: 23 },
            { t: "2019-11-11", y: 61 }
          ],
          World: [
            { t: "2019-01-29", y: 30 },
            { t: "2019-11-11", y: 78 }
          ]
        },
        "ICU Rate": {
          Ethiopia: [
            { t: "2018-11-24", y: 34 },
            { t: "2019-10-02", y: 64 }
          ],
          "United States": [
            { t: "2019-01-29", y: 62 },
            { t: "2019-11-11", y: 32 }
          ],
          World: [
            { t: "2019-01-29", y: 62 },
            { t: "2019-11-11", y: 46 }
          ]
        },
        "Death Rate": {
          Ethiopia: [
            { t: "2018-11-24", y: 32 },
            { t: "2019-10-02", y: 9 }
          ],
          "United States": [
            { t: "2019-01-29", y: 59 },
            { t: "2019-11-11", y: 67 }
          ],
          World: [
            { t: "2019-01-29", y: 42 },
            { t: "2019-11-11", y: 42 }
          ]
        }
      };
      // TODO fetch country Comparison here
      let input = {
        label: country,
        color: color,
        data: info[criteria][country]
      };

      if (mode === "one") {
        commit("setCountryOne", makeDataSet(input));
      } else {
        commit("setCountryTwo", makeDataSet(input));
      }
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
          commit("setSources", response.data);
          // commit('setNewsMeta', response.meta);
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
