<template>
  <v-container class="home">
    <statistics />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "@/views/Home/Statistics.vue";

export default {
  name: "Home",
  components: {
    Statistics
  }
};
</script>
