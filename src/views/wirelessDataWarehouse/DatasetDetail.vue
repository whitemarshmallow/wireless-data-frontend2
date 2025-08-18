/* eslint-disable */
<template>
  <div class="dataset-detail-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="breadcrumb">
            <router-link to="/wireless-data" class="breadcrumb-link"
              >无线数据仓库</router-link
            >
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{
              currentWirelessInfo?.name
            }}</span>
          </div>
          <h1 class="page-title">{{ currentWirelessInfo?.name }}</h1>
          <p class="page-subtitle">{{ currentWirelessInfo?.description }}</p>
        </div>
      </div>
    </section>

    <!-- 简化的统计信息 -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ datasetStats.total }}</div>
            <div class="stat-label">数据集总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">
              {{ datasetStats.totalSize.toFixed(1) }} GB
            </div>
            <div class="stat-label">总存储大小</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ datasetStats.totalDownloads }}</div>
            <div class="stat-label">总下载次数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 简化的操作栏 -->
    <section class="action-section">
      <div class="action-container">
        <div class="action-left">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索数据集..."
              class="search-input"
            />
            <div class="search-icon">🔍</div>
          </div>
        </div>
        <div class="action-right">
          <button
            class="refresh-btn"
            @click="refreshDatasets"
            :disabled="loading"
          >
            <span>{{ loading ? "加载中..." : "刷新数据" }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 数据集列表 -->
    <section class="dataset-list-section">
      <div class="dataset-container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">⏳</div>
          <div class="loading-text">正在加载数据集...</div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">❌</div>
          <div class="error-title">加载失败</div>
          <div class="error-description">{{ error }}</div>
          <button class="retry-btn" @click="loadDatasets">重试</button>
        </div>

        <!-- 空状态 -->
        <div v-else-if="filteredDatasets.length === 0" class="empty-state">
          <div class="empty-icon">📁</div>
          <div class="empty-title">暂无数据集</div>
          <div class="empty-description">
            {{
              searchKeyword ? "没有找到匹配的数据集" : "还没有上传任何数据集"
            }}
          </div>
        </div>

        <!-- 数据集网格 -->
        <div v-else class="dataset-grid">
          <div
            v-for="dataset in filteredDatasets"
            :key="dataset.id"
            class="dataset-card"
          >
            <div class="card-header">
              <div class="dataset-title">{{ dataset.name }}</div>
            </div>
            <div class="card-content">
              <div class="dataset-description">{{ dataset.description }}</div>
              <div class="dataset-meta">
                <div class="meta-row">
                  <span class="meta-label">贡献者：</span>
                  <span class="meta-value">{{
                    dataset.contributor || "未知"
                  }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">大小：</span>
                  <span class="meta-value">{{ dataset.size }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">格式：</span>
                  <span class="meta-value">{{ dataset.format }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">上传时间：</span>
                  <span class="meta-value">{{ dataset.uploadTime }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">下载次数：</span>
                  <span class="meta-value">{{ dataset.downloadCount }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button
                class="action-btn primary"
                @click="downloadDataset(dataset)"
              >
                下载数据集
              </button>
              <button
                class="action-btn outline"
                @click="viewDatasetDetail(dataset)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 下载选项对话框 -->
    <div
      v-if="showDownloadDialog"
      class="upload-dialog-overlay"
      @click="closeDownloadDialog"
    >
      <div class="upload-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">下载数据集</h3>
          <button class="close-btn" @click="closeDownloadDialog">×</button>
        </div>
        <div class="dialog-content">
          <div class="dataset-info">
            <h4>{{ selectedDataset?.name }}</h4>
            <p>{{ selectedDataset?.description }}</p>
            <div class="contributor-info">
              <span class="contributor-label">贡献者：</span>
              <span class="contributor-name">{{
                selectedDataset?.contributor || "未知"
              }}</span>
            </div>
          </div>

          <div class="download-options">
            <div class="option-section">
              <h5>是否使用工具链处理？</h5>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    type="radio"
                    v-model="useToolchain"
                    :value="false"
                    name="toolchain"
                  />
                  <span>否，直接下载原始数据</span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    v-model="useToolchain"
                    :value="true"
                    name="toolchain"
                  />
                  <span>是，使用工具链处理后下载</span>
                </label>
              </div>
            </div>

            <div v-if="useToolchain" class="option-section">
              <h5>选择处理工具</h5>
              <div class="tools-grid">
                <label
                  v-for="tool in availableTools"
                  :key="tool.id"
                  class="tool-item"
                  :class="{ active: selectedTool === tool.id }"
                >
                  <input
                    type="radio"
                    :value="tool.id"
                    v-model="selectedTool"
                    name="processingTool"
                  />
                  <div class="tool-info">
                    <div class="tool-name">{{ tool.name }}</div>
                    <div class="tool-description">{{ tool.description }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="dialog-actions">
            <button
              type="button"
              class="dialog-btn secondary"
              @click="closeDownloadDialog"
            >
              取消
            </button>
            <button
              type="button"
              class="dialog-btn primary"
              @click="startDownload"
              :disabled="useToolchain && !selectedTool"
            >
              {{ useToolchain ? "开始处理并下载" : "直接下载" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 处理进度对话框 -->
    <div v-if="showProgressDialog" class="upload-dialog-overlay">
      <div class="upload-dialog progress-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">数据处理中...</h3>
        </div>
        <div class="dialog-content">
          <div class="progress-info">
            <div class="progress-step">
              <span class="step-text">{{ currentStep }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <div class="progress-text">{{ progressPercent }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { ElMessage } from "element-plus";
import { getApiUrl } from "@/utils/api";

export default {
  name: "DatasetDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const appStore = useAppStore();

    // 从路由参数获取无线数据类型
    const wirelessType = computed(() => route.params.wirelessType);

    // 获取当前无线数据信息
    const currentWirelessInfo = computed(() => {
      return appStore.getWirelessById(wirelessType.value);
    });

    // 数据集列表和状态
    const datasets = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // 搜索和筛选
    const searchKeyword = ref("");

    // 过滤后的数据集
    const filteredDatasets = computed(() => {
      let filtered = datasets.value;

      // 按搜索关键词筛选
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(keyword) ||
            dataset.description.toLowerCase().includes(keyword) ||
            (dataset.contributor &&
              dataset.contributor.toLowerCase().includes(keyword))
        );
      }

      return filtered;
    });

    // 简化的统计信息
    const datasetStats = computed(() => {
      const allDatasets = datasets.value;

      const stats = {
        total: allDatasets.length,
        totalDownloads: allDatasets.reduce(
          (sum, d) => sum + (d.downloadCount || 0),
          0
        ),
        totalSize: 0,
      };

      // 计算总大小
      allDatasets.forEach((dataset) => {
        const sizeStr = dataset.size || "0 GB";
        const sizeMatch = sizeStr.match(/([\d.]+)\s*(GB|MB|KB)/i);
        if (sizeMatch) {
          const size = parseFloat(sizeMatch[1]);
          const unit = sizeMatch[2].toUpperCase();
          let sizeInGB = size;

          if (unit === "MB") {
            sizeInGB = size / 1024;
          } else if (unit === "KB") {
            sizeInGB = size / (1024 * 1024);
          }

          stats.totalSize += sizeInGB;
        }
      });

      return stats;
    });

    // API 调用函数
    const fetchDatasetsFromAPI = async () => {
      try {
        console.log(`正在获取数据集: ${wirelessType.value}`);

        const response = await fetch(
          getApiUrl(
            `/api/dataset/overview?wirelessType=${wirelessType.value}&view=card`
          )
        );

        if (!response.ok) {
          throw new Error(
            `API请求失败: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("API返回数据:", result);

        if (!result.success) {
          throw new Error(result.message || "API返回失败状态");
        }

        return result.items || [];
      } catch (error) {
        console.error("获取数据集失败:", error);
        throw error;
      }
    };

    // 数据格式转换
    const convertAPIDataToComponentFormat = (apiItems) => {
      return apiItems.map((item) => {
        // 解析 textLines 中的信息
        const textLines = item.textLines || [];
        const name = textLines[0] || "未知数据集";
        const description = textLines[1] || "暂无描述";
        const contributor = textLines[2]?.replace("贡献者：", "") || "未知";
        const size = textLines[3]?.replace("大小：", "") || "0.00 GB";
        const format = textLines[4]?.replace("格式：", "") || "Unknown";

        return {
          id: item.datasetId,
          name,
          description,
          contributor,
          size,
          format,
          uploadTime: new Date().toLocaleString("zh-CN"), // API未返回，就使用当前时间
          downloadCount: 0, // API未返回，默认为0
          downloadPayload: item.downloadPayload, // 保存下载信息
        };
      });
    };

    // 加载数据集列表 - 从API获取
    const loadDatasets = async () => {
      if (!wirelessType.value) {
        datasets.value = [];
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const apiItems = await fetchDatasetsFromAPI();
        datasets.value = convertAPIDataToComponentFormat(apiItems);
        console.log("转换后的数据集:", datasets.value);
      } catch (err) {
        error.value = err.message;
        console.error("数据加载失败:", err);

        // 降级到localStorage（如果需要）
        const localStorageKey = `datasets_${wirelessType.value}`;
        const localDatasets = JSON.parse(
          localStorage.getItem(localStorageKey) || "[]"
        );
        if (localDatasets.length > 0) {
          datasets.value = localDatasets;
          ElMessage.warning("从本地缓存加载数据");
        }
      } finally {
        loading.value = false;
      }
    };

    // 刷新数据集
    const refreshDatasets = () => {
      loadDatasets();
    };

    // 下载相关状态
    const showDownloadDialog = ref(false);
    const selectedDataset = ref(null);
    const useToolchain = ref(false);
    const selectedTool = ref("");

    // 处理进度相关状态
    const showProgressDialog = ref(false);
    const currentStep = ref("");
    const progressPercent = ref(0);

    // 可用工具列表
    const availableTools = ref([
      {
        id: "format_conversion",
        name: "格式转换",
        description: "将数据转换为指定格式（CSV、JSON等）",
      },
      {
        id: "noise_removal",
        name: "去除噪声",
        description: "自动识别并去除数据中的噪声和异常值",
      },
      {
        id: "data_augmentation",
        name: "数据增强",
        description: "通过旋转、缩放等方法增加数据样本",
      },
      {
        id: "data_labeling",
        name: "数据标签化",
        description: "为数据自动生成或优化标签信息",
      },
      {
        id: "method_x",
        name: "数据处理方法X",
        description: "专用的无线数据预处理算法",
      },
      {
        id: "method_xx",
        name: "数据处理方法XX",
        description: "高级数据清洗和特征提取方法",
      },
    ]);

    // 下载数据集
    const downloadDataset = (dataset) => {
      console.log("点击下载数据集:", dataset);
      selectedDataset.value = dataset;
      useToolchain.value = false;
      selectedTool.value = "";
      showDownloadDialog.value = true;
    };

    // 关闭下载对话框
    const closeDownloadDialog = () => {
      showDownloadDialog.value = false;
      selectedDataset.value = null;
      useToolchain.value = false;
      selectedTool.value = "";
    };

    // 开始下载（使用API提供的downloadPayload）
    const startDownload = async () => {
      if (!selectedDataset.value) {
        ElMessage.error("未选择数据集，请重新点击下载");
        return;
      }

      const currentDataset = selectedDataset.value;
      const currentUseToolchain = useToolchain.value;
      const currentSelectedTool = selectedTool.value;

      closeDownloadDialog();

      try {
        // 使用API提供的downloadPayload，并根据用户选择更新参数
        const downloadData = {
          ...currentDataset.downloadPayload,
          useToolchain: currentUseToolchain,
          ...(currentUseToolchain && { tool: currentSelectedTool }),
        };

        console.log("发送下载请求参数:", downloadData);

        // 如果使用工具链，显示处理中状态
        if (currentUseToolchain) {
          showProgressDialog.value = true;
          currentStep.value = `正在使用${
            availableTools.value.find((t) => t.id === currentSelectedTool)?.name
          }处理数据...`;
          progressPercent.value = 50;
        }

        const response = await fetch(getApiUrl("/api/dataset/download", null), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(downloadData),
        });

        if (!response.ok) {
          throw new Error(
            `下载失败: ${response.status} ${response.statusText}`
          );
        }

        // 直接处理文件流响应
        const blob = await response.blob();

        // 尝试从响应头获取文件名
        const contentDisposition = response.headers.get("content-disposition");
        let filename =
          currentDataset.name + (currentUseToolchain ? "_processed" : "");

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        } else {
          // 根据原始格式确定扩展名
          const originalFormat = currentDataset.format || "txt";
          const firstFormat = originalFormat.split(",")[0].trim();
          const fileExtension = firstFormat.toLowerCase();
          filename = filename + "." + fileExtension;
        }

        // 创建下载链接并触发下载
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // 关闭进度对话框（如果有）
        if (currentUseToolchain) {
          showProgressDialog.value = false;
        }

        // 更新下载次数（本地）
        updateLocalDownloadCount(currentDataset);

        ElMessage.success(
          `${currentDataset.name} ${
            currentUseToolchain ? "处理并" : ""
          }下载成功`
        );
      } catch (error) {
        console.error("下载错误:", error);

        // 关闭进度对话框（如果有）
        if (currentUseToolchain) {
          showProgressDialog.value = false;
        }

        ElMessage.error(`下载失败: ${error.message}`);
      }
    };

    // 更新本地下载次数（用于显示，实际应该由后端统计）
    const updateLocalDownloadCount = (dataset) => {
      const index = datasets.value.findIndex((d) => d.id === dataset.id);
      if (index !== -1) {
        datasets.value[index].downloadCount =
          (datasets.value[index].downloadCount || 0) + 1;
      }
    };

    // 查看数据集详情
    const viewDatasetDetail = (dataset) => {
      ElMessage.info(`查看 ${dataset.name} 详情功能开发中...`);
    };

    // 监听路由参数变化
    watch(
      () => wirelessType.value,
      (newType) => {
        if (newType && appStore && appStore.setCurrentWireless) {
          appStore.setCurrentWireless(newType);
        }
        // 重新加载数据集
        loadDatasets();
      },
      { immediate: true }
    );

    onMounted(() => {
      // 设置当前选中的无线数据类型
      if (wirelessType.value && appStore && appStore.setCurrentWireless) {
        appStore.setCurrentWireless(wirelessType.value);
      }

      // 加载数据集列表
      loadDatasets();
    });

    return {
      wirelessType,
      currentWirelessInfo,
      datasets,
      datasetStats,
      loading,
      error,
      searchKeyword,
      filteredDatasets,
      downloadDataset,
      viewDatasetDetail,
      loadDatasets,
      refreshDatasets,
      // 下载相关
      showDownloadDialog,
      selectedDataset,
      useToolchain,
      selectedTool,
      availableTools,
      closeDownloadDialog,
      startDownload,
      // 进度相关
      showProgressDialog,
      currentStep,
      progressPercent,
    };
  },
};
</script>

<style scoped>
.dataset-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e8ef;
  padding: 24px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #697586;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #263fff;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #c0c4cc;
}

.breadcrumb-current {
  color: #202939;
  font-weight: 500;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #202939;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #697586;
  margin: 0;
}

/* 统计信息 */
.stats-section {
  background: #ffffff;
  border-bottom: 1px solid #e5e8ef;
  padding: 24px 0;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #263fff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #697586;
}

/* 操作栏 */
.action-section {
  background: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid #e5e8ef;
}

.action-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #e5e8ef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #263fff;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #697586;
}

.refresh-btn {
  padding: 10px 20px;
  background: #263fff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  background: #1a2ecc;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载和错误状态 */
.loading-state,
.error-state {
  text-align: center;
  padding: 80px 0;
}

.loading-spinner,
.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.loading-text,
.error-title {
  font-size: 20px;
  font-weight: 600;
  color: #202939;
  margin-bottom: 8px;
}

.error-description {
  font-size: 14px;
  color: #697586;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 20px;
  background: #263fff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* 数据集列表 */
.dataset-list-section {
  padding: 24px 0;
}

.dataset-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #202939;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #697586;
}

.dataset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.dataset-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e8ef;
  transition: all 0.3s ease;
}

.dataset-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.dataset-title {
  font-size: 18px;
  font-weight: 600;
  color: #202939;
  flex: 1;
  margin-right: 12px;
}

.dataset-description {
  font-size: 14px;
  color: #697586;
  line-height: 1.5;
  margin-bottom: 16px;
}

.dataset-meta {
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.meta-label {
  color: #697586;
  font-weight: 500;
}

.meta-value {
  color: #202939;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
}

.action-btn.primary {
  background: #263fff;
  color: #ffffff;
  border-color: #263fff;
}

.action-btn.primary:hover {
  background: #1a2ecc;
  border-color: #1a2ecc;
}

.action-btn.outline {
  background: transparent;
  color: #263fff;
  border-color: #263fff;
}

.action-btn.outline:hover {
  background: #263fff;
  color: #ffffff;
}

/* 下载对话框样式 - 复用原有样式 */
.upload-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.upload-dialog {
  background: #ffffff;
  border-radius: 12px;
  width: 700px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.progress-dialog {
  width: 500px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #202939;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #697586;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #202939;
}

.dialog-content {
  padding: 24px;
}

.dataset-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.dataset-info h4 {
  margin: 0 0 8px 0;
  color: #202939;
}

.dataset-info p {
  margin: 0 0 8px 0;
  color: #697586;
  font-size: 14px;
}

.contributor-info {
  font-size: 13px;
  color: #697586;
}

.contributor-label {
  font-weight: 500;
}

.contributor-name {
  color: #263fff;
  font-weight: 500;
}

.download-options {
  margin-bottom: 24px;
}

.option-section {
  margin-bottom: 24px;
}

.option-section h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #202939;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  margin: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.tool-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e5e8ef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-item:hover {
  border-color: #263fff;
}

.tool-item.active {
  border-color: #263fff;
  background: #f0f4ff;
}

.tool-item input[type="radio"] {
  margin: 0;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-weight: 500;
  color: #202939;
  margin-bottom: 4px;
}

.tool-description {
  font-size: 12px;
  color: #697586;
  line-height: 1.4;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.dialog-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
}

.dialog-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-btn.primary {
  background: #263fff;
  color: #ffffff;
  border-color: #263fff;
}

.dialog-btn.primary:hover:not(:disabled) {
  background: #1a2ecc;
  border-color: #1a2ecc;
}

.dialog-btn.secondary {
  background: transparent;
  color: #697586;
  border-color: #e5e8ef;
}

.dialog-btn.secondary:hover {
  background: #f0f2f5;
}

/* 进度对话框样式 */
.progress-info {
  text-align: center;
  margin-bottom: 24px;
}

.progress-step {
  margin-bottom: 16px;
}

.step-text {
  font-size: 16px;
  color: #202939;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e8ef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #263fff;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #697586;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .action-container {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .action-left {
    flex-direction: column;
    gap: 12px;
  }

  .search-box {
    width: 100%;
  }

  .dataset-grid {
    grid-template-columns: 1fr;
  }

  .upload-dialog {
    width: 95vw;
    margin: 20px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
