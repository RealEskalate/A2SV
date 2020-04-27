<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12">
        <bar-chart
          :height="650"
          :chart-data="diseaseData"
          :options="chartOptions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { BarChart, ChartMixin } from "./charts.js";
import store from "@/store/index.js";

export default {
  components: { BarChart },
  mixins: [ChartMixin],
  data() {
    return {
      diseases: [
        { name: "Corona", color: [121, 134, 203] },
        { name: "SARS", color: [77, 208, 225] },
        { name: "MERS", color: [240, 98, 146] },
        { name: "AIDS", color: [255, 213, 79] },
        { name: "Ebola", color: [220, 231, 117] }
      ],
    };
  },
  methods: {
    fetchData() {
      store.dispatch("setDiseaseCompare", {
        diseases: this.diseases,
        makeDataSet: this.makeDataSet
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    diseaseData: () => store.getters.getDiseaseCompare
  }
};
</script>
