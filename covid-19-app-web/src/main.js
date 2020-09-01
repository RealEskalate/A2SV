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
    translateCriteria(criteria) {
      return this.$t("criteria." + criteria);
    },
    rateToColor(rate, hue0 = 0, hue1 = 100, reverse = false) {
      let hue = Math.min(rate, 1) * (hue1 - hue0) + hue0;
      if (reverse) hue = hue1 - hue;
      return `hsl(${hue}, 100%, 45%)`;
    },
    htmlToText(htmlString) {
      let p = document.createElement("div");
      p.innerHTML = htmlString.trim();
      return p.innerText;
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    relevanceColor(relevance) {
      switch (relevance.toLowerCase()) {
        case "high":
          return "red";
        case "medium":
          return "orange";
        case "low":
          return "yellow";
        default:
          return "grey";
      }
    }
  },
  computed: {
    loggedInUser: () => store.getters.getUser
  }
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
