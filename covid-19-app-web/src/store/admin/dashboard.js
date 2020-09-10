import ajax from "../../auth/ajax";

const state = {
  graphData: [[], [], [], []]
};

const getters = {
  getGraphData: state => state.graphData
};

const mutations = {
  setCitizenSymptoms: (state, payload) => (state.graphData[1] = payload)
};

const actions = {
  queryDeaths: ({ commit }, { start_date, end_date }) => {
    ajax
      .get(`test-stat?status=Died`, {
        params: {
          start_date,
          end_date,
          status: "Died"
        }
      })
      .then(
        response => {
          console.log(response);
          commit("setDeaths", response.data.data);
        },
        error => {
          console.log(error);
        }
      );
  },
  queryCitizenSymptoms: ({ commit }, { start_date, end_date }) => {
    ajax
      .get(`new_citizen_symptoms`, {
        params: { start_date, end_date }
      })
      .then(
        response => {
          let item = {
            title: "Citizens with symptoms",
            arr: [],
            totalNum: 123,
            increaseRate: 1
          };
          response.data.forEach(val => item.arr.push(val.total));
          commit("setCitizenSymptoms", item);
        },
        error => {
          console.log(error);
        }
      );
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
