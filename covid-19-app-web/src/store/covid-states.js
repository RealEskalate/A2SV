// import axios from "axios";

const state = {
  states: null
};

const getters = {
  getStates: state => {
    return state.states;
  }
};

const mutations = {
  setStates: (state, payload) => {
    state.states = payload;
  }
};

const actions = {
  setStates: ({ commit }) => {
    commit("setStates", {
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
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
