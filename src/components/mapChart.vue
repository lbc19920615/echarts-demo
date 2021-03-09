<style scoped>
.map-chart {
  width: 400px;
  height: 300px;
}
</style>


<template>
  <v-echarts class="map-chart" @init="onEchartsInit"></v-echarts>
</template>

<script>
import VEcharts from "@/components/vEcharts";
import {commonMapChartMixin} from "@/utils/mapChart";

export default {
  name: "mapChart",
  components: {VEcharts},
  mixins: [
    commonMapChartMixin
  ],
  data() {
    return {
      chart: null,
      echarts: null,
    }
  },
  methods: {
    /**
     * 当echarts init
     * @param chart
     * @param echarts
     */
    onEchartsInit(chart, echarts) {
      this.chart = chart
      this.echarts = echarts
    },
    render({map, mapData}) {
      let chart = this.chart
      const option = this.getMapOption({map});
      chart.clear();
      chart.setOption(option);
      this.echarts.registerMap(map, mapData);
      // console.log('mapData', mapData)
    }
  }
}
</script>
