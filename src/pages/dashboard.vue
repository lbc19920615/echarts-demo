<template>
  <div class="container fui-container--dark">
    <div>
      <el-button type="grd" size="small" @click="openModalChart('bar')"
        style="--grd-btn-width: 90px; --grd-btn-height: 30px;"
        >打开bar</el-button>
      <el-button type="grd" size="small" @click="openPieChart('pie')"
        style="--grd-btn-width: 90px; --grd-btn-height: 30px;"
        >打开饼图</el-button>

      <router-link to="/threemap">3d地图</router-link>
    </div>

    
    <div class="grid justify-items-center">
      <baidu-mapv></baidu-mapv>
    </div>

    <v-modal name="pie" :height="600" :width="900">
      <div class="fui-section" style="background-color: #fff;">
        <al-echart ref="pie_chart" title="动态bar"></al-echart>
      </div>
    </v-modal>

    <v-modal name="bar" :height="600" :width="900">
      <div class="fui-section" style="background-color: #fff;">
        <al-echart ref="bar_chart" title="动态bar"></al-echart>
      </div>
    </v-modal>
  </div>
</template>

<script>
import AlEchart from "@/components/alEchart";
import BaiduMapv from "../components/baiduMapv.vue";
import BarChartMixin from './dashboard/bar_chart_mixin'
import PieChartMixin from './dashboard/pie_chart_mixin'

var data = [];
for (let i = 0; i < 5; ++i) {
  data.push(Math.round(Math.random() * 200));
}

export default {
  name: "dashboard",
  components: { AlEchart, BaiduMapv },
  mixins: [
    BarChartMixin,
    PieChartMixin,
  ],
  mounted() {
  },
  methods: {
   
  },
};
</script>

<style scoped>
</style>
