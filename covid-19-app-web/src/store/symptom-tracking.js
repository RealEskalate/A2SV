import ajax from "../auth/ajax";

const state = {
  allSymptoms: [],
  symptomUser: [],
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
  setCities: (state, payload) => {
    state.cities = payload;
  },
  setLocationsSymptoms: (state, payload) => {
    state.locationsSymptoms = payload;
  }
};

const actions = {
  setAllSymptoms: ({ commit }) => {
    commit("setSymTrackLoaders", { key: "allSymptoms", value: true });
    ajax
      .get(`symptoms`)
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
  setSymptomUser: ({ commit }, userId) => {
    commit("setSymTrackLoaders", { key: "userSymptoms", value: true });
    ajax
      .get(`symptomuser/user/${userId}`)
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
  setCities: ({ commit }) => {
    ajax.get("cities").then(res => {
      commit("setCities", res.data);
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
