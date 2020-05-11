import { Bar, Line, mixins } from "vue-chartjs";
import store from "@/store/index.js";
import moment from "moment";
const { reactiveProp } = mixins;

export const BarChart = {
  extends: Bar,
  mixins: [reactiveProp],
  props: ["chartData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};

export const LineChart = {
  extends: Line,
  mixins: [reactiveProp],
  props: ["chartData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};

export const ChartMixin = {
  props: {
    y_label: {
      type: String,
      default() {
        return "Value";
      }
    },
    x_axis_type: {
      type: String,
      default() {
        return "time";
      }
    },
    y_axis_type: {
      type: String,
      default() {
        return "linear";
      }
    },
    tab_index: {
      type: Number,
      default() {
        return "linear";
      }
    }
  },
  computed: {
    maxDate: () => moment(new Date()).format("YYYY-MM-DD"),
    countries: () => store.getters.getAllCountries,
    chartOptions() {
      const self = this;
      return {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        tooltips: {
          callbacks: {
            title: self.tooltipTitle,
            label: self.tooltipLabel
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: "Date"
              },
              type: self.x_axis_type,
              time: {
                unit: "day"
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [0]
              },
              ticks: {
                maxTicksLimit: null
              }
            }
          ],
          yAxes: [
            {
              type: self.y_axis_type,
              scaleLabel: {
                display: false,
                labelString: self.y_label
              },
              ticks: {
                callback: self.yTicks,
                maxTicksLimit: 10,
                padding: 10,
                beginAtZero: true
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [5],
                zeroLineBorderDash: [0]
              }
            }
          ]
        }
      };
    }
  },
  methods: {
    defaultDate(mode = "start") {
      if (mode === "start")
        return moment(new Date())
          .subtract(3, "month")
          .format("YYYY-MM-DD");
      else return moment(new Date()).format("YYYY-MM-DD");
    },
    isCount() {
      let counts = [];
      if (!this.criteria) {
        return false;
      }
      this.criteria.counts.forEach(function(item) {
        counts.push(item.label);
      });
      return counts.includes(this.criterion);
    },
    isRate() {
      let rates = [];
      if (!this.criteria) {
        return false;
      }
      this.criteria.rates.forEach(function(item) {
        rates.push(item.label);
      });
      return rates.includes(this.criterion);
    },
    yTicks(value) {
      if (this.y_label === "Percent" || this.isRate()) {
        return `${value} %`;
      } else if (
        ["Logarithmic Value", "People"].includes(this.y_label) ||
        this.isCount()
      ) {
        if (value >= 1000000000) {
          return `${(value / 1000000000).toFixed(2).toString()} B`;
        } else if (value >= 1000000) {
          return `${(value / 1000000).toFixed(2).toString()} M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(2).toString()} K`;
        }
        return value;
      } else {
        return value;
      }
    },
    tooltipTitle(tooltipItem) {
      if (this.x_axis_type === "time") {
        return moment(tooltipItem[0].label).format("MMM DD, YYYY");
      } else if (this.date_range_1 && this.date_range_2) {
        let starts = [this.date_range_1[0], this.date_range_2[0]];
        return moment(starts[tooltipItem[0].datasetIndex])
          .add(tooltipItem[0].index, "days")
          .format("MMM DD, YYYY");
      }
      return tooltipItem[0].label;
    },
    tooltipLabel(tooltipItem, data) {
      let label = data.datasets[tooltipItem.datasetIndex].label || "";
      if (label) label += ": ";

      label += this.yTicks(tooltipItem.yLabel);
      return label;
    },
    rangeToText(start, end) {
      let arrow = "\u2192";
      return `  ${moment(start || "").format(
        "MMM DD, YYYY"
      )}    ${arrow}    ${moment(end || "").format("MMM DD, YYYY")}  `;
    },
    sliderColor(percentage = this.social_distancing, hue0 = 0, hue1 = 100) {
      let hue = (percentage / 100) * (hue1 - hue0) + hue0;
      return "hsl(" + hue + ", 100%, 45%)";
    },
    makeDataSet(payload, chartType = "line") {
      let opacity = 0.07;
      if (chartType === "bar" || chartType === "pie") {
        opacity = 1;
      }
      const color = payload.color || [78, 115, 223];
      const mainColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.85)`;
      const bgColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;

      return {
        label: payload.label,
        data: payload.data,
        lineTension: 0.4,
        backgroundColor: bgColor,
        borderColor: mainColor,
        borderWidth: 2,
        pointRadius: 1.5,
        pointBackgroundColor: mainColor,
        pointBorderColor: mainColor,
        pointHoverRadius: 2,
        pointHoverBackgroundColor: mainColor,
        pointHoverBorderColor: mainColor,
        pointHitRadius: 10,
        pointBorderWidth: 2
      };
    }
  },
  data: () => {
    return {
      default_start_date: "",
      default_end_date: "",
      age_ranges: ["All", "Bellow 25", "26 - 50", "Above 50"],
      criteria: {
        counts: [
          { label: "Test Count", color: [121, 134, 203] },
          { label: "Confirmed Cases", color: [255, 213, 79] },
          { label: "Death Count", color: [240, 98, 146] },
          { label: "Recovery Count", color: [220, 231, 117] },
          { label: "Active Cases", color: [176, 190, 197] }
        ],
        daily: [
          { label: "Daily Test", color: [121, 134, 203] },
          { label: "Daily Confirmed", color: [255, 213, 79] },
          { label: "Daily Deaths", color: [240, 98, 146] },
          { label: "Daily Recovery", color: [220, 231, 117] }
        ],
        rates: [
          { label: "Positive Rate", color: [255, 213, 79] },
          { label: "Recovery Rate", color: [220, 231, 117] },
          { label: "Active Rate", color: [176, 190, 197] },
          // { label: "Hospitalization Rate", color: [77, 208, 225] },
          // { label: "ICU Rate", color: [121, 134, 203] },
          { label: "Death Rate", color: [240, 98, 146] }
        ]
      }
    };
  }
};
