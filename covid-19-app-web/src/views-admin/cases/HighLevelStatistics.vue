<template>
  <v-card shaped outlined>
    <v-row>
      <v-col class="mx-auto">
        <div
          class="display-1 font-weight-light text-center pt-3"
          v-text="getTotalCases"
        />
        <v-subheader class="text-center p-0 justify-center" v-text="title" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HighLevelStatistics",
  data() {
    return {
      title: "TOTAL NUMBER OF CASES"
    };
  },
  computed: {
    ...mapGetters(["getTotalCases"])
  },
  created() {}
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
</style>
