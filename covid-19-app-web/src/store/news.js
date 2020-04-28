import axios from "axios";

const state = {
  news: []
};

const getters = {
  getNews: state => {
    console.log(state.news);
    return state.news;
  },
  getNewsMeta: state => {
    return state.newsMeta;
  }
};

const mutations = {
  setNews: (state, payload) => {
    state.news = payload;
  },
  setNewsMeta: (state, payload) => {
    state.newsMeta = payload;
  }
};

const actions = {
  setNews: ({commit}, {page, size}) => {
    axios.get(`${process.env.VUE_APP_BASE_URL }/news/?page=${page}&size=${size}`).then(
        response => {
          commit('setNews', response.data);
          commit('setNewsMeta', response.meta);
          console.log(response);
        },
        error => {
          console.log(error);
        }
    );
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}