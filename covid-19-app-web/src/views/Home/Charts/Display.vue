<template>
  <v-content>
    <line-chart
      :chart-data="chartData"
      :options="chartOptions"
      style="height: 500px"
    />
  </v-content>
</template>
<script>
import { LineChart, ChartMixin } from "./charts.js";

export default {
  components: { LineChart },
  mixins: [ChartMixin],
  data() {
    return {
      chartData: null
    };
  },
  mounted() {
    let collection = {
      datasets: []
    };
    let self = this;
    this.fetchData.forEach(function(load) {
      collection.datasets.push(self.makeDataSet(load));
    });
    this.chartData = collection;
  },
  computed: {
    fetchData() {
      return [
        {
          label: "Data One",
          data: [
            { t: "2018-11-24", y: 400 },
            { t: "2018-11-29", y: 530 },
            { t: "2018-12-02", y: 780 },
            { t: "2019-01-11", y: 120 }
          ]
        },
        {
          label: "Data Two",
          data: [
            { t: "2018-11-25", y: 242 },
            { t: "2018-11-30", y: 245 },
            { t: "2019-01-06", y: 743 },
            { t: "2019-01-11", y: 23 }
          ]
        }
      ];
    }
  }
};
</script>
