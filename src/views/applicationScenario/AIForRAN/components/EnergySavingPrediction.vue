<template>
  <div class="card-wrapper prediction-wrapper">
    <div class="card-header">
      <div class="card-title">
        <img src="@/assets/AIForRAN/EnergySaving/icon_energysaving.svg" alt="" width="22" height="22" class="mr8">
        指标预测及节能监控
      </div>
    </div>
    <div class="card-body">
      <div class="prediction-form">
        <div class="cell-select-label mr8">节能小区</div>
        <el-select v-model="cellSelected" value-key="cellIdentity" placeholder="请选择" :disabled="isStart" class="mr16">
          <el-option
            v-for="item in cellList"
            :key="item.cellIdentity"
            :label="item.name"
            :value="item" />
        </el-select>
        <el-button type="primary" @click="onStart" :disabled="!startable">启动</el-button>
        <el-button type="default" @click="onReset" class="ml8">复位</el-button>
      </div>
      <div class="prediction-charts-wrapper">
        <div
          v-for="chart in chartList"
          :key="chart.key"
          class="chart-wrapper">
          <div class="chart-header">
            <div class="chart-title">{{ chart.title }}</div>
            <div class="chart-legend">
              <div
                v-for="(item, index) in chart.legend"
                :key="item.type"
                :class="['chart-legend-item', `chart-legend-item-${item.type}`, index ? 'ml8' : '']">{{ item.name }}</div>
            </div>
          </div>
          <ELineChart v-bind="chartDataMap[chart.key]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch, onBeforeUnmount, nextTick } from 'vue';
import ELineChart from '@/components/charts/ELineChart';
import PREDICTION_DATA from '@/demo/EnergySaving/predictionData';

const props = defineProps({
  cellList: {
    type: Array,
    default: () => ([])
  },
  dataFileListLoaded: {
    type: Array,
    default: () => ([])
  },
  modelFileListLoaded: {
    type: Array,
    default: () => ([])
  }
});

const emit = defineEmits(['onStartStatusChange', 'onEnergySavingStatusChange', 'onCellSelectedChange']);

const cellSelected = ref(null);
watch(() => props.cellList, (newVal) => {
  if (!(newVal && newVal.length)) cellSelected.value = null;
}, { deep: true });
watch(cellSelected, (newVal) => {
  emit('onCellSelectedChange', newVal);
}, { deep: true });

const historyDataFlag = computed(() => {
  return props.dataFileListLoaded.find((v) => (v.type === 'history'))?.flag;
});

const chartList = ref([
  {
    key: 'rrc',
    title: 'RRC连接数',
    legend: [
      { name: 'RRC连接数', type: 'green' },
      { name: 'RRC连接数模型预测值', type: 'orange-dashed' },
    ],
  },
  {
    key: 'prb',
    title: 'PRB利用率',
    legend: [
      { name: 'PRB利用率', type: 'green' },
      { name: 'PRB利用率模型预测值', type: 'orange-dashed' },
    ],
  },
  {
    key: 'energy',
    title: '能耗',
    legend: [
      { name: '未启用节能', type: 'red' },
      { name: '启用节能', type: 'green' },
    ],
  },
]);
// 图表初始化数据
const chartDataMapInit = {
  rrc: {
    id: 'rrcChart',
    chartStyle: { height: 'calc(100% - 22px)' },
    gridData: {
      top: 8,
      bottom: 22,
      left: 50,
    },
    legendData: {
      show: false,
    },
    colors: ['#02B3B2', '#F3940E', '#263FFF'],
    xData: [{ data: [] }],
    yData: [{ minInterval: 1, min: null, max: null }],
    seriesData: [
      { name: 'RRC连接数', data: [] },
      { name: 'RRC连接数模型预测值', data: [], lineStyle: { type: 'dashed' } },
      { name: 'RRC链接数阈值', data: [] },
    ],
  },
  prb: {
    id: 'prbChart',
    chartStyle: { height: 'calc(100% - 22px)' },
    gridData: {
      top: 8,
      bottom: 22,
      left: 50,
    },
    legendData: {
      show: false,
    },
    colors: ['#02B3B2', '#F3940E', '#263FFF'],
    xData: [{ data: [] }],
    yData: [{ minInterval: 1, min: null, max: null }],
    seriesData: [
      { name: 'PRB利用率', data: [] },
      { name: 'PRB利用率模型预测值', data: [], lineStyle: { type: 'dashed' } },
      { name: 'PRB利用率阈值', data: [] },
    ],
  },
  energy: {
    id: 'energyChart',
    chartStyle: { height: 'calc(100% - 22px)' },
    gridData: {
      top: 8,
      bottom: 22,
      left: 50,
    },
    legendData: {
      show: false,
    },
    colors: ['#F04438', '#02B3B2'],
    xData: [{ data: [] }],
    yData: [{ minInterval: 1, min: null, max: null }],
    seriesData: [
      { name: '未启用节能', data: [] },
      { name: '启用节能', data: [] },
    ],
  },
};
const chartDataMap = ref(JSON.parse(JSON.stringify(chartDataMapInit)));
let chartTimer = null;
let chartTimerIndex = 0; // 取demo数据的索引
const isStart = ref(false);
const startable = computed(() => {
  return !isStart.value && cellSelected.value && [1, 2].includes(cellSelected.value.energySavingStatus) && props.dataFileListLoaded.length === 2 && props.modelFileListLoaded.length;
});
const onStart = () => {
  isStart.value = true;
  chartTimer = setInterval(() => {
    handleChartData();
    if (chartTimerIndex < 191) chartTimerIndex += 1;
    else chartTimerIndex = 0;
  }, 1000);
  emit('onStartStatusChange', true);
};
// 临时存储预测数据
let predictionDataTemp = {
  time: [],
  rrc: [],
  rrcPre: [],
  prb: [],
  prbPre: [],
  energy: [],
  energyPre: [],
};
const handleChartData = () => {
  // 总共 192个点，取 48个点
  const {
    time: timeAll,
    rrc: rrcAll, rrc01: rrc01All, rrc02: rrc02All,
    prb: prbAll, prb01: prb01All, prb02: prb02All,
    energy: energyAll, energy01: energy01All, energy02: energy02All,
  } = PREDICTION_DATA;
  const { time, rrc, rrcPre, prb, prbPre, energy, energyPre } = predictionDataTemp;
  time.push(timeAll[chartTimerIndex]);
  rrc.push(rrcAll[chartTimerIndex]);
  const curRrcPre = historyDataFlag.value === '01' ? rrc01All[chartTimerIndex] : rrc02All[chartTimerIndex];
  rrcPre.push(curRrcPre);
  prb.push(prbAll[chartTimerIndex]);
  const curPrbPre = historyDataFlag.value === '01' ? prb01All[chartTimerIndex] : prb02All[chartTimerIndex];
  prbPre.push(curPrbPre);
  const curEnergy = energyAll[chartTimerIndex];
  energy.push(energyAll[chartTimerIndex]);
  const curEnergyPre = historyDataFlag.value === '01' ? energy01All[chartTimerIndex] : energy02All[chartTimerIndex];
  energyPre.push(curEnergyPre);
  if (time.length > 48) {
    time.shift();
    rrc.shift();
    rrcPre.shift();
    prb.shift();
    prbPre.shift();
    energy.shift();
    energyPre.shift();
  }
  // console.log(chartTimerIndex, time)
  predictionDataTemp = { time, rrc, rrcPre, prb, prbPre, energy, energyPre };
  const { rrc: rrcChartData, prb: prbChartData, energy: energyChartData } = chartDataMap.value;
  chartDataMap.value = {
    rrc: {
      ...rrcChartData,
      xData: [{ data: time }, { data: ['0', '1'], show: false }],
      yData: [{ minInterval: 1, min: 0, max: 400 }],
      seriesData: [
        { name: 'RRC连接数', data: rrc, isAreaStyleShow: true },
        { name: 'RRC连接数模型预测值', data: rrcPre, lineStyle: { type: 'dashed' } },
        {
          name: 'RRC链接数阈值',
          data: [200, 200],
          lineStyle: { type: 'dashed' },
          markPoint:{ data: [{ type: 'max', name: 'Max' }], symbol: 'cicle', symbolSize: 0, symbolOffset: [20, -6], label: { color: '#263FFF', fontSize: 12, lineHeight: 22 } },
          tooltip: { show: false },
          xAxisIndex: 1
        },
      ]
    },
    prb: {
      ...prbChartData,
      xData: [{ data: time }, { data: ['0', '1'], show: false }],
      yData: [{ minInterval: 1, min: 0, max: 100, axisLabel: { color: '#9AA4B2', formatter: '{value}%' } }],
      seriesData: [
        { name: 'PRB利用率', data: prb, isAreaStyleShow: true },
        { name: 'PRB利用率模型预测值', data: prbPre, lineStyle: { type: 'dashed' } },
        {
          name: 'PRB利用率阈值',
          data: [30, 30],
          lineStyle: { type: 'dashed' },
          markPoint:{ data: [{ type: 'max', name: 'Max' }], symbol: 'cicle', symbolSize: 0, symbolOffset: [20, -6], label: { color: '#263FFF', formatter: '{c}%', fontSize: 12, lineHeight: 22 } },
          tooltip: { show: false },
          xAxisIndex: 1
        },
      ]
    },
    energy: {
      ...energyChartData,
      xData: [{ data: time }],
      yData: [{ minInterval: 1, min: 0, max: null, axisLabel: { color: '#9AA4B2', formatter: '{value}W' } }],
      seriesData: [
        { name: '未启用节能', data: energy },
        { name: '启用节能', data: energyPre },
      ]
    },
  };
  // demo小区数据联动
  if (curEnergyPre < curEnergy) emit('onEnergySavingStatusChange', {
    cellIdentity: cellSelected.value.cellIdentity,
    energySavingStatus: 2
  });
  else emit('onEnergySavingStatusChange', {
    cellIdentity: cellSelected.value.cellIdentity,
    energySavingStatus: 1
  });
};
const onReset = async () => {
  // 清空右侧数据
  if (chartTimer) {
    clearInterval(chartTimer);
    chartTimer = null;
  }
  await nextTick();
  chartTimerIndex = 0;
  predictionDataTemp = {
    time: [],
    rrc: [],
    rrcPre: [],
    prb: [],
    prbPre: [],
    energy: [],
    energyPre: []
  };
  chartDataMap.value = JSON.parse(JSON.stringify(chartDataMapInit));
  isStart.value = false;
  emit('onStartStatusChange', false);
};

onBeforeUnmount(() => {
  if (chartTimer) {
    clearInterval(chartTimer);
    chartTimer = null;
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/energy_saving.scss';

.card-wrapper.prediction-wrapper {
  width: 100%;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  .card-body {
    padding: 0 10px 20px 20px;
    .prediction-form {
      height: 32px;
      padding-right: 10px;
      .cell-select-label {
        display: inline-block;
        line-height: 32px;
        font-size: 14px;
        color: #202939;
      }
      :deep(.el-select) {
        width: 154px;
        height: 32px;
      }
    }
    .prediction-charts-wrapper {
      width: 100%;
      height: calc(100% - 32px);
      padding-right: 10px;
      overflow-y: auto;
      .chart-wrapper {
        width: 100%;
        height: calc(100% / 3 - 16px);
        min-height: 180px;
        padding: 12px 0;
        border: 1px solid #E3E8EF;
        border-radius: 10px;
        margin-top: 16px;
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 22px;
          padding: 0 16px;
          .chart-title {
            line-height: 22px;
            font-size: 14px;
            font-weight: 700;
            color: #202939;
          }
          .chart-legend {
            .chart-legend-item {
              display: inline-block;
              line-height: 22px;
              font-size: 12px;
              color: #202939;
              &::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 4px;
                border-radius: 2px;
                margin-right: 8px;
                vertical-align: middle;;
              }
              &.chart-legend-item-green::before {
                background: #02B3B2;
              }
              &.chart-legend-item-red::before {
                background: #F04438;
              }
              &.chart-legend-item-orange-dashed::before {
                background: url('@/assets/AIForRAN/EnergySaving/icon_legend_orangedashed.svg') center / cover no-repeat;
              }
            }
          }
        }
      }
    }
  }
}
</style>