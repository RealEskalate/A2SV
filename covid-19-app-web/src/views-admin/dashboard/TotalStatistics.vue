<template>
  <v-row>
    <v-col md="6" cols="12" v-for="(item, index) in getGraphData" :key="index">
      <v-card class="mx-1" shaped outlined style="background: transparent">
        <v-subheader class="card-title" v-text="item.title" />
        <v-sparkline
          :value="value"
          :gradient="gradient"
          :smooth="radius || false"
          :padding="padding"
          :line-width="lineWidth"
          :stroke-linecap="lineCap"
          :gradient-direction="gradientDirection"
          :fill="fill"
          :type="type"
          :auto-line-width="autoLineWidth"
          auto-draw
          :show-labels="showLabels"
          :label-size="labelSize"
          :labels="value"
        />
        <v-card-actions>
          <v-subheader v-text="item.totalNum" />
          <v-spacer />
          <div
            class="mx-3"
            :class="item.increaseRate > 0 ? 'red--text' : 'green--text'"
          >
            <v-icon
              small
              v-if="item.increaseRate > 0"
              class="red--text"
              v-text="mdiArrowUp"
            />
            <v-icon
              small
              v-else
              class="green--text font-weight-bold"
              v-text="mdiArrowDown"
            />
            {{ item.increaseRate + "%" }}
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];
import { mdiArrowDown, mdiArrowUp } from "@mdi/js";

export default {
  props: ["start_date", "end_date"],
  name: "TotalStatistics",
  data() {
    return {
      mdiArrowUp,
      mdiArrowDown,
      items: [
        {
          title: "Confirmed COVID-19 cases",
          totalNum: "123, 456",
          increaseRate: -4
        },
        {
          title: "Citizens with symptoms",
          totalNum: "123, 456",
          increaseRate: 9
        },
        {
          title: "COVID related deaths",
          totalNum: "56",
          increaseRate: -1
        },
        {
          title: "Tests administered",
          totalNum: "1,456",
          increaseRate: 1
        }
      ],
      showLabels: true,
      lineWidth: 2,
      labelSize: 7,
      radius: 10,
      padding: 8,
      lineCap: "round",
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, -4, -10, 1, 8, 2, 9, 0],
      gradientDirection: "top",
      gradients,
      fill: false,
      type: "trend",
      autoLineWidth: false
    };
  },
  created() {
    this.queryCitizenSymptoms({
      start_date: this.start_date,
      end_date: this.end_date
    });
  },
  methods: {
    ...mapActions(["queryCitizenSymptoms"])
  },
  computed: {
    ...mapGetters(["getGraphData"])
  }
};
</script>

<style scoped>
.card-title {
  font-size: small;
}

.shadow:hover {
  background: transparent !important;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12) !important;
  border-radius: 5px !important;
}
</style>
