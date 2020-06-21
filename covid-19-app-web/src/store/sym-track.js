import ajax from "../auth/ajax";
import { langConverter } from "./index";

const state = {
  allSymptoms: [],
  symptomUser: {
    probability: 0,
    symptom_info: []
  },
  symptomHistory: [],
  cities: [],
  locationsSymptoms: null
};

const getters = {
  getAllSymptoms: state => {
    return state.allSymptoms;
  },
  getSymptomUser: state => {
    return state.symptomUser;
  },
  getSymptomHistory: state => {
    return state.symptomHistory;
  },
  getCities: state => {
    return state.cities;
  },
  getLocationsSymptoms: state => {
    return state.locationsSymptoms;
  }
};

const mutations = {
  setAllSymptoms: (state, payload) => {
    state.allSymptoms = payload;
  },
  setSymptomUser: (state, payload) => {
    state.symptomUser = payload;
  },
  setSymptomHistory: (state, payload) => {
    state.symptomHistory = payload;
  },
  setCities: (state, payload) => {
    state.cities = payload;
  },
  setLocationsSymptoms: (state, payload) => {
    state.locationsSymptoms = payload;
  }
};

const actions = {
  setAllSymptoms: ({ commit }, { lang }) => {
    commit("setSymTrackLoaders", { key: "allSymptoms", value: true });
    ajax
      .get(`symptoms`, {
        params: {
          language: langConverter[lang]
        }
      })
      .then(res => {
        commit("setAllSymptoms", res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      })
      .finally(function() {
        commit("setSymTrackLoaders", { key: "allSymptoms", value: false });
      });
  },
  setSymptomUser: ({ commit, getters }, { userId, lang, demo }) => {
    commit("setSymTrackLoaders", { key: "userSymptoms", value: true });
    ajax
      .get(`symptomuser/user/${userId}`, {
        params: {
          language: langConverter[lang],
          probability: true,
          iso: getters.getCurrentCountry.code,
          demo: demo
        }
      })
      .then(res => {
        commit("setSymptomUser", res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      })
      .finally(function() {
        commit("setSymTrackLoaders", { key: "userSymptoms", value: false });
      });
  },
  setSymptomHistory: ({ commit }, { userId, lang }) => {
    commit("setSymTrackLoaders", { key: "symptomHistory", value: true });
    ajax
      .get(`symptomuserhistory/user/${userId}`, {
        params: {
          language: langConverter[lang]
        }
      })
      .then(res => {
        commit("setSymptomHistory", res.data.events);
      })
      .catch(err => {
        console.log(err.response.data);
      })
      .finally(function() {
        commit("setSymTrackLoaders", { key: "symptomHistory", value: false });
      });
  },
  setCities: ({ commit }, { keyword, limit }) => {
    commit("setSymTrackLoaders", { key: "cities", value: true });
    ajax
      .get("cities", {
        params: {
          matches: keyword,
          limit: limit
        }
      })
      .then(res => {
        commit("setCities", res.data);
      })
      .finally(function() {
        commit("setSymTrackLoaders", { key: "cities", value: false });
      });
  },
  setLocationsSymptoms: ({ commit }, input) => {
    commit("setSymTrackLoaders", { key: "map", value: true });
    ajax
      .post("locations_symptoms", input, {
        params: {
          demo: true
        }
      })
      .then(res => {
        commit("setLocationsSymptoms", res.data);
      })
      .catch(err => {
        console.log(err.response.data);
      })
      .finally(() => {
        commit("setSymTrackLoaders", { key: "map", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
