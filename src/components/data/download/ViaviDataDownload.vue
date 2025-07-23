<template>
  <el-card class="download-container" :class="{ 'in-chat-mode': inChatMode }">
    <template #header>
      <div class="card-header">
        <span>仿真数据下载</span>
      </div>
    </template>

    <el-form :model="downloadForm" label-width="75px">
      <el-form-item label="主类别">
        <el-select
          v-model="downloadForm.mainCategory"
          placeholder="请选择主类别"
          @change="handleMainCategoryChange"
        >
          <el-option
            v-for="category in mainCategories"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="特征" v-if="showFeatures">
        <el-checkbox-group v-model="downloadForm.features">
          <el-checkbox
            v-for="feature in features"
            :key="feature"
            :label="feature"
          >
            {{ feature }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="时间范围" v-if="showTimeRange">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-input
              v-model="downloadForm.startTime"
              placeholder="请输入起始时间"
              clearable
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span>至</span>
          </el-col>
          <el-col :span="11">
            <el-input
              v-model="downloadForm.endTime"
              placeholder="请输入结束时间"
              clearable
            />
          </el-col>
        </el-row>
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
        <el-select v-model="downloadForm.format" placeholder="选择下载格式">
          <el-option label="压缩包 (ZIP)" value="zip" />
          <el-option label="单个CSV文件" value="csv" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleDownload">下载数据</el-button>
      </el-form-item>
    </el-form>

    <div v-if="downloadResult" class="download-result">
      <el-alert
        :title="downloadResult.message"
        :type="downloadResult.success ? 'success' : 'error'"
        show-icon
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, defineEmits, defineProps } from "vue";
import { ElMessage } from "element-plus";
import { getApiUrl } from "../../../utils/api";

// 如需修改，只需取消注释下面这一行并提供新的 URL
const baseUrl = null; // 使用 null 表示使用全局配置
// const baseUrl = 'http://...'  // 取消注释并修改此行以自定义 API URL

defineProps({
  inChatMode: {
    type: Boolean,
    default: false,
  },
});

const categoryMap = {
  urban_converage: ["信号质量测量", "吞吐", "位置信息", "场景配置信息"],
  highway_converage: ["信号质量测量", "吞吐", "位置信息", "场景配置信息"],
};

const downloadForm = reactive({
  mainCategory: "",
  features: [],
  startTime: "",
  endTime: "",
  format: "zip",
});

const downloadResult = ref(null);
const showFeatures = ref(false);
const showTimeRange = ref(false);

const mainCategories = [
  { label: "城市宏站覆盖", value: "urban_converage" },
  { label: "高速公路覆盖", value: "highway_converage" },
];

const features = computed(() => categoryMap[downloadForm.mainCategory] || []);

const handleMainCategoryChange = () => {
  downloadForm.features = [];
  downloadForm.timeRange = "";
  showFeatures.value = true;
  showTimeRange.value = true;
};

const emit = defineEmits(["download-completed"]);

const handleDownload = async () => {
  // 验证表单
  if (!downloadForm.mainCategory) {
    ElMessage.error("请选择主类别");
    return;
  }
  if (downloadForm.features.length === 0) {
    ElMessage.error("请至少选择一个特征");
    return;
  }
  if (!downloadForm.startTime || !downloadForm.endTime) {
    ElMessage.error("请输入完整的时间范围");
    return;
  }

  //验证时间格式
  const timeRegex = /^\d{13}$/;
  if (
    !timeRegex.test(downloadForm.startTime) ||
    !timeRegex.test(downloadForm.endTime)
  ) {
    ElMessage.error("时间格式不正确，请输入正确的时间格式");
    return;
  }

  //验证时间范围
  if (Number(downloadForm.startTime) >= Number(downloadForm.endTime)) {
    ElMessage.error("起始时间必须小于结束时间");
    return;
  }

  try {
    const response = await fetch(
      getApiUrl("/api/download-viaviData", baseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadForm),
      }
    );

    if (!response.ok) {
      throw new Error("下载失败");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viavi_data.${downloadForm.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    downloadResult.value = {
      success: true,
      message: "数据下载成功",
    };

    //添加触发下载完成事件
    emit("download-completed", downloadForm);
  } catch (error) {
    downloadResult.value = {
      success: false,
      message: error.message,
    };
  }
};
</script>

<style scoped>
.download-container {
  max-width: 800px;
  margin: 20px auto;
}

.download-result {
  margin-top: 20px;
}

.text-center {
  text-align: center;
  line-height: 32px;
}

.download-container.in-chat-mode {
  width: 550px;
  margin: 0;
  box-shadow: none;
}

.el-form-item__label {
  justify-content: left;
}
</style>
