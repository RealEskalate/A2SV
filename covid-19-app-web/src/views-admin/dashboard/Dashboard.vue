<template>
  <v-container class="align-content-center">
    <v-row>
      <v-col md="4" sm="5" class="pr-md-7 py-0">
        <daily-statistics :data="items" class="mb-5" />
      </v-col>
      <v-col
        class="v-card--shaped pa-6 grey lighten-5 shadow-in"
        md="8"
        cols="12"
      >
        <total-statistics />
      </v-col>
    </v-row>
    <greatest-hit-city class="my-10" />
  </v-container>
</template>

<script>
import DailyStatistics from "./DailyStatistics";
import TotalStatistics from "./TotalStatistics";
import GreatestHitCity from "./GreatestHitCity";

export default {
  name: "Dashboard",
  components: {
    DailyStatistics,
    TotalStatistics,
    GreatestHitCity
  },
  data() {
    return {
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
      ]
    };
  },
  methods: {}
};
</script>
