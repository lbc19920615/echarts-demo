export let commonMapChartMixin = {
  methods: {
    /**
     * 获取map option
     */
    getMapOption({ map }) {
      return  {
        title: {
          text: name,
          left: "center",
        },
        backgroundColor: '#b4eeff',
        series: [
          {
            name: name,
            type: "map",
            map,
            roam: true, // 是否开启鼠标缩放和平移漫游
            emphasis: {
              itemStyle: {
                areaColor: '#0ecdfd',
              },
              label: {
                show: true, //是否显示标签
                textStyle: {
                  color: "#fff",
                },
              },
            },
            itemStyle: {
              // 地图区域的多边形 图形样式
              normal: {
                areaColor: '#085fa2',
                borderColor: '#0ecdfd',
                // 是图形在默认状态下的样式
                label: {
                  show: true, //是否显示标签
                  textStyle: {
                    color: "#eee",
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
  }
}
