<template>
  <v-row>
    <v-col>
      <v-skeleton-loader
        :loading="getCaseLoaders.caseList"
        transition="scale-transition"
        height="100"
        width="300"
        type="list-item-two-line"
        class="mx-auto"
      >
        <v-card class="mx-auto" :flat="true" max-width="344">
          <v-card-text>
            <p class="display-1 text-center">{{ getTotalCases }}</p>
            <h4 class="text-center">{{ title_one }}</h4>
          </v-card-text>
        </v-card>
      </v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HighLevelStatistics",
  components: {},
  data() {
    return {
      title_one: "TOTAL NUMBER OF CASES"
    };
  },
  computed: {
    ...mapGetters(["getTotalCases", "getCaseLoaders"])
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
