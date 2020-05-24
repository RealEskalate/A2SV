export default {
  state: {
    newsLoaders: {
      list: false,
      sources: false
    },
    learnLoaders: {
      information: false,
      actions: false,
      states: false,
      learningPaths: false
    },
    graphLoaders: {
      counts: 0,
      rates: 0,
      daily: 0,
      countryCompare: 0,
      diseaseCompare: 0,
      descriptions: false
    }
  },
  getters: {
    getNewsLoaders(state) {
      return state.newsLoaders;
    },
    getLearnLoaders(state) {
      return state.learnLoaders;
    },
    getGraphLoaders(state) {
      return state.graphLoaders;
    }
  },
  mutations: {
    setNewsLoaders(state, { key, value }) {
      state.newsLoaders[key] = value;
    },
    setLearnLoaders(state, { key, value }) {
      state.learnLoaders[key] = value;
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
