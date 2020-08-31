<template>
  <v-row>
    <v-col cols="6" sm="6" md="3">
      <v-skeleton-loader
        :loading="getSymptomStatLoaders.total"
        transition="scale-transition"
        height="100"
        type="list-item-two-line"
      >
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text-center">{{ getTotalSymptoms }}</p>
            <h4 class="text-center">{{ title_one }}</h4>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6" sm="6" md="3">
      <v-skeleton-loader
        :loading="getSymptomStatLoaders.total"
        transition="scale-transition"
        height="100"
        type="list-item-two-line"
      >
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text-center">
              {{ getMostCommonSymptomCount }}
            </p>
            <h4 class="text-center">{{ title_two }}</h4>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6" sm="6" md="3">
      <v-skeleton-loader
        :loading="getSymptomStatLoaders.totalPeople"
        transition="scale-transition"
        height="100"
        type="list-item-two-line"
      >
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text-center">
              15,333
            </p>
            <h4 class="text-center">{{ title_three }}</h4>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
    <v-col cols="6" sm="6" md="3">
      <v-skeleton-loader
        :loading="getSymptomStatLoaders.totalPeople"
        transition="scale-transition"
        height="100"
        type="list-item-two-line"
      >
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text-center">
              15
            </p>
            <h4 class="text-center">{{ title_four }}</h4>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HighLevelStatistics",
  components: {},
  data() {
    return {
      title_one: "Admin",
      title_two: "Health care workers",
      title_three: "Total Users",
      title_four: "New users, last 7 days"
    };
  },
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
    ])
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
