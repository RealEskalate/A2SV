import axios from "axios";
import moment from "moment";

const converter = {
  "Test Count": "Tests",
  "Confirmed Cases": "Confirmed",
  "Death Count": "Deaths",
  "Recovery Count": "Recovered",
  "Active Cases": "Active",

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
    countryResources: {
      World: null,
      "United States": null,
      Afghanistan: null,
      Albania: null,
      Algeria: null,
      Andorra: null,
      Angola: null,
      "Antigua and Barbuda": null,
      Argentina: null,
      Armenia: null,
      Australia: null,
      Austria: null,
      Azerbaijan: null,
      Bahamas: null,
      Bahrain: null,
      Bangladesh: null,
      Barbados: null,
      Belarus: null,
      Belgium: null,
      Belize: null,
      Benin: null,
      Bhutan: null,
      Bolivia: null,
      "Bosnia and Herzegovina": null,
      Botswana: null,
      Brazil: null,
      Brunei: null,
      Bulgaria: null,
      "Burkina Faso": null,
      Burma: null,
      Burundi: null,
      "Cabo Verde": null,
      Cambodia: null,
      Cameroon: null,
      Canada: null,
      "Central African Republic": null,
      Chad: null,
      Chile: null,
      China: null,
      Colombia: null,
      Comoros: null,
      "Congo (Brazzaville)": null,
      "Congo (Kinshasa)": null,
      "Costa Rica": null,
      "Cote d'Ivoire": null,
      Croatia: null,
      Cuba: null,
      Cyprus: null,
      Czechia: null,
      Denmark: null,
      Djibouti: null,
      Dominica: null,
      "Dominican Republic": null,
      Ecuador: null,
      Egypt: null,
      "El Salvador": null,
      "Equatorial Guinea": null,
      Eritrea: null,
      Estonia: null,
      Eswatini: null,
      Ethiopia: null,
      Fiji: null,
      Finland: null,
      France: null,
      Gabon: null,
      Gambia: null,
      Georgia: null,
      Germany: null,
      Ghana: null,
      Greece: null,
      Grenada: null,
      Guatemala: null,
      Guinea: null,
      "Guinea-Bissau": null,
      Guyana: null,
      Haiti: null,
      "Holy See": null,
      Honduras: null,
      Hungary: null,
      Iceland: null,
      India: null,
      Indonesia: null,
      Iran: null,
      Iraq: null,
      Ireland: null,
      Israel: null,
      Italy: null,
      Jamaica: null,
      Japan: null,
      Jordan: null,
      Kazakhstan: null,
      Kenya: null,
      "Korea, South": null,
      Kosovo: null,
      Kuwait: null,
      Kyrgyzstan: null,
      Laos: null,
      Latvia: null,
      Lebanon: null,
      Liberia: null,
      Libya: null,
      Liechtenstein: null,
      Lithuania: null,
      Luxembourg: null,
      Madagascar: null,
      Malawi: null,
      Malaysia: null,
      Maldives: null,
      Mali: null,
      Malta: null,
      Mauritania: null,
      Mauritius: null,
      Mexico: null,
      Moldova: null,
      Monaco: null,
      Mongolia: null,
      Montenegro: null,
      Morocco: null,
      Mozambique: null,
      Namibia: null,
      Nepal: null,
      Netherlands: null,
      "New Zealand": null,
      Nicaragua: null,
      Niger: null,
      Nigeria: null,
      "North Macedonia": null,
      Norway: null,
      Oman: null,
      Pakistan: null,
      Panama: null,
      "Papua New Guinea": null,
      Paraguay: null,
      Peru: null,
      Philippines: null,
      Poland: null,
      Portugal: null,
      Qatar: null,
      Romania: null,
      Russia: null,
      Rwanda: null,
      "Saint Kitts and Nevis": null,
      "Saint Lucia": null,
      "Saint Vincent and the Grenadines": null,
      "San Marino": null,
      "Sao Tome and Principe": null,
      "Saudi Arabia": null,
      Senegal: null,
      Serbia: null,
      Seychelles: null,
      "Sierra Leone": null,
      Singapore: null,
      Slovakia: null,
      Slovenia: null,
      Somalia: null,
      "South Africa": null,
      "South Sudan": null,
      Spain: null,
      "Sri Lanka": null,
      Sudan: null,
      Suriname: null,
      Sweden: null,
      Switzerland: null,
      Syria: null,
      "Taiwan*": null,
      Tajikistan: null,
      Tanzania: null,
      Thailand: null,
      "Timor-Leste": null,
      Togo: null,
      "Trinidad and Tobago": null,
      Tunisia: null,
      Turkey: null,
      Uganda: null,
      Ukraine: null,
      "United Arab Emirates": null,
      "United Kingdom": null,
      Uruguay: null,
      US: null,
      Uzbekistan: null,
      Venezuela: null,
      Vietnam: null,
      "West Bank and Gaza": null,
      "Western Sahara": null,
      Yemen: null,
      Zambia: null,
      Zimbabwe: null
    },
    diseaseCompare: null,
    graphDescriptions: {
      "Total Counts": {
        title: "Total Counts",
        description:
          "This graph represents the number of daily confirmed cases of the latest pandemic, COVID-19. The vertical line (y-axis) represents the daily confirmed cases and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
        fields: [
          {
            name: "Country",
            explanation: "Searchable list of countries"
          },
          {
            name: "Date Range",
            explanation:
              "Specific start date and finish date for calculating the counts"
          }
        ],
        criteria: [
          {
            name: "Test Count",
            explanation:
              "The total  number of tests conducted for each day in the selected range"
          },
          {
            name: "Confirmed Cases",
            explanation:
              "The total number of confirmed cases  for each day in the selected range"
          },
          {
            name: "Death Count ",
            explanation:
              "The total number of death cases  for each day in the selected range"
          },
          {
            name: "Recovery Count",
            explanation:
              "The total number of reported recoveries  for each day in the selected range"
          },
          {
            name: "Active Cases",
            explanation:
              "The number of cases still active on the day for each day in the selected range"
          }
        ]
      },
      "Daily Counts": {
        title: "Daily Counts",
        description:
          "This graph represents the number of daily confirmed cases of the latest pandemic, COVID-19. The vertical line (y-axis) represents the daily confirmed cases and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
        fields: [
          {
            name: "Country",
            explanation: "Searchable list of countries"
          },
          {
            name: "Date Range",
            explanation:
              "specific start to finish date for calculating the counts"
          },
          {
            name: "Criteria",
            explanation: " List of metrics to view "
          }
        ],
        criteria: [
          {
            name: "Daily Test",
            explanation:
              "The number of tested people for each day in the selected rangey"
          },
          {
            name: "Daily Confirmed Cases",
            explanation:
              "The number of confirmed cases for each day in the selected range"
          },
          {
            name: "Daily Death ",
            explanation:
              "The number of death cases for each day in the selected range"
          },
          {
            name: "Daily Recovery",
            explanation:
              "the number of recovered patients for each day in the selected range"
          }
        ]
      },
      "View Rates": {
        title: "View Rates",
        description:
          "This graph represents the recovery rate, active rate, and death rate of the latest pandemic, COVID-19 of either any selected country or of the entire world. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The line represents the criteria selected.",
        fields: [
          {
            name: "Country",
            explanation: "Searchable list of countries"
          },
          {
            name: "Date Range",
            explanation:
              "Specific start to finish date for calculating the counts"
          }
        ],
        criteria: [
          {
            name: "Positive Rate ",
            explanation:
              "The percentage of positive counts from the test counts of all days in the selected range"
          },
          {
            name: "Recovery Rate",
            explanation:
              "The percentage of recovered counts from the confirmed test counts of all days in the selected range"
          },
          {
            name: "Active Rate",
            explanation:
              "The percentage of active patient counts from the confirmed test counts of all days in the selected range"
          },
          {
            name: "Death Rate",
            explanation:
              "The percentage of  death counts from the test counts of all days in the selected range"
          }
        ]
      },
      "Compare Countries": {
        title: "Compare Countries",
        description:
          "This graph represents the comparison of two selected countries regarding the latest pandemic, COVID-19 of either any selected country or of the entire world based on factors including test counts, confirmed cases, death counts, recovery counts, active cases, and others. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The two lines represent the criteria selected.",
        fields: [
          {
            name: "Country 1 & 2",
            explanation: " An option to select two countries to compare"
          },
          {
            name: "Date Range 1 & 2",
            explanation:
              "Specific start to finish date in which we see the data for the respective country"
          },
          {
            name: "Common Criteria",
            explanation: "Mutual criteria to compare the chosen countries"
          }
        ],
        criteria: [
          {
            name: "Test Count",
            explanation:
              "The total  number of tests conducted  for each day in the selected range"
          },
          {
            name: "Recovery Count",
            explanation:
              "The total number of reported recoveries  for each day in the selected range"
          },
          {
            name: "Confirmed Cases",
            explanation:
              "The total number of confirmed cases  for each day in the selected range"
          },
          {
            name: "Death Count ",
            explanation:
              "The total number of death cases  for each day in the selected range"
          },
          {
            name: "Active Cases",
            explanation:
              "The number of cases still active on the day for each day in the selected range"
          },
          {
            name: "Positive Rate ",
            explanation:
              "The percentage of positive counts from the test counts of all days in the selected range"
          },
          {
            name: "Recovery Rate",
            explanation:
              "The percentage of recovered counts from the confirmed test counts of all days in the selected range"
          },
          {
            name: "Active Rate",
            explanation:
              "The percentage of active patient counts from the confirmed test counts of all days in the selected range"
          },
          {
            name: "Death Rate",
            explanation:
              "The percentage of death counts from the test counts of all days in the selected range"
          }
        ]
      },
      "Compare Similar Diseases": {
        title: "Compare Similar Diseases",
        description:
          "This graph represents the comparison of the latest pandemic, COVID-19 with other similar epidemics of the entire world based on factors including confirmed cases, death counts, recovery counts, active cases, and others. The vertical line (y-axis) represents the rate of increase and the horizontal line (x-axis) represents the date. The two lines represent the criteria selected.",
        fields: [],
        criteria: [
          {
            name: "Confirmed  Cases",
            explanation: "The overall number of confirmed cases "
          },
          {
            name: "Death Count",
            explanation: "The overall number of death cases"
          },
          {
            name: "Recovery Count",
            explanation: "The overall number of recovery cases"
          },
          {
            name: "Affected Countries",
            explanation: "The overall number of countries affected"
          }
        ]
      },
      "Country Resources": {
        title: "Available Resources",
        content: "describing what they are doing",
        resources: [
          { name: "Hospital Beds", explanation: "this explanation" },
          { name: "this other resource", explanation: "this other explanation" }
        ]
      }
    }
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
          "Recovered Count",
          "Affected Countries"
        ],
        datasets: payload
      };
    },
    setGraphDescriptions(state, { key, payload }) {
      state.graphDescriptions[key] = payload;
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
        axios
          .get(`${process.env.VUE_APP_BASE_URL}/api/statistics`, {
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
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/statistics`, {
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
      { commit },
      { criteria, country, start_date, end_date, mode }
    ) {
      commit("incrementGraphLoaders", "countryCompare");
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/statistics`, {
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
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/diseases`)
        .then(response => {
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
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          commit("decrementGraphLoaders", "diseaseCompare");
        });
    },
    setCountryResources({ commit }, { country }) {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/publicResources/${country}`)
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
          commit("setCountryResources", { key: country, payload: data });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
