export default {
  state: {
    newsLoaders: {
      list: false,
      sources: false
    },
    graphLoaders: {
      counts: 0,
      rates: 0,
      daily: 0,
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
      state.graphLoaders[key]++;
    },
    decrementGraphLoaders(state, key) {
      state.graphLoaders[key]--;
    },
    resetGraphLoaders(state, key) {
      state.graphLoaders[key] = 0;
    }
  }
};
