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
  fetchAllUsers: ({ commit }) => {
    commit("setSymptomStatLoaders", { key: "total", value: true });
    setTimeout(
      commit("setSymptomStatLoaders", { key: "total", value: false }),
      2000
    );
    commit("setUsers", {});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
