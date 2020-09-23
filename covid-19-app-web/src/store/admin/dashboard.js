import ajax from "../../auth/ajax";
import moment from "moment";

const state = {
  graphData: [[], [], [], []],
  xLables: []
};

const getters = {
  getGraphData: state => state.graphData,
  getXLables: state => state.xLables
};

const mutations = {
  setGraphData: (state, payload) => (state.graphData = payload),
  setXLables: (state, payload) => (state.xLables = payload)
};

const actions = {
  fetchGraphData: ({ commit }, { start_date, end_date }) => {
    commit("setDashboardLoaders", { key: "graphInput", value: true });
    ajax
      .get(`test-stat`, {
        params: {
          start_date: start_date,
          end_date: end_date,
          demo: true
        }
      })
      .then(
        response => {
          console.log(response);
          const data = response.data;
          let graphData =  [[], [], [], []];
          let xLables = [];
          for (let key in data) {
            xLables.push(moment(key).format("MM/DD"));
            graphData[0].push(data[key].administered);
            graphData[1].push(data[key].positive);
            graphData[2].push(data[key].death);
            graphData[3].push(data[key].recovered);
          }
          console.log(graphData);
          console.log(xLables);
          commit("setGraphData", graphData);
          commit("setXLables", xLables);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setDashboardLoaders", { key: "graphInput", value: false });
      });
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
