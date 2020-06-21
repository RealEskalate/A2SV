import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import VueTour from "vue-tour";
import VueProgressBar from "vue-progressbar";
import VTooltip from "v-tooltip";
import injectInitialState from "./utils/inject-initial-state";

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
    rateToColor(rate, hue0 = 0, hue1 = 100, reverse = false) {
      let hue = Math.min(rate, 1) * (hue1 - hue0) + hue0;
      if (reverse) hue = hue1 - hue;
      return `hsl(${hue}, 100%, 45%)`;
    },
    htmlToText(htmlString) {
      let p = document.createElement("div");
      p.innerHTML = htmlString.trim();
      return p.innerText;
    }
  },
  computed: {
    loggedInUser: () => store.getters.getUser
  }
});

const app = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
});

if (window.__INITIAL_STATE__) store.replaceState(window.__INITIAL_STATE__);

router.beforeResolve(async (to, from, next) => {
  try {
    const components = router.getMatchedComponents(to);

    // By using `await` we make sure to wait
    // for the API request made by the `fetch()`
    // method to resolve before rendering the view.
    await Promise.all(components.map(x => x.fetch && x.fetch({ store })));

    // The `injectInitialState()` function injects
    // the current state as a global variable
    // `__INITIAL_STATE__` if the page is currently
    // pre-rendered.
    if (window.__PRERENDER_INJECTED) injectInitialState(store.state);
  } catch (error) {
    // This is the place for error handling in
    // case the API request fails for example.
    console.log(error);
  }

  return next();
});

app.$mount("#app");
