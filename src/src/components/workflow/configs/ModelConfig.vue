<template>
  <div class="model-config">
    <div class="config-section">
      <h4>模型分析配置</h4>

      <el-form :model="formData" label-position="top" size="small">
        <!-- 是否使用大模型 -->
        <el-form-item label="大模型分析">
          <el-switch
            v-model="formData.useLargeModel"
            active-text="使用大模型提供分析建议"
            inactive-text="仅使用小模型"
            @change="emitChange"
          />
        </el-form-item>

        <!-- 小模型选择 -->
        <el-form-item label="小模型类型">
          <el-select
            v-model="formData.selectedSmallModel"
            placeholder="选择小模型类型"
            @change="emitChange"
            style="width: 100%"
          >
            <el-option label="随机森林 (Random Forest)" value="random_forest" />
            <el-option label="LSTM 神经网络" value="lstm" />
            <el-option label="CNN 卷积神经网络" value="cnn" />
            <el-option label="K-means 聚类" value="kmeans" />
            <el-option label="线性回归" value="linear_regression" />
            <el-option label="支持向量机 (SVM)" value="svm" />
            <el-option label="决策树" value="decision_tree" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 模型说明 -->
    <div
      class="model-description"
      :style="{ display: modelDesc ? 'block' : 'none' }"
    >
      <el-card size="small">
        <template #header>
          <span style="font-size: 12px; font-weight: 500">模型说明</span>
        </template>
        <p style="font-size: 12px; margin: 0; color: #666; line-height: 1.4">
          {{ modelDesc }}
        </p>
      </el-card>
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

<script setup name="ModelConfig">
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
  useLargeModel: false,
  selectedSmallModel: "",
  ...props.modelValue,
});

// 模型描述
const modelDescriptions = {
  random_forest:
    "随机森林：适用于分类和回归任务，具有良好的泛化能力和特征重要性分析",
  lstm: "LSTM神经网络：适用于时序数据分析，能够捕捉长期依赖关系",
  cnn: "CNN卷积神经网络：适用于图像和空间数据分析，擅长特征提取",
  kmeans: "K-means聚类：无监督学习算法，用于数据分群和模式发现",
  linear_regression: "线性回归：简单高效的回归算法，适用于线性关系建模",
  svm: "支持向量机：适用于分类和回归，在高维数据中表现优秀",
  decision_tree: "决策树：直观的分类算法，易于理解和解释",
};

// 当前模型描述
const modelDesc = computed(() => {
  return modelDescriptions[formData.selectedSmallModel] || "";
});

// 验证逻辑
const isValid = computed(() => {
  return formData.selectedSmallModel !== "";
});

const validationMessage = computed(() => {
  if (!formData.selectedSmallModel) {
    return "请选择小模型类型";
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
