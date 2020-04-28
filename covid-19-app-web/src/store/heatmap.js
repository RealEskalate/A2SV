import axios from "axios";

const state = {
  heatmap: [],
  countries: [],
};

const getters = {
  getHeatMap: state => {
    return state.heatmap;
  },
  getCountries: state => {
    return state.countries;
  }
};

const mutations = {
  setHeatMap: (state, payload) => {
    state.heatmap = payload;
  },
  setCountries: (state, payload) => {
    state.countries = payload;
  }
};

const actions = {
  setHeatMap: ({commit}) => {
    commit('setHeatMap', 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson');
  },
  setCountries: ({commit}) => {
    axios.get('https://res.cloudinary.com/geotargetly/raw/upload/v1579830286/data/iso_3166_country_codes.json')
        .then(
            res => {
              commit('setCountries', res.data);
              console.log(res.data);
            },
            error => {
              console.log(error);
            }
        )
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}