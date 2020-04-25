import { Bar, Line, mixins } from "vue-chartjs";
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
  computed: {
    dateRangeText() {
      let start = this.date_range[0] || "";
      let end = this.date_range[1] || "";
      let arrow = "\u2192";
      return `  ${moment(start).format("MMM DD, YYYY")}    ${arrow}    ${moment(
        end
      ).format("MMM DD, YYYY")}  `;
    }
  },
  methods: {
    makeDataSet(payload, chartType = "line") {
      let opacity = 0.07;
      if (chartType === "bar" || chartType === "pie") {
        opacity = 0.75;
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
        pointRadius: 2,
        pointBackgroundColor: mainColor,
        pointBorderColor: mainColor,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: mainColor,
        pointHoverBorderColor: mainColor,
        pointHitRadius: 10,
        pointBorderWidth: 2
      };
    }
  },
  data: () => {
    return {
      criteria: {
        counts: [
          { label: "Test Count", color: [121, 134, 203] },
          { label: "Confirmed Cases", color: [255, 213, 79] },
          { label: "Death Count", color: [240, 98, 146] },
          { label: "Recovery Count", color: [220, 231, 117] }
        ],
        rates: [
          { label: "Positive Rate", color: [255, 213, 79] },
          { label: "Recovery Rate", color: [220, 231, 117] },
          { label: "Hospitalization Rate", color: [220, 231, 117] },
          { label: "ICU Rate", color: [220, 231, 117] },
          { label: "Death Rate", color: [240, 98, 146] }
        ]
      },
      chartOptions: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: "Date"
              },
              type: "time",
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
              scaleLabel: {
                display: true,
                labelString: "Counts"
              },
              ticks: {
                maxTicksLimit: 5,
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
      }
    };
  }
};
