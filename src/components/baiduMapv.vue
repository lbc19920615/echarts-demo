<style lang="scss">
#map {
  width: 1024px;
  height: 768px;
}
</style>

<template>
  <div>
    <div id="map"></div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import * as mapv from "mapv";
console.log(mapv);

export default {
  name: "baiduMapv",
  mounted() {
    // 百度地图API功能
    var map = new BMap.Map("map", {
      enableMapClick: false,
    }); // 创建Map实例
    map.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5); // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

    /*
        map.setMapStyle({
            style: 'light'
        });
        */

    var randomCount = 300;

    var data = [];

    var citys = [
      "北京",
      "天津",
      "上海",
      "重庆",
      "石家庄",
      "太原",
      "呼和浩特",
      "哈尔滨",
      "长春",
      "沈阳",
      "济南",
      "南京",
      "合肥",
      "杭州",
      "南昌",
      "福州",
      "郑州",
      "武汉",
      "长沙",
      "广州",
      "南宁",
      "西安",
      "银川",
      "兰州",
      "西宁",
      "乌鲁木齐",
      "成都",
      "贵阳",
      "昆明",
      "拉萨",
      "海口",
    ];

    // 构造数据
    while (randomCount--) {
      var cityCenter = mapv.utilCityCenter.getCenterByCityName(
        citys[parseInt(Math.random() * citys.length)]
      );
      data.push({
        geometry: {
          type: "Point",
          coordinates: [
            cityCenter.lng - 2 + Math.random() * 4,
            cityCenter.lat - 2 + Math.random() * 4,
          ],
        },
        count: 30 * Math.random(),
      });
    }

    var dataSet = new mapv.DataSet(data);

    var options = {
      fillStyle: "rgba(255, 50, 50, 0.6)",
      shadowColor: "rgba(255, 50, 50, 1)",
      shadowBlur: 30,
      globalCompositeOperation: "lighter",
      methods: {
        click: function (item) {
          console.log(item);
        },
      },
      size: 5,
      // updateImmediate: true,
      draw: "simple",
    };

    var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
  },
};
</script>