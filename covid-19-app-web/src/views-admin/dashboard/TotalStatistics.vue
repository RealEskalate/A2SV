<template>
  <v-container>
    <div class="random">
      <trend-chart
        :datasets="datasets"
        :grid="grid"
        :labels="labels"
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
          <strong>{{ labels.xLabels[tooltipData.index] }}</strong>
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
          </div>
        </div>
      </div>
    </div>
    <v-row>
      <v-col
        v-for="legend in legends"
        :key="legend.color"
        col="6"
        md="4"
        sm="4"
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

export default {
  name: "Graph Statistics",
  components: {
    TrendChart
  },
  data() {
    return {
      datasets: [
        {
          data: [512, 524, 619, 680, 450, 398, 542],
          smooth: true,
          showPoints: false,
          fill: true,
          className: "curve1"
        },
        {
          data: [150, 199, 210, 413, 212, 422, 559],
          smooth: true,
          fill: true,
          showPoints: false,
          className: "curve2"
        },
        {
          data: [50, 45, 21, 50, 12, 25, 60],
          smooth: true,
          fill: true,
          showPoints: false,
          className: "curve3"
        }
      ],
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      },
      tooltipData: null,
      popper: null,
      popperIsActive: false,
      legends: [
        { title: "Confirmed COVID cases", color: "#fbac91" },
        { title: "Citizen with symptoms", color: "#00bfff" },
        { title: "COVID related deaths", color: "#9126ff" }
      ]
    };
  },
  methods: {
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
  mounted() {
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
  stroke: #fbac91;
  stroke-width: 2;
}
.random .curve1 .fill {
  fill: #fbac91;
  opacity: 0.02;
}
.random .curve1 .point {
  fill: #fbac91;
  stroke: #fbac91;
}
.random .curve2 .stroke {
  stroke: #9126ff;
  stroke-width: 2;
}
.random .curve2 .point {
  fill: #9126ff;
  stroke: #9126ff;
}
.random .curve2 .fill {
  fill: #9126ff;
  opacity: 0.05;
}
.random .curve3 .stroke {
  stroke: #00bfff;
  stroke-width: 2;
}
.random .curve3 .point {
  fill: #00bfff;
  stroke: #00bfff;
}
.random .curve3 .fill {
  fill: #00bfff;
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
  background: #fbac91;
}
.random .tooltip-data-item--2:before {
  background: #9126ff;
}
.random .tooltip-data-item--3:before {
  background: #00bfff;
}
</style>
