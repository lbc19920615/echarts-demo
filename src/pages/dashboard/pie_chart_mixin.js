const demoSerie = {
  name: '访问来源',
  type: 'pie',
  radius: '50%',
  data: [
    { value: 1048, name: '搜索引擎' },
    { value: 735, name: '直接访问' },
    { value: 580, name: '邮件营销' },
    { value: 484, name: '联盟广告' },
    { value: 300, name: '视频广告' },
  ],
  emphasis: {
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },
  },
}

export default {
  mounted() {},
  methods: {
    openPieChart(name) {
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          demoSerie
        ],
      }

      this.$modal.show(name)
      setTimeout(() => {
        let chartRef = this.$refs[name + '_chart']
        if (chartRef) {
          // console.log(chartRef.render)
          chartRef.getChart().setOption(option)
        }
      }, 300)
    },
  },
}
