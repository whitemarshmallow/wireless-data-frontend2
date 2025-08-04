<template>
  <div class="viavi-data-config">
    <div class="config-section">
      <h4>数据配置</h4>

      <el-form :model="formData" label-position="top" size="small">
        <el-form-item label="主类别">
          <el-select
            v-model="formData.mainCategory"
            placeholder="请选择主类别"
            @change="handleMainCategoryChange"
            style="width: 100%"
          >
            <el-option
              v-for="category in mainCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="特征"
          :style="{ display: formData.mainCategory ? 'block' : 'none' }"
        >
          <el-checkbox-group v-model="formData.features" @change="emitChange">
            <div class="checkbox-container">
              <el-checkbox
                v-for="feature in features"
                :key="feature"
                :label="feature"
                class="feature-checkbox"
              >
                {{ feature }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item
          label="时间范围"
          :style="{ display: formData.mainCategory ? 'block' : 'none' }"
        >
          <div class="time-range-container">
            <el-input
              v-model="formData.startTime"
              placeholder="起始时间"
              @input="emitChange"
              style="margin-bottom: 8px"
            />
            <el-input
              v-model="formData.endTime"
              placeholder="结束时间"
              @input="emitChange"
            />
          </div>
          <el-alert
            title="范围示例：1739758277000 至 1739758877000，单位：ms"
            type="info"
            :closable="false"
            show-icon
            size="small"
            style="margin-top: 8px"
          />
        </el-form-item>

        <el-form-item label="下载格式">
          <el-select
            v-model="formData.format"
            placeholder="选择下载格式"
            @change="emitChange"
            style="width: 100%"
          >
            <el-option label="压缩包 (ZIP)" value="zip" />
            <el-option label="单个CSV文件" value="csv" />
          </el-select>
        </el-form-item>

        <!-- 添加下载按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="downloadData"
            :disabled="!isValid"
            style="width: 100%"
          >
            <el-icon style="margin-right: 6px"><Download /></el-icon>
            下载数据
          </el-button>
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
import { reactive, computed, watch, defineProps, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { getApiUrl } from "../../../utils/api";

// 如需修改，只需取消注释下面这一行并提供新的 URL
const baseUrl = null; // 使用 null 表示使用全局配置

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "config-change"]);

// 表单数据
const formData = reactive({
  mainCategory: "",
  features: [],
  startTime: "",
  endTime: "",
  format: "zip",
  ...props.modelValue,
});

// 类别映射
const categoryMap = {
  urban_converage: ["信号质量测量", "吞吐", "位置信息", "场景配置信息"],
  highway_converage: ["信号质量测量", "吞吐", "位置信息", "场景配置信息"],
};

const mainCategories = [
  { label: "城市宏站覆盖", value: "urban_converage" },
  { label: "高速公路覆盖", value: "highway_converage" },
];

// 计算属性
const features = computed(() => categoryMap[formData.mainCategory] || []);

// 验证逻辑
const isValid = computed(() => {
  return (
    formData.mainCategory &&
    formData.features.length > 0 &&
    formData.startTime &&
    formData.endTime &&
    validateTimeFormat()
  );
});

const validationMessage = computed(() => {
  if (!formData.mainCategory) {
    return "请选择主类别";
  }
  if (formData.features.length === 0) {
    return "请至少选择一个特征";
  }
  if (!formData.startTime || !formData.endTime) {
    return "请输入完整的时间范围";
  }
  if (!validateTimeFormat()) {
    return "时间格式不正确，请输入13位时间戳";
  }
  if (Number(formData.startTime) >= Number(formData.endTime)) {
    return "起始时间必须小于结束时间";
  }
  return "配置完整";
});

// 时间格式验证
const validateTimeFormat = () => {
  const timeRegex = /^\d{13}$/;
  return timeRegex.test(formData.startTime) && timeRegex.test(formData.endTime);
};

// 处理主类别变化
const handleMainCategoryChange = () => {
  formData.features = [];
  emitChange();
};

// 下载数据
const downloadData = async () => {
  if (!isValid.value) {
    ElMessage.warning("请完善配置信息");
    return;
  }

  try {
    ElMessage.loading("正在下载数据...");

    // 这里可以调用实际的下载API
    const response = await fetch(
      getApiUrl("/api/download-viaviData", baseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      // 处理文件下载
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `viavi_data_${Date.now()}.${
        formData.format === "zip" ? "zip" : "csv"
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      ElMessage.success("数据下载成功");
    } else {
      throw new Error("下载失败");
    }
  } catch (error) {
    console.error("下载数据失败:", error);
    ElMessage.error("下载失败，请重试");
  }
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
.viavi-data-config {
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
  gap: 8px;
}

.feature-checkbox {
  margin-right: 0;
}

.time-range-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

:deep(.el-form-item--small .el-form-item__content) {
  width: 260px;
}
</style>
