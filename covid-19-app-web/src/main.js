import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VTooltip from "v-tooltip";
import VueProgressBar from 'vue-progressbar';
import VueLoaders from 'vue-loaders';
Vue.use(VTooltip);


Vue.use(VueProgressBar, {
  color: 'rgb(53,52,196)',
  failedColor: 'red',
  height: '2px'
})

Vue.use(VueLoaders);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
