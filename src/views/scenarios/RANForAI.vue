<template>
  <div class="ran-for-ai-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/scenarios">应用场景</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>RAN for AI</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">RAN for AI</h1>
            <p class="page-subtitle">利用无线网络数据助力AI模型训练和优化</p>
            <div class="coming-soon-badge">
              <el-icon><Clock /></el-icon>
              <span>即将推出</span>
            </div>
          </div>

          <div class="header-icon">
            <el-icon class="scenario-icon"><DataBoard /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能介绍 -->
    <section class="feature-preview">
      <div class="section-container">
        <h2 class="section-title">功能预览</h2>

        <div class="features-grid">
          <div class="feature-item">
            <el-icon class="feature-icon"><TrendCharts /></el-icon>
            <h3 class="feature-title">网络数据特征提取</h3>
            <p class="feature-desc">
              从无线网络运行数据中提取有价值的特征，为AI模型提供高质量输入
            </p>
          </div>

          <div class="feature-item">
            <el-icon class="feature-icon"><Connection /></el-icon>
            <h3 class="feature-title">网络状态预测</h3>
            <p class="feature-desc">
              利用历史网络数据训练预测模型，实现网络性能和故障的提前预警
            </p>
          </div>

          <div class="feature-item">
            <el-icon class="feature-icon"><DataAnalysis /></el-icon>
            <h3 class="feature-title">用户行为分析</h3>
            <p class="feature-desc">
              分析用户网络使用模式，为个性化服务和资源配置提供决策支持
            </p>
          </div>

          <div class="feature-item">
            <el-icon class="feature-icon"><Monitor /></el-icon>
            <h3 class="feature-title">智能运维辅助</h3>
            <p class="feature-desc">
              结合网络数据和AI技术，实现智能化网络运维和自动化问题解决
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术架构 -->
    <section class="architecture-section">
      <div class="section-container">
        <h2 class="section-title">技术架构</h2>

        <div class="architecture-diagram">
          <div class="arch-layer">
            <h4>数据采集层</h4>
            <div class="layer-items">
              <span>基站数据</span>
              <span>用户数据</span>
              <span>网络性能</span>
            </div>
          </div>

          <div class="arch-arrow">
            <el-icon><ArrowDown /></el-icon>
          </div>

          <div class="arch-layer">
            <h4>数据处理层</h4>
            <div class="layer-items">
              <span>数据清洗</span>
              <span>特征工程</span>
              <span>数据标注</span>
            </div>
          </div>

          <div class="arch-arrow">
            <el-icon><ArrowDown /></el-icon>
          </div>

          <div class="arch-layer">
            <h4>AI模型层</h4>
            <div class="layer-items">
              <span>预测模型</span>
              <span>分类模型</span>
              <span>优化模型</span>
            </div>
          </div>

          <div class="arch-arrow">
            <el-icon><ArrowDown /></el-icon>
          </div>

          <div class="arch-layer">
            <h4>应用服务层</h4>
            <div class="layer-items">
              <span>智能决策</span>
              <span>自动优化</span>
              <span>预警服务</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 订阅通知 -->
    <section class="subscribe-section">
      <div class="section-container">
        <div class="subscribe-card">
          <el-icon class="subscribe-icon"><Bell /></el-icon>
          <h3 class="subscribe-title">获取最新进展</h3>
          <p class="subscribe-desc">
            订阅我们的邮件列表，第一时间了解 RAN for AI 功能上线信息
          </p>

          <div class="subscribe-form">
            <el-input
              v-model="email"
              placeholder="请输入您的邮箱地址"
              style="width: 300px; margin-right: 16px"
            />
            <el-button type="primary" @click="subscribe">订阅通知</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "RANForAI",
  setup() {
    const email = ref("");

    const subscribe = () => {
      if (!email.value) {
        ElMessage.warning("请输入邮箱地址");
        return;
      }

      ElMessage.success("订阅成功！我们会在功能上线时第一时间通知您");
      email.value = "";
    };

    return {
      email,
      subscribe,
    };
  },
};
</script>

<style scoped>
.ran-for-ai-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
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

.coming-soon-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.scenario-icon {
  font-size: 120px;
  opacity: 0.3;
}

/* 功能预览 */
.feature-preview {
  padding: 60px 0;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-item {
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.feature-title {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.feature-desc {
  color: var(--text-regular);
  line-height: 1.6;
}

/* 技术架构 */
.architecture-section {
  background: white;
  padding: 60px 0;
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.arch-layer {
  background: #f8fafe;
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  text-align: center;
}

.arch-layer h4 {
  color: var(--primary-color);
  margin-bottom: 16px;
  font-size: 18px;
}

.layer-items {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 12px;
}

.layer-items span {
  background: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-regular);
}

.arch-arrow {
  font-size: 24px;
  color: var(--primary-color);
}

/* 订阅通知 */
.subscribe-section {
  padding: 60px 0;
}

.subscribe-card {
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.subscribe-icon {
  font-size: 64px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.subscribe-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.subscribe-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 32px;
}

.subscribe-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
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

  .features-grid {
    grid-template-columns: 1fr;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .subscribe-form .el-input {
    width: 100% !important;
  }
}
</style>
