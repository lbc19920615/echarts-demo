import { BasicSerie } from "@/utils/series";

export default {
  methods: {
     openModalChart(name) {
      let option = {
        xAxis: {
          max: "dataMax",
        },
        yAxis: {
          type: "category",
          data: ["A", "B", "C", "D", "E"],
          // inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          // max: 2 // only
        },
        series: [
          BasicSerie("销量", {
            initOption() {
              return {
                realtimeSort: true,
                name: "X",
                label: {
                  show: true,
                  position: "right",
                  valueAnimation: true,
                },
              };
            },
          }).init("bar", [5, 20, 36, 10, 10, 20]),
        ],
        animationDuration: 0,
        animationDurationUpdate: 2000,
        animationEasing: "linear",
        animationEasingUpdate: "linear",
      };

      function run(chartRef, option) {
        var data = option.series[0].data;
        for (var i = 0; i < data.length; ++i) {
          if (Math.random() > 0.9) {
            data[i] += Math.round(Math.random() * 2000);
          } else {
            data[i] += Math.round(Math.random() * 200);
          }
        }
        chartRef.render(option);
      }

      this.$modal.show(name);
      setTimeout(() => {
        let chartRef = this.$refs[name + "_chart"];
        if (chartRef) {
          run(chartRef, option);

          setInterval(() => {
            run(chartRef, option);
          }, 2000);
        }
      }, 300);
    },
  }
}