<template>
  <div class="ai-for-ran-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">AI for RAN</h1>
            <p class="page-subtitle">利用人工智能技术优化无线网络性能</p>
            <div class="page-tags">
              <el-tag class="custom-tag">网络优化</el-tag>
              <el-tag class="custom-tag">机器学习</el-tag>
              <el-tag class="custom-tag">实时处理</el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 案例选择区域 -->
    <section class="case-selection">
      <div class="section-container">
        <div class="selection-header">
          <h2 class="section-title">选择应用案例</h2>
          <p class="section-desc">选择不同的网络优化案例进行体验</p>
        </div>

        <div class="cases-grid">
          <div
            v-for="case_item in cases"
            :key="case_item.id"
            class="case-card"
            :class="{ active: selectedCase === case_item.id }"
            @click="selectCase(case_item)"
          >
            <div class="case-header">
              <el-icon class="case-icon"
                ><component :is="case_item.icon"
              /></el-icon>
              <h3 class="case-title">{{ case_item.name }}</h3>
            </div>

            <p class="case-description">{{ case_item.description }}</p>

            <div class="case-metrics">
              <div class="metric-item">
                <span class="metric-label">提升效果</span>
                <span class="metric-value">{{ case_item.improvement }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">复杂度</span>
                <el-rate
                  v-model="case_item.complexity"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </div>
            </div>

            <div class="case-actions">
              <el-button
                type="primary"
                @click.stop="startCase(case_item.id)"
                :disabled="selectedCase !== case_item.id"
              >
                开始调试
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  name: "AIForRAN",
  setup() {
    const router = useRouter();

    // 案例数据
    const cases = ref([
      {
        id: "handover",
        name: "乒乓切换优化",
        description:
          "利用机器学习算法优化小区间的乒乓切换问题，减少不必要的切换次数。",
        icon: "Connection",
        improvement: "↑ 30%",
        complexity: 3,
        route: "/pingpong-switch",
      },
      {
        id: "taskflow",
        name: "多案例链式编排",
        description:
          "可视化任务流编排页面，支持模块化创建数据处理工作流，一键执行获取结果。",
        icon: "Connection",
        improvement: "↑ 50%",
        complexity: 5,
        route: "/task-flow-editor",
      },
      {
        id: "networkagent",
        name: "网优智能助手",
        description:
          "AI驱动的网络优化工具，支持KPI分析、参数调优与Viavi仿真，生成专业优化方案。",
        icon: "Connection",
        improvement: "↑ 50%",
        complexity: 5,
        route: "/network-optimization-agent",
      },
    ]);

    // 状态管理
    const selectedCase = ref(null);

    // 方法
    const selectCase = (case_item) => {
      selectedCase.value = case_item.id;
    };

    const startCase = (caseId) => {
      const selectedCaseData = cases.value.find((c) => c.id === caseId);

      if (selectedCaseData && selectedCase.value === caseId) {
        // ElMessage.success(`正在跳转到 ${selectedCaseData.name}`);

        // 跳转到对应的页面
        router.push(selectedCaseData.route);
      }
    };

    return {
      cases,
      selectedCase,
      selectCase,
      startCase,
    };
  },
};
</script>

<style scoped>
.ai-for-ran-page {
  min-height: 100vh;
  background: #fff;
}

/* 页面头部 */
.page-header {
  position: relative;
  width: 100%;
  height: 320px;
  background: #d9d9d9;
  background-image: url("../../assets/AIForRAN/bg.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

/* 渐变蒙版 */
.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* 右侧main图 */
.page-header::after {
  content: "";
  position: absolute;
  width: 600px;
  height: 400px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-image: url("../../assets/AIForRAN/main.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
}

.header-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.header-content {
  position: absolute;
  width: 640px;
  height: 144px;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 640px;
  height: 144px;
}

.page-title {
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: 0.04em;
  background: linear-gradient(90deg, #263fff 0%, #00e5e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  width: 264px;
  height: 56px;
  display: flex;
  align-items: center;
}

.page-subtitle {
  font-family: "HarmonyOS Sans SC", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: #202939;
  margin: 0;
  width: 640px;
  height: 28px;
  display: flex;
  align-items: center;
}

.page-tags {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 232px;
  height: 28px;
}

.custom-tag {
  background: #f5f8fb !important;
  border: none !important;
  border-radius: 6px !important;
  color: #4a5366 !important;
  font-family: "HarmonyOS Sans SC", sans-serif !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  padding: 4px 8px !important;
  height: 28px !important;
  display: flex !important;
  align-items: center !important;
  width: 72px !important;
  justify-content: center !important;
}

.header-icon {
  display: none; /* 隐藏原来的图标，因为设计中没有 */
}

.scenario-icon {
  font-size: 120px;
  opacity: 0.3;
}

/* 案例选择 */
.case-selection {
  padding: 60px 0;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.selection-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-desc {
  font-size: 16px;
  color: var(--text-secondary);
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.case-card {
  background: #e3e8ef;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.case-card.active {
  border-color: var(--primary-color);
  transform: translateY(-4px);
}

.case-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.case-icon {
  font-size: 32px;
  color: var(--primary-color);
}

.case-title {
  font-size: 20px;
  color: var(--text-primary);
}

.case-description {
  color: #697586;
  line-height: 1.6;
  margin-bottom: 24px;
}

.case-metrics {
  margin-bottom: 24px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  color: #4a5366;
}

.metric-value {
  font-weight: bold;
  color: var(--success-color);
}

.case-actions {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header::after {
    width: 250px;
    height: 250px;
    right: -50px;
  }

  .header-content {
    left: 24px;
    width: calc(100% - 200px);
  }

  .header-info {
    width: 100%;
  }

  .page-title {
    font-size: 32px;
    width: auto;
    height: auto;
  }

  .page-subtitle {
    width: 100%;
    height: auto;
    font-size: 16px;
  }

  .page-tags {
    justify-content: flex-start;
    width: 100%;
    height: auto;
    flex-wrap: wrap;
  }

  .custom-tag {
    width: auto !important;
  }

  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
