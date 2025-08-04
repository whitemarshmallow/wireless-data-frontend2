<template>
  <div class="digital-twin-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/scenarios">应用场景</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>数字孪生</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">数字孪生</h1>
            <p class="page-subtitle">
              构建无线网络的数字化镜像，实现虚实融合的智能运维
            </p>
            <div class="coming-soon-badge">
              <el-icon><Clock /></el-icon>
              <span>即将推出</span>
            </div>
          </div>

          <div class="header-icon">
            <el-icon class="scenario-icon"><Monitor /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 概念介绍 -->
    <section class="concept-section">
      <div class="section-container">
        <div class="concept-content">
          <div class="concept-text">
            <h2 class="concept-title">什么是无线网络数字孪生？</h2>
            <p class="concept-desc">
              无线网络数字孪生是通过数字化手段，在虚拟空间中构建与物理无线网络完全对应的数字化模型。
              它能够实时反映物理网络的状态、行为和性能，并支持对网络进行仿真、分析、预测和优化。
            </p>

            <div class="concept-features">
              <div class="concept-feature">
                <el-icon class="feature-icon"><Connection /></el-icon>
                <div class="feature-content">
                  <h4>实时映射</h4>
                  <p>物理网络与数字模型实时同步，确保数据的准确性和时效性</p>
                </div>
              </div>

              <div class="concept-feature">
                <el-icon class="feature-icon"><View /></el-icon>
                <div class="feature-content">
                  <h4>可视化展示</h4>
                  <p>以3D可视化方式展示网络拓扑、覆盖范围和性能指标</p>
                </div>
              </div>

              <div class="concept-feature">
                <el-icon class="feature-icon"><TrendCharts /></el-icon>
                <div class="feature-content">
                  <h4>智能分析</h4>
                  <p>基于AI算法进行网络性能分析、故障诊断和容量规划</p>
                </div>
              </div>
            </div>
          </div>

          <div class="concept-visual">
            <div class="twin-diagram">
              <div class="physical-world">
                <h4>物理世界</h4>
                <div class="world-content">
                  <el-icon class="world-icon"><OfficeBuilding /></el-icon>
                  <span>真实无线网络</span>
                </div>
              </div>

              <div class="data-flow">
                <div class="flow-line">
                  <el-icon><ArrowRight /></el-icon>
                  <span>数据采集</span>
                </div>
                <div class="flow-line reverse">
                  <el-icon><ArrowLeft /></el-icon>
                  <span>控制反馈</span>
                </div>
              </div>

              <div class="digital-world">
                <h4>数字世界</h4>
                <div class="world-content">
                  <el-icon class="world-icon"><Monitor /></el-icon>
                  <span>数字孪生模型</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用场景 -->
    <section class="applications-section">
      <div class="section-container">
        <h2 class="section-title">应用场景</h2>

        <div class="applications-grid">
          <div class="app-card">
            <el-icon class="app-icon"><Setting /></el-icon>
            <h3 class="app-title">网络规划设计</h3>
            <p class="app-desc">
              在虚拟环境中进行网络规划和站址优化，降低建设成本和风险
            </p>
            <div class="app-benefits">
              <span class="benefit-tag">成本降低30%</span>
              <span class="benefit-tag">效率提升50%</span>
            </div>
          </div>

          <div class="app-card">
            <el-icon class="app-icon"><Tools /></el-icon>
            <h3 class="app-title">运维管理</h3>
            <p class="app-desc">通过数字孪生模型实现预防性维护和智能故障诊断</p>
            <div class="app-benefits">
              <span class="benefit-tag">故障预测95%</span>
              <span class="benefit-tag">维护效率40%</span>
            </div>
          </div>

          <div class="app-card">
            <el-icon class="app-icon"><TrendCharts /></el-icon>
            <h3 class="app-title">性能优化</h3>
            <p class="app-desc">基于数字孪生进行网络参数调优和性能提升验证</p>
            <div class="app-benefits">
              <span class="benefit-tag">性能提升25%</span>
              <span class="benefit-tag">用户满意度90%</span>
            </div>
          </div>

          <div class="app-card">
            <el-icon class="app-icon"><DataAnalysis /></el-icon>
            <h3 class="app-title">容量规划</h3>
            <p class="app-desc">预测网络容量需求，指导网络扩容和投资决策</p>
            <div class="app-benefits">
              <span class="benefit-tag">预测准确率85%</span>
              <span class="benefit-tag">投资回报35%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术特色 -->
    <section class="tech-features-section">
      <div class="section-container">
        <h2 class="section-title">技术特色</h2>

        <div class="tech-timeline">
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>高精度建模</h4>
              <p>基于真实网络数据构建高精度的数字化模型，误差控制在5%以内</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>实时同步</h4>
              <p>毫秒级的数据同步能力，确保数字孪生与物理网络的实时对应</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>AI驱动</h4>
              <p>集成机器学习算法，实现智能化的分析、预测和决策支持</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>云端部署</h4>
              <p>支持云原生架构，具备弹性扩展和高可用性保障</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 预约演示 -->
    <section class="demo-section">
      <div class="section-container">
        <div class="demo-card">
          <el-icon class="demo-icon"><VideoPlay /></el-icon>
          <h3 class="demo-title">预约产品演示</h3>
          <p class="demo-desc">
            我们的技术专家将为您详细演示数字孪生平台的核心功能和应用价值
          </p>

          <el-form :model="demoForm" class="demo-form" label-width="100px">
            <el-form-item label="姓名">
              <el-input v-model="demoForm.name" placeholder="请输入您的姓名" />
            </el-form-item>
            <el-form-item label="公司">
              <el-input
                v-model="demoForm.company"
                placeholder="请输入公司名称"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="demoForm.email" placeholder="请输入邮箱地址" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="demoForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitDemo">预约演示</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "DigitalTwin",
  setup() {
    const demoForm = reactive({
      name: "",
      company: "",
      email: "",
      phone: "",
    });

    const submitDemo = () => {
      if (!demoForm.name || !demoForm.email) {
        ElMessage.warning("请填写必要信息");
        return;
      }

      ElMessage.success("预约成功！我们会在24小时内与您联系");
      Object.keys(demoForm).forEach((key) => {
        demoForm[key] = "";
      });
    };

    return {
      demoForm,
      submitDemo,
    };
  },
};
</script>

<style scoped>
.digital-twin-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
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

/* 概念介绍 */
.concept-section {
  padding: 60px 0;
  background: white;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.concept-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.concept-title {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.concept-desc {
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 40px;
}

.concept-features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.concept-feature {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.feature-content h4 {
  color: var(--text-primary);
  margin-bottom: 4px;
}

.feature-content p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 孪生图示 */
.twin-diagram {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 40px;
  background: #f8fafe;
  border-radius: 16px;
}

.physical-world,
.digital-world {
  flex: 1;
  text-align: center;
}

.physical-world h4,
.digital-world h4 {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 18px;
}

.world-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.world-icon {
  font-size: 48px;
  color: var(--primary-color);
}

.data-flow {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flow-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-size: 14px;
}

.flow-line.reverse {
  flex-direction: row-reverse;
}

/* 应用场景 */
.applications-section {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.app-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.app-card:hover {
  transform: translateY(-4px);
}

.app-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.app-title {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.app-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 20px;
}

.app-benefits {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.benefit-tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 技术特色 */
.tech-features-section {
  background: white;
  padding: 60px 0;
}

.tech-timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.tech-timeline::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary-color);
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  position: relative;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  position: relative;
  z-index: 1;
}

.timeline-content {
  flex: 1;
  background: #f8fafe;
  padding: 24px;
  border-radius: 12px;
}

.timeline-content h4 {
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 18px;
}

.timeline-content p {
  color: var(--text-regular);
  line-height: 1.6;
}

/* 预约演示 */
.demo-section {
  padding: 60px 0;
}

.demo-card {
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.demo-icon {
  font-size: 64px;
  color: var(--primary-color);
  margin-bottom: 24px;
}

.demo-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.demo-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 32px;
}

.demo-form {
  text-align: left;
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

  .concept-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .twin-diagram {
    flex-direction: column;
    gap: 20px;
  }

  .applications-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    flex-direction: column;
    text-align: center;
  }

  .tech-timeline::before {
    display: none;
  }
}
</style>
