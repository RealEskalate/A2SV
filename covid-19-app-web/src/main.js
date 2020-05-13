import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueProgressBar from "vue-progressbar";
import VueLoaders from "vue-loaders";

Vue.use(VueLoaders);
Vue.use(VueProgressBar, {
  color: "#40AAFB",
  failedColor: "red",
  height: "2px"
});

Vue.config.productionTip = false;
Vue.mixin({
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
  render: h => h(App)
}).$mount("#app");
