<template>
  <div class="image-config">
    <div class="config-section">
      <h4>图像生成配置</h4>

      <el-form :model="formData" label-position="top" size="small">
        <!-- 依赖场景选择 -->
        <!-- <el-form-item label="分析类别">
            <el-input 
              v-model="formData.category" 
              placeholder="需要先配置场景选择模块"
              disabled
            />
            <div class="help-text">
              此配置依赖于场景选择模块的输出
            </div>
          </el-form-item> -->

        <!-- 图像类型选择 -->
        <el-form-item label="图像类型" v-if="availableImageTypes.length > 0">
          <el-checkbox-group
            v-model="formData.selectedImageTypes"
            @change="emitChange"
          >
            <div class="checkbox-container">
              <el-checkbox
                v-for="imageType in availableImageTypes"
                :key="imageType.value"
                :label="imageType.value"
                class="image-type-checkbox"
              >
                {{ imageType.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <!-- 图像格式 -->
        <el-form-item
          label="输出格式"
          v-if="formData.selectedImageTypes.length > 0"
        >
          <el-select
            v-model="formData.outputFormat"
            placeholder="选择输出格式"
            @change="emitChange"
            style="width: 100%"
          >
            <el-option label="PNG格式" value="png" />
            <el-option label="SVG格式" value="svg" />
            <el-option label="PDF格式" value="pdf" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 配置验证状态 -->
    <div class="validation-status">
      <el-alert
        v-if="validationMessage"
        :title="validationMessage"
        :type="isValid ? 'success' : 'warning'"
        :closable="false"
        size="small"
      />
    </div>
  </div>
</template>

<script setup name="ImageConfig">
import { reactive, computed, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "config-change"]);

// 表单数据
const formData = reactive({
  outputFormat: "png",
  ...props.modelValue,
});

// 根据场景类别确定可用的图像类型
const availableImageTypes = computed(() => {
  const baseOptions = [
    { label: "RSPR热力图", value: "RSPR热力图" },
    { label: "吞吐量分布图", value: "吞吐量分布图" },
    { label: "覆盖质量图", value: "覆盖质量图" },
  ];

  if (formData.category === "user") {
    if (formData.subOption === 1) {
      // 覆盖与性能评估
      return [
        ...baseOptions,
        { label: "信号强度分布", value: "信号强度分布" },
        { label: "干扰分析图", value: "干扰分析图" },
      ];
    }
  }
  return baseOptions;
});

// 验证逻辑
const isValid = computed(() => {
  return formData.selectedImageTypes && formData.selectedImageTypes.length > 0;
});

const validationMessage = computed(() => {
  if (
    !formData.selectedImageTypes ||
    formData.selectedImageTypes.length === 0
  ) {
    return "请至少选择一种图像类型";
  }
  return "配置完整";
});

// 发出变化事件
const emitChange = () => {
  emit("update:modelValue", { ...formData });
  emit("config-change", { ...formData });
};

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(formData, newValue);
  },
  { deep: true }
);

// 监听formData变化
watch(
  formData,
  () => {
    emitChange();
  },
  { deep: true }
);
</script>

<style scoped>
.image-config,
.model-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-section h4 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.image-type-checkbox {
  margin-right: 0;
}

.help-text {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.model-description,
.validation-status {
  margin-top: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  padding-bottom: 4px;
}

:deep(.el-select),
:deep(.el-input) {
  font-size: 12px;
}

:deep(.el-radio) {
  font-size: 12px;
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  padding-left: 6px;
}

:deep(.el-switch__label) {
  font-size: 12px;
}

:deep(.el-card__header) {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 8px 12px;
}
</style>
