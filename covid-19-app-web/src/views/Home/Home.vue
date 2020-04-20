<template>
  <v-container class="home">
    <statistics />
    <actions />
    <states />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "@/views/Home/Statistics.vue";
import Actions from "@/views/Home/Actions.vue";
import States from "@/views/Home/States.vue";

export default {
  name: "Home",
  components: {
    Statistics,
    Actions,
    States
  }
};
</script>
