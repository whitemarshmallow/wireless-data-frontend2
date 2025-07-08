<template>
  <div class="ai-for-ran-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/scenarios">应用场景</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>AI for RAN</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">AI for RAN</h1>
            <p class="page-subtitle">利用人工智能技术优化无线网络性能</p>
            <div class="page-tags">
              <el-tag type="success">网络优化</el-tag>
              <el-tag type="primary">机器学习</el-tag>
              <el-tag type="warning">实时处理</el-tag>
            </div>
          </div>

          <div class="header-icon">
            <el-icon class="scenario-icon"><Cpu /></el-icon>
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
                开始体验
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
          "利用机器学习算法优化小区间的乒乓切换问题，减少不必要的切换次数",
        icon: "Connection",
        improvement: "30%",
        complexity: 3,
        route: "/pingpong-switch", // 对应的路由
      },
      {
        id: "taskflow",
        name: "多案例链式编排",
        description:
          "可视化任务流编排页面，支持模块化创建数据处理工作流，一键执行获取结果。",
        icon: "Connection",
        improvement: "60%",
        complexity: 6,
        route: "/task-flow-editor", // 对应的路由
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
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0 60px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.page-tags {
  display: flex;
  gap: 12px;
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
  background: white;
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
  color: var(--text-regular);
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
  color: var(--text-secondary);
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
  .page-title {
    font-size: 32px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
