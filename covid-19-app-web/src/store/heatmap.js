const state = {
  heatmap: []
};

const getters = {
  getHeatMap: state => {
    return state.heatmap;
  }
};

const mutations = {
  setHeatMap: (state, payload) => {
    state.heatmap = payload;
  }
};

const actions = {
  setHeatMap: ({ commit }) => {
    commit(
      "setHeatMap",
      "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
    );
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
