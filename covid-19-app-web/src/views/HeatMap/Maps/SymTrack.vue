<template>
  <h1>empty symtrack map page</h1>
</template>

<script>
import store from "@/store/";

export default {
  name: "SymTrack",
  mounted() {
    store.dispatch("setCities");
  },
  computed: {
    userSymptoms() {
      return store.getters.symptomUser;
    },
    cities() {
      return store.getters.cities;
    }
  }
};
</script>

<style scoped></style>
