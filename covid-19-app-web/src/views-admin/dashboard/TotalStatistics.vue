<template>
  <v-container>
    <date-range-picker :date_range="date_range" @onDateChange="onDateChange" />
    <br />
    <div class="random" v-if="!getDashboardLoaders.graphInput">
      <trend-chart
        :datasets="[
          {
            data: getGraphData[0],
            smooth: true,
            showPoints: false,
            fill: true,
            className: 'curve1'
          },
          {
            data: getGraphData[1],
            smooth: true,
            showPoints: false,
            fill: true,
            className: 'curve2'
          },
          {
            data: getGraphData[2],
            smooth: true,
            showPoints: false,
            fill: true,
            className: 'curve3'
          },
          {
            data: getGraphData[3],
            smooth: true,
            showPoints: false,
            fill: true,
            className: 'curve4'
          }
        ]"
        :grid="{
          verticalLines: false,
          horizontalLines: false
        }"
        :labels="{
          xLabels: getXLables,
          yLabels: 5,
          yLabelsTextFormatter: val => Math.round(val)
        }"
        :min="0"
        :interactive="true"
        @mouse-move="onMouseMove"
        class="random-chart"
      ></trend-chart>
      <div
        id="pop"
        role="tooltip"
        ref="tooltip"
        class="tooltip"
        :class="{ 'is-active': tooltipData }"
      >
        <div class="tooltip-container" v-if="tooltipData">
          <strong>{{ getXLables[tooltipData.index] }}</strong>
          <div class="tooltip-data">
            <div class="tooltip-data-item tooltip-data-item--1">
              {{ tooltipData.data[0] }}
            </div>
            <div class="tooltip-data-item tooltip-data-item--2">
              {{ tooltipData.data[1] }}
            </div>
            <div class="tooltip-data-item tooltip-data-item--3">
              {{ tooltipData.data[2] }}
            </div>
            <div class="tooltip-data-item tooltip-data-item--4">
              {{ tooltipData.data[3] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-row>
      <v-col
        v-for="legend in legends"
        :key="legend.color"
        col="12"
        md="3"
        sm="3"
      >
        <div
          class="d-inline-block mr-2 red"
          :style="{
            width: '10px',
            height: '10px',
            background: legend.color + '!important'
          }"
        ></div>
        <span class="choice"> {{ legend.title }} </span>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { createPopper } from "@popperjs/core/lib/popper-lite.js";
import TrendChart from "vue-trend-chart";
import preventOverflow from "@popperjs/core/lib/modifiers/preventOverflow.js";
import flip from "@popperjs/core/lib/modifiers/flip.js";
import DateRangePicker from "../../components/core/DateRangePicker";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "GraphStatistics",
  components: {
    TrendChart,
    DateRangePicker
  },
  data() {
    return {
      date_range: ["2020-03-17", "2020-03-23"],
      tooltipData: null,
      popper: null,
      popperIsActive: false,
      legends: [
        { title: "Test Administered", color: "#00bfff" },
        { title: "Confirmed Cases", color: "#FFD54F" },
        { title: "Deaths", color: "#F06292" },
        { title: "Recovered", color: "#DCE775" }
      ]
    };
  },
  methods: {
    ...mapActions(["fetchGraphData"]),
    fetch() {
      this.fetchGraphData({
        start_date: this.date_range[0],
        end_date: this.date_range[1]
      });
    },
    onDateChange(dateRange) {
      this.date_range = dateRange;
      this.fetch();
    },
    initPopper() {
      const chart = document.querySelector(".random-chart");
      const ref = chart.querySelector(".active-line");
      const tooltip = this.$refs.tooltip;
      this.popper = new createPopper(ref, tooltip, {
        placement: "right",
        modifiers: [preventOverflow, flip]
      });
    },
    onMouseMove(params) {
      this.popperIsActive = !!params;
      this.popper.update();
      this.tooltipData = params || null;
    }
  },
  computed: {
    ...mapGetters(["getGraphData", "getXLables", "getDashboardLoaders"])
  },
  mounted() {
    this.fetch();
    this.initPopper();
  }
};
</script>
<style>
.random {
  width: 100%;
}
.random .vtc {
  height: 250px;
  font-size: 12px;
}
@media (min-width: 699px) {
  .random .vtc {
    height: 320px;
  }
}
.random .labels {
  stroke: rgba(0, 0, 0, 0.05);
}
.random .active-line {
  stroke: rgba(0, 0, 0, 0.2);
}
.random .point {
  stroke-width: 2;
  transition: stroke-width 0.2s;
}
.random .point.is-active {
  stroke-width: 5;
}
.random .curve1 .stroke {
  stroke: #00bfff;
  stroke-width: 2;
}
.random .curve1 .fill {
  fill: #00bfff;
  opacity: 0.02;
}
.random .curve1 .point {
  fill: #00bfff;
  stroke: #00bfff;
}
.random .curve2 .stroke {
  stroke: #ffd54f;
  stroke-width: 2;
}
.random .curve2 .point {
  fill: #ffd54f;
  stroke: #ffd54f;
}
.random .curve2 .fill {
  fill: #ffd54f;
  opacity: 0.05;
}
.random .curve3 .stroke {
  stroke: #f06292;
  stroke-width: 2;
}
.random .curve3 .point {
  fill: #f06292;
  stroke: #f06292;
}
.random .curve3 .fill {
  fill: #f06292;
  opacity: 0.09;
}
.random .curve4 .stroke {
  stroke: #dce775;
  stroke-width: 2;
}
.random .curve4 .point {
  fill: #dce775;
  stroke: #dce775;
}
.random .curve4 .fill {
  fill: #dce775;
  opacity: 0.09;
}
.random .tooltip {
  padding: 10px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
.random .tooltip:not(.is-active) {
  display: none;
}
.random .tooltip-data {
  display: flex;
}
.random .tooltip-data-item {
  display: flex;
  align-items: center;
}
.random .tooltip-data-item:not(:first-child) {
  margin-left: 20px;
}
.random .tooltip-data-item:before {
  content: "";
  display: block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.random .tooltip-data-item--1:before {
  background: #00bfff;
}
.random .tooltip-data-item--2:before {
  background: #ffd54f;
}
.random .tooltip-data-item--3:before {
  background: #f06292;
}
.random .tooltip-data-item--4:before {
  background: #dce775;
}
</style>
