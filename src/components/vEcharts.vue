<style>
.v-charts {
  width: 600px;
  height: 600px;
}
</style>

<template>
  <div class="v-charts" ref="main"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "vEcharts",
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    // initialize the echarts instance
    this.chart = echarts.init(this.$refs.main);
    this.$emit('init', this.chart, echarts)
  },
}
</script>

<style scoped>

</style>
