/* eslint-disable */
<template>
  <div class="capabilities-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <h1 class="page-title">五大核心能力</h1>
        <p class="page-subtitle">
          链式展示平台核心能力，实现网络智慧能力的持续进化
        </p>
      </div>
    </section>

    <!-- 能力流程图 -->
    <section class="capabilities-flow">
      <div class="flow-container">
        <div class="flow-steps">
          <div
            v-for="(capability, index) in appStore.capabilities"
            :key="capability.id"
            class="flow-step"
            :class="{ active: activeStep === index }"
            @click="setActiveStep(index)"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ capability.name }}</h3>
              <p class="step-desc">{{ capability.title }}</p>
            </div>

            <!-- 连接线 -->
            <div
              v-if="index < appStore.capabilities.length - 1"
              class="step-connector"
            >
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 能力详情展示 -->
    <section class="capability-detail">
      <div class="detail-container">
        <transition name="slide" mode="out-in">
          <div :key="activeStep" class="detail-content">
            <div class="detail-left">
              <div
                class="detail-icon"
                :style="{ color: currentCapability.color }"
              >
                <el-icon><component :is="currentCapability.icon" /></el-icon>
              </div>
              <h2 class="detail-title">{{ currentCapability.name }}</h2>
              <h3 class="detail-subtitle">{{ currentCapability.title }}</h3>
              <p class="detail-description">
                {{ currentCapability.description }}
              </p>

              <!-- 能力特点 -->
              <div class="capability-features">
                <div
                  class="feature-item"
                  v-for="feature in getCapabilityFeatures(currentCapability.id)"
                  :key="feature"
                >
                  <el-icon class="feature-icon"><Check /></el-icon>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <div class="detail-actions">
                <el-button type="primary" size="large"> 立即体验 </el-button>
                <el-button type="default" size="large"> 了解更多 </el-button>
              </div>
            </div>

            <div class="detail-right">
              <div class="capability-visualization">
                <component
                  :is="getVisualizationComponent(currentCapability.id)"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- 能力导航 -->
    <section class="capability-navigation">
      <div class="nav-container">
        <div class="nav-buttons">
          <el-button
            v-for="(capability, index) in appStore.capabilities"
            :key="capability.id"
            :type="activeStep === index ? 'primary' : 'default'"
            @click="setActiveStep(index)"
          >
            {{ capability.name }}
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/app";
import UniversalityViz from "@/components/visualizations/UniversalityViz.vue";
import IncubationViz from "@/components/visualizations/IncubationViz.vue";
import ProcessingViz from "@/components/visualizations/ProcessingViz.vue";
import ValidationViz from "@/components/visualizations/ValidationViz.vue";
import EcosystemViz from "@/components/visualizations/EcosystemViz.vue";

export default {
  name: "Capabilities",
  components: {
    UniversalityViz,
    IncubationViz,
    ProcessingViz,
    ValidationViz,
    EcosystemViz,
  },
  setup() {
    const appStore = useAppStore();
    const activeStep = ref(0);

    // 当前激活的能力
    const currentCapability = computed(() => {
      return appStore.capabilities[activeStep.value];
    });

    // 设置激活步骤
    const setActiveStep = (index) => {
      activeStep.value = index;
    };

    // 获取能力特点
    const getCapabilityFeatures = (capabilityId) => {
      const featuresMap = {
        universality: [
          "支持多种数据源格式",
          "统一数据规范标准",
          "智能数据转换",
          "跨平台兼容性",
        ],
        incubation: [
          "智能数据分类",
          "自动数据增强",
          "精准数据筛选",
          "质量评估体系",
        ],
        processing: [
          "丰富的处理工具",
          "可视化操作界面",
          "批量处理能力",
          "工具链编排",
        ],
        validation: [
          "多维度评估指标",
          "模型性能验证",
          "数据质量检测",
          "场景适配评估",
        ],
        ecosystem: [
          "开放数据贡献",
          "社区协作机制",
          "版本管理系统",
          "激励奖励机制",
        ],
      };
      return featuresMap[capabilityId] || [];
    };

    // 获取可视化组件
    const getVisualizationComponent = (capabilityId) => {
      const componentMap = {
        universality: "UniversalityViz",
        incubation: "IncubationViz",
        processing: "ProcessingViz",
        validation: "ValidationViz",
        ecosystem: "EcosystemViz",
      };
      return componentMap[capabilityId] || "UniversalityViz";
    };

    return {
      appStore,
      activeStep,
      currentCapability,
      setActiveStep,
      getCapabilityFeatures,
      getVisualizationComponent,
    };
  },
};
</script>

<style scoped>
.capabilities-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* 能力流程图 */
.capabilities-flow {
  padding: 60px 0;
  background: white;
}

.flow-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.flow-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px;
  border-radius: 12px;
  position: relative;
}

.flow-step:hover,
.flow-step.active {
  background: #f0f8ff;
  transform: translateY(-4px);
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.flow-step.active .step-number {
  background: var(--success-color);
  transform: scale(1.1);
}

.step-content {
  text-align: center;
  max-width: 180px;
}

.step-title {
  font-size: 18px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.step-connector {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 24px;
}

/* 能力详情 */
.capability-detail {
  padding: 80px 0;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.detail-left {
  padding: 40px;
}

.detail-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.detail-title {
  font-size: 36px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.detail-subtitle {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.detail-description {
  font-size: 16px;
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 32px;
}

.capability-features {
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 16px;
  color: var(--text-regular);
}

.feature-icon {
  color: var(--success-color);
  font-size: 18px;
}

.detail-actions {
  display: flex;
  gap: 16px;
}

.detail-right {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.capability-visualization {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 能力导航 */
.capability-navigation {
  background: white;
  padding: 40px 0;
  border-top: 1px solid var(--border-light);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .flow-steps {
    flex-direction: column;
    gap: 20px;
  }

  .step-connector {
    display: none;
  }

  .detail-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .detail-actions {
    flex-direction: column;
  }
}
</style>
