import ajax from "../auth/ajax";

const state = {
  totalSymptoms: 0,
  mostCommonSymptom: "",
  mostCommonSymptomCount: 0,
  totalPeoplesWithSymptoms: 0,
  peoplesWithSymptoms: [],
  peopleCount: 0
};

const getters = {
  getTotalSymptoms: state => state.totalSymptoms,
  getMostCommonSymptom: state => state.mostCommonSymptom,
  getMostCommonSymptomCount: state => state.mostCommonSymptomCount,
  getTotalPeoplesWithSymptoms: state => state.totalPeoplesWithSymptoms,
  getPeoplesWithSymptoms: state => state.peoplesWithSymptoms,
  getPeopleCount: state => state.peopleCount
};

const mutations = {
  setTotalSymptoms: (state, payload) => (state.totalSymptoms = payload),
  setMostCommonSymptom: (state, payload) => (state.mostCommonSymptom = payload),
  setMostCommonSymptomCount: (state, payload) =>
    (state.mostCommonSymptomCount = payload),
  setTotalPeoplesWithSymptoms: (state, payload) =>
    (state.totalPeoplesWithSymptoms = payload),
  setPeoplesWithSymptoms: (state, payload) =>
    (state.peoplesWithSymptoms = payload),
  setPeopleCount: (state, payload) => (state.peopleCount = payload)
};

const actions = {
  fetchTotalSymptoms: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "total", value: true });
    ajax
      .get(`symptom_statistics`)
      .then(
        response => {
          commit("setTotalSymptoms", response.data.total);
          commit("setMostCommonSymptom", response.data.data[0].symptom.name);
          commit("setMostCommonSymptomCount", response.data.data[0].count);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setSymptomStatLoaders", { key: "total", value: false });
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
  },
  fetchPeoplesWithSymptoms: (
    { commit },
    { page, size, status, username, start_date, end_date }
  ) => {
    commit("setSymptomStatLoaders", { key: "peopleList", value: true });
    ajax
      .get(`symptom_statistics/logs`, {
        params: {
          page: page,
          size: size,
          status: status,
          username: username,
          start_date: start_date,
          end_date: end_date
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
              date: new Date(
                element.user_id.last_symptom_update
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZoneName: "short"
              }),
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
      .finally(function() {
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
