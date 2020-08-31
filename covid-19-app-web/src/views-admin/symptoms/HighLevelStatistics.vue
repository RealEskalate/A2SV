<template>
  <v-card shaped outlined>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="item in items" :key="item.title">
        <div
          class="display-1 font-weight-light text-center pt-3"
          v-text="item.value"
        />
        <v-subheader
          class="text-center p-0 justify-center"
          v-text="item.title.toUpperCase()"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HighLevelStatistics",
  methods: {
    ...mapActions(["fetchTotalSymptoms", "fetchTotalPeoplesWithSymptoms"])
  },
  computed: {
    ...mapGetters([
      "getTotalSymptoms",
      "getMostCommonSymptom",
      "getMostCommonSymptomCount",
      "getTotalPeoplesWithSymptoms",
      "getSymptomStatLoaders"
    ]),
    items() {
      return [
        {
          title: "Total Symptoms Registered",
          value: this.getTotalSymptoms || 0
        },
        {
          title: "Most Common Symptom",
          value:
            `${this.getMostCommonSymptom} | ${Math.round(
              ((this.getMostCommonSymptomCount * 100) / this.getTotalSymptoms) *
                100
            ) / 100}%` || "None"
        },
        {
          title: "People With Symptoms",
          value: this.getTotalPeoplesWithSymptoms || 0
        }
      ];
    }
  },
  created() {
    this.fetchTotalSymptoms();
    this.fetchTotalPeoplesWithSymptoms();
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
</style>
