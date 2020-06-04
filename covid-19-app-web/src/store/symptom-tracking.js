import ajax from "../auth/ajax";

const state = {
  symptomUser: [],
  cities: [],
  locationsSymptoms: []
};

const getters = {
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
  setSymptomUser: ({ commit }, { userId }) => {
    ajax.get(`symptomuser/user/${userId}/demo=true`).then(res => {
      console.log(res);
      commit("setSymptomUser", res.data);
    });
  },
  setCities: ({ commit }) => {
    ajax.get("cities").then(res => {
      console.log(res);
      commit("setCities", res.data);
    });
  },
  setLocationsSymptoms: ({ commit }, location) => {
    ajax.post("locations_symptoms", location).then(res => {
      console.log(res.data);
      commit("setLocationsSymptoms", res);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
