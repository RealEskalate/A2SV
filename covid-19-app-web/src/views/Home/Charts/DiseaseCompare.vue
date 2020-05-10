<template>
  <v-container class="py-8">
    <v-row class="mx-md-5" dense>
      <v-col cols="12" class="overflow-auto">
        <bar-chart
                style="min-width: 400px"
          :height="600"
          :chart-data="diseaseData"
          :options="chartOptions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import {BarChart, ChartMixin} from "./charts.js";
  import store from "@/store/index.js";

  export default {
  components: { BarChart },
  mixins: [ChartMixin],

  methods: {
    fetchData() {
      store.dispatch("setDiseaseCompare", {
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
