import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import heatmap from "./heatmap";
import covidStates from './covid-states';
import news from './news';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    graphs,
    heatmap,
    covidStates,
    news
  }
});
