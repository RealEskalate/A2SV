import axios from "axios";
import moment from "moment";

const converter = {
  "Test Count": "Tests",
  "Confirmed Cases": "Confirmed",
  "Death Count": "Deaths",
  "Recovery Count": "Recovered",
  "Active Cases": "Active",

  "Daily Test": "Test",
  "Daily Confirmed": "Confirmed",
  "Daily Deaths": "Deaths",
  "Daily Recovery": "Recovered",
  "Daily Active": "Active",

  "Positive Rate": "Confirmed_Rate",
  "Recovery Rate": "Recovered_Rate",
  "Active Rate": "Active_Rate",
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
      "Recovery Count": [],
      "Active Counts": []
    },
    dailyCounts: {
      "Daily Test": [],
      "Daily Confirmed": [],
      "Daily Deaths": [],
      "Daily Recovery": []
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
    countryResources: { "World": null, "United States": null, "Afghanistan": null, "Albania": null, "Algeria": null, "Andorra": null, "Angola": null, "Antigua and Barbuda": null, "Argentina": null, "Armenia": null, "Australia": null, "Austria": null, "Azerbaijan": null, "Bahamas": null, "Bahrain": null, "Bangladesh": null, "Barbados": null, "Belarus": null, "Belgium": null, "Belize": null, "Benin": null, "Bhutan": null, "Bolivia": null, "Bosnia and Herzegovina": null, "Botswana": null, "Brazil": null, "Brunei": null, "Bulgaria": null, "Burkina Faso": null, "Burma": null, "Burundi": null, "Cabo Verde": null, "Cambodia": null, "Cameroon": null, "Canada": null, "Central African Republic": null, "Chad": null, "Chile": null, "China": null, "Colombia": null, "Comoros": null, "Congo (Brazzaville)": null, "Congo (Kinshasa)": null, "Costa Rica": null, "Cote d'Ivoire": null, "Croatia": null, "Cuba": null, "Cyprus": null, "Czechia": null, "Denmark": null, "Djibouti": null, "Dominica": null, "Dominican Republic": null, "Ecuador": null, "Egypt": null, "El Salvador": null, "Equatorial Guinea": null, "Eritrea": null, "Estonia": null, "Eswatini": null, "Ethiopia": null, "Fiji": null, "Finland": null, "France": null, "Gabon": null, "Gambia": null, "Georgia": null, "Germany": null, "Ghana": null, "Greece": null, "Grenada": null, "Guatemala": null, "Guinea": null, "Guinea-Bissau": null, "Guyana": null, "Haiti": null, "Holy See": null, "Honduras": null, "Hungary": null, "Iceland": null, "India": null, "Indonesia": null, "Iran": null, "Iraq": null, "Ireland": null, "Israel": null, "Italy": null, "Jamaica": null, "Japan": null, "Jordan": null, "Kazakhstan": null, "Kenya": null, "Korea, South": null, "Kosovo": null, "Kuwait": null, "Kyrgyzstan": null, "Laos": null, "Latvia": null, "Lebanon": null, "Liberia": null, "Libya": null, "Liechtenstein": null, "Lithuania": null, "Luxembourg": null, "Madagascar": null, "Malawi": null, "Malaysia": null, "Maldives": null, "Mali": null, "Malta": null, "Mauritania": null, "Mauritius": null, "Mexico": null, "Moldova": null, "Monaco": null, "Mongolia": null, "Montenegro": null, "Morocco": null, "Mozambique": null, "Namibia": null, "Nepal": null, "Netherlands": null, "New Zealand": null, "Nicaragua": null, "Niger": null, "Nigeria": null, "North Macedonia": null, "Norway": null, "Oman": null, "Pakistan": null, "Panama": null, "Papua New Guinea": null, "Paraguay": null, "Peru": null, "Philippines": null, "Poland": null, "Portugal": null, "Qatar": null, "Romania": null, "Russia": null, "Rwanda": null, "Saint Kitts and Nevis": null, "Saint Lucia": null, "Saint Vincent and the Grenadines": null, "San Marino": null, "Sao Tome and Principe": null, "Saudi Arabia": null, "Senegal": null, "Serbia": null, "Seychelles": null, "Sierra Leone": null, "Singapore": null, "Slovakia": null, "Slovenia": null, "Somalia": null, "South Africa": null, "South Sudan": null, "Spain": null, "Sri Lanka": null, "Sudan": null, "Suriname": null, "Sweden": null, "Switzerland": null, "Syria": null, "Taiwan*": null, "Tajikistan": null, "Tanzania": null, "Thailand": null, "Timor-Leste": null, "Togo": null, "Trinidad and Tobago": null, "Tunisia": null, "Turkey": null, "Uganda": null, "Ukraine": null, "United Arab Emirates": null, "United Kingdom": null, "Uruguay": null, "US": null, "Uzbekistan": null, "Venezuela": null, "Vietnam": null, "West Bank and Gaza": null, "Western Sahara": null, "Yemen": null, "Zambia": null, "Zimbabwe": null },
    diseaseCompare: null
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
          "Recovered Count",
          "Death Count",
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
          commit("setCountryResources", { key: country, payload: data});
        })
        .catch(error => {
          console.log(error);
        });
    },
    setDailyCounts({ commit }, { criteria, country, start_date, end_date }) {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/statistics`, {
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
        "SEASONAL FLU": [176, 190, 197]
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
