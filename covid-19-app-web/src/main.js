import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import VueTour from "vue-tour";
import VueProgressBar from "vue-progressbar";
import VTooltip from "v-tooltip";

require("vue-tour/dist/vue-tour.css");

Vue.use(VTooltip);

Vue.use(VueTour);
Vue.use(VueProgressBar, {
  color: "#019DE5",
  failedColor: "red",
  thickness: "3px",
  autoFinish: false
});

Vue.config.productionTip = false;
Vue.mixin({
  data: () => {
    return {
      server_url: process.env.VUE_APP_BASE_URL
    };
  },
  methods: {
    htmlToText(htmlString) {
      let p = document.createElement("div");
      p.innerHTML = htmlString.trim();
      return p.innerText;
    }
  }
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
