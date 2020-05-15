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
      paths: ["navigationType"]
    })
  ],
  state: {
    allCountries: [],
    navigationType: "1"
  },
  getters: {
    getAllCountries(state) {
      return state.allCountries;
    },
    getNavigationType(state) {
      return state.navigationType;
    }
  },
  mutations: {
    setCountriesList(state, payload) {
      state.allCountries = payload;
    },
    setNavigationType(state, payload) {
      state.navigationType = payload;
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
    },
    setNavState({ commit }, { type }) {
      commit("setNavigationType", type);
      console.log("type", type);
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
