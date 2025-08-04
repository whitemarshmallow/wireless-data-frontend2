<template>
  <div class="active-beam-selection-page">
    <!-- 页面头部 -->
    <section class="page-header"></section>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- 步骤状态 -->
        <div class="card spacing-md">
          <h3 class="section-title">处理流程</h3>
          <div class="steps-container">
            <div
              v-for="(step, index) in store.steps"
              :key="step.id"
              class="step-item"
              :class="getStepClass(step.status)"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-name">{{ step.name }}</div>
                <div class="step-status">
                  {{ getStepStatusText(step.status) }}
                </div>
              </div>
              <div v-if="index < store.steps.length - 1" class="step-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 训练数据选择 -->
        <div class="card spacing-md">
          <div class="section-header">
            <h3 class="section-title">训练数据选择</h3>
            <div class="header-controls">
              <el-select
                v-model="selectedTrainingFileId"
                placeholder="请选择训练数据模型文件"
                @change="handleTrainingFileSelect"
                class="file-select"
              >
                <el-option
                  v-for="file in store.availableTrainingFiles"
                  :key="file.id"
                  :label="file.name"
                  :value="file.id"
                />
              </el-select>
              <el-button
                type="primary"
                :disabled="!store.canLoadTrainingData"
                @click="handleLoadTrainingData"
              >
                加载
              </el-button>
            </div>
          </div>

          <div class="file-list">
            <div class="list-header">
              <span>序号</span>
              <span>文件名</span>
              <span>大小</span>
              <span>时间</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            <div
              v-if="store.loadedTrainingDataList.length === 0"
              class="empty-list-item"
            >
              <span colspan="6">暂无数据</span>
            </div>
            <div
              v-else
              v-for="data in store.loadedTrainingDataList"
              :key="data.id"
              class="list-item"
              :class="{ selected: data.id === store.selectedTrainingData?.id }"
            >
              <span>{{ data.id }}</span>
              <span>{{ data.name }}</span>
              <span>{{ data.size }}</span>
              <span>{{ data.date }}</span>
              <span class="status">{{ data.status }}</span>
              <div class="actions">
                <el-button type="primary" size="small">配置</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDeleteTrainingData(data.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 预测模型加载 -->
        <div class="card spacing-md">
          <div class="section-header">
            <h3 class="section-title">预测模型加载</h3>
            <div class="header-controls">
              <el-select
                v-model="selectedModelFileId"
                placeholder="请选择预训练模型文件"
                @change="handleModelFileSelect"
                class="file-select"
              >
                <el-option
                  v-for="file in store.availableModelFiles"
                  :key="file.id"
                  :label="file.name"
                  :value="file.id"
                />
              </el-select>
              <el-button
                type="primary"
                :disabled="!store.canLoadModel"
                @click="handleLoadModel"
              >
                加载
              </el-button>
            </div>
          </div>

          <div class="file-list">
            <div class="list-header">
              <span>序号</span>
              <span>模型名称</span>
              <span>类型</span>
              <span>时间</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            <div
              v-if="store.loadedModelList.length === 0"
              class="empty-list-item"
            >
              <span colspan="6">暂无数据</span>
            </div>
            <div
              v-else
              v-for="model in store.loadedModelList"
              :key="model.id"
              class="list-item"
              :class="{ selected: model.id === store.selectedModel?.id }"
            >
              <span>{{ model.id }}</span>
              <span>{{ model.name }}</span>
              <span>{{ model.type }}</span>
              <span>{{ model.date }}</span>
              <span class="status">{{ model.status }}</span>
              <div class="actions">
                <el-button type="primary" size="small">配置</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDeleteModel(model.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 数据情况 -->
        <div class="card spacing-md">
          <h3 class="section-title">数据情况</h3>
          <div class="data-types-row">
            <el-checkbox-group
              v-model="selectedDataTypeKeys"
              @change="handleDataTypeChange"
            >
              <el-checkbox
                v-for="dataType in store.dataTypes"
                :key="dataType.key"
                :label="dataType.key"
                :value="dataType.key"
              >
                {{ dataType.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 启动按钮 -->
          <div class="start-button-container">
            <el-button
              type="primary"
              size="large"
              :disabled="!store.canStart"
              @click="handleStart"
              :loading="isAnalyzing"
            >
              启动
            </el-button>
            <el-button
              type="primary"
              size="large"
              :disabled="!store.canReset"
              @click="handleReset"
            >
              复位
            </el-button>
          </div>
        </div>

        <!-- 网络性能对比 -->
        <div class="card spacing-md">
          <h3 class="section-title">网络性能对比</h3>
          <div class="chart-container">
            <div v-if="!store.showPerformanceChart" class="empty-content">
              点击启动按钮后显示网络性能对比图
            </div>
            <img
              v-else
              src="../../../assets/AIForRAN/ActiveBeamSelection/data1.png"
              alt="网络性能对比图"
              class="performance-chart"
            />
          </div>
        </div>

        <!-- 详细性能指标对比 -->
        <div class="card spacing-md">
          <h3 class="section-title">详细性能指标对比</h3>
          <div class="performance-table-container">
            <div v-if="!store.showPerformanceTable" class="empty-content">
              点击启动按钮后显示详细性能指标对比表
            </div>
            <div v-else class="performance-table">
              <table>
                <thead>
                  <tr>
                    <th>评估指标</th>
                    <th>RawData</th>
                    <th>FinelyFiltered</th>
                    <th>CoarselyFiltered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in store.performanceData" :key="row.metric">
                    <td>{{ row.metric }}</td>
                    <td>{{ row.rawData }}</td>
                    <td>{{ row.finelyFiltered }}</td>
                    <td>{{ row.coarselyFiltered }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果弹窗 -->
    <el-dialog
      v-model="store.showResults"
      title="分析结果"
      width="80%"
      @close="store.closeResults"
    >
      <div class="results-content">
        <h4>选择的数据类型分析结果：</h4>
        <div class="result-images">
          <div
            v-for="result in store.resultImages"
            :key="result.title"
            class="result-item"
          >
            <h5>{{ getDataTypeLabel(result.title) }}</h5>
            <img :src="result.url" :alt="result.title" class="result-image" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";
import { useBeamSelectionStore } from "../../../stores/beamSelection.js";

export default {
  name: "ActiveBeamSelection",
  components: {
    ArrowRight,
  },
  setup() {
    const router = useRouter();
    const store = useBeamSelectionStore();

    // 响应式数据
    const selectedTrainingFileId = ref(null);
    const selectedModelFileId = ref(null);
    const selectedDataTypeKeys = ref([]);
    const isAnalyzing = ref(false);

    // 计算属性
    const canStart = computed(() => store.canStart);
    const canReset = computed(() => store.canReset);

    // 方法
    const getStepClass = (status) => {
      return {
        "step-pending": status === "pending",
        "step-loaded": status === "loaded",
        "step-selected": status === "selected",
        "step-completed": status === "completed",
      };
    };

    const getStepStatusText = (status) => {
      const statusMap = {
        pending: "未加载",
        loaded: "已加载",
        selected: "已选择",
        completed: "已完成",
      };
      return statusMap[status] || "未知";
    };

    const getDataTypeLabel = (key) => {
      const dataType = store.dataTypes.find((type) => type.key === key);
      return dataType ? dataType.label : key;
    };

    const handleTrainingFileSelect = (fileId) => {
      store.selectTrainingFile(fileId);
    };

    const handleLoadTrainingData = () => {
      store.loadTrainingData();
      ElMessage.success("训练数据已加载");
    };

    const handleDeleteTrainingData = (dataId) => {
      store.deleteTrainingData(dataId);
      ElMessage.success("训练数据已删除");
    };

    const handleModelFileSelect = (fileId) => {
      store.selectModelFile(fileId);
    };

    const handleLoadModel = () => {
      store.loadModel();
      ElMessage.success("预测模型已加载");
    };

    const handleDeleteModel = (modelId) => {
      store.deleteModel(modelId);
      ElMessage.success("预测模型已删除");
    };

    const handleDataTypeChange = (value) => {
      // 重置所有数据类型的选中状态
      store.dataTypes.forEach((type) => {
        type.checked = value.includes(type.key);
      });
    };

    const handleStart = async () => {
      if (!store.canStart) {
        ElMessage.warning("请先选择训练数据、预测模型和数据类型");
        return;
      }

      try {
        isAnalyzing.value = true;
        await store.startAnalysis();
        ElMessage.success("分析已启动，正在处理数据...");
      } catch (error) {
        ElMessage.error("启动分析失败：" + error.message);
      } finally {
        isAnalyzing.value = false;
      }
    };

    const handleReset = async () => {
      store.resetAnalysis();
      ElMessage.success("已复位");
    };

    // 生命周期
    onMounted(() => {
      // 初始化数据类型选择
      selectedDataTypeKeys.value = store.dataTypes
        .filter((type) => type.checked)
        .map((type) => type.key);
    });

    return {
      store,
      selectedTrainingFileId,
      selectedModelFileId,
      selectedDataTypeKeys,
      isAnalyzing,
      canStart,
      canReset,
      getStepClass,
      getStepStatusText,
      getDataTypeLabel,
      handleTrainingFileSelect,
      handleLoadTrainingData,
      handleDeleteTrainingData,
      handleModelFileSelect,
      handleLoadModel,
      handleDeleteModel,
      handleDataTypeChange,
      handleStart,
      handleReset,
    };
  },
};
</script>

<style scoped>
.active-beam-selection-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* 页面头部 */
.page-header {
  position: relative;
  width: 100%;
  height: 410px;
  background: #d9d9d9;
  background-image: url("../../../assets/AIForRAN/ActiveBeamSelection/scenario-bg.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

/* 主要内容区域 */
.main-container {
  margin-top: 24px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-bottom: 48px;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-section .card,
.right-section .card {
  border: 1px solid #e3e8ef;
  box-shadow: none;
}

/* 章节标题 */
.section-title {
  margin-bottom: 20px;
  color: var(--text-primary);
  font-weight: 600;
  border-left: 5px solid var(--primary-color);
  padding-left: 10px;
}

/* 章节头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  gap: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
  flex: 1;
}

.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.file-select {
  min-width: 280px;
}

/* 步骤组件样式 */
.steps-container {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: var(--fill-lighter);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 190px;
}

.step-item.step-loaded,
.step-item.step-selected,
.step-item.step-completed {
  background: var(--gradient-light);
  border: 1px solid var(--primary-light);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--border-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-primary);
}

.step-item.step-loaded .step-number,
.step-item.step-selected .step-number,
.step-item.step-completed .step-number {
  background: var(--primary-color);
  color: white;
}

.step-content {
  flex: 1;
}

.step-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.step-status {
  font-size: 12px;
  color: var(--text-regular);
}

.step-arrow {
  color: var(--primary-color);
  font-size: 20px;
}

/* 文件列表样式 */
.file-list {
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 50px 135px 80px 110px 80px 120px;
  gap: 12px;
  padding: 12px;
  background: var(--fill-light);
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid #e3e8ef;
}

.list-item {
  display: grid;
  grid-template-columns: 50px 135px 80px 110px 80px 120px;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #e3e8ef;
  align-items: center;
  transition: background 0.3s ease;
}

.list-item:hover {
  background: var(--fill-lighter);
}

.list-item:last-child {
  border-bottom: none;
}

.empty-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  color: var(--text-secondary);
  font-size: 14px;
  border-bottom: none;
}

.status {
  color: var(--success-color);
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 8px;
}

/* 数据类型选择样式 */
.data-types-row {
  margin-bottom: 24px;
}

.data-types-row :deep(.el-checkbox-group) {
  display: flex;
  gap: 20px;
  justify-content: space-around;
}

.data-types-row :deep(.el-checkbox) {
  margin-right: 0;
  padding: 12px 16px;
  border: 1px solid #e3e8ef;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.data-types-row :deep(.el-checkbox:hover) {
  border-color: var(--primary-color);
  background: var(--fill-lighter);
}

.data-types-row :deep(.el-checkbox.is-checked) {
  background: var(--fill-light);
  border-color: var(--primary-color);
}

/* 启动按钮样式 */
.start-button-container {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

/* 图表容器样式 */
.chart-container {
  text-align: center;
}

.performance-chart {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 性能表格样式 */
.performance-table-container {
  min-height: 200px;
}

.performance-table {
  overflow-x: auto;
}

.performance-table table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-light);
  border: 1px solid #e3e8ef;
}

.performance-table th,
.performance-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e3e8ef;
}

.performance-table th {
  background: var(--fill-light);
  font-weight: 600;
  color: var(--text-primary);
}

.performance-table td {
  background: white;
  color: var(--text-regular);
}

.performance-table tr:hover td {
  background: var(--fill-lighter);
}

.performance-table tr:last-child td {
  border-bottom: none;
}

/* 空内容状态 */
.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: var(--fill-lighter);
  border: 2px dashed #e3e8ef;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 结果弹窗样式 */
.results-content h4 {
  margin-bottom: 20px;
  color: var(--text-primary);
}

.result-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.result-item {
  text-align: center;
}

.result-item h5 {
  margin-bottom: 12px;
  color: var(--primary-color);
  font-weight: 600;
}

.result-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-base);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-container {
    grid-template-columns: 1fr;
    max-width: 800px;
  }

  .steps-container {
    flex-direction: column;
  }

  .step-item {
    min-width: auto;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .header-controls {
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 0 12px;
  }

  .list-header,
  .list-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .list-header span,
  .list-item span {
    padding: 4px 0;
  }

  .actions {
    justify-content: center;
  }

  .data-types-row :deep(.el-checkbox-group) {
    flex-direction: column;
    gap: 12px;
  }

  .data-types-row :deep(.el-checkbox) {
    text-align: left;
  }

  .header-controls {
    flex-direction: column;
  }

  .file-select {
    min-width: auto;
    width: 100%;
  }

  .result-images {
    grid-template-columns: 1fr;
  }
}
</style>
