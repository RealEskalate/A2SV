import ajax from "../auth/ajax";

const state = {
  totalSymptoms: 0,
  mostCommonSymptom: "",
  totalPeoplesWithSymptoms: 0,
  peoplesWithSymptoms: [],
  peopleCount: 0
};

const getters = {
  getTotalSymptoms: state => state.totalSymptoms,
  getMostCommonSymptom: state => state.mostCommonSymptom,
  getTotalPeoplesWithSymptoms: state => state.totalPeoplesWithSymptoms,
  getPeoplesWithSymptoms: state => state.peoplesWithSymptoms,
  getPeopleCount: state => state.peopleCount
};

const mutations = {
  setTotalSymptoms: (state, payload) => state.totalSymptoms = payload,
  setMostCommonSymptom: (state, payload) => state.mostCommonSymptom = payload,
  setTotalPeoplesWithSymptoms: (state, payload) => state.totalPeoplesWithSymptoms = payload,
  setPeoplesWithSymptoms: (state, payload) => state.peoplesWithSymptoms = payload,
  setPeopleCount: (state, payload) => state.peopleCount = payload
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
      .finally(function () {
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
      .finally(function () {
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
      .finally(function () {
        commit("setSymptomStatLoaders", { key: "totalPeople", value: false });
      });
  },
  fetchPeoplesWithSymptoms: ({ commit }, { page, size }) => {
    commit("setSymptomStatLoaders", { key: "peopleList", value: true });
    ajax
      .get(`symptom_statistics/logs`, {
        params: {
          page: page,
          size: size
        }
      })
      .then(
        response => {
          commit("setPeopleCount", response.data.data_count);
          let tableData = [];
          response.data.data.forEach(element => {
            let row = {
              id: element.user_id._id,
              gender: element.user_id.gender,
              date: element.user_id.last_symptom_update,
              status: element.status,
              person: element.user_id.username,
              symptoms: Array(element.current_symptoms.symptoms.length)
                .fill()
                .map((_, i) => " " + element.current_symptoms.symptoms[i].name),
              riskScore: element.current_symptoms.symptoms[0].relevance, //until risk_score can be mapped to "High, Medium, Low"
              location: element.current_symptoms.location.country
            };
            tableData.push(row);
          });
          commit("setPeoplesWithSymptoms", tableData);
          console.log(tableData);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function () {
        commit("setSymptomStatLoaders", { key: "peopleList", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};