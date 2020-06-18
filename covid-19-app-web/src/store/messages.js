const state = {
  stateMessage: ""
};

const getters = {
  getMessage: state => {
    return state.stateMessage;
  }
};

const mutations = {
  setStateMessage: (state, payload) => {
    state.stateMessage = payload;
  },
  resetMessage: state => {
    state.stateMessage = "";
  }
};

const actions = {
  setStateMessage: ({ commit }, payload) => {
    commit("setStateMessage", payload);
  },
  resetMessage: ({ commit }) => {
    commit("resetMessage");
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
