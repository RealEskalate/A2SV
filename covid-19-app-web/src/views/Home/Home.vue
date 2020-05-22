<template>
  <v-container class="home">
    <statistics />
    <ethiopia />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "@/views/Home/Statistics.vue";
import Ethiopia from "../ethiopia/Ethiopia";

export default {
  name: "Home",
  components: {
    Statistics,
    ethiopia: Ethiopia
  }
};
</script>
