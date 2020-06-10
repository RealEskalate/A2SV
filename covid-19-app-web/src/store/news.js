import axios from "axios";
import ajax from "../auth/ajax";

const state = {
  news: null,
  newsMeta: "",
  totalCount: 0,
  sources: [],
  currentCountry: {
    name: "World",
    code: "World"
  }
};

const getters = {
  getNews: state => {
    return state.news;
  },
  getTotalCount: state => {
    return state.totalCount;
  },
  getSources: state => {
    return state.sources;
  },
  getCurrentCountry: state => {
    return state.currentCountry;
  }
};

const mutations = {
  setNews: (state, payload) => {
    state.news = payload;
  },
  setTotalCount: (state, payload) => {
    state.totalCount = payload;
  },
  setSources: (state, payload) => {
    state.sources = payload;
  },
  setCurrentCountry: (state, payload) => {
    state.currentCountry = payload;
  }
};

const actions = {
  setSources: ({ commit }) => {
    commit("setNewsLoaders", { key: "sources", value: true });
    axios
      .get(`${process.env.VUE_APP_BASE_URL}/api/news/sources`)
      .then(
        response => {
          commit("setSources", response.data);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setNewsLoaders", { key: "sources", value: false });
      });
  },
  setCurrentCountry: ({ commit }) => {
    axios.get("http://ip-api.com/json").then(
      response => {
        commit("setCurrentCountry", {
          name: response.data.country,
          code: response.data.countryCode
        });
      },
      () => {
        commit("setCurrentCountry", "World");
      }
    );
  },
  setNews: ({ commit }, { page, size, country, sources }) => {
    commit("setNewsLoaders", { key: "list", value: true });
    ajax
      .get(`news`, {
        params: {
          page: page,
          size: size,
          country: country,
          source: sources.join(",")
        }
      })
      .then(
        response => {
          commit("setNews", response.data.data);
          commit("setTotalCount", response.data.data_count);
        },
        error => {
          console.log(error);
        }
      )
      .finally(function() {
        commit("setNewsLoaders", { key: "list", value: false });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
