<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ appStore.platformInfo.fullName }}
          </h1>
          <p class="hero-subtitle">
            提供高质量数据集、工具库和算法模型<br />
            助力无线AI领域快速开发与创新
          </p>

          <!-- 大的展示区域 -->
          <div class="hero-display">
            <div class="display-content">
              <el-icon class="display-icon"><DataBoard /></el-icon>
              <div class="display-text">
                <h3>开放可信的无线数据存储与发布研究平台</h3>
                <p>
                  向全球科研人员、团队、专业公司、高校及运营商等相关主体提供无线数据服务
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 三大特性 -->
    <section class="features-section">
      <div class="section-container">
        <h2 class="section-title">三大特性</h2>
        <p class="section-subtitle">
          Wi-Dop平台以三⼤特性为基础，为无线数据研究提供全方位支持
        </p>
        <div class="features-grid">
          <div
            v-for="feature in appStore.coreFeatures"
            :key="feature.id"
            class="feature-card"
          >
            <div class="feature-icon">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 四大应用场景 -->
    <section class="application-scenarios">
      <div class="section-container">
        <h2 class="section-title">四大应用场景</h2>
        <p class="section-subtitle">
          支撑运营、维护、优化、规划四大场景的数字化转型
        </p>
        <div class="scenarios-grid">
          <div
            v-for="scenario in appStore.applicationScenarios"
            :key="scenario.id"
            class="scenario-card"
            :style="{ '--card-color': scenario.color }"
          >
            <div class="scenario-content">
              <div class="scenario-header">
                <img
                  :src="scenario.image"
                  :alt="scenario.name"
                  class="scenario-image"
                />
                <h3 class="scenario-name">{{ scenario.name }}</h3>
              </div>
              <h4 class="scenario-title">{{ scenario.title }}</h4>
              <p class="scenario-desc">{{ scenario.description }}</p>
            </div>
            <div class="scenario-action">
              <el-button type="primary" plain size="small">
                了解更多
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台五大核心能力 -->
    <section class="capabilities-section">
      <div class="section-container">
        <h2 class="section-title">平台五大核心能力</h2>
        <p class="section-subtitle">Wi-Dop平台构建了完整的无线数据能力体系</p>
        <div class="capabilities-grid">
          <div
            v-for="capability in appStore.capabilities"
            :key="capability.id"
            class="capability-card"
          >
            <div
              class="capability-icon"
              :style="{ backgroundColor: capability.color }"
            >
              <img
                :src="capability.image"
                :alt="capability.name"
                class="scenario-image"
              />
            </div>
            <h3 class="capability-title">{{ capability.title }}</h3>
            <p class="capability-desc">{{ capability.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台核心理念 -->
    <section class="concept-section">
      <div class="section-container">
        <div class="concept-content">
          <h2 class="concept-title">{{ appStore.platformInfo.slogan }}</h2>
          <div class="concept-grid">
            <div class="concept-item">
              <span class="concept-number">1</span>
              <span class="concept-text">一站聚合</span>
            </div>
            <div class="concept-item">
              <span class="concept-number">2</span>
              <span class="concept-text">双擎智变</span>
            </div>
            <div class="concept-item">
              <span class="concept-number">3</span>
              <span class="concept-text">三性护航</span>
            </div>
            <div class="concept-item">
              <span class="concept-number">4</span>
              <span class="concept-text">四景落地</span>
            </div>
            <div class="concept-item">
              <span class="concept-number">5</span>
              <span class="concept-text">五维进化</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAppStore } from "@/stores/app";

export default {
  name: "Home",
  setup() {
    const appStore = useAppStore();

    return {
      appStore,
    };
  },
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-display {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.display-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.display-icon {
  font-size: 64px;
  color: #ffffff;
}

.display-text h3 {
  font-size: 24px;
  margin-bottom: 12px;
}

.display-text p {
  font-size: 16px;
  opacity: 0.9;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: #f8fafe;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  text-align: center;
  font-size: 36px;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  margin-bottom: 24px;
}

.feature-icon .el-icon {
  font-size: 48px;
  color: var(--primary-color);
}

.feature-title {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.feature-desc {
  color: var(--text-regular);
  line-height: 1.6;
}

/* 四大应用场景 */
.application-scenarios {
  padding: 60px 0;
  background: white;
}

.section-subtitle {
  text-align: center;
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.scenario-card {
  background: white;
  padding: 24px 20px;
  border-radius: 16px;
  border: 2px solid #f0f2f5;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.scenario-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
}

.scenario-card:hover {
  border-color: var(--card-color);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.scenario-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.scenario-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--card-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.scenario-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.scenario-card:hover .scenario-icon {
  transform: scale(1.1);
}

.scenario-content {
  flex: 1;
}

.scenario-name {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0;
  font-weight: bold;
}

.scenario-title {
  font-size: 14px;
  color: var(--card-color);
  margin-bottom: 12px;
  font-weight: 600;
  text-align: center;
}

.scenario-desc {
  color: var(--text-regular);
  line-height: 1.5;
  margin-bottom: 0;
  font-size: 14px;
  text-align: center;
}

.scenario-action {
  text-align: center;
  margin-top: 20px;
}

.scenario-card .el-button {
  border-color: var(--card-color);
  color: var(--card-color);
}

.scenario-card .el-button:hover {
  background: var(--card-color);
  border-color: var(--card-color);
  color: white;
}

/* 平台五大核心能力 */
.capabilities-section {
  padding: 80px 0;
  background: #f8fafe;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.capability-card {
  background: white;
  padding: 45px 20px;
  border-radius: 16px;
  border: 2px solid #f0f2f5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.capability-card:hover {
  transform: translateY(-8px);
}

.capability-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: transform 0.3s ease;
}

.capability-icon .el-icon {
  font-size: 32px;
  color: white;
}

.capability-card:hover .capability-icon {
  transform: scale(1.1);
}

.capability-title {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 600;
}

.capability-desc {
  color: var(--text-regular);
  line-height: 1.5;
  font-size: 14px;
}

/* Modules Section */
.modules-section {
  padding: 80px 0;
  background: #f8fafe;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 48px;
}

.module-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.module-icon {
  margin-bottom: 24px;
}

.icon-large {
  font-size: 64px;
  color: var(--primary-color);
}

.module-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.module-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 32px;
}

.module-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.data-visualization {
  background: #f8fafe;
  border-radius: 8px;
  padding: 32px;
  border: 2px dashed #d4d7de;
}

.viz-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.viz-placeholder .el-icon {
  font-size: 48px;
}

/* Concept Section */
.concept-section {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 80px 0;
}

.concept-title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 48px;
}

.concept-grid {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.concept-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.concept-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.concept-text {
  font-size: 18px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .display-content {
    flex-direction: column;
    text-align: center;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .module-actions {
    flex-direction: column;
  }

  .concept-grid {
    gap: 24px;
  }

  .scenarios-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .capabilities-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .scenarios-grid {
    grid-template-columns: 1fr;
  }

  .capabilities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
