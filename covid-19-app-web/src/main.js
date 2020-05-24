import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueProgressBar from "vue-progressbar";
import "vue-loaders/dist/vue-loaders.css";
import i18n from "./i18n";

Vue.use(VueProgressBar, {
  color: "#40AAFB",
  failedColor: "red",
  height: "2px"
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
