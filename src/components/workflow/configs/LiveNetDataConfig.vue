<template>
  <div class="livenet-data-config">
    <div class="config-section">
      <h4>现网数据配置</h4>

      <el-form :model="formData" label-position="top" size="small">
        <!-- 场景选择 -->
        <el-form-item label="分析场景">
          <el-select
            v-model="formData.scenario"
            placeholder="请选择分析场景"
            @change="handleScenarioChange"
            style="width: 100%"
          >
            <el-option
              v-for="scenario in scenarios"
              :key="scenario.value"
              :label="scenario.label"
              :value="scenario.value"
            />
          </el-select>
        </el-form-item>

        <!-- 分析维度选择 -->
        <el-form-item label="分析维度" v-if="showAspect">
          <el-radio-group
            v-model="formData.aspect"
            @change="handleAspectChange"
            size="small"
          >
            <el-radio-button label="baseStation">基站侧</el-radio-button>
            <el-radio-button label="user">用户侧</el-radio-button>
            <el-radio-button label="asset">资产侧</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 关注问题选择 -->
        <el-form-item label="关注问题" v-if="showCategories">
          <el-checkbox-group v-model="formData.categories" @change="emitChange">
            <div class="checkbox-container">
              <el-checkbox
                v-for="category in availableCategories"
                :key="category.value"
                :label="category.value"
                class="category-checkbox"
              >
                <span class="category-label">{{ category.label }}</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <!-- 下载格式 -->
        <el-form-item label="下载格式" v-if="showFormat">
          <el-select
            v-model="formData.format"
            placeholder="选择下载格式"
            @change="emitChange"
            style="width: 100%"
          >
            <el-option label="CSV文件" value="csv" />
            <el-option label="压缩包 (ZIP)" value="zip" />
          </el-select>
        </el-form-item>

        <!-- 生成图像选项 -->
        <el-form-item label="生成图像" v-if="showImageOption">
          <el-switch
            v-model="formData.generateImages"
            active-text="是"
            inactive-text="否"
            @change="emitChange"
          />
        </el-form-item>

        <!-- 模型分析选项 -->
        <el-form-item label="模型分析" v-if="showModelOption">
          <el-switch
            v-model="formData.enableAnalysis"
            active-text="是"
            inactive-text="否"
            @change="emitChange"
          />
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

<script setup>
import { ref, reactive, computed, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "config-change"]);

// 表单数据
const formData = reactive({
  ...props.modelValue,
});

// 场景配置
const scenarios = [
  { label: "广深沿江高速", value: "guangshen_coastal_expressway" },
  { label: "长岗火车站", value: "changgang_railway_station" },
];

// 9类问题配置
const problemCategories = [
  { label: "基站信息（站点配置、位置信息、编号等）", value: "site", id: 1 },
  { label: "无线资源&容量类（PRB/CQI/吞吐/载波等）", value: "capacity", id: 2 },
  { label: "接入类（RRC连接、接入成功率、Paging等）", value: "access", id: 3 },
  { label: "QoS流程与失败类（掉话、失败、超时等）", value: "qosflow", id: 4 },
  { label: "切换类（同频/异频/Xn/N2 切换等）", value: "handover", id: 5 },
  { label: "业务面（PDCP/RLC/MAC 层、吞吐量、包数）", value: "traffic", id: 6 },
  { label: "物理层（功率、CQI、MIMO、HARQ）", value: "phy", id: 7 },
  { label: "VoNR/VINR语音质量类（连接、掉话、丢包）", value: "vonr", id: 8 },
  {
    label: "可用性与节能类（可用率、功耗、节能时间）",
    value: "availability",
    id: 9,
  },
];

// 显示状态
const showAspect = ref(false);
const showCategories = ref(false);
const showFormat = ref(false);
const showImageOption = ref(false);
const showModelOption = ref(false);

// 可用的问题类别
const availableCategories = computed(() => {
  return problemCategories;
});

// 验证逻辑
const isValid = computed(() => {
  return formData.scenario && formData.aspect && formData.categories.length > 0;
});

const validationMessage = computed(() => {
  if (!formData.scenario) {
    return "请选择分析场景";
  }
  if (!formData.aspect) {
    return "请选择分析维度";
  }
  if (formData.categories.length === 0) {
    return "请至少选择一个关注问题";
  }
  return "配置完整";
});

// 处理场景变化
const handleScenarioChange = () => {
  formData.categories = [];
  showAspect.value = true;
  emitChange();
};

// 处理维度变化
const handleAspectChange = () => {
  formData.categories = [];
  showCategories.value = true;
  showFormat.value = true;
  showImageOption.value = true;
  showModelOption.value = true;
  emitChange();
};

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

    // 根据当前配置状态设置显示状态
    if (formData.scenario) {
      showAspect.value = true;
    }
    if (formData.aspect) {
      showCategories.value = true;
      showFormat.value = true;
      showImageOption.value = true;
      showModelOption.value = true;
    }
  },
  { deep: true, immediate: true }
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
.livenet-data-config {
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

.category-checkbox {
  margin-right: 0;
}

.category-label {
  font-size: 12px;
  line-height: 1.4;
}

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

:deep(.el-radio-button) {
  font-size: 11px;
}

:deep(.el-radio-button__inner) {
  padding: 8px 12px;
  font-size: 11px;
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  padding-left: 6px;
}

:deep(.el-switch__label) {
  font-size: 12px;
}
</style>
