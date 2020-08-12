<template>
  <v-container class="align-content-center">
    <v-row>
      <v-col md="4" sm="5">
        <daily-statistics :data="items" />
      </v-col>
      <v-col class="px-2" md="8" cols="12">
        <date-range-picker
          :date_range="date_range"
          @onDateChange="onDateChange"
        />
        <v-row>
          <v-col md="12">
            <total-statistics />
          </v-col>
          <v-col cols="12" class="ml-md-3">
            <greatest-hit-city />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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
