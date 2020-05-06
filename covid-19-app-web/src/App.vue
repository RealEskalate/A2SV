<template>
  <v-app>
    <app-bar/>
    <v-content style="font-family: 'Nunito',sans-serif">
      <router-view/>
      <vue-progress-bar></vue-progress-bar>
    </v-content>
    <app-footer/>
  </v-app>
</template>

<script>
  import AppBar from "./components/core/AppBar.vue";
  import AppFooter from "./components/core/AppFooter.vue";

  export default {
    name: "App",
    components: {AppBar, AppFooter},
    data: () => ({
      //
    }),
    mounted() {
      //  [App.vue specific] When App.vue is finish loading finish the progress bar
      this.$Progress.finish()
    },
    created() {
      //  [App.vue specific] When App.vue is first loaded start the progress bar
      this.$Progress.start();
      //  hook the progress bar to start before we move router-view
      this.$router.beforeEach((to, from, next) => {
        //  does the page we want to go to have a meta.progress object
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          // parse meta tags
          this.$Progress.parseMeta(meta)
        }
        //  start the progress bar
        this.$Progress.start();
        //  continue to next page
        next();
      });
      //  hook the progress bar to finish after we've finished moving router-view
      this.$router.afterEach(() => {
        //  finish the progress bar
        this.$Progress.finish()
      })
    }
  };
</script>
