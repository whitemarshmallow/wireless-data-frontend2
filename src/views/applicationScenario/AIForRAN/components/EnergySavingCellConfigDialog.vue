<template>
  <el-dialog
    title="小区节能配置"
    class="custom-dialog"
    v-model="isVisible"
    @closed="onClose"
    :close-on-click-modal="false"
    width="640px">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="140px"
      v-loading="loading">
      <el-form-item label="小区序号">
        <div class="fixed-value">{{ cellData.id }}</div>
        <!-- <el-input v-model="cellData.id" disabled></el-input> -->
      </el-form-item>
      <el-form-item label="小区标识">
        <div class="fixed-value">{{ cellData.cellIdentity }}</div>
        <!-- <el-input v-model="cellData.cellIdentity" disabled></el-input> -->
      </el-form-item>
      <el-form-item label="小区名称">
        <div class="fixed-value">{{ cellData.name }}</div>
        <!-- <el-input v-model="cellData.name" disabled></el-input> -->
      </el-form-item>
      <el-form-item label="节能模式" prop="mode">
        <el-select v-model="form.mode" placeholder="请选择" disabled>
          <el-option
            v-for="item in constantList.EMERGY_SAVING_MODE"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节能时段预测模型" prop="timeSlotForecastingModel">
        <el-select
          v-model="form.timeSlotForecastingModel"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择">
          <el-option
            v-for="o in timeSlotForecastingModelList"
            :key="o.id"
            :label="o.modelName"
            :value="o.modelName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节能开关" prop="energySavingSwitch">
        <el-select v-model="form.energySavingSwitch" placeholder="请选择">
          <el-option
            v-for="item in constantList.EMERGY_SAVING_SWITCH"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="default" @click="onClose" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="onSubmit" :disabled="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import CONSTANT from '@/demo/EnergySaving/constant';

const props = defineProps({
  cellData: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['handleSuccess', 'handleClose']);

const isVisible = ref(false);

const constantList = ref(CONSTANT);

const loading = ref(false);
const formRef = ref();
const form = ref({
  mode: '',
  timeSlotForecastingModel: null,
  energySavingSwitch: ''
});
const rules = ref({
  mode: [
    { required: true, message: "请选择", trigger: 'change' }
  ],
  timeSlotForecastingModel: [
    { required: true, message: "请选择", trigger: 'change' }
  ],
  energySavingSwitch: [
    { required: true, message: "请选择", trigger: 'change' }
  ],
});
const timeSlotForecastingModelList = ref([
  { id: 'rrc', modelName: 'RRC连接数预测模型' },
  { id: 'prb', modelName: 'PRB利用率预测模型' },
]);

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const { timeSlotForecastingModel } = form.value;
      loading.value = true;
      setTimeout(() => {
        emit('handleSuccess', { ...form.value, timeSlotForecastingModel: timeSlotForecastingModel.join() });
        ElMessage.success('保存成功');
      }, 500);
    }
  });
};

const onClose = () => {
  emit('handleClose')
};

onMounted(() => {
  const { mode, timeSlotForecastingModel, energySavingSwitch } = props.cellData;
  form.value = {
    mode,
    timeSlotForecastingModel: timeSlotForecastingModel ? timeSlotForecastingModel.split(',') : [],
    energySavingSwitch
  };
  isVisible.value = true;
});
</script>

<style lang="scss" scoped>
.el-form {
  :deep(.el-form-item) {
    .el-form-item__label {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #202939;
      padding-right: 16px;
    }
    .el-form-item__content {
      height: 40px;
      line-height: 40px;
      .fixed-value {
        width: 100%;
        height: 100%;
        line-height: 40px;
        font-size: 14px;
        color: #697586;
        border: 1px solid #E3E8EF;
        background: #F5F8FB;
        border-radius: 8px;
        padding: 0 8px;
      }
      .el-select {
        // display: inline-flex;
        height: 100%;
        .el-select__wrapper {
          width: 100%;
          height: 100%;
          min-height: unset;
          padding: 4px 8px;
          border-radius: 8px;
          box-shadow: 0 0 0 1px #E3E8EF inset;
          .el-select__selected-item.el-select__placeholder {
            // font-size: 12px;
            font-size: 14px;
            color: #697586;
            &.is-transparent {
              color: #9AA4B2;
            }
          }
        }
      }
    }
  }
}
.el-button:not(.is-link) {
  // height: 32px;
  // padding: 6px 8px;
  height: 40px;
  padding: 10px 16px;
  border-radius: 8px;
  > span {
    line-height: 20px;
    // font-size: 12px;
    font-size: 14px;
  }
  &.el-button--primary {
    background: #263FFF;
    border-color: #263FFF;
  }
  &.el-button--default {
    color: #202939;
    border-color: #E3E8EF;
  }
  &.is-disabled,
  &.is-disabled:hover {
    opacity: 0.5;
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>
<style lang="scss">
.el-dialog.custom-dialog {
  background: url('@/assets/AIForRAN/EnergySaving/bg_popover.svg') center top / contain no-repeat #FFFFFF;
  padding: 0;
  .el-dialog__header {
    height: 56px;
    padding: 16px 20px;
    border-bottom: 1px solid #E3E8EF;
    .el-dialog__title {
      line-height: 22px;
      font-size: 16px;
      font-weight: 700;
      color: #202939;
    }
  }
  .el-dialog__body {
    padding: 20px;
  }
  .el-dialog__footer {
    height: 72px;
    padding: 16px 20px;
    border-top: 1px solid #E3E8EF;
  }
}
</style>
