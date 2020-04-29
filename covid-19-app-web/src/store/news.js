import axios from "axios";

const state = {
  news: [],
  newsMeta: '',
  sources: [],
  country: []
};

const getters = {
  getNews: state => {
    console.log(state.news);
    return state.news;
  },
  getNewsMeta: state => {
    return state.newsMeta;
  },
  getSources: state => {
    return state.sources
  },
  getCountry: state => {
    return state.country;
  }
};

const mutations = {
  setNews: (state, payload) => {
    state.news = payload;
  },
  setNewsMeta: (state, payload) => {
    state.newsMeta = payload;
  },
  setSources: (state, payload) => {
    state.sources = payload;
  },
  setCountry: (state, payload) => {
    state.country = payload;
  }
};

const actions = {
  setSources: ({commit}) => {
    axios.get(`${process.env.VUE_APP_BASE_URL}/news/sources`).then(
        response => {
          commit('setSources', response.data);
          // commit('setNewsMeta', response.meta);
          console.log(response);
        },
        error => {
          console.log(error);
        }
    );
  },
  setCountry: ({commit}) => {
    axios.get("http://ip-api.com/json").then(response => {
      commit('setCountry', response.data.country);
    });
  },
  setNews: ({commit}, {page, country, source}) => {
    axios.get(`${process.env.VUE_APP_BASE_URL}/news/?page=${page}&country=${country}&source=${source}`).then(
        response => {
          commit('setNews', response.data.data);
          // commit('setNewsMeta', response.meta);
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