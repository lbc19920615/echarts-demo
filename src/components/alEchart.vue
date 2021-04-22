

<template>
  <div>
    <v-echarts  @init="onEchartsInit"></v-echarts>
  </div>
</template>

<script>
import VEcharts from "@/components/vEcharts";
import merge from 'lodash/merge'

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
    },
    title: String
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
    getChart() {
      return this.chart
    },
    render(option = {}) {
      this.cachedOptions = merge({
        title: {
          text: this.title
        },
      }, option)
      this.chart.setOption(this.cachedOptions);
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
        // this.render()
      })
    },
  }
}
</script>

<style scoped>

</style>
