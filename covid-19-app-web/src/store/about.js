import ajax from "../auth/ajax";
import { langConverter } from "./index";

export default {
  state: {
    aboutDescriptions: null,
    aboutActions: []
  },
  getters: {
    getAboutDescriptions(state) {
      return state.aboutDescriptions;
    },
    getAboutActions(state) {
      return state.aboutActions;
    }
  },
  mutations: {
    setAboutDescriptions(state, payload) {
      state.aboutDescriptions = payload;
    },
    setAboutActions(state, payload) {
      state.aboutActions = payload;
    }
  },
  actions: {
    setAboutDescriptions: ({ commit }, { lang }) => {
      commit("setAboutLoaders", { key: "descriptions", value: true });
      ajax
        .get(`resources/information`, {
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
    },
    setAboutActions({ commit }, { lang }) {
      commit("setAboutLoaders", { key: "actions", value: true });
      ajax
        .get(`/resources/statistics-description`, {
          params: {
            title: "image-description",
            language: langConverter[lang]
          }
        })
        .then(response => {
          commit("setAboutActions", response.data[0].fields);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(function() {
          commit("setAboutLoaders", { key: "actions", value: false });
        });
    }
  }
};
