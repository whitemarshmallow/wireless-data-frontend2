<template>
  <el-drawer
    title="小区详情"
    v-model="isVisible"
    @closed="onClose"
    :close-on-click-modal="false"
    :size="960"
    class="custom-drawer">
    <div class="field-item-wrapper">
      <el-row :gutter="16">
        <el-col
          :span="8"
          v-for="(item, index) in detailFields"
          :key="item.prop"
          :class="index > 2 ? 'mt10' : ''">
          <div class="field-item">
            <div class="field-label">{{ item.label }}：</div>
            <div class="field-value">{{ cellData[item.prop] }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
// import CONSTANT_MAP from '@/demo/EnergySaving/constantMap';

const props = defineProps({
  cellData: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['handleClose']);

const isVisible = ref(false);
// const constantMap = ref(CONSTANT_MAP);
const detailFields = ref([
  { prop: 'id', label: '小区序号' },
  { prop: 'cellIdentity', label: '小区标识' },
  { prop: 'name', label: '小区名称' },
  { prop: 'trackingAreaCode', label: '跟踪区域码' },
  { prop: 'cgi', label: '小区CGI' },
  { prop: 'localCellIdentity', label: '本地小区标识' },
  { prop: 'cellStatus', label: '小区状态' },
  { prop: 'physicalCellIdentity', label: '物理小区识别码' },
  { prop: 'neId', label: '网元标识' },
  { prop: 'neName', label: '网元名称' },
  { prop: 'equipmentMaintenanceStatus', label: '设备维护状态' },
  { prop: 'sectorName', label: '片区名称' },
  { prop: 'manufacturerName', label: '厂家名称' },
  { prop: 'baseStationName', label: '基站名称' },
  { prop: 'longitude', label: '经度' },
  { prop: 'latitude', label: '纬度' },
  { prop: 'antennaHeight', label: '天线挂高' },
  { prop: 'antennaDowntilt', label: '下倾角' },
  { prop: 'antennaAzimuth', label: '方向角' },
  { prop: 'coverageType', label: '覆盖类型' },
  { prop: 'coverageScenario', label: '覆盖场景' },
  { prop: 'centerFrequencyChannelNumber', label: '中心载频的信道号' },
  { prop: 'radioAccessTechnology', label: '制式' },
  { prop: 'bandwidth', label: '带宽' },
  { prop: 'operatingBand', label: '工作频段' },
]);

const onClose = () => {
  emit('handleClose');
};

onMounted(() => {
  isVisible.value = true
});
</script>

<style lang="scss" scoped>
@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mt10 {
  margin-top: 10px;
}
.field-item {
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  margin-right: 4px;
  .field-label {
    color: #697586;
    word-break: keep-all;
  }
  .field-value {
    color: #202939;
    @include ellipsis;
  }
}
</style>
<style lang="scss">
.el-drawer.custom-drawer {
  background: url('@/assets/AIForRAN/EnergySaving/bg_popover.svg') center top / contain no-repeat #FFFFFF;
  .el-drawer__header {
    height: 56px;
    padding: 16px 20px;
    border-bottom: 1px solid #E3E8EF;
    margin-bottom: 0;
    .el-drawer__title {
      line-height: 22px;
      font-size: 16px;
      font-weight: 700;
      color: #202939;
    }
  }
}
</style>
