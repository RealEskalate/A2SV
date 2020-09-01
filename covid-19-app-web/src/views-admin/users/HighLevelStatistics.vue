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
            <p class="display-1 text-center">
              {{ getHighLevelStats.allUsers }}
            </p>
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
              {{ getHighLevelStats.ephiUsers }}
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
              {{ getHighLevelStats.healthcareWorkers }}
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
              {{ getHighLevelStats.thisWeekNewUsers }}
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
      title_one: "Total Users",
      title_two: "Admin",
      title_three: "Health care workers",
      title_four: "New users, last 7 days"
    };
  },
  methods: {
    ...mapActions(["fetchUserStats"])
  },
  computed: {
    ...mapGetters(["getHighLevelStats", "getSymptomStatLoaders"])
  },
  created() {
    this.fetchUserStats();
  }
};
</script>

<style scoped>
.display-1 {
  font-size: 2em !important;
  color: #303030 !important;
}
</style>
