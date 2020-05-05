export default {
  state: {
    newsLoaders: {
      list: false,
      sources: false
    },
    graphLoaders: {
      counts: 0,
      rates: 0,
      countryCompare: 0,
      diseaseCompare: 0
    }
  },
  getters: {
    getNewsLoaders(state) {
      return state.newsLoaders;
    },
    getGraphLoaders(state) {
      return state.graphLoaders;
    }
  },
  mutations: {
    setNewsLoaders(state, { key, value }) {
      state.newsLoaders[key] = value;
    },
    incrementGraphLoaders(state, key) {
      state.newsLoaders[key]++;
    },
    decrementGraphLoaders(state, key) {
      state.newsLoaders[key]--;
    },
    resetGraphLoaders(state, key) {
      state.newsLoaders[key] = 0;
    }
  },
  actions: {
    setNewsLoaders({ commit }, { key, value }) {
      commit("setNewsLoaders", { key: key, value: value });
    },
    incrementGraphLoaders({ commit }, key) {
      commit("incrementGraphLoaders", key);
    },
    decrementGraphLoaders({ commit }, key) {
      commit("decrementGraphLoaders", key);
    },
    resetGraphLoaders({ commit }, key) {
      commit("resetGraphLoaders", key);
    }
  }
};
