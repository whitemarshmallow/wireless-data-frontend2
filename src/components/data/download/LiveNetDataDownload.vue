<template>
  <el-card class="download-container" :class="{ 'in-chat-mode': inChatMode }">
    <template #header>
      <div class="card-header">
        <span>现网数据下载</span>
      </div>
    </template>

    <el-form :model="downloadForm" label-width="85px">
      <!-- 场景选择 -->
      <el-form-item label="分析场景">
        <el-select
          v-model="downloadForm.scenario"
          placeholder="请选择分析场景"
          @change="handleScenarioChange"
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
          v-model="downloadForm.aspect"
          @change="handleAspectChange"
        >
          <el-radio-button label="baseStation">基站侧</el-radio-button>
          <el-radio-button label="user">用户侧</el-radio-button>
          <el-radio-button label="asset">资产侧</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 关注问题选择 -->
      <el-form-item label="关注问题" v-if="showCategories">
        <el-checkbox-group v-model="downloadForm.categories">
          <el-checkbox
            v-for="category in availableCategories"
            :key="category.value"
            :label="category.value"
          >
            {{ category.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 下载格式 -->
      <el-form-item label="下载格式" v-if="showFormat">
        <el-select v-model="downloadForm.format" placeholder="选择下载格式">
          <el-option label="CSV文件" value="csv" />
          <el-option label="压缩包 (ZIP)" value="zip" />
        </el-select>
      </el-form-item>

      <!-- 生成图像选项 -->
      <el-form-item label="生成图像" v-if="showImageOption">
        <el-switch
          v-model="downloadForm.generateImages"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>

      <!-- 模型分析选项 -->
      <el-form-item label="模型分析" v-if="showModelOption">
        <el-switch
          v-model="downloadForm.enableAnalysis"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleDownload">开始处理</el-button>
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

// 场景配置
const scenarios = [
  { label: "广深沿江高速", value: "guangshen_coastal_expressway" },
  { label: "长岗火车站", value: "changgang_railway_station" },
];

// 9类问题配置 - 包含序号映射
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

const downloadForm = reactive({
  scenario: "",
  aspect: "",
  categories: [],
  format: "csv",
  generateImages: true, // 默认开启成像
  enableAnalysis: true, // 默认开启分析
});

const downloadResult = ref(null);
const showAspect = ref(false);
const showCategories = ref(false);
const showFormat = ref(false);
const showImageOption = ref(false);
const showModelOption = ref(false);

// 可用的问题类别
const availableCategories = computed(() => {
  // 可以根据scenario和aspect来筛选可用的问题类别
  return problemCategories;
});

const handleScenarioChange = () => {
  downloadForm.categories = [];
  showAspect.value = true;
};

const handleAspectChange = () => {
  downloadForm.categories = [];
  showCategories.value = true;
  showFormat.value = true;
  showImageOption.value = true;
  showModelOption.value = true;
};

const emit = defineEmits(["download-completed"]);

const handleDownload = async () => {
  // 验证表单
  if (!downloadForm.scenario) {
    ElMessage.error("请选择分析场景");
    return;
  }
  if (!downloadForm.aspect) {
    ElMessage.error("请选择分析维度");
    return;
  }
  if (downloadForm.categories.length === 0) {
    ElMessage.error("请至少选择一个关注问题");
    return;
  }

  try {
    // 1. 下载数据
    const downloadParams = {
      scenario: downloadForm.scenario,
      aspect: downloadForm.aspect,
      categories: downloadForm.categories,
      format: downloadForm.format,
    };

    const response = await fetch(
      getApiUrl("/api/download-liveNetData", baseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadParams),
      }
    );

    if (!response.ok) {
      throw new Error("数据下载失败");
    }

    // 处理文件下载
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livenet_data_${downloadForm.scenario}.${downloadForm.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    downloadResult.value = {
      success: true,
      message: "数据下载成功",
    };

    // 2. 如果需要生成图像
    let images = [];
    if (downloadForm.generateImages) {
      try {
        const imageParams = {
          scene: downloadForm.scenario,
          aspect: downloadForm.aspect,
          categories: downloadForm.categories,
          format: "png",
        };

        const imageResponse = await fetch(
          getApiUrl("/api/assistant/live-image", baseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(imageParams),
          }
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          // 确保图像URL是完整的
          images = (imageData.images || []).map((img) => ({
            ...img,
            url: getApiUrl(img.url, baseUrl),
          }));
        }
      } catch (error) {
        console.warn("图像生成失败:", error);
      }
    }

    // 3. 触发下载完成事件，传递所有必要信息
    const completedData = {
      ...downloadParams,
      images: images,
      generateImages: downloadForm.generateImages,
      enableAnalysis: downloadForm.enableAnalysis,
      // 传递类别的详细映射信息，方便store显示label
      selectedCategoryDetails: downloadForm.categories.map((catValue) => {
        const category = problemCategories.find((pc) => pc.value === catValue);
        return {
          value: catValue,
          label: category ? category.label : catValue,
          id: category ? category.id : null,
        };
      }),
    };

    emit("download-completed", completedData);
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

.download-container.in-chat-mode {
  width: 550px;
  margin: 0;
  box-shadow: none;
}

.el-form-item__label {
  justify-content: left;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.el-checkbox {
  margin-right: 0;
}
</style>
