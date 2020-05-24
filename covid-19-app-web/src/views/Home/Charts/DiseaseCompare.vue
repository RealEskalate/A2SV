<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12" class="overflow-auto">
        <loader
          v-if="graphLoaders.diseaseCompare > 0"
          style="position:absolute; left: 45%; top: 40%"
        />
        <bar-chart
          :style="`opacity: ${graphLoaders.diseaseCompare > 0 ? 0.5 : 1}`"
          class="v-card--shaped grey lighten-5 shadow-in pb-6 px-1"
          :height="600"
          ref="graph"
          :chart-data="diseaseData"
          :options="chartOptions"
        />
        <small
          class="d-block grey--text my-3 text--darken-2"
          v-text="short_description"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { BarChart, ChartMixin } from "./charts.js";
import Loader from "@/components/core/Loader.vue";
import store from "@/store/index.js";

export default {
  components: { BarChart, Loader },
  mixins: [ChartMixin],

  methods: {
    fetchData() {
      store.dispatch("setDiseaseCompare", {
        makeDataSet: this.makeDataSet
      });
    }
  },
  watch: {},
  mounted() {
    this.fetchData();
  },
  computed: {
    diseaseData: () => store.getters.getDiseaseCompare,
    graphLoaders: () => store.getters.getGraphLoaders
  }
};
</script>
