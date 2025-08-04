/* eslint-disable */
<template>
  <div class="scenarios-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="header-content">
          <h1 ref="pageTitle" class="page-title animate-fade-up">应用场景</h1>
          <p ref="pageSubtitle" class="page-subtitle animate-fade-up">
            支撑运营、维护、优化、规划四大场景的数字化转型
          </p>
        </div>
      </div>
    </section>

    <!-- 场景选择器 -->
    <section class="scenario-selector">
      <div class="selector-container">
        <h2 ref="selectorTitle" class="selector-title animate-fade-up">
          选择应用场景
        </h2>
        <div class="scenarios-grid">
          <div
            v-for="scenario in appStore.scenarios"
            :key="scenario.id"
            class="scenario-card"
            :class="{
              active: selectedScenario === scenario.id,
              'coming-soon': scenario.status === 'coming-soon',
            }"
          >
            <!-- 即将推出徽章 -->
            <div
              v-if="scenario.status === 'coming-soon'"
              class="coming-soon-badge"
            >
              即将推出
            </div>

            <div class="card-content">
              <div class="scenario-info">
                <div class="scenario-name-container">
                  <h3 class="scenario-name">{{ scenario.name }}</h3>
                </div>
                <h4 class="scenario-title">{{ scenario.description }}</h4>
              </div>

              <!-- 案例列表 - 只在非即将推出状态显示 -->
              <div
                v-if="
                  scenario.cases &&
                  scenario.cases.length &&
                  scenario.status !== 'coming-soon'
                "
                class="scenario-cases"
              >
                <div class="cases-label">应用案例：</div>
                <div class="cases-list">
                  <div
                    v-for="case_item in scenario.cases"
                    :key="case_item"
                    class="case-tag"
                  >
                    {{ case_item }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 使用 button 替代 div -->
            <button
              class="card-action-button"
              :class="{
                primary: scenario.status !== 'coming-soon',
                disabled: scenario.status === 'coming-soon',
              }"
              @click="handleCardAction(scenario)"
              :disabled="scenario.status === 'coming-soon'"
            >
              <div class="button-content">
                <span>{{
                  scenario.status === "coming-soon" ? "敬请期待" : "进入场景"
                }}</span>
                <div
                  class="arrow-icon"
                  :class="{ disabled: scenario.status === 'coming-soon' }"
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
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

    // 动画相关的refs - 只针对头部和标题
    const pageTitle = ref(null);
    const pageSubtitle = ref(null);
    const selectorTitle = ref(null);

    // Intersection Observer - 只观察头部和标题元素
    let observer = null;

    const createObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;

              // 为不同类型的元素添加不同的动画延迟
              if (element === pageTitle.value) {
                // 页面标题立即显示
                setTimeout(() => {
                  element.classList.add("animate-visible");
                }, 100);
              } else if (element === pageSubtitle.value) {
                // 副标题稍微延迟
                setTimeout(() => {
                  element.classList.add("animate-visible");
                }, 200);
              } else if (element === selectorTitle.value) {
                // 选择器标题延迟更多
                setTimeout(() => {
                  element.classList.add("animate-visible");
                }, 100);
              }

              // 停止观察已经显示的元素
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
      // 只观察头部和标题元素
      if (pageTitle.value) observer.observe(pageTitle.value);
      if (pageSubtitle.value) observer.observe(pageSubtitle.value);
      if (selectorTitle.value) observer.observe(selectorTitle.value);

      // 手动检查已经在视窗内的元素
      setTimeout(() => {
        const elements = [
          pageTitle.value,
          pageSubtitle.value,
          selectorTitle.value,
        ].filter(Boolean);
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
            // 强制触发动画
            if (element === pageTitle.value) {
              setTimeout(() => element.classList.add("animate-visible"), 100);
            } else if (element === pageSubtitle.value) {
              setTimeout(() => element.classList.add("animate-visible"), 200);
            } else if (element === selectorTitle.value) {
              setTimeout(() => element.classList.add("animate-visible"), 100);
            }
          }
        });
      }, 300);
    };

    onMounted(() => {
      createObserver();
      // 延迟一点观察，确保DOM完全渲染
      setTimeout(() => {
        observeElements();
      }, 100);

      // 应急方案：如果5秒后还有元素没有显示，强制显示所有元素
      setTimeout(() => {
        const elements = [
          pageTitle.value,
          pageSubtitle.value,
          selectorTitle.value,
        ].filter(Boolean);
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

    // 场景ID到路由路径的映射
    const scenarioRouteMap = {
      "ai-for-ran": "/scenarios/ai-for-ran",
      "ran-for-ai": "/scenarios/ran-for-ai",
      "digital-twin": "/scenarios/digital-twin",
      "data-asset": "/scenarios/data-asset",
    };

    // 处理按钮点击 - 直接跳转到对应页面
    const handleCardAction = (scenario) => {
      if (scenario.status === "coming-soon") {
        ElMessage.info("该场景即将推出，敬请期待");
        return;
      }
      // 直接调用路由跳转
      enterScenario(scenario.id);
    };

    // 进入场景详情页
    const enterScenario = (scenarioId) => {
      console.log("准备跳转到场景:", scenarioId); // 调试日志

      const routePath = scenarioRouteMap[scenarioId];
      if (routePath) {
        console.log("跳转路径:", routePath); // 调试日志
        router.push(routePath);
      } else {
        console.log("使用默认路径:", `/scenarios/${scenarioId}`); // 调试日志
        // 如果没有找到对应的路由，回退到原来的逻辑
        router.push(`/scenarios/${scenarioId}`);
      }
    };

    return {
      appStore,
      selectedScenario,
      selectScenario,
      enterScenario,
      handleCardAction,
      pageTitle,
      pageSubtitle,
      selectorTitle,
    };
  },
};
</script>

<style scoped>
/* 动画相关样式 - 只针对头部和标题 */
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-fade-up.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.scenarios-page {
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
  width: 200px;
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

/* 场景选择器 */
.scenario-selector {
  padding: 60px 0;
  background: #f5f8fb;
  position: relative;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.scenario-card {
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

.scenario-card::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  right: -20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0;
}

/* 可点击卡片的图片位置 - 调整以避免与内容重叠 */
.scenario-card:not(.coming-soon)::before {
  top: 160px;
  right: -24px;
}

/* 即将推出卡片的图片位置 */
.scenario-card.coming-soon::before {
  top: 160px;
  right: -24px;
}

/* 为不同场景添加特定的背景图片 */
.scenario-card:nth-child(1)::before {
  background-image: url("../assets/scenarios/scene1.png");
}

.scenario-card:nth-child(2)::before {
  background-image: url("../assets/scenarios/scene2.png");
}

.scenario-card:nth-child(3)::before {
  background-image: url("../assets/scenarios/scene3.png");
}

.scenario-card:nth-child(4)::before {
  background-image: url("../assets/scenarios/scene4.png");
}

.scenario-card > * {
  position: relative;
  z-index: 1;
}

.scenario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.scenario-card.active {
  border-color: var(--primary-color);
  transform: translateY(-20px);
}

/* 即将推出徽章 */
.coming-soon-badge {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  gap: 10px;
  width: 88px;
  height: 32px;
  background: #9aa4b2;
  border-radius: 0px 16px;
  z-index: 1;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
}

/* 正常状态的卡片内容 */
.scenario-card:not(.coming-soon) .card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;
  width: 354px;
  height: 300px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  z-index: 0; /* 降低层级，避免遮挡按钮 */
}

/* 即将推出状态的卡片内容 */
.scenario-card.coming-soon .card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  gap: 40px;
  width: 354px;
  height: 264px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  z-index: 0; /* 降低层级，避免遮挡按钮 */
}

/* 正常状态的信息区域 */
.scenario-card:not(.coming-soon) .scenario-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 233px;
  height: 80px;
}

/* 即将推出状态的信息区域 */
.scenario-card.coming-soon .scenario-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 354px;
  height: 104px;
}

.scenario-name-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  width: 160px;
  height: 64px;
}

/* 正常状态的标题 */
.scenario-card:not(.coming-soon) .scenario-name {
  width: 160px;
  height: 64px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
}

/* 即将推出状态的标题 */
.scenario-card.coming-soon .scenario-name {
  width: 160px;
  height: 64px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #697586;
  margin: 0;
}

/* 正常状态的副标题 */
.scenario-card:not(.coming-soon) .scenario-title {
  width: 233px;
  height: 24px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #697586;
  margin: 0;
}

/* 即将推出状态的副标题 */
.scenario-card.coming-soon .scenario-title {
  width: 251px;
  height: 24px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #697586;
  margin: 0;
}

.scenario-cases {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  width: 228px;
  height: 64px;
}

.cases-label {
  width: 228px;
  height: 28px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #202939;
  margin: 0;
}

.cases-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 222px;
  height: 28px;
}

.case-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  background: rgba(38, 63, 255, 0.1);
  border-radius: 6px;
  font-family: "HarmonyOS Sans SC", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #263fff;
  height: 28px;
}

/* 卡片动作按钮样式 */
.card-action-button {
  position: absolute;
  left: 25px;
  bottom: 120px;
  z-index: 2; /* 提高层级，确保在内容之上 */
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

/* 主要按钮样式 */
.card-action-button.primary {
  background: #263fff;
  pointer-events: auto; /* 确保按钮可以接收鼠标事件 */
}

.card-action-button.primary:hover {
  background: #1a2ecc;
}

.card-action-button.primary:disabled {
  background: #263fff;
  cursor: not-allowed;
}

/* 禁用按钮样式 */
.card-action-button.disabled {
  background: transparent;
  border: 1px solid #697586;
  cursor: not-allowed;
  pointer-events: auto; /* 确保禁用按钮也能接收事件（用于显示提示） */
}

.card-action-button.disabled:disabled {
  opacity: 1;
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

.card-action-button.disabled span {
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
  color: #697586;
}

/* 箭头图标 - 使用Unicode符号 */
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

.arrow-icon.disabled::before {
  color: #697586;
}

.ml-2 {
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .scenarios-grid {
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

  .scenarios-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .scenario-card {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }

  .scenario-card:not(.coming-soon)::before {
    width: 200px;
    height: 200px;
    right: -30px;
    top: 180px;
  }

  .scenario-card.coming-soon::before {
    width: 200px;
    height: 200px;
    right: -30px;
    bottom: -30px;
  }

  .card-action-button {
    left: 20px;
    bottom: 30px;
  }
}
</style>
