<template>
  <v-container class="home">
    <statistics />
    <v-row>
      <actions class="col-md-7 col-sm-12"/>
      <states class="col-md-5  col-sm-12"/>
    </v-row>
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
