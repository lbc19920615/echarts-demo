<template>
  <div class="container">

    <div>
      <a-button type="primary" size="small"
      @click="openModalChart('bar')"
      >打开bar</a-button>
    </div>

    <china-map></china-map>

    <v-modal name="bar" :resizable="true"
    :height="600" :width="900"
    >
      <al-echart ref="bar_chart"
        title="动态bar"
      ></al-echart>
    </v-modal>
  </div>
</template>

<script>
import ChinaMap from "@/components/chinaMap";
import AlEchart from "@/components/alEchart";
import {BasicSerie} from "@/utils/series";

var data = [];
for (let i = 0; i < 5; ++i) {
  data.push(Math.round(Math.random() * 200));
}


export default {
  name: "dashboard",
  components: {AlEchart, ChinaMap},
  mounted () {
    // this.openModalChart('bar')
  },
  methods: {
   openModalChart(name) {
     let option = {
       xAxis: {
         max: 'dataMax',
       },
       yAxis: {
         type: 'category',
         data: ['A', 'B', 'C', 'D', 'E'],
         // inverse: true,
         animationDuration: 300,
         animationDurationUpdate: 300,
         // max: 2 // only
       },
       series: [
         BasicSerie('销量', {
           initOption() {
             return {
               realtimeSort: true,
               name: 'X',
               label: {
                 show: true,
                 position: 'right',
                 valueAnimation: true
               }
             }
           }
         })
             .init('bar', [5, 20, 36, 10, 10, 20])
       ],
       animationDuration: 0,
       animationDurationUpdate: 2000,
       animationEasing: 'linear',
       animationEasingUpdate: 'linear'
     }

     function run(chartRef, option) {
       var data = option.series[0].data;
       for (var i = 0; i < data.length; ++i) {
         if (Math.random() > 0.9) {
           data[i] += Math.round(Math.random() * 2000);
         }
         else {
           data[i] += Math.round(Math.random() * 200);
         }
       }
       chartRef.render(option);
     }

     this.$modal.show(name)
     setTimeout(() => {
       let chartRef = this.$refs[name + '_chart']
       if (chartRef) {
         run(chartRef, option)

         setInterval(() => {
           run(chartRef, option)
         }, 2000)
       }
     }, 300)
   }
  }
}
</script>

<style scoped>

</style>
