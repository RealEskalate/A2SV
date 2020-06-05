import ajax from "../auth/ajax";
import {langConverter} from "./index";

const state = {
  ethiopia: null,
  regional: []
};

const getters = {
  getEthiopia: state => {
    return state.ethiopia;
  },
  getRegional: state => {
    return state.regional;
  }
};

const mutations = {
  setEthiopia: (state, payload) => {
    state.ethiopia = payload;
  },
  setRegional: (state, payload) => {
    state.regional = payload;
  }
};

const actions = {
  setEthiopia: ({commit}, {lang}) => {
    ajax
        .get("ethiopia", {
          params: {
            language: langConverter[lang]
          }
        })
        .then(
            res => {
              console.log(res);
              // split data
              categorizeData(commit, res.data);
            },
            err => {
              console.log(err);
            }
        );
  }
};

function categorizeData(commit, data) {
  let len = data.length;
  let regional = [];
  for (let i = 0; i < len; i++) {
    if (data[i]["region"] === "Ethiopia") {
      commit("setEthiopia", data[i]);
    } else {
      regional.push(data[i]);
    }
  }
  commit("setRegional", regional);
  console.log(regional);
}

export default {
  state,
  getters,
  mutations,
  actions
};
