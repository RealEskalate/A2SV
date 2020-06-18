<template>
  <v-container class="home">
    <statistics />
    <ethiopia />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "./Statistics.vue";
import Ethiopia from "./Ethiopia/Ethiopia";

export default {
  name: "Home",
  components: {
    Statistics,
    Ethiopia
  }
};
</script>
