<template>
  <div class="task-flow-editor">
    <!-- 左栏：模块库 -->
    <div class="left-panel">
      <h3>模块库</h3>

      <div class="module-category">
        <h4>数据获取</h4>
        <div class="module-list">
          <div class="module-item" @click="addModule('viavi-data')">
            <i class="icon-database"></i>
            <span>仿真数据加载</span>
          </div>
          <div class="module-item" @click="addModule('livenet-data')">
            <i class="icon-network"></i>
            <span>现网数据加载</span>
          </div>
        </div>
      </div>

      <div class="module-category">
        <h4>分析配置</h4>
        <div class="module-list">
          <div class="module-item" @click="addModule('scenario-selector')">
            <i class="icon-setting"></i>
            <span>场景选择</span>
          </div>
          <div class="module-item" @click="addModule('image-selector')">
            <i class="icon-chart"></i>
            <span>图像选择</span>
          </div>
          <div class="module-item" @click="addModule('model-selector')">
            <i class="icon-robot"></i>
            <span>模型分析</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中栏：任务流 -->
    <div class="middle-panel">
      <!-- 任务编排区域 -->
      <div class="flow-editor-section">
        <div class="flow-header" :class="{ 'has-changes': hasUnsavedChanges }">
          <h3>{{ isEditMode ? "编辑任务流" : "新建任务流" }}</h3>
          <div class="flow-actions">
            <el-input
              v-if="isEditMode || (flowNodes && flowNodes.length > 0)"
              v-model="currentFlowName"
              placeholder="请输入任务流名称"
              size="small"
              style="width: 150px; margin-right: 8px"
              @input="onFlowNameChange"
              clearable
            />
            <span
              v-if="isEditMode || (flowNodes && flowNodes.length > 0)"
              style="font-size: 12px; color: #666; margin-right: 8px"
            >
              {{ currentFlowName || "未命名" }}
            </span>
            <el-button
              @click="saveFlow"
              type="primary"
              size="small"
              :disabled="!canSave || isExecuting"
            >
              {{ isEditMode ? "更新" : "保存" }} ({{
                canSave ? "可用" : "禁用"
              }})
            </el-button>
            <el-button @click="debugState" size="small" type="info"
              >调试</el-button
            >
            <el-button
              @click="executeFlow"
              type="success"
              size="small"
              :disabled="!canExecute || isExecuting"
            >
              {{ isExecuting ? "执行中..." : "执行" }}
            </el-button>
            <el-button
              v-if="isEditMode || (flowNodes && flowNodes.length > 0)"
              @click="cancelEdit"
              size="small"
              :disabled="isExecuting"
            >
              {{ isEditMode ? "取消编辑" : "清空" }}
            </el-button>
          </div>
        </div>

        <div class="flow-container">
          <div v-if="!flowNodes || flowNodes.length === 0" class="empty-flow">
            <p>点击左侧模块添加到任务流</p>
          </div>

          <div v-else class="flow-nodes">
            <div
              v-for="(node, index) in flowNodes"
              :key="node.nodeId"
              class="flow-node"
              :class="{
                active: selectedNode?.nodeId === node.nodeId,
                [`status-${node.status}`]: true,
              }"
              @click="selectNode(node)"
            >
              <div class="node-header">
                <i :class="node.icon"></i>
                <span class="node-name">{{
                  node.customName || node.name
                }}</span>
                <div class="node-actions">
                  <el-button
                    @click.stop="moveNodeUp(index)"
                    :disabled="index === 0"
                    size="small"
                    text
                  >
                    ↑
                  </el-button>
                  <el-button
                    @click.stop="moveNodeDown(index)"
                    :disabled="index === (flowNodes?.length || 0) - 1"
                    size="small"
                    text
                  >
                    ↓
                  </el-button>
                  <el-button
                    @click.stop="removeNode(index)"
                    size="small"
                    text
                    type="danger"
                  >
                    ×
                  </el-button>
                </div>
              </div>

              <div class="node-status">
                <span :class="'status-' + node.status">{{
                  getStatusText(node.status)
                }}</span>
              </div>

              <!-- 配置预览 -->
              <div class="node-config-preview">
                {{ getConfigPreview(node) }}
              </div>

              <!-- 连接线 -->
              <!-- <div v-if="index < (flowNodes?.length || 0) - 1" class="node-connector">
                  <div class="connector-line"></div>
                  <div class="connector-arrow">↓</div>
                </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 任务流列表区域 -->
      <div class="flow-list-section">
        <div class="list-header">
          <h3>已保存的任务流</h3>
          <div class="list-actions">
            <el-button @click="loadSavedFlows" size="small" text>
              <i class="el-icon-refresh"></i> 刷新
            </el-button>
          </div>
        </div>

        <div class="flow-list-container">
          <div v-if="!savedFlows || savedFlows.length === 0" class="empty-list">
            <p>暂无保存的任务流</p>
          </div>

          <div v-else class="flow-list">
            <div
              v-for="flow in savedFlows"
              :key="flow.id"
              class="flow-item"
              :class="{
                active: currentFlowId === flow.id,
                disabled: hasUnsavedChanges && currentFlowId !== flow.id,
              }"
            >
              <div class="flow-info">
                <div class="flow-name">{{ flow.name }}</div>
                <div class="flow-meta">
                  <span class="node-count"
                    >{{ flow.nodes?.length || 0 }} 个模块</span
                  >
                  <span class="create-time">{{
                    formatTime(flow.createdAt)
                  }}</span>
                </div>
                <div class="flow-description" v-if="flow.description">
                  {{ flow.description }}
                </div>
              </div>

              <div class="flow-actions">
                <el-button
                  @click="editFlow(flow)"
                  size="small"
                  type="primary"
                  text
                  :disabled="hasUnsavedChanges && currentFlowId !== flow.id"
                >
                  编辑
                </el-button>
                <el-button @click="duplicateFlow(flow)" size="small" text>
                  复制
                </el-button>
                <el-button
                  @click="deleteFlow(flow)"
                  size="small"
                  text
                  type="danger"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右栏：配置面板 -->
    <div class="right-panel">
      <div v-if="!selectedNode" class="no-selection">
        <p>选择一个模块进行配置</p>
      </div>

      <div v-else class="config-panel">
        <h3>{{ selectedNode.name }} 配置</h3>

        <!-- 基础信息 -->
        <div class="config-section">
          <h4>基础信息</h4>
          <el-form-item label="组件名称">
            <el-input
              v-model="selectedNode.customName"
              placeholder="自定义名称"
            />
          </el-form-item>
        </div>

        <!-- 动态渲染对应的配置组件 -->
        <div class="config-content">
          <!-- 仿真数据加载配置 -->
          <ViaviDataConfig
            v-if="selectedNode.type === 'viavi-data'"
            v-model="selectedNode.config"
            @config-change="handleConfigChange"
          />

          <!-- 现网数据加载配置 -->
          <LiveNetDataConfig
            v-if="selectedNode.type === 'livenet-data'"
            v-model="selectedNode.config"
            @config-change="handleConfigChange"
          />

          <!-- 场景选择配置 -->
          <ScenarioConfig
            v-if="selectedNode.type === 'scenario-selector'"
            v-model="selectedNode.config"
            @config-change="handleConfigChange"
          />

          <!-- 图像选择配置 -->
          <ImageConfig
            v-if="selectedNode.type === 'image-selector'"
            v-model="selectedNode.config"
            @config-change="handleConfigChange"
          />

          <!-- 模型分析配置 -->
          <ModelConfig
            v-if="selectedNode.type === 'model-selector'"
            v-model="selectedNode.config"
            @config-change="handleConfigChange"
          />
        </div>

        <div class="config-actions">
          <el-button @click="saveNodeConfig" type="primary">保存配置</el-button>
          <el-button @click="resetNodeConfig">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 执行进度模态框 -->
    <el-dialog
      v-model="showExecutionModal"
      title="任务流执行"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!isExecuting"
      center
    >
      <div class="execution-modal-content">
        <!-- 执行进度区域 -->
        <div v-if="isExecuting" class="execution-progress-section">
          <h4>执行进度</h4>
          <div class="progress-stages-modal">
            <div
              v-for="stage in executionStages"
              :key="stage.id"
              class="progress-stage-modal"
              :class="stage.status"
            >
              <div class="stage-icon-modal">
                <el-icon v-if="stage.status === 'running'" class="rotating">
                  <Loading />
                </el-icon>
                <el-icon
                  v-else-if="stage.status === 'completed'"
                  class="success"
                >
                  <Check />
                </el-icon>
                <el-icon v-else-if="stage.status === 'failed'" class="error">
                  <Close />
                </el-icon>
                <div v-else class="pending-dot-modal"></div>
              </div>
              <div class="stage-info">
                <span class="stage-name-modal">{{ stage.name }}</span>
                <div v-if="stage.status === 'running'" class="stage-loading">
                  <span class="loading-text">执行中...</span>
                </div>
                <div
                  v-else-if="stage.status === 'failed' && stage.error"
                  class="stage-error"
                >
                  <span class="error-text">{{ stage.error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 执行结果区域 -->
        <div
          v-if="executionResult && !isExecuting"
          class="execution-result-section"
        >
          <div class="result-header-modal">
            <h4>
              <el-icon
                v-if="executionResult.overall.status === 'success'"
                class="success large-icon"
              >
                <Check />
              </el-icon>
              <el-icon v-else class="error large-icon">
                <Close />
              </el-icon>
              {{
                executionResult.overall.status === "success"
                  ? "执行成功"
                  : "执行失败"
              }}
            </h4>
            <div class="execution-stats">
              <span class="stat-item">
                <strong>耗时：</strong
                >{{ formatDuration(executionResult.overall.duration) }}
              </span>
              <span class="stat-item">
                <strong>完成时间：</strong
                >{{ formatExecutionTime(executionResult.overall.completedAt) }}
              </span>
            </div>
          </div>

          <!-- 图片展示区域 -->
          <div
            v-if="executionResult.images && executionResult.images.length > 0"
            class="image-gallery-modal"
          >
            <h5>生成图片 ({{ executionResult.images.length }}张)</h5>
            <div class="image-grid-modal">
              <div
                v-for="(image, index) in executionResult.images"
                :key="index"
                class="image-card-modal"
                @click="previewImage(image)"
              >
                <div class="image-wrapper">
                  <img :src="getImageUrl(image.url)" :alt="image.type" />
                  <div class="image-overlay">
                    <el-icon class="preview-icon">
                      <ZoomIn />
                    </el-icon>
                  </div>
                </div>
                <div class="image-info">
                  <span class="image-type-modal">{{ image.type }}</span>
                  <span v-if="image.caption" class="image-caption">{{
                    image.caption
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- AI分析结果 -->
          <div
            v-if="executionResult.analysisResult"
            class="analysis-result-modal"
          >
            <h5>分析结果</h5>
            <div class="analysis-content">
              <div
                v-if="executionResult.analysisResult.thinking"
                class="thinking-section"
              >
                <h6>分析思路</h6>
                <p class="thinking-text">
                  {{ executionResult.analysisResult.thinking }}
                </p>
              </div>
              <div
                v-if="executionResult.analysisResult.largemodel"
                class="large-model-section"
              >
                <h6>大模型分析</h6>
                <p class="analysis-text">
                  {{ executionResult.analysisResult.largemodel }}
                </p>
              </div>
              <div
                v-if="executionResult.analysisResult.smallmodel"
                class="small-model-section"
              >
                <h6>小模型分析</h6>
                <p class="analysis-text">
                  {{ executionResult.analysisResult.smallmodel }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <div class="footer-left">
            <el-button
              v-if="isExecuting"
              @click="cancelExecution"
              type="danger"
            >
              取消执行
            </el-button>
          </div>
          <div class="footer-right">
            <el-button
              v-if="executionResult && !isExecuting"
              @click="reExecuteFlow"
              type="primary"
            >
              重新执行
            </el-button>
            <el-button
              v-if="executionResult && !isExecuting"
              @click="viewDetailedResults"
            >
              查看详细结果
            </el-button>
            <el-button @click="closeExecutionModal" :disabled="isExecuting">
              关闭
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Loading, Check, Close, ZoomIn } from "@element-plus/icons-vue";
import { getApiUrl } from "../utils/api";
import ViaviDataConfig from "../components/workflow/configs/ViaviDataConfig.vue";
import LiveNetDataConfig from "../components/workflow/configs/LiveNetDataConfig.vue";
import ScenarioConfig from "../components/workflow/configs/ScenarioConfig.vue";
import ImageConfig from "../components/workflow/configs/ImageConfig.vue";
import ModelConfig from "../components/workflow/configs/ModelConfig.vue";

console.log("=== TaskFlowEditor 组件加载 ===");

// 编辑器状态管理
const isEditMode = ref(false);
const currentFlowId = ref(null);
const currentFlowName = ref("");
const hasUnsavedChanges = ref(false);
const originalFlowData = ref(null);

// 任务流数据
const flowNodes = ref([]);
const selectedNode = ref(null);
const savedFlows = ref([]);

// 执行相关状态
const isExecuting = ref(false);
const executionCanceled = ref(false);
const executionResult = ref(null);
const executionStartTime = ref(null);
const showExecutionModal = ref(false);

// API配置
const baseUrl = null; // 使用全局配置

// 执行阶段定义
const executionStages = ref([
  { id: "start", name: "任务流开始执行", status: "pending" },
  { id: "download", name: "数据正在加载", status: "pending" },
  { id: "scenario", name: "确定选择场景", status: "pending" },
  { id: "image", name: "开始图像生成", status: "pending" },
  { id: "analysis", name: "开始模型分析", status: "pending" },
  { id: "complete", name: "任务流执行结束", status: "pending" },
]);

console.log("响应式变量初始化完成");

// 模块定义
const moduleDefinitions = {
  "viavi-data": {
    name: "仿真数据加载",
    icon: "icon-database",
    type: "viavi-data",
    defaultConfig: {
      mainCategory: "",
      features: [],
      startTime: "",
      endTime: "",
      format: "zip",
    },
  },
  "livenet-data": {
    name: "现网数据加载",
    icon: "icon-network",
    type: "livenet-data",
    defaultConfig: {
      scenario: "",
      aspect: "",
      categories: [],
      format: "csv",
      generateImages: true,
      enableAnalysis: true,
    },
  },
  "scenario-selector": {
    name: "场景选择",
    icon: "icon-setting",
    type: "scenario-selector",
    defaultConfig: {
      selectedCategory: "",
      selectedSubOption: null,
    },
  },
  "image-selector": {
    name: "图像选择",
    icon: "icon-chart",
    type: "image-selector",
    defaultConfig: {
      category: "",
      subOption: null,
      selectedImageTypes: [],
    },
  },
  "model-selector": {
    name: "模型分析",
    icon: "icon-robot",
    type: "model-selector",
    defaultConfig: {
      useLargeModel: false,
      selectedSmallModel: "",
    },
  },
};

// 计算属性
const canSave = computed(() => {
  const hasNodes = (flowNodes.value?.length || 0) > 0;
  const hasName = currentFlowName.value && currentFlowName.value.trim() !== "";

  console.log("canSave computed:", {
    hasNodes,
    hasName,
    nodesCount: flowNodes.value?.length || 0,
    flowName: currentFlowName.value,
    result: hasNodes && hasName,
  });

  return hasNodes && hasName;
});

const canExecute = computed(() => {
  // 检查是否有必需的模块且都已配置
  const requiredModules = [
    "viavi-data",
    "scenario-selector",
    "image-selector",
    "model-selector",
  ];
  const hasAllRequiredModules = requiredModules.every((type) => {
    const node = flowNodes.value?.find((n) => n.type === type);
    return node && node.status === "configured";
  });

  console.log("canExecute check:", {
    hasAllRequiredModules,
    nodeStatuses: flowNodes.value?.map((n) => ({
      type: n.type,
      status: n.status,
    })),
  });

  return hasAllRequiredModules && !isExecuting.value;
});

// 调试状态
const debugState = () => {
  console.log("=== 调试状态 ===");
  console.log("flowNodes.value:", flowNodes.value);
  console.log("flowNodes.value.length:", flowNodes.value?.length);
  console.log("currentFlowName.value:", currentFlowName.value);
  console.log("currentFlowName.value.trim():", currentFlowName.value?.trim());
  console.log("isEditMode.value:", isEditMode.value);
  console.log("hasUnsavedChanges.value:", hasUnsavedChanges.value);
  console.log("canSave.value:", canSave.value);
  console.log("canExecute.value:", canExecute.value);

  const hasNodes = (flowNodes.value?.length || 0) > 0;
  const hasName = currentFlowName.value && currentFlowName.value.trim() !== "";
  console.log("hasNodes:", hasNodes);
  console.log("hasName:", hasName);

  ElMessage.info(
    `节点数:${flowNodes.value?.length || 0}, 名称:"${
      currentFlowName.value
    }", 可保存:${canSave.value}`
  );
};

// 处理任务流名称变化
const onFlowNameChange = () => {
  console.log("Flow name changed to:", currentFlowName.value);
  if (!isEditMode.value && flowNodes.value && flowNodes.value.length > 0) {
    hasUnsavedChanges.value = true;
  }
};

// 添加模块到任务流
const addModule = (moduleType) => {
  console.log("=== 添加模块 ===");
  console.log("moduleType:", moduleType);

  const definition = moduleDefinitions[moduleType];
  if (!definition) {
    console.error("Module definition not found:", moduleType);
    return;
  }

  console.log("Module definition found:", definition);

  const node = {
    nodeId: Date.now(),
    ...definition,
    customName: definition.name,
    status: "pending",
    config: { ...definition.defaultConfig },
  };

  console.log("Created node:", node);

  if (!flowNodes.value) {
    flowNodes.value = [];
    console.log("Initialized flowNodes array");
  }

  flowNodes.value.push(node);
  console.log("Added node, total nodes:", flowNodes.value.length);
  console.log("Current flowNodes:", flowNodes.value);

  // 自动生成名称
  if (
    !isEditMode.value &&
    (!currentFlowName.value || currentFlowName.value.trim() === "")
  ) {
    const timestamp = new Date();
    const timeStr = `${
      timestamp.getMonth() + 1
    }_${timestamp.getDate()}_${timestamp.getHours()}_${timestamp.getMinutes()}`;
    currentFlowName.value = `任务流_${timeStr}`;
    console.log("Generated name:", currentFlowName.value);
  }

  ElMessage.success(`已添加 ${definition.name}`);

  // 确保响应式更新
  nextTick(() => {
    console.log("After nextTick:");
    console.log("  flowNodes.length:", flowNodes.value?.length);
    console.log("  currentFlowName:", currentFlowName.value);
    console.log("  canSave:", canSave.value);
  });
};

// 移除节点
const removeNode = (index) => {
  if (!flowNodes.value || index < 0 || index >= flowNodes.value.length) {
    return;
  }

  const node = flowNodes.value[index];
  ElMessageBox.confirm(
    `确定要删除 "${node.customName || node.name}" 吗？`,
    "确认删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      flowNodes.value.splice(index, 1);
      if (selectedNode.value?.nodeId === node.nodeId) {
        selectedNode.value = null;
      }
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};

// 上移节点
const moveNodeUp = (index) => {
  if (!flowNodes.value || index <= 0 || index >= flowNodes.value.length) {
    return;
  }

  const temp = flowNodes.value[index];
  flowNodes.value[index] = flowNodes.value[index - 1];
  flowNodes.value[index - 1] = temp;
};

// 下移节点
const moveNodeDown = (index) => {
  if (!flowNodes.value || index < 0 || index >= flowNodes.value.length - 1) {
    return;
  }

  const temp = flowNodes.value[index];
  flowNodes.value[index] = flowNodes.value[index + 1];
  flowNodes.value[index + 1] = temp;
};

// 选择节点
const selectNode = (node) => {
  console.log("Selected node:", node);
  selectedNode.value = node;
};

// 处理配置变化
const handleConfigChange = (newConfig) => {
  console.log("Config changed:", newConfig);
  if (selectedNode.value) {
    selectedNode.value.config = { ...newConfig };
  }
};

// 保存节点配置
const saveNodeConfig = () => {
  if (selectedNode.value) {
    selectedNode.value.status = "configured";
    ElMessage.success("配置已保存");
  }
};

// 重置节点配置
const resetNodeConfig = () => {
  if (selectedNode.value) {
    const definition = moduleDefinitions[selectedNode.value.type];
    selectedNode.value.config = { ...definition.defaultConfig };
    selectedNode.value.status = "pending";
    ElMessage.success("配置已重置");
  }
};

// 保存任务流
const saveFlow = async () => {
  console.log("=== 保存任务流 ===");
  console.log("canSave:", canSave.value);

  if (!canSave.value) {
    ElMessage.warning("请添加模块并输入任务流名称");
    return;
  }

  const flowData = {
    id: isEditMode.value ? currentFlowId.value : Date.now(),
    name: currentFlowName.value.trim(),
    description: "",
    nodes: JSON.parse(JSON.stringify(flowNodes.value || [])),
    createdAt: isEditMode.value
      ? originalFlowData.value?.createdAt
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log("Saving flow data:", flowData);

  try {
    // 保存到localStorage
    const flows = JSON.parse(localStorage.getItem("taskFlows") || "[]");

    if (isEditMode.value) {
      const index = flows.findIndex((flow) => flow.id === currentFlowId.value);
      if (index !== -1) {
        flows[index] = flowData;
        ElMessage.success("任务流已更新");
      }
    } else {
      flows.push(flowData);
      ElMessage.success("任务流已保存");
    }

    localStorage.setItem("taskFlows", JSON.stringify(flows));
    console.log("Saved to localStorage, total flows:", flows.length);

    // 刷新列表
    loadSavedFlows();

    // 更新状态
    hasUnsavedChanges.value = false;
    isEditMode.value = true;
    currentFlowId.value = flowData.id;
    originalFlowData.value = JSON.parse(JSON.stringify(flowData));
  } catch (error) {
    console.error("保存任务流失败:", error);
    ElMessage.error("保存失败: " + error.message);
  }
};

// 执行任务流
const executeFlow = async () => {
  console.log("=== 开始执行任务流 ===");

  if (!canExecute.value) {
    ElMessage.warning("请确保所有模块都已配置");
    return;
  }

  // 验证必需的模块配置
  const requiredModules = [
    "viavi-data",
    "scenario-selector",
    "image-selector",
    "model-selector",
  ];
  const missingModules = requiredModules.filter(
    (type) =>
      !flowNodes.value.find(
        (node) => node.type === type && node.status === "configured"
      )
  );

  if (missingModules.length > 0) {
    ElMessage.warning(
      "请确保已配置：仿真数据加载、场景选择、图像选择、模型分析"
    );
    return;
  }

  // 初始化执行状态
  isExecuting.value = true;
  executionCanceled.value = false;
  executionResult.value = null;
  executionStartTime.value = Date.now();
  showExecutionModal.value = true; // 打开模态框
  resetExecutionStages();

  try {
    // 获取各模块配置
    const viaviConfig = flowNodes.value.find(
      (n) => n.type === "viavi-data"
    ).config;
    const scenarioConfig = flowNodes.value.find(
      (n) => n.type === "scenario-selector"
    ).config;
    const imageConfig = flowNodes.value.find(
      (n) => n.type === "image-selector"
    ).config;
    const modelConfig = flowNodes.value.find(
      (n) => n.type === "model-selector"
    ).config;

    console.log("Execution configs:", {
      viaviConfig,
      scenarioConfig,
      imageConfig,
      modelConfig,
    });

    // 阶段1: 开始执行
    updateStageStatus("start", "running");
    await delay(500); // 模拟处理时间
    if (executionCanceled.value) return;
    updateStageStatus("start", "completed");

    // 阶段2: 数据加载
    updateStageStatus("download", "running");
    await downloadViaviData(viaviConfig);
    if (executionCanceled.value) return;
    updateStageStatus("download", "completed");

    // 阶段3: 场景处理（纯前端，瞬间完成）
    updateStageStatus("scenario", "running");
    await delay(300);
    if (executionCanceled.value) return;
    updateStageStatus("scenario", "completed");

    // 阶段4: 图像生成
    updateStageStatus("image", "running");
    const imageResult = await generateImages({
      imageTypes: imageConfig.selectedImageTypes,
      category: scenarioConfig.selectedCategory,
      subOption: scenarioConfig.selectedSubOption,
      dataSource: "viavi",
      downloadParams: viaviConfig,
    });
    if (executionCanceled.value) return;
    updateStageStatus("image", "completed");

    // 阶段5: 模型分析
    updateStageStatus("analysis", "running");
    const analysisResult = await runModelAnalysis({
      message: generateAnalysisMessage(modelConfig),
      context: {
        dataSource: "viavi",
        downloadParams: viaviConfig,
        category: scenarioConfig.selectedCategory,
        subOption: scenarioConfig.selectedSubOption,
        imageTypes: imageConfig.selectedImageTypes,
        generatedImages: imageResult.images || [],
      },
      modelOptions: modelConfig,
    });
    if (executionCanceled.value) return;
    updateStageStatus("analysis", "completed");

    // 阶段6: 完成
    updateStageStatus("complete", "running");
    await delay(500);
    updateStageStatus("complete", "completed");

    // 保存执行结果
    const duration = Date.now() - executionStartTime.value;
    executionResult.value = {
      overall: {
        status: "success",
        duration: duration,
        completedAt: new Date().toISOString(),
      },
      downloadResult: { status: "success" },
      images: imageResult.images || [],
      analysisResult: analysisResult,
      taskFlowConfig: {
        viavi: viaviConfig,
        scenario: scenarioConfig,
        image: imageConfig,
        model: modelConfig,
      },
    };

    ElMessage.success("任务流执行完成");
  } catch (error) {
    console.error("执行失败:", error);

    // 更新失败状态
    const currentStage = executionStages.value.find(
      (s) => s.status === "running"
    );
    if (currentStage) {
      updateStageStatus(currentStage.id, "failed", error.message);
    }

    const duration = Date.now() - executionStartTime.value;
    executionResult.value = {
      overall: {
        status: "failed",
        duration: duration,
        error: error.message,
      },
    };

    ElMessage.error(`执行失败: ${error.message}`);
  } finally {
    isExecuting.value = false;
  }
};

// 生成分析消息
const generateAnalysisMessage = (modelConfig) => {
  if (modelConfig.useLargeModel && modelConfig.selectedSmallModel) {
    return `请帮我用大模型进行分析，并用${modelConfig.selectedSmallModel}小模型进行分析。`;
  } else if (modelConfig.useLargeModel) {
    return `请帮我用大模型进行分析。`;
  } else {
    return `请帮我用${modelConfig.selectedSmallModel}小模型进行分析。`;
  }
};

// 重置执行阶段状态
const resetExecutionStages = () => {
  executionStages.value.forEach((stage) => {
    stage.status = "pending";
    stage.error = null;
  });
};

// 更新阶段状态
const updateStageStatus = (stageId, status, error = null) => {
  const stage = executionStages.value.find((s) => s.id === stageId);
  if (stage) {
    stage.status = status;
    stage.error = error;
    console.log(`Stage ${stageId}: ${status}`, error || "");
  }
};

// 延迟函数
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 仿真数据加载
const downloadViaviData = async (config) => {
  console.log("加载仿真数据:", config);
  const viaviConfig = flowNodes.value.find(
    (n) => n.type === "viavi-data"
  ).config;

  try {
    const response = await fetch(
      getApiUrl("/api/download-viaviData", baseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      }
    );

    if (!response.ok) {
      throw new Error("数据下载失败");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viavi_data.${viaviConfig.format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    //   downloadResult.value = {
    //     success: true,
    //     message: '数据下载成功'
    //   }
    // 对于文件下载，我们不需要实际下载文件，只需要确认API调用成功
    console.log("仿真数据下载成功");
    return { status: "success" };
  } catch (error) {
    console.error("仿真数据下载失败:", error);
    throw new Error(`数据下载失败: ${error.message}`);
  }
};

// 图像生成
const generateImages = async (params) => {
  console.log("生成图像:", params);

  try {
    const response = await fetch(getApiUrl("/api/assistant/image", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("图像生成失败");
    }

    const result = await response.json();
    console.log("图像生成结果:", result);

    if (!result.success) {
      throw new Error("图像生成失败");
    }

    return result;
  } catch (error) {
    console.error("图像生成失败:", error);
    throw new Error(`图像生成失败: ${error.message}`);
  }
};

// 模型分析
const runModelAnalysis = async (params) => {
  console.log("运行模型分析:", params);

  try {
    const response = await fetch(getApiUrl("/api/assistant", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("模型分析失败");
    }

    const result = await response.json();
    console.log("模型分析结果:", result);

    if (!result.success) {
      throw new Error("模型分析失败");
    }

    return result;
  } catch (error) {
    console.error("模型分析失败:", error);
    throw new Error(`模型分析失败: ${error.message}`);
  }
};

// 取消执行
const cancelExecution = () => {
  console.log("取消执行");
  executionCanceled.value = true;

  // 1-2秒后停止显示执行状态
  setTimeout(() => {
    isExecuting.value = false;
    showExecutionModal.value = false;
    executionResult.value = null;
    resetExecutionStages();
    ElMessage.info("已取消执行");
  }, 1500);
};

// 关闭执行模态框
const closeExecutionModal = () => {
  if (isExecuting.value) {
    ElMessageBox.confirm("任务正在执行中，确定要关闭吗？", "确认关闭", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        cancelExecution();
      })
      .catch(() => {});
  } else {
    showExecutionModal.value = false;
    executionResult.value = null;
  }
};

// 重新执行
const reExecuteFlow = () => {
  executionResult.value = null;
  executeFlow();
};

// 查看详细结果
const viewDetailedResults = () => {
  // TODO: 跳转到详细结果页面或显示详细结果模态框
  ElMessage.info("详细结果页面开发中...");
};

// 预览图片
const previewImage = (image) => {
  // TODO: 实现图片预览功能
  console.log("预览图片:", image);
  window.open(getImageUrl(image.url), "_blank");
};

// 获取图片URL
const getImageUrl = (imagePath) => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return getApiUrl(imagePath, baseUrl);
};

// 格式化持续时间
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

// 格式化执行时间
const formatExecutionTime = (dateStr) => {
  if (!dateStr) return "未知时间";

  try {
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  } catch (error) {
    return "时间解析失败";
  }
};

// 取消编辑/清空
const cancelEdit = async () => {
  console.log("Cancel edit called");

  // 重置编辑器状态
  flowNodes.value = [];
  selectedNode.value = null;
  currentFlowName.value = "";
  isEditMode.value = false;
  currentFlowId.value = null;
  hasUnsavedChanges.value = false;
  originalFlowData.value = null;

  ElMessage.success("已清空编辑器");
};

// 加载已保存的任务流
const loadSavedFlows = () => {
  try {
    const flowsJson = localStorage.getItem("taskFlows");
    console.log("Loading flows from localStorage:", flowsJson);

    const flows = JSON.parse(flowsJson || "[]");
    console.log("Parsed flows:", flows);

    savedFlows.value = (flows || []).sort((a, b) => {
      const dateA = new Date(b.updatedAt || b.createdAt || 0);
      const dateB = new Date(a.updatedAt || a.createdAt || 0);
      return dateA - dateB;
    });

    console.log("Loaded and sorted flows:", savedFlows.value.length);
  } catch (error) {
    console.error("加载任务流失败:", error);
    savedFlows.value = [];
  }
};

// 编辑任务流
const editFlow = async (flow) => {
  console.log("Edit flow:", flow);

  if (!flow || !flow.nodes) {
    ElMessage.error("任务流数据无效");
    return;
  }

  // 加载任务流数据
  flowNodes.value = JSON.parse(JSON.stringify(flow.nodes || []));
  currentFlowName.value = flow.name || "";
  currentFlowId.value = flow.id;
  isEditMode.value = true;
  hasUnsavedChanges.value = false;
  selectedNode.value = null;
  originalFlowData.value = JSON.parse(JSON.stringify(flow));

  ElMessage.success(`已加载任务流: ${flow.name}`);
};

// 复制任务流
const duplicateFlow = (flow) => {
  if (!flow) {
    ElMessage.error("任务流数据无效");
    return;
  }

  const newFlow = {
    ...flow,
    id: Date.now(),
    name: `${flow.name}_副本`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: JSON.parse(JSON.stringify(flow.nodes || [])),
  };

  try {
    const flows = JSON.parse(localStorage.getItem("taskFlows") || "[]");
    flows.push(newFlow);
    localStorage.setItem("taskFlows", JSON.stringify(flows));
    loadSavedFlows();
    ElMessage.success("任务流已复制");
  } catch (error) {
    console.error("复制任务流失败:", error);
    ElMessage.error("复制失败");
  }
};

// 删除任务流
const deleteFlow = async (flow) => {
  if (!flow) {
    return;
  }

  const result = await ElMessageBox.confirm(
    `确定要删除任务流 "${flow.name}" 吗？此操作无法撤销。`,
    "确认删除",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).catch(() => false);

  if (!result) return;

  try {
    const flows = JSON.parse(localStorage.getItem("taskFlows") || "[]");
    const index = flows.findIndex((f) => f.id === flow.id);
    if (index !== -1) {
      flows.splice(index, 1);
      localStorage.setItem("taskFlows", JSON.stringify(flows));
      loadSavedFlows();

      // 如果删除的是当前编辑的任务流，清空编辑器
      if (currentFlowId.value === flow.id) {
        cancelEdit();
      }

      ElMessage.success("任务流已删除");
    }
  } catch (error) {
    console.error("删除任务流失败:", error);
    ElMessage.error("删除失败");
  }
};

// 获取配置预览
const getConfigPreview = (node) => {
  const config = node.config;
  switch (node.type) {
    case "viavi-data":
      return config.mainCategory ? `类别: ${config.mainCategory}` : "未配置";
    case "livenet-data":
      return config.scenario ? `场景: ${config.scenario}` : "未配置";
    case "scenario-selector":
      return config.selectedCategory
        ? `类型: ${config.selectedCategory}`
        : "未配置";
    case "image-selector":
      return config.selectedImageTypes.length
        ? `${config.selectedImageTypes.length}个图表`
        : "未配置";
    case "model-selector":
      return config.selectedSmallModel
        ? `模型: ${config.selectedSmallModel}`
        : "未配置";
    default:
      return "未配置";
  }
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: "待配置",
    configured: "已配置",
    running: "执行中",
    completed: "已完成",
    error: "执行失败",
  };
  return statusMap[status] || "未知";
};

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return "未知时间";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "无效时间";

    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    return "时间解析失败";
  }
};

// 监听变更
watch(
  [flowNodes, currentFlowName],
  () => {
    console.log(
      "Watch triggered - flowNodes length:",
      flowNodes.value?.length,
      "name:",
      currentFlowName.value
    );
    if (isEditMode.value || (flowNodes.value?.length || 0) > 0) {
      hasUnsavedChanges.value = true;
    }
  },
  { deep: true }
);

// 页面加载时获取已保存的任务流
onMounted(() => {
  console.log("Component mounted");
  loadSavedFlows();
});

console.log("=== TaskFlowEditor 脚本加载完成 ===");
</script>

<style scoped>
.task-flow-editor {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

/* 左栏样式 */
.left-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  padding: 20px;
  overflow-y: auto;
}

.left-panel h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.module-category {
  margin-bottom: 24px;
}

.module-category h4 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
}

.module-item:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.module-item i {
  font-size: 16px;
  color: #1890ff;
}

/* 中栏样式 */
.middle-panel {
  flex: 1;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

/* 任务编排区域 */
.flow-editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.flow-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.flow-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flow-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-height: 200px;
}

.empty-flow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: #999;
  background: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
}

.flow-nodes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 任务流列表区域 */
.el-button--primary.is-text {
  color: white;
}
.flow-list-section {
  height: 300px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: white;
}

.list-header h3 {
  margin: 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.list-actions {
  display: flex;
  gap: 8px;
}

.flow-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  text-align: center;
}

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.flow-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.flow-item.active {
  border-color: #1890ff;
  background: #e6f7ff;
}

.flow-info {
  flex: 1;
  min-width: 0;
}

.flow-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.node-count {
  color: #1890ff;
}

.create-time {
  color: #999;
}

.flow-description {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-actions {
  display: flex;
  gap: 4px;
  margin-left: 12px;
}

.flow-node {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.flow-node:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.flow-node.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.node-header i {
  font-size: 16px;
  color: #1890ff;
}

.node-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.node-actions {
  display: flex;
  gap: 4px;
}

.node-status {
  font-size: 12px;
  margin-bottom: 8px;
}

.status-pending {
  color: #999;
}
.status-configured {
  color: #52c41a;
}
.status-running {
  color: #1890ff;
}
.status-completed {
  color: #52c41a;
}
.status-error {
  color: #ff4d4f;
}

.node-config-preview {
  font-size: 12px;
  color: #666;
  background: #fafafa;
  padding: 8px;
  border-radius: 4px;
}

.node-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
}

.connector-line {
  width: 2px;
  height: 20px;
  background: #d9d9d9;
}

.connector-arrow {
  color: #d9d9d9;
  font-size: 16px;
}

/* 右栏样式 */
.right-panel {
  width: 350px;
  background: white;
  padding: 20px;
  overflow-y: auto;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
  text-align: center;
}

.config-panel h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.config-section {
  margin-bottom: 20px;
}

.config-section h4 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.config-content {
  margin: 20px 0;
}

.config-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

/* 执行状态条样式 */
.execution-status-bar {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
}

.execution-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-stages {
  display: flex;
  gap: 24px;
  flex: 1;
}

.progress-stage {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.progress-stage.running {
  color: #1890ff;
}

.progress-stage.completed {
  color: #52c41a;
}

.progress-stage.failed {
  color: #ff4d4f;
}

.stage-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pending-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9d9;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.success {
  color: #52c41a;
}

.error {
  color: #ff4d4f;
}

.execution-actions {
  margin-left: 16px;
}

/* 执行结果预览样式 */
.execution-result-preview {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
}

.result-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-header h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
}

.execution-time {
  font-size: 12px;
  color: #666;
}

.image-thumbnails {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.image-thumbnails h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}

.thumbnail-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.thumbnail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.2s;
  width: 100px;
}

.thumbnail-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.thumbnail-item img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  min-height: 200px;
  max-height: 500px;
  overflow: hidden;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.image-wrapper img {
  max-width: 450px;
  max-height: 450px;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.image-type {
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

.result-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}
.flow-node.status-pending {
  border-left: 4px solid #d9d9d9;
}

.flow-node.status-configured {
  border-left: 4px solid #52c41a;
}

.flow-node.status-running {
  border-left: 4px solid #1890ff;
}

.flow-node.status-completed {
  border-left: 4px solid #52c41a;
}

.flow-node.status-error {
  border-left: 4px solid #ff4d4f;
}

/* 未保存变更提示 */
.flow-header h3::after {
  content: " *";
  color: #ff4d4f;
  font-weight: normal;
  opacity: 0;
  transition: opacity 0.2s;
}

.flow-header.has-changes h3::after {
  opacity: 1;
}

/* 禁用状态样式 */
.flow-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.flow-item.disabled:hover {
  border-color: #e8e8e8;
  box-shadow: none;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .flow-list-section {
    height: 250px;
  }

  .flow-container {
    min-height: 150px;
  }
}

@media (max-width: 1200px) {
  .task-flow-editor {
    min-width: 1200px;
    overflow-x: auto;
  }
}
</style>
