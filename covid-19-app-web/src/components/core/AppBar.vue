<template>
  <v-app-bar app color="primary" dark>
    <router-link class="d-flex align-center" to="/">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"
      />

      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />
    </router-link>

    <v-spacer/>

    <v-btn text to="/">
      <span>Home</span>
    </v-btn>

    <v-btn text to="/about">
      <span>About</span>
    </v-btn>
  </v-app-bar>
</template>
