import ajax from "../auth/ajax";

const state = {
  totalSymptoms: 0,
  mostCommonSymptom: "",
  totalPeoplesWithSymptoms: 0
};

const getters = {
  getTotalSymptoms: state => state.totalSymptoms,
  getMostCommonSymptom: state => state.mostCommonSymptom,
  getTotalPeoplesWithSymptoms: state => state.totalPeoplesWithSymptoms
};

const mutations = {
  setTotalSymptoms: (state, payload) => state.totalSymptoms = payload,
  setMostCommonSymptom: (state, payload) => state.mostCommonSymptom = payload,
  setTotalPeoplesWithSymptoms: (state, payload) => state.totalPeoplesWithSymptoms = payload
};

const actions = {
  fetchTotalSymptoms: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "total", value: true });
    ajax
      .get(`symptom_statistics`) 
      .then(
        response => {
          commit("setTotalSymptoms", response.data.result);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setSymptomStatLoaders", { key: "total", value: false });
      });
  },
  fetchMostCommonSymptom: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "mostCommon", value: true });
    ajax
      .get(`symptom_statistics/most_common`)
      .then(
        response => {
          commit("setMostCommonSymptom", response.data[0].name);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setSymptomStatLoaders", { key: "mostCommon", value: false });
      });
  },
  fetchTotalPeoplesWithSymptoms: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "totalPeople", value: true });
    ajax
      .get(`symptom_statistics/people`)
      .then(
        response => {
          commit("setTotalPeoplesWithSymptoms", response.data.result);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setSymptomStatLoaders", { key: "totalPeople", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};