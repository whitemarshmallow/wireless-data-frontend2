<template>
  <div class="card-wrapper config-wrapper">
    <div class="card-header">
      <div class="card-title">
        <img src="@/assets/AIForRAN/EnergySaving/icon_config.svg" alt="" width="22" height="22" class="mr8">
        节能配置
      </div>
      <el-radio-group v-model="activeConfigTab" class="config-tab">
        <el-radio-button label="数据加载" value="data" />
        <el-radio-button label="小区列表" value="cell" />
      </el-radio-group>
    </div>
    <div class="card-body">
      <!-- 数据加载 -->
      <div class="data-load-wrapper" v-show="activeConfigTab === 'data'">
        <div class="data-load-header mb12">
          <div class="data-load-title">无线网络数据加载</div>
          <div class="data-load-form">
            <el-select v-model="dataFileSelected" value-key="id" placeholder="请选择要加载的数据文件" class="mr16">
              <el-option
                v-for="item in dataFileList"
                :key="item.id"
                :label="item.name"
                :value="item" />
            </el-select>
            <el-button type="primary" @click="onLoadDataFile" :disabled="isStart || !dataFileSelected">加载</el-button>
          </div>
        </div>
        <el-table
          :data="dataFileTableData"
          max-height="120"
          show-overflow-tooltip
          border>
          <el-table-column type="index" label="序号" width="56" />
          <el-table-column
            v-for="col in fileColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width || ''"
            :min-width="col.minWidth || ''" />
          <el-table-column label="操作" width="60">
            <template #default="scope">
              <el-button
                type="danger"
                link
                :disabled="isStart"
                @click="onDeleteDataFile(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="data-load-header mb12 mt16">
          <div class="data-load-title">预测模型加载</div>
          <div class="data-load-form">
            <el-select v-model="modelFileSelected" value-key="id" placeholder="请选择要加载的模型文件" class="mr16">
              <el-option
                v-for="item in modelFileList"
                :key="item.id"
                :label="item.name"
                :value="item" />
            </el-select>
            <el-button type="primary" @click="onLoadModelFile" :disabled="isStart || !modelFileSelected">加载</el-button>
          </div>
        </div>
        <el-table
          :data="modelFileTableData"
          max-height="120"
          show-overflow-tooltip
          border>
          <el-table-column type="index" label="序号" width="56" />
          <el-table-column
            v-for="col in fileColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width || ''"
            :min-width="col.minWidth || ''" />
          <el-table-column label="操作" width="60">
            <template #default="scope">
              <el-button
                type="danger"
                link
                :disabled="isStart"
                @click="onDeleteModelFile(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 小区列表 -->
      <div class="cell-list-wrapper" v-show="activeConfigTab === 'cell'">
        <div class="cell-list-form mb16">
          <el-select v-model="cellSearchForm.prop" value-key="prop" placeholder="请选择" class="search-key">
            <el-option
              v-for="item in cellColumns.filter((v) => (v.searchable))"
              :key="item.prop"
              :label="item.label"
              :value="item" />
          </el-select>
          <el-select v-model="cellSearchForm.propValue" placeholder="请选择" class="search-value mr16" v-if="cellSearchForm.prop && cellSearchForm.prop.showType === 'select'">
            <el-option
              v-for="item in constantList[cellSearchForm.prop.staticCode]"
              :key="item.key"
              :label="item.value"
              :value="item.key" />
          </el-select>
          <el-input v-model="cellSearchForm.propValue" placeholder="请输入" class="search-value mr16" v-else></el-input>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="default" @click="onSearchReset" class="ml8">重置</el-button>
        </div>
        <el-table
          :data="cellTableData"
          height="200"
          show-overflow-tooltip
          border>
          <el-table-column
            v-for="col in cellColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="col.width || ''"
            :min-width="col.minWidth || ''">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="onCellDetail(scope.row)"
                v-if="col.prop === 'name'">{{ scope.row[col.prop] }}</el-button>
              <div :class="['status-tag', `status-tag-${scope.row[col.prop]}`]" v-else-if="col.prop === 'energySavingStatus'">{{ constantMap.EMERGY_SAVING_STATUS[scope.row[col.prop]] }}</div>
              <template v-else>{{ scope.row[col.prop] }}</template>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button
                type="primary"
                link
                :disabled="isStart"
                @click="onCellEnergySavingConfig(scope.row)">节能配置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="mt8"
          background
          layout="sizes, total, prev, pager, next, jumper"
          :total="cellPage.total"
          v-model:current-page="cellPage.currentPage"
          v-model:page-size="cellPage.pageSize"
          :page-sizes="[10, 20, 30, 50, 100]" />
      </div>
    </div>
  </div>

  <EnergySavingCellDetailDrawer
    v-if="cellDetailVisible"
    :cellData="cellDetailData"
    @handleClose="handleCellDetailClose" />
  <EnergySavingCellConfigDialog
    v-if="cellConfigVisible"
    :cellData="cellConfigData"
    @handleSuccess="handleCellConfigSuccess"
    @handleClose="handleCellConfigClose" />
</template>

<script setup>
import { ref, reactive, computed, defineProps, defineEmits, defineExpose, watch } from 'vue';
import { ElMessage } from 'element-plus';
import EnergySavingCellDetailDrawer from './EnergySavingCellDetailDrawer';
import EnergySavingCellConfigDialog from './EnergySavingCellConfigDialog';
import CONSTANT from '@/demo/EnergySaving/constant';
import CONSTANT_MAP from '@/demo/EnergySaving/constantMap';
import CELL_LIST_DATA from '@/demo/EnergySaving/cellList';

const props = defineProps({
  isStart: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['onSomeDataChange']);

const constantList = ref(CONSTANT);
const constantMap = ref(CONSTANT_MAP);

const activeConfigTab = ref('data');
const fileColumns = ref([
  { prop: 'name', label: '文件名', minWidth: 240 },
  { prop: 'size', label: '大小' },
  { prop: 'time', label: '时间', minWidth: 130 },
]);

// 数据文件加载
const dataFileSelected = ref(null);
let historyDataFlag = ref(''); // 当前历史数据优劣标识
const dataFileList = ref([
  { id: 0, name: '小区信息数据.json', size: '12kb', time: '2025-07-29 18:00:32', type: 'cell' },
  { id: 1, name: '小区最近24小时历史运行性能数据_01.xlsx', size: '2M', time: '2025-07-29 18:04:24', type: 'history', flag: '01' }, // 优质数据
  { id: 2, name: '小区最近24小时历史运行性能数据_02.xlsx', size: '2M', time: '2025-07-29 18:07:54', type: 'history', flag: '02' }, // 劣质数据
]);
const dataFileTableData = ref([]);
const onLoadDataFile = () => {
  const { id: dataFileSelectedId, type: dataFileSelectedType, flag: dataFileSelectedFlag } = dataFileSelected.value;
  if (dataFileTableData.value.map((v) => (v.id)).includes(dataFileSelectedId)) {
    ElMessage.warning('当前文件数据已加载，请选择其他文件');
    return;
  }
  if (dataFileTableData.value.map((v) => (v.type)).includes(dataFileSelectedType)) {
    ElMessage.warning('有同类型文件数据已加载，请选择其他文件，或删除同类型文件');
    return;
  }
  dataFileTableData.value.push({ ...dataFileSelected.value });
  if (dataFileSelectedType === 'history') historyDataFlag.value = dataFileSelectedFlag;
};
const onDeleteDataFile = (index) => {
  dataFileTableData.value.splice(index, 1);
};

// 模型文件加载
const modelFileSelected = ref(null);
const modelFileList = ref([
  { id: 0, name: 'RRC连接数预测模型.pth', size: '568kb', time: '2025-07-29 18:25:06', type: 'model', flag: 'rrc' },
  { id: 1, name: 'PRB利用率预测模型.pth', size: '673kb', time: '2025-07-29 18:33:15', type: 'model', flag: 'prb' },
]);
const modelFileTableData = ref([]);
const onLoadModelFile = () => {
  const { id: modelFileSelectedId } = modelFileSelected.value;
  if (modelFileTableData.value.map((v) => (v.id)).includes(modelFileSelectedId)) {
    ElMessage.warning('当前文件数据已加载，请选择其他文件');
    return;
  }
  modelFileTableData.value.push({ ...modelFileSelected.value });
};
const onDeleteModelFile = (index) => {
  modelFileTableData.value.splice(index, 1);
};

// 文件是否加载完成以支持启动预测和监控
const isFileLoadOk = computed(() => {
  return dataFileTableData.value.length === 2 && modelFileTableData.value.length;
});

// 小区列表
const cellSearchForm = reactive({
  prop: null,
  propValue: null
});
const cellColumns = ref([
  { prop: 'id', label: '序号', width: 50 },
  { prop: 'baseStationId', label: '基站ID' },
  { prop: 'cellIdentity', label: '小区标识', searchable: true },
  { prop: 'name', label: '小区名称', minWidth: 120, searchable: true },
  { prop: 'energySavingStatus', label: '节能状态', minWidth: 100, searchable: true, showType: 'select', staticCode: 'EMERGY_SAVING_STATUS' },
]);
const cellTableData = ref([]);
const cellPage = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
});
const onSearch = () => {

};
const onSearchReset = () => {
  cellSearchForm.prop = null;
  cellSearchForm.propValue = null;
};

// 小区详情
const cellDetailVisible = ref(false);
const cellDetailData = ref(null);
const onCellDetail = (row) => {
  cellDetailData.value = { ...row };
  cellDetailVisible.value = true;
};
const handleCellDetailClose = () => {
  cellDetailVisible.value = false;
  cellDetailData.value = null;
};

// 节能配置
const cellConfigVisible = ref(false);
const cellConfigData = ref(null);
const onCellEnergySavingConfig = (row) => {
  cellConfigData.value = row;
  cellConfigVisible.value = true;
};
const handleCellConfigSuccess = (data) => {
  const { mode, timeSlotForecastingModel, energySavingSwitch } = data;
  cellConfigData.value.energySavingStatus = energySavingSwitch ? 1 : 3;
  cellConfigData.value.mode = mode;
  cellConfigData.value.timeSlotForecastingModel = timeSlotForecastingModel;
  cellConfigData.value.energySavingSwitch = energySavingSwitch;
  handleCellConfigClose();
};
const handleCellConfigClose = () => {
  cellConfigVisible.value = false;
  cellConfigData.value = null;
};

watch(dataFileTableData, (newVal) => {
  // 小区列表数据 (oldVal是newVal的副本，无法对比)
  if (newVal.find((v) => (v.type === 'cell')) && !(cellTableData.value && cellTableData.value.length)) {
    cellTableData.value = JSON.parse(JSON.stringify(CELL_LIST_DATA));
    cellPage.value.total = cellTableData.value.length;
    emit('onSomeDataChange', {
      key: 'cellList',
      value: cellTableData.value
    });
  } else if (!newVal.find((v) => (v.type === 'cell')) && cellTableData.value && cellTableData.value.length) {
    cellTableData.value = [];
    cellPage.value = {
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
    emit('onSomeDataChange', {
      key: 'cellList',
      value: cellTableData.value
    });
  }
  emit('onSomeDataChange', {
    key: 'dataFile',
    value: newVal
  });
}, { deep: true });

watch(modelFileTableData, (newVal) => {
  emit('onSomeDataChange', {
    key: 'modelFile',
    value: newVal
  });
}, { deep: true });

// demo小区数据联动
const updateDemoCellData = ({ cellIdentity, key, value }) => {
  const cellSelected = cellTableData.value.find((v) => (v.cellIdentity === cellIdentity));
  if (cellSelected) cellSelected[key] = value;
  emit('onSomeDataChange', {
    key: 'cellList',
    value: cellTableData.value
  });
};

defineExpose({ updateDemoCellData });
</script>

<style lang="scss" scoped>
@use '@/styles/energy_saving.scss';

.card-wrapper.config-wrapper {
  position: absolute;
  left: 16px;
  bottom: 16px;
  width: calc(100% - 32px);
  height: calc(50% - 21px);
  .config-tab {
    height: 32px;
    padding: 2px;
    border-radius: 8px;
    background: #E3E8EF;
    :deep(.el-radio-button) {
      .el-radio-button__inner {
        height: 28px;
        font-size: 12px;
        line-height: 12px;
        color: #697586;
        padding: 8px;
        border-radius: 8px;
        background: unset;
        border: none;
        box-shadow: unset;
      }
      &.is-active {
        color: #202939;
        border-radius: 8px;
        background: #FFFFFF;
        box-shadow: 0px 1px 2px 0px rgba(18, 25, 38, 0.05);
      }
    }
  }
  .card-body {
    padding: 0 10px 16px 20px;
    .data-load-wrapper {
      width: 100%;
      height: 100%;
      padding-right: 10px;
      overflow-y: auto;
      .data-load-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 28px;
        .data-load-title {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          font-weight: 700;
          &::before {
            content: '';
            display: inline-block;
            width: 3px;
            height: 12px;
            background: #263FFF;
            margin-right: 8px;
            vertical-align: middle;
          }
        }
        .data-load-form {
          :deep(.el-select) {
            width: 240px;
            height: 28px;
          }
          :deep(.el-button:not(.is-link)) {
            height: 28px;
            padding: 4px 8px;
          }
        }
      }
    }
    .cell-list-wrapper {
      width: 100%;
      height: 100%;
      padding-right: 10px;
      .cell-list-form {
        :deep(.el-select).search-key {
          width: 100px;
          height: 32px;
          .el-select__wrapper {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        :deep(.el-input) {
          width: 200px!important;
          height: 32px;
          .el-input__wrapper {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            margin-left: -1px;
          }
        }
        :deep(.el-select).search-value {
          width: 200px!important;
          height: 32px;
          .el-select__wrapper {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            margin-left: -1px;
          }
        }
      }
    }
  }
}

.status-tag {
  width: fit-content;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  padding: 0 8px;
  border-radius: 4px;
  &.status-tag-0 {
    color: #9AA4B2;
    background: rgba(154, 164, 178, 0.1);
  }
  &.status-tag-1 {
    color: #263FFF;
    background: rgba(38, 63, 255, 0.1);
  }
  &.status-tag-2 {
    color: #02B3B2;
    background: rgba(2, 179, 178, 0.1);
  }
  &.status-tag-3 {
    color: #F04438;
    background: rgba(240, 68, 56, 0.1);
  }
}
</style>