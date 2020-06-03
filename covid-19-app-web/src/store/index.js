import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import heatmap from "./heatmap";
import learn from "./learn";
import about from "./about";
import news from "./news";
import loaders from "./loaders";
import axios from "axios";
import messages from "./messages";
import symptomTracking from "./symptom-tracking";
import user from "./user";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export const langConverter = {
  en: "English",
  am: "Amharic"
};

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: [
        "navigationType",
        "languagePreference",
        "firstVisit",
        "user.user",
        "user.token"
      ]
    })
  ],
  state: {
    allCountries: [],
    navigationType: "1",
    languagePreference: null,
    firstVisit: true
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
    },
    getFirstVisit(state) {
      return state.firstVisit;
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
    },
    setFirstVisit(state, payload) {
      state.firstVisit = payload;
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
    },
    setLanguagePreference({ commit }, { lang }) {
      commit("setLanguagePreference", lang);
    },
    setFirstVisit({ commit }, { value }) {
      commit("setFirstVisit", value);
    }
  },
  modules: {
    graphs,
    heatmap,
    learn,
    about,
    news,
    user,
    loaders,
    messages,
    symptomTracking
  }
});
