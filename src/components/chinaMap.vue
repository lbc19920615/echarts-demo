<style>
.china-map {
  width: 1000px;
  height: 800px;
  position: absolute;
  left: calc(50% - 500px);
  top: 30px;
}

.china-map-back {
  cursor: pointer;
  position: fixed;
  top: 30px;
  right: 30px;
}

.parent-map {

}
</style>

<template>
  <div>
    {{childParentMapObj}}
    <div class="china-map-back"
        v-if="isShowBack" ref="oBack" @click="backUpMap">{{childParentMapObj && childParentMapObj.name ?
        '返回' + childParentMapObj.name : '返回'}}</div>
    <v-echarts class="china-map" @init="onEchartsInit"></v-echarts>

    <map-chart ref="parentMap"></map-chart>
  </div>
</template>

<script>
import VEcharts from "@/components/vEcharts";
import axios from 'axios'
import MapChart from "@/components/mapChart";
import {commonMapChartMixin} from "@/utils/mapChart";

function getMapReqType(areaCode, isFull) {
  return areaCode +
      (isFull ? "_full" : "")
}

function getMapKey(code) {
  if (code === 100000) {
    return 'china'
  }
  return code
}

export default {
  name: "chinaMap",
  components: {MapChart, VEcharts},
  mixins: [
    commonMapChartMixin
  ],
  data() {
    return {
      isShowBack: false,
      chart: null,
      echarts: null,
      mapCaches: {},
      mapGetCaches: {},
      childParentMapObj: {},
      version: ''
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    childParentMapObj(newVal) {
      // console.log('childParentMapObj', newVal)
      if (this.onSetMapData) {
        this.onSetMapData()
      }
    },
    isShowBack(newVal) {
      if (!newVal) {
        this.$refs.parentMap.clear()
      }
    }
  },
  methods: {
    getAreaMap(areaCode, isFull) {
      let mapGetCaches = this.mapGetCaches
      let type = getMapReqType(areaCode, isFull)
      if (mapGetCaches && mapGetCaches[type]) {
        return Promise.resolve(mapGetCaches[type]);
      } else {
        return axios
            .get(
                "http://42.192.232.58:3000/proxy/areas_v2/bound/" +
                type +
                ".json?proxy_key=7f297416175d8b022098ded9548eb276"
            )
            .then(function (res) {
              return Promise.resolve(res.data);
            });
      }
    },
    /**
     * 加载map
     **/
    loadMap(map, name, { code, isFull, isAction = true}) {
      // map请求程序
      let mapGetCaches = this.mapGetCaches
      // 地图缓存数据
      let mapCaches = this.mapCaches;
      // 点击进入下一级时，其父级的地图数据对象集合
      // eslint-disable-next-line no-unused-vars
      let childParentMapObj = this.childParentMapObj;
      // self
      let self = this

      window.mapCaches = mapCaches
      window.mapGetCaches = mapGetCaches

      const echarts = this.echarts
      const chart = this.chart

      let type = getMapReqType(code, isFull)
      let promise = Promise.resolve();

      if (!mapCaches[map]) {
        promise = self.getAreaMap(code, isFull)
          .then((mapData) => {
            echarts.registerMap(map, mapData);

            mapCaches[map] = mapData;
            mapGetCaches[type] = mapData
            // console.log('mapCaches', mapCaches, map)

          });
      }

      promise.then(() => {
        const option = self.getMapOption({map});
        chart.clear();
        // console.log(option)
        chart.setOption(option);

        self.$nextTick(() => {
          if (isAction) {
            self.setMapAction({
              map,
              name,
              code,
              isFull
            })
          }
        })

      });
    },
    onSetMapData() {
      // console.log('parentMap', this.childParentMapObj)
      if ( this.childParentMapObj && this.childParentMapObj.name &&  this.childParentMapObj.parent) {
        let mapCaches = this.mapCaches
        let map = getMapKey(this.childParentMapObj.code)
        // console.log(mapCaches,  this.childParentMapObj)
        if (mapCaches[map]) {
          this.$refs.parentMap.render({
            map,
            mapData: mapCaches[map],
          })
        } else {
          this.$refs.parentMap.clear()
        }
      } else {
        this.$refs.parentMap.clear()
      }
    },
    /**
     * 设置map 动作
     * @param map
     * @param code
     * @param isFull
     */
    setMapAction({map, name, code, isFull}) {
      let self = this
      let chart = this.chart

      chart.off("click");
      chart.off("dblclick");


      chart.on("click", function (param) {
        let childParentMapObj = self.childParentMapObj
        let mapCaches = self.mapCaches

        if (param.name !== (childParentMapObj || {}).name) {
          const mapData = mapCaches[map];
          // console.log('sdsdsds', self.mapCaches, map)
          if (mapData) {
            const mapInfo = mapData.features.find((m) => {
              return m.properties.name === param.name;
            });
            const properties = mapInfo.properties;

            self.loadMap(properties.adcode, properties.name, {
              code: properties.adcode,
              isFull: properties.level !== "district",
            });
          }

          childParentMapObj = {
            map,
            name,
            code,
            isFull,
            parent: childParentMapObj,
          };

          if (self.onClickMap) {
            self.onClickMap(childParentMapObj, name)
          }
        }
      });
    },
    /**
     * 返回上一级map
     */
    backUpMap() {
      let self = this
      let childParentMapObj = this.childParentMapObj;
      self.loadMap(childParentMapObj.map, childParentMapObj.name, {
        code: childParentMapObj.code,
        isFull: childParentMapObj.isFull,
      });

      // console.log(childParentMapObj)
      if (childParentMapObj.map !== "china") {
        // childParentMapObj = childParentMapObj.parent;
        self.$set(self, 'childParentMapObj', childParentMapObj.parent)
      } else {
        self.$set(self, 'childParentMapObj', null)
        self.isShowBack = false
      }
    },
    /**
     * 处理返回
     * @param childParentMapObj
     */
    handleBackStatus(childParentMapObj) {
      let self = this
      // console.log('childParentMapObj', childParentMapObj)
      self.childParentMapObj = childParentMapObj
      if (!childParentMapObj) {
        self.isShowBack = false
      } else {
        self.isShowBack = true
      }
    },
    onClickMap(childParentMapObj, name) {
      this.handleBackStatus(childParentMapObj, name)
    },
    /**
     * 当echarts init
     * @param chart
     * @param echarts
     */
    onEchartsInit(chart, echarts) {
      this.chart = chart
      this.echarts = echarts
      this.loadMap(getMapKey(100000), "中国", {
        code: 100000,
        isFull: true,
      });
    }
  }
}
</script>


