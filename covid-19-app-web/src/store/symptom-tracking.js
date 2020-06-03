import ajax from "../auth/ajax";

const state = {
  symptomUser: [],
  cities: []
};

const getters = {
  getSymptomUser: state => {
    return state.symptomUser;
  },
  getCities: state => {
    return state.cities;
  }
};

const mutations = {
  setSymptomUser: (state, payload) => {
    state.symptomUser = payload;
  },
  setCities: (state, payload) => {
    state.cities = payload;
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
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
