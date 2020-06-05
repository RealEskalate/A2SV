import ajax from "../auth/ajax";
import {langConverter} from "./index";

const state = {
  regionalIndexed: null,
  ethiopia: null,
  regional: []
};

const getters = {
  getEthiopia: state => {
    return state.ethiopia;
  },
  getRegional: state => {
    return state.regional;
  },
  getRegionalIndexed: state => {
    return state.regionalIndexed;
  }
};

const mutations = {
  setEthiopia: (state, payload) => {
    state.ethiopia = payload;
  },
  setRegional: (state, payload) => {
    state.regional = payload;
  },
  setRegionalIndexed: (state, payload) => {
    state.regionalIndexed = payload;
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
  let regionalByKey = {};
  for (let i = 0; i < len; i++) {
    if (data[i]["region_code"] === "ET") {
      commit("setEthiopia", data[i]);
      console.log(data[i]);
    } else {
      regional.push(data[i]);
      regionalByKey[data[i]["region_code"]] = data[i];
    }
  }
  commit("setRegional", regional);
  commit("setRegionalIndexed", regionalByKey);
}

export default {
  state,
  getters,
  mutations,
  actions
};
