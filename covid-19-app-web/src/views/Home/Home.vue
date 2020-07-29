<template>
  <v-container class="home">
    <heat-map />
    <symptom-reporting />
    <statistics />
    <ethiopia />
  </v-container>
</template>

<script>
// @ is an alias to /src
import Statistics from "./Statistics.vue";
import Ethiopia from "./Ethiopia/Ethiopia";
import HeatMap from "../HeatMap/HeatMap";
import SymptomReporting from "../Profile/SymptomReporting";

export default {
  name: "Home",
  components: {
    HeatMap,
    SymptomReporting,
    Statistics,
    Ethiopia
  }
};
</script>
