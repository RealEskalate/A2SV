import ajax from "../auth/ajax";

const state = {
  totalCases: 0,
  cases: []
};

const getters = {
  getTotalCases: state => state.totalCases,
  getCases: state => state.cases
};

const mutations = {
  setTotalCases: (state, payload) => (state.totalCases = payload),
  setCases: (state, payload) => (state.cases = payload)
};

const actions = {
  fetchCases: ({ commit }, { page, size, status, start_date, end_date }) => {
    commit("setCaseLoaders", { key: "caseList", value: true });
    ajax
      .get(`test-report`, {
        params: {
          page: page,
          size: size,
          status: status,
          start_date: start_date,
          end_date: end_date
        }
      })
      .then(
        response => {
          commit("setTotalCases", response.data.data_count);
          let tableData = [];
          response.data.data.forEach(element => {
            let row = {
              id: element._id,
              status: element.test_status,
              date: new Date(element.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZoneName: "short"
              }),
              updatedAt: new Date(element.updated_at).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZoneName: "short"
                }
              ),
              person: element.user_id.username,
              healthcareOfficial: element.healthcare_worker_id.username,
              userInfo: element.user_id,
              healthcareWorkerInfo: element.healthcare_worker_id
            };
            tableData.push(row);
          });
          commit("setCases", tableData);
          console.log(tableData);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setCaseLoaders", { key: "caseList", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
