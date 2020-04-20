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
      <div>
        <h3 class="white--text font-weight-light">Covid-19</h3>
        <h3 class="white--text font-weight-light">SymTrack</h3>
      </div>
    </router-link>

    <v-spacer/>

    <v-btn :key="link.to" :to="link.to" text v-for="link in links">
      <span v-text="link.text"/>
    </v-btn>
  </v-app-bar>
</template>

<script>
    export default {
        data: () => {
            return {
                links: [
                    {text: "HOME", icon: "mdi-home", to: "/"},
                    {text: "ABOUT", icon: "mdi-information", to: "/about"},
                    {text: "NEWS", icon: "mdi-newspaper", to: "/news"},
                    {text: "MAP", icon: "mdi-map", to: "/map"}
                ]
            };
        }
    };
</script>
