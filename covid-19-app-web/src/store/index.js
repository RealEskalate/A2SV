import Vue from "vue";
import Vuex from "vuex";
import graphs from "./graphs";
import heatmap from "./heatmap";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    graphs,
    heatmap
  }
});
