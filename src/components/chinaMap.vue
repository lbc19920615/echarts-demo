<style>
.china-map {
  width: 1000px;
  height: 800px;
  position: absolute;
  left: calc(50% - 500px);
  top: 100px;
}

.china-map-back {
  cursor: pointer;
}
</style>

<template>
  <div>
<!--    {{childParentMapObj}}-->
    <div class="china-map-back"
        v-if="isShowBack" ref="oBack" @click="backUpMap">{{childParentMapObj && childParentMapObj.name ?
        '返回' + childParentMapObj.name : '返回'}}</div>
    <v-echarts class="china-map" @init="onEchartsInit"></v-echarts>
  </div>
</template>

<script>
import VEcharts from "@/components/vEcharts";
import axios from 'axios'

export default {
  name: "chinaMap",
  components: {VEcharts},
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
  methods: {
    /**
     * 加载map
     **/
    loadMap(map, name, { code, isFull, onClickMap, isAction = true}) {
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

      function getMapReqType(areaCode, isFull) {
        return areaCode +
            (isFull ? "_full" : "")
      }

      function getAreaMap(areaCode, isFull) {
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
      }

      let type = getMapReqType(code, isFull)
      let promise = Promise.resolve();

      if (!mapCaches[map]) {
        promise = getAreaMap(code, isFull)
            .then((mapData) => {
              echarts.registerMap(map, mapData);

              mapCaches[map] = mapData;
              mapGetCaches[type] = mapData
            });
      }

      promise.then(() => {
        const option = self.getMapOption({map});
        chart.clear();
        chart.setOption(option);


        self.$nextTick(() => {
          if (isAction) {
            self.setMapAction({
              map,
              name,
              code,
              isFull
            }, onClickMap)
          }
        })

      });
    },
    /**
     * 获取map option
     */
    getMapOption({ map }) {
      return  {
        title: {
          text: name,
          left: "center",
        },
        series: [
          {
            name: name,
            type: "map",
            map,
            roam: true, // 是否开启鼠标缩放和平移漫游
            itemStyle: {
              // 地图区域的多边形 图形样式
              normal: {
                // 是图形在默认状态下的样式
                label: {
                  show: true, //是否显示标签
                  textStyle: {
                    color: "rgba(255,255,255,0)",
                  },
                },
              },
            },
            aspectScale: map === "china" ? 0.75 : 1,
            top: "10%", //组件距离容器的距离
          },
        ],
      }
    },
    /**
     * 设置map 动作
     * @param map
     * @param code
     * @param isFull
     * @param onClickMap
     */
    setMapAction({map, name, code, isFull}, onClickMap) {
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

          if (onClickMap) {
            onClickMap(childParentMapObj)
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
      this.loadMap(childParentMapObj.map, childParentMapObj.name, {
        code: childParentMapObj.code,
        isFull: childParentMapObj.isFull,
      });

      if (childParentMapObj.map !== "china") {
        childParentMapObj = childParentMapObj.parent;
      } else {
        childParentMapObj = null;
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
    /**
     * 当echarts init
     * @param chart
     * @param echarts
     */
    onEchartsInit(chart, echarts) {
      let self = this
      this.chart = chart
      this.echarts = echarts
      let name = '中国'
      this.loadMap("china", "中国", {
        code: 100000,
        isFull: true,
        onClickMap(childParentMapObj) {
          self.handleBackStatus(childParentMapObj, name)
        }
      });
    }
  }
}
</script>


