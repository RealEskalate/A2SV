import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VTooltip from "v-tooltip";
import VueProgressBar from 'vue-progressbar';
import VueLoaders from 'vue-loaders';
Vue.use(VTooltip);
const options = {
  color: '#FFF',
  failedColor: '#F4511E',
  transition: {
    speed: '0.2s',
    termination: 300
  },
  autoRevert: true,
  inverse: false
};

Vue.use(VueProgressBar, options);

Vue.use(VueLoaders);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
