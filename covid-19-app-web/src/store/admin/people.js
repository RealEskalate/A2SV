import ajax from "../../auth/ajax";

const state = {
  users: [],
  usersCount: 0
};

const getters = {
  getUsers: state => state.users,
  getUsersCount: state => state.usersCount
};

const mutations = {
  setUsers: (state, payload) => (state.users = payload),
  setUsersCount: (state, payload) => (state.usersCount = payload)
};

const actions = {
  fetchAllUsers: (
    { commit },
    { page, size, status, username, start_date, end_date }
  ) => {
    commit("setSymptomStatLoaders", { key: "total", value: true });
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
