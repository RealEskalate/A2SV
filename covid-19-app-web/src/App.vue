<template>
  <v-app>
    <app-bar />
    <v-content>
      <router-view />
    </v-content>
    <app-footer />
  </v-app>
</template>

<script>
import AppBar from "./components/core/AppBar.vue";
import AppFooter from "./components/core/AppFooter.vue";

export default {
  name: "App",
  components: { AppBar, AppFooter },
  data: () => ({
    //
  })
};
</script>
