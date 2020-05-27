<template>
  <v-app>
    <app-bar />
    <v-content class="px-md-0 px-3">
      <v-fade-transition>
        <router-view />
      </v-fade-transition>
      <vue-progress-bar />
    </v-content>
    <app-footer />
    <tour />
  </v-app>
</template>

<script>
import AppBar from "./components/core/AppBar.vue";
import AppFooter from "./components/core/AppFooter.vue";
import Tour from "./components/core/Tour.vue";
import store from "@/store/";

export default {
  name: "App",
  components: { AppBar, AppFooter, Tour },
  mounted() {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish();

    this.$i18n.locale =
      store.getters.getLanguagePreference === null
        ? "en"
        : store.getters.getLanguagePreference;
    if (this.firstVisit) {
      store.dispatch("setFirstVisit", { value: false });
      this.$tours["appTour"].start();
    }
  },
  created() {
    store.dispatch("fillCountriesList");
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start();
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => {
      //  finish the progress bar
      this.$Progress.finish();
    });
  },
  computed: {
    firstVisit: () => store.getters.getFirstVisit
  },
  watch: {
    "$i18n.locale": newValue => {
      store.dispatch("setLanguagePreference", { lang: newValue });

      store.dispatch("setGraphDescriptions", { lang: newValue });
      store.dispatch("setAboutDescriptions", { lang: newValue });
      store.dispatch("setAboutActions", { lang: newValue });
      store.dispatch("setInformation", { lang: newValue });
      store.dispatch("setActions", { lang: newValue });
      store.dispatch("setStates", { lang: newValue });
      store.dispatch("setLearningPaths", {
        age_group: "Adults",
        lang: newValue
      });
    }
  }
};
</script>

<style>
html {
  scroll-behavior: smooth;
  scroll-margin-top: 50px;
}
.v-step__arrow {
  color: white;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1) !important;
}

.shadow {
  box-shadow: 0 0.35rem 0.75rem rgba(0, 0, 0, 0.1) !important;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important;
}

.shadow-none {
  box-shadow: none !important;
}

.shadow-in {
  box-shadow: 0 0 5px #dededede inset;
}

.v-alert,
.v-dialog--active {
  border-radius: 23px 5px 23px 5px !important;
}

.v-pagination__item,
.v-pagination__navigation {
  border-radius: 10px 3px 10px 3px !important;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.05) !important;
}
</style>
