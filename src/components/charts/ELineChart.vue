<template>
  <div :id="id" :style="chartStyle" class="chart-contianer"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, watch, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  chartStyle: {
    type: Object,
    default: () => ({})
  },
  gridData: {
    type: Object,
    default: () => ({})
  },
  colors: {
    type: Array,
    default: () => ([])
  },
  legendData: {
    type: Object,
    default: () => ({})
  },
  tooltipData: {
    type: Object,
    default: () => ({})
  },
  xData: {
    type: Array,
    default: () => ([])
  },
  yData: {
    type: Array,
    default: () => ([])
  },
  seriesData: {
    type: Array,
    default: () => ([])
  }
})

let chartsDom = null
const drawChart = async () => {
  await nextTick()
  const container = document.getElementById(props.id)
  if (!(props.seriesData && props.seriesData.length) || !container.clientWidth) return
  if (!chartsDom) {
    chartsDom = echarts.init(container)
    container.removeAttribute('_echarts_instance_')
  }
  let gridLeft = props.gridData?.left || 30
  if (!(props.yData && props.yData.length && props.yData.some(v => (v.type && v.type !== 'value')))) {
    const allValues = []
    props.seriesData.forEach(v => {
      const { data } = v
      allValues.push(...data.map(d => (d?.value ?? d)))
    })
    const maxLength = allValues.length ? String(Math.floor(Math.max(...allValues))).length : 0;
    const valueMaxWidth = (maxLength + 1 ) * 8 + Math.floor(maxLength / 3) * 4 + 12
    gridLeft = Math.max(valueMaxWidth, gridLeft)
  }
  const option = {
    grid: {
      right: 30,
      top: 38,
      bottom: 20,
      ...props.gridData,
      left: gridLeft
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(45, 62, 83, 0.7)',
      borderWidth: 0,
      shadow: '0px 2px 4px 0px rgba(69, 90, 116, 0.18)',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 12
      },
      confine: true,
      ...props.tooltipData
    },
    legend: {
      top: 0,
      right: props.yData.length > 1 ? 40 : 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 6,
      itemGap: 12,
      padding: 0,
      ...props.legendData,
      textStyle: {
        fontSize: 12,
        color: '#FFFFFF',
        lineHeight: 16,
        height: 16,
        overflow: 'truncate',
        padding: [0, 0, 0, 3],
        ...props.legendData?.textStyle
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0)'
      },
    },
    color: props.colors,
    xAxis: props.xData.map(item => {
      const { axisLabel = {} } = item
      return {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E3EAF2',
            type: 'dashed'
          }
        },
        axisTick: {
          length: 5,
          lineStyle: {
            color: '#E3EAF2'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#E3EAF2'
          }
        },
        ...item,
        axisLabel: {
          interval: 'auto',
          rotate: 0,
          margin: 4,
          color: '#9AA4B2',
          fontSize: 14,
          lineHeight: 22,
          ...axisLabel
        }
      }
    }),
    yAxis: props.yData.map(item => (
      {
        type: 'value',
        // max: maxData < 5 ? 5 : '',
        // minInterval: 1,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E3EAF2',
            type: 'dashed'
          }
        },
        axisTick: {
          length: 5,
          lineStyle: {
            color: '#E3EAF2'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#E3EAF2'
          }
        },
        axisLabel: {
          color: '#9AA4B2'
        },
        nameTextStyle: {
          align: 'center',
          padding: [0, 0, 0, 30]
        },
        ...item,
    })),
    series: props.seriesData.map((item, index) => (
      {
        type: 'line',
        showSymbol: false,
        // smooth: true,
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: getColorStopsByColor(props.colors[index]),
            global: false 
          },
          opacity: item.isAreaStyleShow ? 1 : 0
        },
        ...item
      }
    ))
  }
  chartsDom.setOption(option)
}

const getColorStopsByColor = (color) => {
  let color0
  let color1
  switch (color) {
    case '#02B3B2':
      color0 = 'rgba(2, 179, 178, 0.2)'
      color1 = 'rgba(2, 179, 178, 0)'
      break
    default:
      color0 = 'rgba(255, 255, 255, 0)'
      color1 = 'rgba(255, 255, 255, 0)'
      break
  }
  const colorStops = [{
    offset: 0, color: color0 // 0% 处的颜色
  }, {
    offset: 1, color: color1 // 100% 处的颜色
  }]
  return colorStops
}

// 监听容器元素
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    if (entry?.target?.id === props.id) drawChart()
  })
})

watch(() => props.seriesData, (newVal) => {
  if (newVal) drawChart()
}, { deep: true })

onMounted(() => {
  observer.observe(document.getElementById(props.id))
  drawChart()
})

onBeforeUnmount(() => {
  observer.unobserve(document.getElementById(props.id))
})
</script>

<style lang="scss" scoped>
  .chart-contianer {
    width: 100%;
    height: 100%;
  }
</style>
