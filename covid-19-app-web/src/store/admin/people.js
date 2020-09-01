import ajax from "../../auth/ajax";

const state = {
  users: [],
  highLevelStats: null,
  usersCount: 0
};

const getters = {
  getUsers: state => state.users,
  getUsersCount: state => state.usersCount,
  getHighLevelStats: state => state.highLevelStats
};

const mutations = {
  setUsers: (state, payload) => (state.users = payload),
  setUsersCount: (state, payload) => (state.usersCount = payload),
  setHighLevelStats: (state, payload) => (state.highLevelStats = payload)
};

const actions = {
  fetchAllUsers: (
    { commit },
    { page, size, status, username, start_date, end_date }
  ) => {
    ajax
      .get(`users`, {
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
          commit("setUsers", response.data.data);
          commit("setUsersCount", response.data.data_count);
          console.log(response.data);
        },
        error => {
          console.log(error);
        }
      );
  },
  fetchUserStats: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "total", value: true });
    ajax
      .get("users-stat")
      .then(
        res => {
          console.log(res.data);
          commit("setHighLevelStats", res.data);
        },
        err => {
          console.log(err);
        }
      )
      .finally(function() {
        commit("setSymptomStatLoaders", { key: "total", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
