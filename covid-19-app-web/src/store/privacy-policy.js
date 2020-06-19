import ajax from "../../auth/ajax";
import { langConverter } from "../../store";

export default {
  state: {
    privacyPolicy: null
  },
  getters: {
    getPrivacyPolicy(state) {
      return state.privacyPolicy;
    }
  },
  mutations: {
    setPrivacyPolicy(state, payload) {
      state.privacyPolicy = payload;
    }
  },
  actions: {
    setPrivacyPolicy: ({ commit }, { lang }) => {
      ajax
        .get(`resources/statistics-description`, {
          params: {
            title: "privacy-policy",
            language: langConverter[lang]
          }
        })
        .then(
          res => {
            commit("setPrivacyPolicy", res.data);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
};
