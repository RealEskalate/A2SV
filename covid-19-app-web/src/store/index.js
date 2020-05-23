import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import heatmap from "./heatmap";
import learn from "./learn";
import news from "./news";
import loaders from "./loaders";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["navigationType", "languagePreference"]
    })
  ],
  state: {
    allCountries: [],
    navigationType: "1",
    languagePreference: null
  },
  getters: {
    getAllCountries(state) {
      return state.allCountries;
    },
    getNavigationType(state) {
      return state.navigationType;
    },
    getLanguagePreference(state) {
      return state.languagePreference;
    }
  },
  mutations: {
    setCountriesList(state, payload) {
      state.allCountries = payload;
    },
    setNavigationType(state, payload) {
      state.navigationType = payload;
    },
    setLanguagePreference(state, payload) {
      state.languagePreference = payload;
    }
  },
  actions: {
    fillCountriesList({ commit }) {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/statistics/countries`)
        .then(
          response => {
            commit("setCountriesList", response.data);
          },
          error => {
            console.log(error);
          }
        );
    },
    setNavState({ commit }, { type }) {
      commit("setNavigationType", type);
      console.log("type", type);
    },
    setLanguagePreference({commit}, {lang}) {
      console.log(lang);
      commit("setLanguagePreference", lang);
    }
  },
  modules: {
    graphs,
    heatmap,
    learn,
    news,
    loaders
  }
});
