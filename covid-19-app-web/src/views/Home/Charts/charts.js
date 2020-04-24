import { Bar, Line, mixins } from "vue-chartjs";
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
        lineTension: 0.3,
        backgroundColor: bgColor,
        borderColor: mainColor,
        pointRadius: 3,
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
      criteria: [
        {
          label: "Test Count",
          color: "#477523"
        },
        {
          label: "Positive Count",
          color: "#5734e4"
        },
        {
          label: "Positive Count",
          color: "#542967"
        },
        {
          label: "Hospitalization Count",
          color: "#acb453"
        },
        {
          label: "ICU Count",
          color: "#2aa175"
        },
        {
          label: "Positive Count",
          color: "#f9a4c5"
        }
      ],
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
                display: true,
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
                labelString: "Numbers"
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
