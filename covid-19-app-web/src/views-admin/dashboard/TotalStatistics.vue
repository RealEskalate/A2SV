<template>
  <v-row>
    <v-col md="6" cols="12" v-for="(item, index) in items" :key="index">
      <v-card class="shadow">
        <v-card-title class="card-title">{{ item.title }}</v-card-title>
        <v-sheet color="transparent">
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
          ></v-sparkline>
        </v-sheet>
        <v-card-actions>
          <h5>
            {{ item.totalNum }}
          </h5>
          <v-spacer />
          <p :class="item.increaseRate > 0 ? 'red--text' : 'green--text'">
            <v-icon v-if="item.increaseRate > 0" class="red--text">
              {{ mdiArrowUpThick }}
            </v-icon>
            <v-icon v-else class="green--text font-weight-bold">
              {{ mdiArrowDownThick }}
            </v-icon>
            {{ item.increaseRate + "%" }}
          </p>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];
import { mdiArrowDownThick, mdiArrowUpThick } from "@mdi/js";

export default {
  name: "TotalStatistics",
  data() {
    return {
      mdiArrowUpThick,
      mdiArrowDownThick,
      items: [
        {
          title: "New confirmed COVID-19 cases",
          totalNum: "123, 456",
          increaseRate: -4
        },
        {
          title: "New citizens with symptoms",
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
      showLabels: false,
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
