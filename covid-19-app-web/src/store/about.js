import axios from "axios";
import { langConverter } from "./index";

export default {
  state: {
    aboutDescriptions: null
  },
  getters: {
    getAboutDescriptions(state) {
      return state.aboutDescriptions;
    }
  },
  mutations: {
    setAboutDescriptions(state, payload) {
      state.aboutDescriptions = payload;
    }
  },
  actions: {
    setAboutDescriptions: ({ commit }, { lang }) => {
      commit("setAboutLoaders", { key: "descriptions", value: true });
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/resources/information`, {
          params: {
            type: "about",
            language: langConverter[lang]
          }
        })
        .then(
          response => {
            let res = {};
            response.data.forEach(function(desc) {
              res[desc.title] = desc;
            });
            commit("setAboutDescriptions", res);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setAboutLoaders", { key: "descriptions", value: false });
        });
    }
  }
};
