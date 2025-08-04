/* eslint-disable */
<template>
  <div class="wireless-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="header-content">
          <h1 ref="pageTitle" class="page-title animate-fade-up">
            无线数据仓库
          </h1>
          <p ref="pageSubtitle" class="page-subtitle animate-fade-up">
            支撑运营、维护、优化、规划四大场景的数字化转型
          </p>
        </div>
      </div>
    </section>

    <!-- 筛选和操作栏 -->
    <section class="filter-section">
      <div class="filter-container">
        <div class="filter-left">
          <span class="filter-label">数据类型：</span>
          <div class="filter-tabs">
            <button
              v-for="filter in filterOptions"
              :key="filter.key"
              class="filter-tab"
              :class="{ active: activeFilter === filter.key }"
              @click="setActiveFilter(filter.key)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
        <div class="filter-right">
          <button class="create-dataset-btn" @click="handleCreateDataset">
            <span class="btn-text">新建数据集</span>
            <div class="btn-icon">+</div>
          </button>
        </div>
      </div>
    </section>

    <!-- 无线数据选择器 -->
    <section class="wireless-selector">
      <div class="selector-container">
        <div class="wireless-grid">
          <div
            v-for="wireless in filteredWireless"
            :key="wireless.id"
            class="wireless-card"
            :class="{
              active: selectedWireless === wireless.id,
            }"
          >
            <div class="card-content">
              <div class="wireless-info">
                <div class="wireless-name-container">
                  <h3 class="wireless-name">{{ wireless.name }}</h3>
                </div>
                <h4 class="wireless-title">{{ wireless.description }}</h4>
              </div>
            </div>

            <!-- 使用 button 替代 div -->
            <button
              class="card-action-button primary"
              @click="handleCardAction(wireless)"
            >
              <div class="button-content">
                <span>立即下载</span>
                <div class="arrow-icon"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 简化的上传对话框 -->
    <div
      v-if="showUploadDialog"
      class="upload-dialog-overlay"
      @click="closeUploadDialog"
    >
      <div class="upload-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">新增数据集</h3>
          <button class="close-btn" @click="closeUploadDialog">×</button>
        </div>
        <div class="dialog-content">
          <form @submit.prevent="submitUpload">
            <!-- 数据集类型选择 -->
            <div class="form-group">
              <label class="form-label">数据集类型</label>
              <div class="dataset-type-grid">
                <div
                  v-for="type in datasetTypes"
                  :key="type.id"
                  class="type-card"
                  :class="{ active: uploadForm.datasetType === type.id }"
                  @click="uploadForm.datasetType = type.id"
                >
                  <div class="type-title">{{ type.name }}</div>
                  <div class="type-description">{{ type.description }}</div>
                </div>
              </div>
            </div>

            <!-- 数据集名称 -->
            <div class="form-group">
              <label class="form-label">数据集名称</label>
              <input
                v-model="uploadForm.name"
                type="text"
                class="form-input"
                placeholder="请输入数据集名称"
                required
              />
            </div>

            <!-- 数据集描述 -->
            <div class="form-group">
              <label class="form-label">数据集描述</label>
              <textarea
                v-model="uploadForm.description"
                class="form-textarea"
                placeholder="请输入数据集描述"
                rows="3"
                required
              ></textarea>
            </div>

            <!-- 文件上传区域 -->
            <div class="form-group">
              <label class="form-label">上传数据文件</label>
              <div class="upload-area" @click="triggerFileUpload">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".csv,.json,.txt,.xlsx,.xls,.parquet,.hdf5,.yaml,.yml,.xml"
                  style="display: none"
                  @change="handleFileUpload"
                />
                <div class="upload-content">
                  <div class="upload-icon">📁</div>
                  <div class="upload-text">选择文件</div>
                  <div class="upload-hint">
                    支持 .csv, .json, .txt 等格式，单个文件不超过 2GB
                  </div>
                </div>
              </div>

              <!-- 已上传文件列表 -->
              <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="file-item"
                >
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  <button
                    type="button"
                    class="file-remove"
                    @click="removeFile(index)"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <!-- 对话框操作按钮 -->
            <div class="dialog-actions">
              <button
                type="button"
                class="dialog-btn secondary"
                @click="closeUploadDialog"
              >
                取消
              </button>
              <button
                type="submit"
                class="dialog-btn primary"
                :disabled="
                  !uploadForm.datasetType ||
                  !uploadForm.name ||
                  uploadedFiles.length === 0 ||
                  uploading
                "
              >
                {{ uploading ? "上传中..." : "确认创建" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 上传进度对话框 -->
    <div v-if="showUploadProgress" class="upload-dialog-overlay">
      <div class="upload-dialog progress-dialog" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">文件上传中...</h3>
        </div>
        <div class="dialog-content">
          <div class="progress-info">
            <div class="progress-step">
              <span class="step-text">{{ uploadStatus }}</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              {{ Math.round(Math.min(uploadProgress, 100)) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { ElMessage } from "element-plus";
import { getApiUrl } from "@/utils/api";

export default {
  name: "WirelessData",
  setup() {
    const router = useRouter();
    const appStore = useAppStore();

    const selectedWireless = ref(null);
    const activeFilter = ref("all");

    // 简化的数据集类型选项
    const datasetTypes = [
      {
        id: "ai-for-ran",
        name: "AI RAN",
        description: "面向智能网络编排决策数据集",
      },
      {
        id: "ran-for-ai",
        name: "RAN AI",
        description: "无线接入网智能化数据集",
      },
      {
        id: "digital-twin",
        name: "数字孪生",
        description: "网络数字孪生建模数据集",
      },
      {
        id: "data-asset",
        name: "数据资产",
        description: "网络数据资产与治理数据集",
      },
    ];

    // 筛选选项
    const filterOptions = [
      { key: "all", label: "全部" },
      { key: "ai-for-ran", label: "AI RAN" },
      { key: "ran-for-ai", label: "RAN AI" },
      { key: "digital-twin", label: "数字孪生" },
      { key: "data-asset", label: "数据资产" },
    ];

    // 根据筛选条件过滤无线数据
    const filteredWireless = computed(() => {
      if (activeFilter.value === "all") {
        return appStore.wireless;
      }
      return appStore.wireless.filter(
        (wireless) => wireless.id === activeFilter.value
      );
    });

    // 设置筛选条件
    const setActiveFilter = (filterKey) => {
      activeFilter.value = filterKey;
    };

    // 上传对话框相关
    const showUploadDialog = ref(false);
    const showUploadProgress = ref(false);
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const uploadStatus = ref("");
    const uploadForm = ref({
      datasetType: "",
      name: "",
      description: "",
    });
    const uploadedFiles = ref([]);
    const fileInput = ref(null);

    // 处理新建数据集
    const handleCreateDataset = () => {
      showUploadDialog.value = true;
    };

    // 触发文件选择
    const triggerFileUpload = () => {
      fileInput.value?.click();
    };

    // 处理文件上传
    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      uploadedFiles.value = [...uploadedFiles.value, ...files];
    };

    // 移除文件
    const removeFile = (index) => {
      uploadedFiles.value.splice(index, 1);
    };

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // 关闭上传对话框
    const closeUploadDialog = () => {
      showUploadDialog.value = false;
      resetUploadForm();
    };

    // 重置上传表单
    const resetUploadForm = () => {
      uploadForm.value = {
        datasetType: "",
        name: "",
        description: "",
      };
      uploadedFiles.value = [];
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    };

    // 上传文件到后端
    const uploadFilesToBackend = async () => {
      const formData = new FormData();

      // 添加元信息
      formData.append("datasetType", uploadForm.value.datasetType);
      formData.append("name", uploadForm.value.name);
      formData.append("description", uploadForm.value.description);

      // 添加文件
      uploadedFiles.value.forEach((file) => {
        formData.append(`files`, file);
      });

      try {
        console.log("开始上传文件到后端...");
        const response = await fetch(getApiUrl("/api/dataset/upload", null), {
          method: "POST",
          body: formData,
        });

        console.log("后端响应状态：", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("上传失败，后端返回:", errorText);
          throw new Error(
            `文件上传失败: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("后端返回的响应数据:", result);

        // 验证返回数据格式
        if (!result.success || !result.datasetId || !result.fileId) {
          console.error("后端返回数据格式异常:", result);
          throw new Error("后端返回数据格式异常");
        }

        return result;
      } catch (error) {
        throw new Error(`上传失败: ${error.message}`);
      }
    };

    // 提交数据集创建 - 修改为先上传到后端
    const submitUpload = async () => {
      if (!uploadForm.value.datasetType) {
        ElMessage.warning("请选择数据集类型");
        return;
      }

      if (uploadedFiles.value.length === 0) {
        ElMessage.warning("请上传至少一个文件");
        return;
      }

      uploading.value = true;
      showUploadProgress.value = true;
      uploadProgress.value = 0;
      uploadStatus.value = "正在上传文件到服务器...";

      try {
        // 模拟上传进度
        const progressInterval = setInterval(() => {
          if (uploadProgress.value < 90) {
            uploadProgress.value += Math.random() * 10;
          }
        }, 200);

        // 1. 先上传文件到后端
        const uploadResult = await uploadFilesToBackend();

        clearInterval(progressInterval);
        uploadProgress.value = 100;
        uploadStatus.value = "文件上传完成，正在保存数据集信息...";

        // 2. 计算总文件大小和格式
        const totalSize = uploadedFiles.value.reduce(
          (sum, file) => sum + file.size,
          0
        );
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);

        const formats = [
          ...new Set(
            uploadedFiles.value.map((file) => {
              const ext = file.name.split(".").pop().toUpperCase();
              return ext;
            })
          ),
        ];

        // 3. 创建数据集对象（包含后端返回的文件ID）
        const newDataset = {
          name: uploadForm.value.name,
          description: uploadForm.value.description,
          size: `${totalSizeGB} GB`,
          format: formats.join(", "),
          id: uploadResult.datasetId, // 使用后端返回的ID
          fileId: uploadResult.fileId, // 保存后端文件ID
          uploadTime: new Date().toLocaleString("zh-CN"),
          downloadCount: 0,
        };

        // 4. 保存元信息到 localStorage
        const localStorageKey = `datasets_${uploadForm.value.datasetType}`;
        const existingDatasets = JSON.parse(
          localStorage.getItem(localStorageKey) || "[]"
        );

        existingDatasets.push(newDataset);
        localStorage.setItem(localStorageKey, JSON.stringify(existingDatasets));

        console.log("数据集信息已保存到localStorage:", {
          key: localStorageKey,
          dataset: newDataset,
        });
        // 5. 完成
        showUploadProgress.value = false;
        ElMessage.success(
          `数据集创建成功！已添加到${
            datasetTypes.find((t) => t.id === uploadForm.value.datasetType)
              ?.name
          }类别`
        );
        closeUploadDialog();
      } catch (error) {
        console.error("数据集创建失败:", error);
        showUploadProgress.value = false;
        ElMessage.error(`创建失败: ${error.message}`);
      } finally {
        uploading.value = false;
        uploadProgress.value = 0;
      }
    };

    // 动画相关的refs
    const pageTitle = ref(null);
    const pageSubtitle = ref(null);

    // Intersection Observer
    let observer = null;

    const createObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;
              if (element === pageTitle.value) {
                setTimeout(() => {
                  element.classList.add("animate-visible");
                }, 100);
              } else if (element === pageSubtitle.value) {
                setTimeout(() => {
                  element.classList.add("animate-visible");
                }, 200);
              }
              observer.unobserve(element);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px",
        }
      );
    };

    const observeElements = () => {
      if (pageTitle.value) observer.observe(pageTitle.value);
      if (pageSubtitle.value) observer.observe(pageSubtitle.value);

      setTimeout(() => {
        const elements = [pageTitle.value, pageSubtitle.value].filter(Boolean);
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const isVisible =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
              (window.innerWidth || document.documentElement.clientWidth);

          if (isVisible && !element.classList.contains("animate-visible")) {
            if (element === pageTitle.value) {
              setTimeout(() => element.classList.add("animate-visible"), 100);
            } else if (element === pageSubtitle.value) {
              setTimeout(() => element.classList.add("animate-visible"), 200);
            }
          }
        });
      }, 300);
    };

    onMounted(() => {
      createObserver();
      setTimeout(() => {
        observeElements();
      }, 100);

      setTimeout(() => {
        const elements = [pageTitle.value, pageSubtitle.value].filter(Boolean);
        elements.forEach((element) => {
          if (!element.classList.contains("animate-visible")) {
            element.classList.add("animate-visible");
          }
        });
      }, 5000);
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
      }
    });

    // 选择无线数据
    const selectWireless = (wireless) => {
      selectedWireless.value = wireless.id;
      appStore.setCurrentWireless(wireless.id);
    };

    // 无线数据ID到路由路径的映射
    const wirelessRouteMap = {
      "ai-for-ran": "/wireless/ai-for-ran/datasets",
      "ran-for-ai": "/wireless/ran-for-ai/datasets",
      "digital-twin": "/wireless/digital-twin/datasets",
      "data-asset": "/wireless/data-asset/datasets",
    };

    // 处理按钮点击
    const handleCardAction = (wireless) => {
      enterWireless(wireless.id);
    };

    // 进入无线数据详情页
    const enterWireless = (wirelessId) => {
      const routePath = wirelessRouteMap[wirelessId];
      if (routePath) {
        router.push(routePath);
      } else {
        router.push(`/wireless/${wirelessId}/datasets`);
      }
    };

    return {
      appStore,
      selectedWireless,
      selectWireless,
      enterWireless,
      handleCardAction,
      handleCreateDataset,
      pageTitle,
      pageSubtitle,
      activeFilter,
      filterOptions,
      filteredWireless,
      setActiveFilter,
      // 上传对话框相关
      showUploadDialog,
      showUploadProgress,
      uploading,
      uploadProgress,
      uploadStatus,
      uploadForm,
      uploadedFiles,
      fileInput,
      datasetTypes,
      triggerFileUpload,
      handleFileUpload,
      removeFile,
      formatFileSize,
      closeUploadDialog,
      submitUpload,
    };
  },
};
</script>

<style scoped>
/* 动画相关样式 */
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-fade-up.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.wireless-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  position: relative;
  width: 100%;
  height: 320px;
  background: #d9d9d9;
  background-image: url("../assets/scenarios/bg.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    270deg,
    rgba(226, 239, 255, 0) 43.08%,
    #e2efff 77.76%
  );
  z-index: 1;
}

.header-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.header-content {
  position: absolute;
  width: 640px;
  height: 100px;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.page-title {
  width: 350px;
  height: 56px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  display: flex;
  align-items: center;
  text-align: left;
  letter-spacing: 0.04em;
  background: linear-gradient(90deg, #263fff 0%, #00e5e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.page-subtitle {
  width: 640px;
  height: 28px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
}

/* 筛选和操作栏 */
.filter-section {
  background: #f5f8fb;
  padding: 32px 0 0 0;
}

.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #202939;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 20px;
  background: #ffffff;
  border: 1px solid #e5e8ef;
  border-radius: 20px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #697586;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #263fff;
  color: #263fff;
}

.filter-tab.active {
  background: #263fff;
  border-color: #263fff;
  color: #ffffff;
}

.filter-right {
  display: flex;
  align-items: center;
}

.create-dataset-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #263fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  gap: 8px;
}

.create-dataset-btn:hover {
  background: #1a2ecc;
}

.btn-text {
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
}

.btn-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

/* 无线数据选择器 */
.wireless-selector {
  padding: 32px 0 60px 0;
  background: #f5f8fb;
  position: relative;
}

.selector-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.wireless-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.wireless-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 10px;
  isolation: isolate;
  width: 100%;
  max-width: 402px;
  height: 440px;
  background: #e3e8ef;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  overflow: hidden;
  margin: 0 auto;
}

.wireless-card::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  right: -20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0;
  top: 160px;
  right: -24px;
}

.wireless-card:nth-child(1)::before {
  background-image: url("../assets/scenarios/scene1.png");
}

.wireless-card:nth-child(2)::before {
  background-image: url("../assets/scenarios/scene2.png");
}

.wireless-card:nth-child(3)::before {
  background-image: url("../assets/scenarios/scene3.png");
}

.wireless-card:nth-child(4)::before {
  background-image: url("../assets/scenarios/scene4.png");
}

.wireless-card > * {
  position: relative;
  z-index: 1;
}

.wireless-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.wireless-card.active {
  border-color: var(--primary-color);
  transform: translateY(-20px);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;
  width: 454px;
  height: 300px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  z-index: 0;
}

.wireless-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 400px;
  height: 120px;
}

.wireless-name-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
  height: 64px;
}

.wireless-name {
  width: 100%;
  height: 64px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
}

.wireless-title {
  width: 280px;
  height: 98px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #697586;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: visible;
}

.card-action-button {
  position: absolute;
  left: 25px;
  bottom: 120px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 24px;
  gap: 10px;
  width: 120px;
  height: 40px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: inherit;
}

.card-action-button.primary {
  background: #263fff;
  pointer-events: auto;
}

.card-action-button.primary:hover {
  background: #1a2ecc;
}

.button-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 92px;
  height: 20px;
}

.card-action-button.primary span {
  width: 64px;
  height: 20px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.arrow-icon::before {
  content: "↗";
  color: #ffffff;
}

/* 上传对话框 */
.upload-dialog-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
}

.upload-dialog {
  background: #ffffff !important;
  border-radius: 12px;
  width: 700px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.progress-dialog {
  width: 500px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e8ef;
  margin-bottom: 24px;
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
  padding: 0 24px 24px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #202939;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e5e8ef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #263fff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 数据集类型选择 */
.dataset-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.type-card {
  padding: 16px;
  border: 2px solid #e5e8ef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-card:hover {
  border-color: #263fff;
}

.type-card.active {
  border-color: #263fff;
  background: #f0f2ff;
}

.type-title {
  font-size: 16px;
  font-weight: 600;
  color: #202939;
  margin-bottom: 4px;
}

.type-description {
  font-size: 13px;
  color: #697586;
  line-height: 1.4;
}

/* 文件上传区域 */
.upload-area {
  border: 2px dashed #e5e8ef;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #263fff;
  background: #f9faff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  color: #263fff;
}

.upload-hint {
  font-size: 13px;
  color: #697586;
}

/* 已上传文件列表 */
.uploaded-files {
  margin-top: 12px;
  border: 1px solid #e5e8ef;
  border-radius: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e8ef;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #202939;
  margin-right: 12px;
}

.file-size {
  font-size: 13px;
  color: #697586;
  margin-right: 12px;
}

.file-remove {
  background: none;
  border: none;
  font-size: 18px;
  color: #697586;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-remove:hover {
  color: #ff4d4f;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e8ef;
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
  opacity: 0.6;
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

/* 上传进度样式 */
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

@media (max-width: 1200px) {
  .wireless-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-content {
    left: 24px;
    width: calc(100% - 48px);
  }

  .page-title {
    font-size: 32px;
    width: auto;
  }

  .page-subtitle {
    width: 100%;
    font-size: 16px;
  }

  .filter-container {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }

  .wireless-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .wireless-card {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }

  .wireless-card::before {
    width: 200px;
    height: 200px;
    right: -30px;
    top: 180px;
  }

  .card-action-button {
    left: 20px;
    bottom: 30px;
  }
}
</style>
