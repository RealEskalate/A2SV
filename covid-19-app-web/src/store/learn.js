import axios from "axios";

export default {
  state: {
    information: null,
    actions: null,
    states: null,
    learningPaths: {
      Kids: null,
      Teens: null,
      Adults: null,
      Seniors: null
    }
  },
  getters: {
    getInformation(state) {
      return state.information;
    },
    getActions(state) {
      return state.actions;
    },
    getStates: state => {
      return state.states;
    },
    getLearningPaths(state) {
      return state.learningPaths;
    }
  },
  mutations: {
    setInformation(state, payload) {
      state.information = payload;
    },
    setActions(state, payload) {
      state.actions = payload;
    },
    setStates(state, payload) {
      state.states = payload;
    },
    setLearningPaths(state, { key, value }) {
      state.learningPaths[key] = value;
    }
  },
  actions: {
    setInformation: ({ commit }) => {
      commit("setLearnLoaders", { key: "information", value: true });
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/resources/information`)
        .then(
          response => {
            commit("setInformation", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "information", value: false });
        });
    },
    setActions: ({ commit }) => {
      commit("setLearnLoaders", { key: "actions", value: true });
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/resources/information`, {
          params: {
            type: "action"
          }
        })
        .then(
          response => {
            commit("setActions", response.data);
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "actions", value: false });
        });
    },
    setStates: ({ commit }) => {
      commit("setLearnLoaders", { key: "states", value: true });
      const payload = {
        incubation: {
          title: "Incubation",
          description:
            "The patient just got infected, the virus amount is not much so it goes unnoticed. "
        },
        mild: {
          title: "Mild or no symptoms",
          description:
            " Now that the virus has reached the throat and/or the lungs, some patients start " +
            "showing mild symptoms, some are asymptomatic."
        },
        heavy: {
          title: "Heavy symptoms",
          description:
            "As the virus continues to replicate itself, some patients develop heavy symptoms and " +
            "require hospitalization, some have strong enough immune systems that can beat the virus without hospitalization.\n"
        },
        hospitalization: {
          title: "Hospitalization",
          description:
            "When the oxygen level in the blood goes below a certain threshold, COVID-19 patients " +
            "require hospitalization. In case of not having a capacity in ICU, some patients may die due to a lack of materials."
        },
        icu: {
          title: "ICU",
          description:
            "Unfortunately some patients’ immune systems can’t cope up with the virus well and the " +
            "patients need to be taken to intensive care units."
        }
      };
      commit("setStates", payload);
      commit("setLearnLoaders", { key: "states", value: false });
    },
    setLearningPaths: ({ commit }, { age_group }) => {
      commit("setLearnLoaders", { key: "learningPaths", value: true });
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/resources/learning-path`, {
          params: {
            age_group: age_group
          }
        })
        .then(
          response => {
            commit("setLearningPaths", {
              key: age_group,
              value: response.data
            });
          },
          error => {
            console.log(error);
          }
        )
        .finally(function() {
          commit("setLearnLoaders", { key: "learningPaths", value: false });
        });
    }
  }
};
