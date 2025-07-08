<template>
  <div class="scenario-config">
    <div class="config-section">
      <h4>场景配置</h4>

      <el-form :model="formData" label-position="top" size="small">
        <!-- 类别选择 -->
        <el-form-item label="分析类别">
          <el-radio-group
            v-model="formData.selectedCategory"
            @change="resetSubOption"
            size="small"
          >
            <el-radio-button label="baseStation">基站</el-radio-button>
            <el-radio-button label="user">用户</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 子选项 -->
        <el-form-item label="分析场景" v-if="formData.selectedCategory">
          <el-select
            v-model="formData.selectedSubOption"
            placeholder="选择分析场景"
            @change="handleSelection"
            style="width: 100%"
          >
            <el-option
              v-for="(label, value) in options[formData.selectedCategory]"
              :key="value"
              :label="label"
              :value="Number(value)"
            />
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

    <!-- 场景说明 -->
    <div class="scenario-description" v-if="currentScenarioDesc">
      <el-card size="small">
        <template #header>
          <span style="font-size: 12px; font-weight: 500">场景说明</span>
        </template>
        <p style="font-size: 12px; margin: 0; color: #666; line-height: 1.4">
          {{ currentScenarioDesc }}
        </p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
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
  ...props.modelValue,
});

// 选项配置
const options = reactive({
  baseStation: {
    1: "容量与负载管理",
    2: "能耗与能效分析",
    3: "邻区关系和切换优化",
    4: "基站MIMO",
    5: "RRC连接分析",
    6: "PCI/天线方向",
    7: "综合KPI",
  },
  user: {
    1: "覆盖与性能评估",
    2: "网络容量与吞吐分析",
    3: "QoS与切片管理",
    4: "异常检测与网络故障排查",
    5: "基于位置的业务体验分析",
    6: "Massive MIMO与波束管理评估",
    7: "TA与距离管理",
  },
});

// 场景描述
const scenarioDescriptions = {
  baseStation: {
    1: "分析基站的容量利用率和负载分布，优化资源配置",
    2: "评估基站能耗效率，制定节能策略",
    3: "优化邻区配置和切换参数，提升用户体验",
    4: "分析MIMO性能，优化天线配置",
    5: "监控RRC连接状态，提升接入成功率",
    6: "优化PCI规划和天线方向角",
    7: "综合评估基站各项KPI指标",
  },
  user: {
    1: "评估网络覆盖质量和用户感知性能",
    2: "分析网络容量和用户吞吐量表现",
    3: "监控QoS保障和网络切片性能",
    4: "检测网络异常和故障定位分析",
    5: "基于地理位置的业务体验评估",
    6: "评估大规模MIMO和波束管理效果",
    7: "分析TA分布和距离管理优化",
  },
};

// 验证逻辑
const isValid = computed(() => {
  return formData.selectedCategory && formData.selectedSubOption !== null;
});

const validationMessage = computed(() => {
  if (!formData.selectedCategory) {
    return "请选择分析类别";
  }
  if (formData.selectedSubOption === null) {
    return "请选择具体的分析场景";
  }
  return "配置完整";
});

// 当前场景描述
const currentScenarioDesc = computed(() => {
  if (formData.selectedCategory && formData.selectedSubOption !== null) {
    return scenarioDescriptions[formData.selectedCategory]?.[
      formData.selectedSubOption
    ];
  }
  return "";
});

// 重置子选项
const resetSubOption = () => {
  formData.selectedSubOption = null;
  emitChange();
};

// 处理选择
const handleSelection = () => {
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
.scenario-config {
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

.validation-status {
  margin-top: 16px;
}

.scenario-description {
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

:deep(.el-card__header) {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 8px 12px;
}
</style>
