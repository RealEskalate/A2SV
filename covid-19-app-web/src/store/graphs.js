const state = {
  displayCounts: null,
  displayRates: null,
  countryResources: null
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
    }
  }
};
