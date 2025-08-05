<template>
  <div id="energySavingMap"></div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import CONSTANT from '@/demo/EnergySaving/constant';
import ICON_CELL_NOT_CONFIG from '@/assets/AIForRAN/EnergySaving/icon_cell_not_config.svg'
import ICON_CELL_NOT_SAVING from '@/assets/AIForRAN/EnergySaving/icon_cell_not_saving.svg'
import ICON_CELL_SAVING from '@/assets/AIForRAN/EnergySaving/icon_cell_saving.svg'
import ICON_CELL_CLOSED from '@/assets/AIForRAN/EnergySaving/icon_cell_closed.svg'

const props = defineProps({
  cellList: {
    type: Array,
    default: () => ([])
  },
  cellSelected: {
    type: Object,
    default: null
  },
  isStart: {
    type: Boolean,
    default: false
  }
});

const constantList = ref(CONSTANT);
const energySavingIconMap = {
  0: ICON_CELL_NOT_CONFIG,
  1: ICON_CELL_NOT_SAVING,
  2: ICON_CELL_SAVING,
  3: ICON_CELL_CLOSED
};

let map = null;
const AMapTemp = ref(null);
const drawMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: 'f95e9060316cef57f4e89739e48c9ec4',
  }
  AMapLoader.load({
    key: '81b8fd54e3551b584de8d59cc6506855',
    // version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Icon', 'AMap.Marker'],
  }).then((AMap) => {
    AMapTemp.value = AMap;
    // let mapCenter = [116.397428, 39.90923];
    let mapCenter = [116.466100, 40.103];
    map = new AMap.Map('energySavingMap', {
      viewMode: '2D',
      zoom: 16,
      center: mapCenter,
      zoomEnable: false,
      dragEnable: false,
    });
  }).catch((e) => {
    console.log('加载地图失败');
  });
};
let markerList = [];
const drawCells = () => {
  const AMap = AMapTemp.value;
  if (markerList && markerList.length) {
    markerList.forEach((marker) => {
      marker.setMap(null);
    });
    markerList = [];
  }
  if (props.cellList && props.cellList.length) {
    markerList = props.cellList.map(cell => {
      const { cellIdentity, energySavingStatus, longitude, latitude } = cell;
      let iconCustomClass = '';
      /* if (props.isStart && props.cellSelected && props.cellSelected.cellIdentity === cellIdentity) {
        if (String(energySavingStatus) === '2') iconCustomClass = 'rotate-slow';
        else iconCustomClass = 'rotate-normal';
      } */
      const cellPosition = new AMap.LngLat(longitude, latitude);
      const marker = new AMap.Marker({
        position: cellPosition,
        anchor: 'center',
        offset: new AMap.Pixel(0, 0),
        content: `<img src="${energySavingIconMap[energySavingStatus]}" class="energy-saving-cell-icon ${iconCustomClass}" />`,
        extData: { cellIdentity },
      });
      return marker;
    })
    map.add(markerList)
  }
};
const updateCellsSelected = () => {
  if (markerList && markerList.length && props.cellSelected) {
    console.log('--------小区marker更新-------')
    markerList.forEach((marker) => {
      const { cellIdentity } =  marker.getExtData() || {};
      if (props.cellSelected.cellIdentity === cellIdentity) {
        const { energySavingStatus } = props.cellSelected;
        let iconCustomClass = '';
        if (props.isStart) {
          if (String(energySavingStatus) === '2') iconCustomClass = 'rotate-slow';
          else iconCustomClass = 'rotate-normal';
        }
        marker.setContent(`<img src="${energySavingIconMap[energySavingStatus]}" class="energy-saving-cell-icon ${iconCustomClass}" />`);
      }
    });
  }
};

watch([AMapTemp, () => props.cellList], ([AMapNew, cellListNew], [AMapOld, cellListOld]) => {
  console.log('----小区数据变化----', cellListNew)
  if (AMapNew) {
    // 从无到有 & 从有到无 => 渲染 cell
    if (
      (!(cellListOld && cellListOld.length) && cellListNew && cellListNew.length)
      || 
      (cellListOld && cellListOld.length) && !(cellListNew && cellListNew.length)
    ) drawCells();
    // 变更 cell状态
    else if (cellListNew && cellListNew.length) {
      // 预测中，只变更当前小区
      if (props.isStart) updateCellsSelected();
      // 非预测中，由节能配置触发整体刷新
      else drawCells();
    };
  } 
}, { deep: true });
watch(() => props.isStart, (newVal, oldVal) => {
  // 复位
  if (oldVal && !newVal) updateCellsSelected();
  // 启动
  if (!oldVal && newVal) updateCellsSelected();
});

onMounted(() => {
  drawMap();
});
</script>

<style lang="scss" scoped>
#energySavingMap {
  width: 100%;
  height: 100%;
  background: #EBEBEB;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
:deep(.energy-saving-cell-icon) {
  width: 90px;
  transform-origin: 50% 46.5%;
  &.rotate-slow {
    animation: iconRotate 4s linear infinite;
  }
  &.rotate-normal {
    animation: iconRotate 2s linear infinite;
  }
}
@keyframes iconRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>