const state = {
  user: null,
  token: null
};

const getters = {
  getUser: state => {
    return state.user;
  },
  getToken: state => {
    return state.token;
  }
};

const mutations = {
  setUser: (state, payload) => {
    state.user = payload;
  },
  setToken: (state, payload) => {
    state.token = payload;
  }
};

const actions = {
  setUser: ({ commit }, { user }) => {
    commit("setUser", user);
  },
  setToken: ({ commit }, { token }) => {
    commit("setToken", token);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
