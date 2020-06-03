import ajax from "../auth/ajax";

const state = {
  symptomUser: [],
  cities: [],
  locationsSymptoms: null
};

const getters = {
  getSymptomUser: state => {
    return state.symptomUser;
  },
  getCities: state => {
    return state.cities;
  },
  getLocationSymptoms: state => {
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
  setLocationSymptoms: (state, payload) => {
    state.locationsSymptoms = payload;
  }
};

const actions = {
  setSymptomUser: ({ commit }, { userId }) => {
    ajax.get(`symptomuser/user/${userId}/`).then(res => {
      console.log(res.data);
      commit("setSymptomUser", res.data);
    });
  },
  setCities: ({ commit }) => {
    ajax.get("cities").then(res => {
      console.log(res.data);
      commit("setCities", res.data);
    });
  },
  setLocationSymptoms: ({ commit }, { location }) => {
    ajax.post("locations_symptoms", location).then(res => {
      console.log(res.data);
      commit("setLocationSymptoms", res.data);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
