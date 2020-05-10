import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import heatmap from "./heatmap";
import covidStates from "./covid-states";
import news from "./news";
import loaders from "./loaders";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allCountries: []
  },
  getters: {
    getAllCountries(state) {
      return state.allCountries;
    }
  },
  mutations: {
    setCountriesList(state, payload) {
      state.allCountries = payload;
    }
  },
  actions: {
    fillCountriesList({ commit }) {
      axios.get(`${process.env.VUE_APP_BASE_URL}/statistics/countries`).then(
        response => {
          commit("setCountriesList", response.data);
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  modules: {
    graphs,
    heatmap,
    covidStates,
    news,
    loaders
  }
});
