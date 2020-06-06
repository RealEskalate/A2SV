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
    aboutLoaders: {
      descriptions: false,
      actions: false
    },
    symTrackLoaders: {
      map: false,
      userSymptoms: false,
      allSymptoms: false
    },
    graphLoaders: {
      counts: 0,
      rates: 0,
      daily: 0,
      countryCompare: 0,
      diseaseCompare: 0,
      descriptions: false,
      countryResources: false
    }
  },
  getters: {
    getNewsLoaders(state) {
      return state.newsLoaders;
    },
    getLearnLoaders(state) {
      return state.learnLoaders;
    },
    getAboutLoaders(state) {
      return state.aboutLoaders;
    },
    getSymTrackLoaders(state) {
      return state.symTrackLoaders;
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
    setAboutLoaders(state, { key, value }) {
      state.aboutLoaders[key] = value;
    },
    setSymTrackLoaders(state, { key, value }) {
      state.symTrackLoaders[key] = value;
    },
    setGraphLoaders(state, { key, value }) {
      state.graphLoaders[key] = value;
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
