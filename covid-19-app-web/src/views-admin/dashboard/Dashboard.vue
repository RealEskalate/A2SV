<template>
  <v-container class="align-content-center">
    <v-row>
      <v-col md="4" sm="5" class="pr-md-7 py-0">
        <daily-statistics :data="items" class="mb-5" />
      </v-col>
      <v-col
        class="v-card--shaped pa-6 shadow-in grey lighten-5"
        md="8"
        cols="12"
      >
        <date-range-picker
          :date_range="date_range"
          @onDateChange="onDateChange"
        />
        <br />
        <total-statistics />
      </v-col>
    </v-row>
    <greatest-hit-city class="my-10" />
  </v-container>
</template>

<script>
import DateRangePicker from "../../components/core/DateRangePicker";
import DailyStatistics from "./DailyStatistics";
import TotalStatistics from "./TotalStatistics";
import GreatestHitCity from "./GreatestHitCity";

export default {
  name: "Dashboard",
  components: {
    DateRangePicker,
    DailyStatistics,
    TotalStatistics,
    GreatestHitCity
  },
  data: () => ({
    date_range: ["2018-09-15", "2018-09-20"],

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
  }),
  mounted() {
    var el = document.getElementsByClassName("mapboxgl-ctrl-attrib-inner");
    alert(el.getAttribute("style"));
    el.removeAttribute("style");
  },
  methods: {
    onDateChange(dateRange) {
      alert(dateRange);
    }
  }
};
</script>
