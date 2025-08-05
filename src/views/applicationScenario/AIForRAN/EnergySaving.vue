<template>
  <div class="energy-saving-container">
    <!-- 左侧 节能配置 -->
    <div class="left-wrapper">
      <EnergySavingMap
        :isStart="isStart"
        :cellList="cellList"
        :cellSelected="cellSelected" />
      <EnergySavingConfig
        ref="energySavingConfigRef"
        :isStart="isStart"
        @onSomeDataChange="handleConfigSomeDataChange" />
    </div>
    <!-- 右侧 预测与监控 -->
    <div class="right-wrapper">
      <EnergySavingPrediction
        :cellList="cellList"
        :dataFileListLoaded="dataFileListLoaded"
        :modelFileListLoaded="modelFileListLoaded"
        @onCellSelectedChange="handleCellSelectedChange"
        @onStartStatusChange="handlePredictionStartStatusChange" 
        @onEnergySavingStatusChange="handleEnergySavingStatusChange"/>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import EnergySavingMap from './components/EnergySavingMap';
import EnergySavingConfig from './components/EnergySavingConfig';
import EnergySavingPrediction from './components/EnergySavingPrediction';

// 节能配置相关数据变化
const energySavingConfigRef = ref();
const cellList = ref([]);
const dataFileListLoaded = ref([]);
const modelFileListLoaded = ref([]);
const handleConfigSomeDataChange = ({ key, value }) => {
  if (key === 'cellList') cellList.value = value;
  if (key === 'dataFile') dataFileListLoaded.value = value;
  if (key === 'modelFile') modelFileListLoaded.value = value;
};

// 预测与监控
const cellSelected = ref(null);
const handleCellSelectedChange = (val) => {
  cellSelected.value = val;
};
const isStart = ref(false);
const handlePredictionStartStatusChange = (val) => {
  isStart.value = val;
};
const handleEnergySavingStatusChange = ({ cellIdentity, energySavingStatus }) => {
  energySavingConfigRef.value.updateDemoCellData({ cellIdentity, key: 'energySavingStatus', value: energySavingStatus });
};
</script>

<style lang="scss" scoped>
@use '@/styles/energy_saving.scss';

.energy-saving-container {
  width: 100%;
  min-width: 1366px;
  // height: calc(100vh - 164px);
  height: calc(100vh - 60px);
  padding: 16px 20px;
  background: url('@/assets/AIForRAN/EnergySaving/bg.svg') center -60px / cover no-repeat;
}
.left-wrapper,
.right-wrapper {
  display: inline-block;
  width: 50%;
  height: 100%;
  vertical-align: middle;
}
.left-wrapper {
  position: relative;
}
</style>