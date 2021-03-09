export let commonMapChartMixin = {
  methods: {
    /**
     * 获取map option
     */
    getMapOption({ map }) {
      let option = {
        title: {
          text: name,
          left: "center",
        },
        // backgroundColor: '#b4eeff',
        // visualMap: {
        //   min: 800,
        //   max: 50000,
        //   text: ['High', 'Low'],
        //   realtime: false,
        //   calculable: true,
        //   inRange: {
        //     color: ['lightskyblue', 'yellow', 'orangered']
        //   }
        // },
        series: [
          {
            name: name,
            type: "map",
            map: map,
            roam: true, // 是否开启鼠标缩放和平移漫游
            label: {
              show: true
            },

            aspectScale: map === "china" ? 0.75 : 1,
            top: "10%", //组件距离容器的距离
          },
        ],
      }

      console.log('map', map)

      if (map === 'china') {
        option.series[0] = Object.assign(option.series[0], {
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
                  color: "#ccc",
                },
              },
            },
          },
          data: [
            // {
            //   name: '江苏省',
            //   value: 2005734,
            //   itemStyle: {
            //     areaColor: '#333'
            //   },
            // },
            // {
            //   name: '浙江省',
            //   value: 111,
            //   itemStyle: {
            //     areaColor: '#333'
            //   },
            // },
          ]
        })
      }

      return option
    },
  }
}
