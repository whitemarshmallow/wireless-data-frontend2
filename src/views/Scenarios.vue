/* eslint-disable */
<template>
  <div class="scenarios-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <h1 class="page-title">应用场景</h1>
        <p class="page-subtitle">
          支撑运营、维护、优化、规划四大场景的数字化转型
        </p>
      </div>
    </section>

    <!-- 场景选择器 -->
    <section class="scenario-selector">
      <div class="selector-container">
        <h2 class="selector-title">选择应用场景</h2>
        <div class="scenarios-grid">
          <div
            v-for="scenario in appStore.scenarios"
            :key="scenario.id"
            class="scenario-card"
            :class="{
              active: selectedScenario === scenario.id,
              'coming-soon': scenario.status === 'coming-soon',
            }"
            @click="selectScenario(scenario)"
          >
            <div class="card-header">
              <div class="scenario-icon">
                <el-icon><component :is="scenario.icon" /></el-icon>
              </div>

              <div
                v-if="scenario.status === 'coming-soon'"
                class="coming-soon-badge"
              >
                即将推出
              </div>
            </div>

            <div class="card-content">
              <h3 class="scenario-name">{{ scenario.name }}</h3>
              <h4 class="scenario-title">{{ scenario.title }}</h4>
              <p class="scenario-desc">{{ scenario.description }}</p>

              <!-- 案例列表 -->
              <div
                v-if="scenario.cases && scenario.cases.length"
                class="scenario-cases"
              >
                <div class="cases-label">应用案例：</div>
                <div class="cases-list">
                  <el-tag
                    v-for="case_item in scenario.cases"
                    :key="case_item"
                    size="small"
                    class="case-tag"
                  >
                    {{ case_item }}
                  </el-tag>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <el-button
                v-if="scenario.status !== 'coming-soon'"
                type="primary"
                @click.stop="enterScenario(scenario.id)"
              >
                进入场景
              </el-button>
              <el-button v-else disabled> 敬请期待 </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 场景详情展示 -->
    <section v-if="selectedScenarioData" class="scenario-detail">
      <div class="detail-container">
        <div class="detail-header">
          <div class="detail-icon">
            <el-icon><component :is="selectedScenarioData.icon" /></el-icon>
          </div>
          <div class="detail-info">
            <h2 class="detail-name">{{ selectedScenarioData.name }}</h2>
            <h3 class="detail-title">{{ selectedScenarioData.title }}</h3>
            <p class="detail-description">
              {{ selectedScenarioData.description }}
            </p>
          </div>
        </div>

        <!-- 场景工具和选项 -->
        <div class="scenario-tools">
          <div class="tools-section">
            <h4 class="tools-title">数据集选择</h4>
            <el-select
              v-model="selectedDataset"
              placeholder="请选择数据集"
              style="width: 100%"
            >
              <el-option
                v-for="dataset in getScenarioDatasets(selectedScenario)"
                :key="dataset.id"
                :label="dataset.name"
                :value="dataset.id"
              />
            </el-select>
          </div>

          <div class="tools-section">
            <h4 class="tools-title">算法选择</h4>
            <el-select
              v-model="selectedAlgorithm"
              placeholder="请选择算法"
              style="width: 100%"
            >
              <el-option
                v-for="algorithm in getScenarioAlgorithms(selectedScenario)"
                :key="algorithm.id"
                :label="algorithm.name"
                :value="algorithm.id"
              />
            </el-select>
          </div>

          <div class="tools-section">
            <el-button type="primary" size="large" @click="startExperiment">
              开始实验
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { ElMessage } from "element-plus";

export default {
  name: "Scenarios",
  setup() {
    const router = useRouter();
    const appStore = useAppStore();

    const selectedScenario = ref(null);
    const selectedDataset = ref(null);
    const selectedAlgorithm = ref(null);

    // 当前选中的场景数据
    const selectedScenarioData = computed(() => {
      if (!selectedScenario.value) return null;
      return appStore.getScenarioById(selectedScenario.value);
    });

    // 选择场景
    const selectScenario = (scenario) => {
      if (scenario.status === "coming-soon") {
        ElMessage.info("该场景即将推出，敬请期待");
        return;
      }
      selectedScenario.value = scenario.id;
      appStore.setCurrentScenario(scenario.id);

      // 重置选择
      selectedDataset.value = null;
      selectedAlgorithm.value = null;
    };

    // 进入场景详情页
    const enterScenario = (scenarioId) => {
      router.push(`/scenarios/${scenarioId}`);
    };

    // 获取场景对应的数据集
    const getScenarioDatasets = (scenarioId) => {
      // 模拟数据，实际应该从API获取
      const datasetsMap = {
        "ai-for-ran": [
          { id: "ping-pong", name: "乒乓切换数据集" },
          { id: "load-balance", name: "负载均衡数据集" },
          { id: "coverage", name: "覆盖优化数据集" },
        ],
        "ran-for-ai": [
          { id: "network-data", name: "网络性能数据集" },
          { id: "user-behavior", name: "用户行为数据集" },
        ],
        "digital-twin": [
          { id: "network-topology", name: "网络拓扑数据集" },
          { id: "traffic-pattern", name: "流量模式数据集" },
        ],
        "data-asset": [
          { id: "asset-inventory", name: "资产清单数据集" },
          { id: "value-assessment", name: "价值评估数据集" },
        ],
      };
      return datasetsMap[scenarioId] || [];
    };

    // 获取场景对应的算法
    const getScenarioAlgorithms = (scenarioId) => {
      // 模拟数据，实际应该从API获取
      const algorithmsMap = {
        "ai-for-ran": [
          { id: "ml-optimization", name: "机器学习优化算法" },
          { id: "deep-learning", name: "深度学习算法" },
          { id: "reinforcement", name: "强化学习算法" },
        ],
        "ran-for-ai": [
          { id: "feature-extraction", name: "特征提取算法" },
          { id: "pattern-recognition", name: "模式识别算法" },
        ],
        "digital-twin": [
          { id: "simulation", name: "仿真建模算法" },
          { id: "prediction", name: "预测算法" },
        ],
        "data-asset": [
          { id: "valuation", name: "数据估值算法" },
          { id: "classification", name: "资产分类算法" },
        ],
      };
      return algorithmsMap[scenarioId] || [];
    };

    // 开始实验
    const startExperiment = () => {
      if (!selectedDataset.value || !selectedAlgorithm.value) {
        ElMessage.warning("请先选择数据集和算法");
        return;
      }

      ElMessage.success("实验已开始，正在跳转到实验环境...");
      // 这里可以跳转到具体的实验页面
      setTimeout(() => {
        enterScenario(selectedScenario.value);
      }, 1000);
    };

    return {
      appStore,
      selectedScenario,
      selectedScenarioData,
      selectedDataset,
      selectedAlgorithm,
      selectScenario,
      enterScenario,
      getScenarioDatasets,
      getScenarioAlgorithms,
      startExperiment,
    };
  },
};
</script>

<style scoped>
.scenarios-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.9;
}

/* 场景选择器 */
.scenario-selector {
  padding: 60px 0;
}

.selector-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.selector-title {
  text-align: center;
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.scenario-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.scenario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.scenario-card.active {
  border-color: var(--primary-color);
  transform: translateY(-4px);
}

.scenario-card.coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
}

.scenario-card.coming-soon:hover {
  transform: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.scenario-icon {
  font-size: 48px;
  color: var(--primary-color);
}

.coming-soon-badge {
  background: var(--warning-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  margin-bottom: 24px;
}

.scenario-name {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: bold;
}

.scenario-title {
  font-size: 18px;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.scenario-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 16px;
}

.scenario-cases {
  margin-top: 16px;
}

.cases-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.cases-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-tag {
  margin: 0;
}

.card-actions {
  text-align: center;
}

/* 场景详情 */
.scenario-detail {
  background: white;
  padding: 60px 0;
  margin-top: 40px;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-light);
}

.detail-icon {
  font-size: 72px;
  color: var(--primary-color);
}

.detail-name {
  font-size: 36px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.detail-title {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.detail-description {
  font-size: 16px;
  color: var(--text-regular);
  line-height: 1.6;
}

/* 场景工具 */
.scenario-tools {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 32px;
  align-items: end;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tools-title {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    text-align: center;
  }

  .scenario-tools {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
