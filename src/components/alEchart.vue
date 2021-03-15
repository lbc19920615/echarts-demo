

<template>
  <div>
    <v-echarts  @init="onEchartsInit"></v-echarts>
  </div>
</template>

<script>
import VEcharts from "@/components/vEcharts";
export default {
  name: "alEchart",
  props: {
    beforeRender: {
      type: Function,
      default: function () {
        return function (v) {
          return v
        }
      }
    }
  },
  components: {VEcharts},
  data() {
    return {
      chart: null,
      cachedOptions: {},
      echarts: null,
    }
  },
  methods: {
    render() {
      this.cachedOptions = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }],
        ...options
      }
      this.chart.setOption();
    },
    /**
     * 当echarts init
     * @param chart
     * @param echarts
     */
    onEchartsInit(chart, echarts) {
      this.chart = chart
      this.echarts = echarts
      this.$nextTick(() => {
        this.render()
      })
    }
  }
}
</script>

<style scoped>

</style>
