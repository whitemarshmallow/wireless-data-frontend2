<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background-container">
        <!-- 背景矩形 -->
        <div class="hero-background-rect"></div>
        <!-- 背景图片 -->
        <div class="hero-background-image"></div>
        <!-- 渐变覆盖层 -->
        <div class="hero-gradient-overlay"></div>
      </div>

      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-left">
            <!-- 主标题组 -->
            <div
              class="hero-main-titles animate-on-scroll"
              ref="heroMainTitles"
            >
              <h1 class="hero-title animate-slide-right">无线数据一站式平台</h1>
              <p class="hero-subtitle animate-slide-right-delay">
                提供高质量数据集成、工具库和算法模型，助力无线AI领域快速开发与创新
              </p>
            </div>

            <!-- 副标题组 -->
            <div class="hero-info-card animate-on-scroll" ref="heroSubTitles">
              <div class="card-line animate-line-expand"></div>
              <div class="card-content animate-content-up">
                <h3 class="animate-text-fade">
                  开放可信的无线数据存储与发布研究平台
                </h3>
                <p class="animate-text-fade-delay">
                  向全球科研人员、团队、专业公司、高校及运营商等相关主体提供无线数据服务
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 向下滚动按钮 -->
        <div class="scroll-down-btn" @click="scrollToFeatures">
          <svg class="arrow-down" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10L12 15L17 10"
              stroke="#263FFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- 三大特性 -->
    <section class="features-section">
      <div class="features-container">
        <div class="features-wrapper">
          <!-- 标题区域 -->
          <div class="features-header">
            <h2
              class="features-title animate-on-scroll animate-zoom-in"
              ref="featuresTitle"
            >
              三大特性
            </h2>
            <p
              class="features-subtitle animate-on-scroll animate-slide-up"
              ref="featuresSubtitle"
            >
              向全球科研人员、团队、专业公司、高校及运营商等相关主体提供无线数据服务
            </p>
          </div>

          <!-- 内容区域 -->
          <div class="features-content animate-on-scroll" ref="featuresContent">
            <div
              class="feature-group animate-stagger animate-bounce-in"
              style="animation-delay: 0.3s"
            >
              <div class="feature-icon-area">
                <img
                  src="../assets/home/feature1.png"
                  alt="全"
                  class="feature-image animate-image-scale"
                />
                <h3 class="feature-name animate-text-bounce">全</h3>
              </div>
              <div class="feature-card animate-card-slide">
                <p class="feature-description animate-description-fade">
                  覆盖无线通信全领域数据，包括运营、运维、网优和网规划等业务场景，提供从底层信号到上层应用的全栈数据支持。
                </p>
              </div>
            </div>

            <div
              class="feature-group animate-stagger animate-bounce-in"
              style="animation-delay: 0.8s"
            >
              <div class="feature-icon-area">
                <img
                  src="../assets/home/feature2.png"
                  alt="智"
                  class="feature-image animate-image-scale"
                />
                <h3 class="feature-name animate-text-bounce">智</h3>
              </div>
              <div class="feature-card animate-card-slide">
                <p class="feature-description animate-description-fade">
                  集成AI算法与智能分析工具，提供数据增强、特征提取、模型训练等全流程智能化支持，加速研究进程。
                </p>
              </div>
            </div>

            <div
              class="feature-group animate-stagger animate-bounce-in"
              style="animation-delay: 1.3s"
            >
              <div class="feature-icon-area">
                <img
                  src="../assets/home/feature3.png"
                  alt="信"
                  class="feature-image animate-image-scale"
                />
                <h3 class="feature-name animate-text-bounce">信</h3>
              </div>
              <div class="feature-card animate-card-slide">
                <p class="feature-description animate-description-fade">
                  依托现网数据和高质量仿真数据的交叉认证，借助数据脱敏技术，保障数据安全与隐私。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 四大应用场景 -->
    <section class="scenarios-section">
      <div class="scenarios-container">
        <div class="scenarios-header">
          <h2
            class="scenarios-title animate-on-scroll animate-scale-fade"
            ref="scenariosTitle"
          >
            四大应用场景
          </h2>
          <p
            class="scenarios-subtitle animate-on-scroll animate-slide-up-soft"
            ref="scenariosSubtitle"
          >
            支撑运营、维护、优化、规划四大场景的数字化转型
          </p>
        </div>

        <div class="scenarios-grid animate-on-scroll" ref="scenariosGrid">
          <div
            class="scenario-card scenario-purple scenario-hover-effect animate-card-float"
            style="animation-delay: 0.1s"
          >
            <div class="scenario-preview">
              <img
                src="../assets/home/scene1.png"
                alt="运营场景"
                class="scenario-image"
              />
            </div>
            <div class="scenario-info">
              <h3 class="scenario-name">运营场景</h3>
              <div class="scenario-tag">智能运营数据服务</div>
              <p class="scenario-desc">
                提供用户行为分析、业务质量评估、资源优
                化等数据服务，助力运营商提升网络运营效 率与用户体验
              </p>
              <button class="scenario-btn">了解更多</button>
            </div>
          </div>

          <div
            class="scenario-card scenario-green scenario-hover-effect animate-card-float"
            style="animation-delay: 0.3s"
          >
            <div class="scenario-preview">
              <img
                src="../assets/home/scene2.png"
                alt="运维场景"
                class="scenario-image"
              />
            </div>
            <div class="scenario-info">
              <h3 class="scenario-name">运维场景</h3>
              <div class="scenario-tag">智能运维数据服务</div>
              <p class="scenario-desc">
                提供设备状态监测、故障预测、性能优化等
                数据服务，实现网络运维的智能化与自动化
              </p>
              <button class="scenario-btn">了解更多</button>
            </div>
          </div>

          <div
            class="scenario-card scenario-blue scenario-hover-effect animate-card-float"
            style="animation-delay: 0.5s"
          >
            <div class="scenario-preview">
              <img
                src="../assets/home/scene3.png"
                alt="网优场景"
                class="scenario-image"
              />
            </div>
            <div class="scenario-info">
              <h3 class="scenario-name">网优场景</h3>
              <div class="scenario-tag">网络优化数据服务</div>
              <p class="scenario-desc">
                提供覆盖分析、干扰识别、参数优化等数据
                服务，提升网络质量与容量，降低优化成本
              </p>
              <button class="scenario-btn">了解更多</button>
            </div>
          </div>

          <div
            class="scenario-card scenario-light scenario-hover-effect animate-card-float"
            style="animation-delay: 0.7s"
          >
            <div class="scenario-preview">
              <img
                src="../assets/home/scene4.png"
                alt="网规场景"
                class="scenario-image"
              />
            </div>
            <div class="scenario-info">
              <h3 class="scenario-name">网规场景</h3>
              <div class="scenario-tag">网络规划数据服务</div>
              <p class="scenario-desc">
                提供覆盖预测、容量规划、站址选址等数据
                服务，支持网络建设的科学决策与高效实施
              </p>
              <button class="scenario-btn">了解更多</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台五大核心能力 -->
    <section class="capabilities-section">
      <div class="capabilities-container">
        <!-- Frame 1597881399 - 主容器 -->
        <div class="capabilities-main-frame">
          <!-- Frame 1597881386 - 标题区域 -->
          <div class="capabilities-header-frame">
            <h2
              class="capabilities-main-title animate-on-scroll animate-title-glow"
              ref="capabilitiesTitle"
            >
              平台五大核心能力
            </h2>
            <p
              class="capabilities-main-subtitle animate-on-scroll animate-subtitle-slide"
              ref="capabilitiesSubtitle"
            >
              Wi-Dop平台构建了完整的无线数据能力体系
            </p>
          </div>

          <!-- Frame 1597882044 - 卡片网格容器 -->
          <div
            class="capabilities-cards-frame animate-on-scroll"
            ref="capabilitiesCards"
          >
            <!-- Frame 1597881319 - 数据的规范化与泛化 (大卡片) -->
            <div
              class="capability-card-large capability-animate"
              data-delay="0.1"
            >
              <div class="capability-card-background"></div>
              <div class="capability-card-content-large">
                <div class="capability-text-area-large">
                  <div class="capability-title-wrapper">
                    <h3 class="capability-title-large">数据的规范化与泛化</h3>
                  </div>
                  <p class="capability-desc-large">
                    规范适配无线数据进行，支持需求定制，保障数据的通用性
                  </p>
                  <a href="#" class="capability-link-large">了解更多 >></a>
                </div>
              </div>
              <!-- image 1330 -->
              <div class="capability-image-large">
                <img src="../assets/home/cap1.png" alt="数据的规范化与泛化" />
              </div>
            </div>

            <!-- Frame 1597881409 - 右侧卡片组容器 -->
            <div class="capability-cards-right">
              <!-- Frame 1597881410 - 上排卡片容器 -->
              <div class="capability-cards-row-top">
                <!-- Frame 1597881320 - 数据分类增强筛选 -->
                <div
                  class="capability-card-small capability-animate"
                  data-delay="0.4"
                >
                  <div class="capability-card-background"></div>
                  <div class="capability-card-content-small">
                    <div class="capability-title-wrapper-small">
                      <h3 class="capability-title-small">数据分类增强筛选</h3>
                    </div>
                    <p class="capability-desc-small">
                      支持数据清洗、标注、增强等预处理，提升数据价值
                    </p>
                    <a href="#" class="capability-link-small">了解更多 >></a>
                  </div>
                  <!-- image 1332 -->
                  <div class="capability-image-small">
                    <img src="../assets/home/cap2.png" alt="数据分类增强筛选" />
                  </div>
                </div>

                <!-- Frame 1597881321 - 数据处理工具链 -->
                <div
                  class="capability-card-small capability-animate"
                  data-delay="0.7"
                >
                  <div class="capability-card-background"></div>
                  <div class="capability-card-content-small">
                    <div class="capability-title-wrapper-small">
                      <h3 class="capability-title-small">数据处理工具链</h3>
                    </div>
                    <p class="capability-desc-small">
                      提供单独工具和工具串联，实现原始数据到高质量数据的转换
                    </p>
                    <a href="#" class="capability-link-small">了解更多 >></a>
                  </div>
                  <!-- image 1331 -->
                  <div class="capability-image-small">
                    <img src="../assets/home/cap3.png" alt="数据处理工具链" />
                  </div>
                </div>
              </div>

              <!-- Frame 1597882061 - 下排卡片容器 -->
              <div class="capability-cards-row-bottom">
                <!-- Frame 1597881322 - 数据评估验证体系 -->
                <div
                  class="capability-card-small capability-animate"
                  data-delay="1.0"
                >
                  <div class="capability-card-background"></div>
                  <div class="capability-card-content-small">
                    <div class="capability-title-wrapper-small">
                      <h3 class="capability-title-small">数据评估验证体系</h3>
                    </div>
                    <p class="capability-desc-small">
                      提供多维度的数据质量评估与分析，确保数据可用性
                    </p>
                    <a href="#" class="capability-link-small">了解更多 >></a>
                  </div>
                  <!-- image 1333 -->
                  <div class="capability-image-small">
                    <img src="../assets/home/cap4.png" alt="数据评估验证体系" />
                  </div>
                </div>

                <!-- Frame 1597881323 - 开放协作生态 -->
                <div
                  class="capability-card-small capability-animate"
                  data-delay="1.3"
                >
                  <div class="capability-card-background"></div>
                  <div class="capability-card-content-small">
                    <div class="capability-title-wrapper-small">
                      <h3 class="capability-title-small">开放协作生态</h3>
                    </div>
                    <p class="capability-desc-small">
                      构建开放共享的数据协作生态，实现数据、工具和模型的开发共享...
                    </p>
                    <a href="#" class="capability-link-small">了解更多 >></a>
                  </div>
                  <!-- image 1334 -->
                  <div class="capability-image-small">
                    <img src="../assets/home/cap5.png" alt="开放协作生态" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 能力导航 -->
    <section class="capability-navigation">
      <div class="nav-container">
        <div class="nav-buttons">
          <button
            v-for="(capability, index) in appStore.capabilities"
            :key="capability.id"
            :class="['nav-pill', { active: activeStep === index }]"
            @click="setActiveStep(index)"
          >
            {{ capability.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- 能力详情展示 -->
    <section class="capability-detail">
      <div class="detail-container">
        <transition name="slide" mode="out-in">
          <div :key="activeStep" class="detail-content">
            <div class="detail-left">
              <div class="detail-breadcrumb">
                <span class="breadcrumb-text">{{
                  currentCapability.name
                }}</span>
              </div>
              <h2 class="detail-title">{{ currentCapability.title }}</h2>
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
                  <div class="feature-check">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="#263FFF"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <div class="detail-actions">
                <button class="btn-primary">立即体验</button>
                <button class="btn-secondary">了解更多</button>
              </div>
            </div>

            <div class="detail-right">
              <div class="capability-image">
                <img
                  :src="require(`@/assets/home/cap-big${activeStep + 1}.png`)"
                  :alt="currentCapability.name"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- 平台核心理念 -->
    <section class="concept-section">
      <div class="section-container">
        <div class="concept-content">
          <h2 class="concept-title">让无线网络 AI 既"懂网"又"易用"</h2>
          <p class="concept-subtitle">中国电信研究院-无线网络智能研究团队</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useAppStore } from "@/stores/app";
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "Home",
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
        universality: ["支持多种数据源格式", "智能数据转换", "跨平台兼容性"],
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

    // 滚动到三大特性部分
    const scrollToFeatures = () => {
      const featuresElement = document.querySelector(".features-section");
      if (featuresElement) {
        featuresElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // 动画相关
    let observer = null;

    const initScrollAnimations = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target;

            if (entry.isIntersecting) {
              // 元素进入可视窗口，添加动画
              if (element.classList.contains("animate-on-scroll")) {
                element.classList.add("is-visible");
              }

              // 为交错动画的子元素添加动画
              if (
                element.classList.contains("animate-on-scroll") &&
                element.querySelector(".animate-stagger")
              ) {
                const staggerElements =
                  element.querySelectorAll(".animate-stagger");
                staggerElements.forEach((el) => {
                  el.classList.add("is-visible");
                });
              }

              // 为能力卡片添加分层动画
              if (
                element.classList.contains("animate-on-scroll") &&
                element.querySelector(".capability-animate")
              ) {
                const capabilityCards = element.querySelectorAll(
                  ".capability-animate"
                );
                capabilityCards.forEach((card, index) => {
                  const delay = parseFloat(card.dataset.delay) || 0;
                  setTimeout(() => {
                    // 先显示背景
                    card.classList.add("bg-visible");
                    setTimeout(() => {
                      // 再显示文字
                      card.classList.add("text-visible");
                      setTimeout(() => {
                        // 最后显示图标
                        card.classList.add("icon-visible");
                      }, 400); // 调整延时
                    }, 400); // 调整延时
                  }, delay * 1000);
                });
              }
            } else {
              // 元素离开可视窗口，移除动画类以便下次重新触发
              if (element.classList.contains("animate-on-scroll")) {
                element.classList.remove("is-visible");
              }

              // 移除交错动画类
              if (
                element.classList.contains("animate-on-scroll") &&
                element.querySelector(".animate-stagger")
              ) {
                const staggerElements =
                  element.querySelectorAll(".animate-stagger");
                staggerElements.forEach((el) => {
                  el.classList.remove("is-visible");
                });
              }

              // 移除能力卡片动画类
              if (
                element.classList.contains("animate-on-scroll") &&
                element.querySelector(".capability-animate")
              ) {
                const capabilityCards = element.querySelectorAll(
                  ".capability-animate"
                );
                capabilityCards.forEach((card) => {
                  card.classList.remove(
                    "bg-visible",
                    "text-visible",
                    "icon-visible"
                  );
                });
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -5% 0px",
        }
      );

      // 观察所有需要动画的元素
      const animateElements = document.querySelectorAll(".animate-on-scroll");
      animateElements.forEach((el) => {
        observer.observe(el);
      });
    };

    onMounted(() => {
      // 稍微延迟一下，确保DOM完全渲染
      setTimeout(() => {
        initScrollAnimations();
      }, 100);
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
      }
    });

    return {
      appStore,
      activeStep,
      currentCapability,
      setActiveStep,
      getCapabilityFeatures,
      getVisualizationComponent,
      scrollToFeatures,
    };
  },
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    "WenQuanYi Micro Hei", sans-serif;
  width: 100%;
  overflow-x: hidden;
}

/* 基础动画类 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(60px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 主标题从右侧滑入 */
.animate-slide-right {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-main-titles.is-visible .animate-slide-right {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.2s;
}

.animate-slide-right-delay {
  opacity: 0;
  transform: translateX(-80px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-main-titles.is-visible .animate-slide-right-delay {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.5s;
}

/* 线条展开动画 */
.animate-line-expand {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-info-card.is-visible .animate-line-expand {
  transform: scaleX(1);
  transition-delay: 0.8s;
}

/* 内容向上滑动 */
.animate-content-up {
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-info-card.is-visible .animate-content-up {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.1s;
}

/* 文字淡入 */
.animate-text-fade {
  opacity: 0;
  filter: blur(3px);
  transition: all 0.8s ease-out;
}

.hero-info-card.is-visible .animate-text-fade {
  opacity: 1;
  filter: blur(0);
  transition-delay: 1.3s;
}

.animate-text-fade-delay {
  opacity: 0;
  filter: blur(3px);
  transition: all 0.8s ease-out;
}

.hero-info-card.is-visible .animate-text-fade-delay {
  opacity: 1;
  filter: blur(0);
  transition-delay: 1.5s;
}

/* 缩放淡入 */
.animate-zoom-in {
  opacity: 0;
  transform: scale(0.8);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-zoom-in.is-visible {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.1s;
}

/* 柔和向上滑动 */
.animate-slide-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-slide-up.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.4s;
}

/* 弹跳进入 */
.animate-bounce-in {
  opacity: 0;
  transform: translateY(80px) scale(0.9);
  transition: all 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-bounce-in.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 图片缩放 */
.animate-image-scale {
  opacity: 0;
  transform: scale(0.6);
  filter: blur(2px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.feature-group.is-visible .animate-image-scale {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  transition-delay: 0.3s;
}

/* 文字弹跳 */
.animate-text-bounce {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.feature-group.is-visible .animate-text-bounce {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.6s;
}

/* 卡片滑动 */
.animate-card-slide {
  opacity: 0;
  transform: translateX(-40px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.feature-group.is-visible .animate-card-slide {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.5s;
}

/* 描述文字淡入 */
.animate-description-fade {
  opacity: 0;
  transform: translateY(15px);
  filter: blur(1px);
  transition: all 1s ease-out;
}

.feature-group.is-visible .animate-description-fade {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition-delay: 0.8s;
}

/* 缩放淡入 */
.animate-scale-fade {
  opacity: 0;
  transform: scale(0.9);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-scale-fade.is-visible {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.2s;
}

/* 柔和向上滑动 */
.animate-slide-up-soft {
  opacity: 0;
  transform: translateY(25px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-slide-up-soft.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

/* 卡片浮动进入 */
.animate-card-float {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
  transition: all 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.scenarios-grid.is-visible .animate-card-float {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 标题发光效果 */
.animate-title-glow {
  opacity: 0;
  transform: scale(0.95);
  text-shadow: 0 0 20px transparent;
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-title-glow.is-visible {
  opacity: 1;
  transform: scale(1);
  text-shadow: 0 0 30px rgba(38, 63, 255, 0.3);
  transition-delay: 0.2s;
}

/* 副标题滑动 */
.animate-subtitle-slide {
  opacity: 0;
  transform: translateX(30px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-subtitle-slide.is-visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.5s;
}

/* 交错动画 - 调整延时 */
.animate-stagger {
  opacity: 0;
  transform: translateY(80px) scale(0.9);
  transition: all 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-stagger.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 场景卡片悬停增强效果 */
.scenario-hover-effect {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

/* 确保hover效果覆盖动画transform */
.scenario-hover-effect:hover {
  transform: translateY(-20px) scale(1.02) !important;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18) !important;
  z-index: 10;
}

.scenario-hover-effect:hover .scenario-btn {
  background: linear-gradient(90deg, #263fff 0%, #00e5e5 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.05);
}

/* 平台核心能力卡片分层动画增强 */
.capability-animate {
  position: relative;
  overflow: hidden;
}

/* 添加背景层 */
.capability-card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0;
  transform: scale(0.7) translateY(30px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.capability-animate.bg-visible .capability-card-background {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* 文字动画增强 */
.capability-animate .capability-card-content-large,
.capability-animate .capability-card-content-small {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(2px);
  transition: all 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.capability-animate.text-visible .capability-card-content-large,
.capability-animate.text-visible .capability-card-content-small {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* 图标动画增强 - 移除旋转，使用缩放和滑动 */
.capability-animate .capability-image-large,
.capability-animate .capability-image-small {
  opacity: 0;
  transform: scale(0.3) translateX(50px);
  filter: blur(3px);
  transition: all 1.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.capability-animate.icon-visible .capability-image-large,
.capability-animate.icon-visible .capability-image-small {
  opacity: 1;
  transform: scale(1) translateX(0);
  filter: blur(0);
}

/* Hero Section - 响应式版本 */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  margin: 0;
  overflow: hidden;
}

.hero-background-container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  min-width: 1440px; /* 确保最小宽度 */
}

/* 背景矩形 - 响应式适配 */
.hero-background-rect {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #d9d9d9;
  min-width: 1440px; /* 保持最小宽度 */
}

/* 背景图片 - 响应式适配 */
.hero-background-image {
  position: absolute;
  width: calc(100% - 18px); /* 相对宽度，保持比例 */
  height: 800px;
  right: 0; /* 改为右对齐 */
  top: 0;
  background: url("../assets/home/main.png");
  background-size: contain;
  background-position: right center; /* 右侧居中对齐 */
  background-repeat: no-repeat;
  min-width: 1400px; /* 最小宽度确保图片完整显示 */
}

/* 渐变覆盖层 - 响应式适配 */
.hero-gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: linear-gradient(
    270deg,
    rgba(228, 236, 250, 0) 40.69%,
    #e4ecfa 74.01%
  );
  min-width: 1440px; /* 保持最小宽度 */
}

.hero-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(-50px);
}

/* 响应式断点优化 */
@media (max-width: 1440px) {
  .hero-background-container,
  .hero-background-rect,
  .hero-gradient-overlay {
    min-width: 100vw; /* 使用视口宽度 */
  }

  .hero-background-image {
    min-width: calc(100vw - 18px);
    background-position: right center;
  }
}

@media (max-width: 1280px) {
  .hero-background-image {
    width: 100%;
    min-width: 100%;
    background-size: cover; /* 改为cover确保填满 */
    background-position: center right;
  }

  .hero-gradient-overlay {
    background: linear-gradient(
      270deg,
      rgba(228, 236, 250, 0) 30%,
      #e4ecfa 65%
    ); /* 调整渐变范围 */
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 100vh;
    min-height: 500px;
  }

  .hero-container {
    padding: 80px 24px;
    transform: translateY(-30px);
  }

  .hero-background-image {
    background-size: cover;
    background-position: center;
    height: 100vh;
  }

  .hero-gradient-overlay {
    background: linear-gradient(
      180deg,
      rgba(228, 236, 250, 0) 20%,
      rgba(228, 236, 250, 0.7) 60%,
      #e4ecfa 90%
    ); /* 移动端改为从上到下的渐变 */
  }
}

@media (max-width: 480px) {
  .hero-container {
    transform: translateY(-20px);
    padding: 60px 16px;
  }

  .hero-background-image {
    height: 100vh;
    background-size: cover;
  }
}

/* 向下滚动按钮 */
.scroll-down-btn {
  position: absolute;
  bottom: 110px; /* 向上移动：原来60px + 50px = 110px */
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 40px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: all 0.3s ease;
  /* 上下律动动画 */
  animation: bounce 2s infinite;
}

.scroll-down-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%) scale(1.1);
}

.arrow-down {
  width: 24px;
  height: 24px;
}

/* 上下律动动画 */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
}

.hero-left {
  z-index: 2;
  max-width: 600px;
}

.hero-title {
  font-size: 48px;
  font-weight: 600;
  background: linear-gradient(90deg, #263fff 0%, #00e5e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 16px;
  color: #202939;
  margin-bottom: 60px;
  line-height: 1.6;
}

.hero-info-card {
  position: relative;
}

.card-line {
  width: 288px;
  height: 1px;
  background: #697586;
  opacity: 1;
  margin-bottom: 20px;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 16px;
  color: #202939;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 20px;
}

.card-content p {
  font-size: 14px;
  color: #697586;
  line-height: 20px;
}

/* 三大特性 - 完美居中 */
.features-section {
  background: #ffffff;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.features-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
}

.features-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 20px;
  width: 1240px;
  min-height: 470px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 20px;
}

.features-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.features-title {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 48px;
  letter-spacing: 0.04em;
  color: #202939;
  margin: 0;
}

.features-subtitle {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #697586;
  margin: 0;
}

.features-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 0px;
  gap: 40px;
  width: 100%;
  max-width: 1160px;
  flex-wrap: wrap;
}

.feature-group {
  width: 360px;
  height: 284px;
  flex: none;
  position: relative;
}

.feature-card {
  position: absolute;
  width: 360px;
  height: 204px;
  left: 0px;
  top: 80px;
  background: #f5f8fb;
  border-radius: 16px;
}

.feature-icon-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  position: absolute;
  width: 160px;
  height: 172px;
  left: 100px;
  top: 0px;
  z-index: 1;
}

.feature-image {
  width: 160px;
  height: 160px;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: -20px 0px;
}

.feature-name {
  width: 24px;
  height: 32px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.feature-description {
  position: absolute;
  width: 290px;
  height: 66px;
  left: 40px;
  top: 114px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #697586;
  margin: 0;
}

/* 四大应用场景 - 居中对齐 */
.scenarios-section {
  background: linear-gradient(
    241.49deg,
    #f1f5fe 2.05%,
    #eff5ff 50.55%,
    #d6edfd 99.05%
  );
  padding: 80px 0;
  display: flex;
  justify-content: center;
}

.scenarios-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.scenarios-header {
  text-align: center;
  margin-bottom: 60px;
}

.scenarios-title {
  font-size: 36px;
  color: #333;
  margin-bottom: 16px;
  font-weight: 600;
}

.scenarios-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  justify-items: center;
}

.scenario-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 280px;
}

.scenario-purple {
  background: linear-gradient(135deg, #b794f6 0%, #9f7aea 100%);
}

.scenario-green {
  background: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
}

.scenario-blue {
  background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
}

.scenario-light {
  background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
}

.scenario-preview {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
  min-height: 128px;
}

.scenario-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scenario-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 10px;
  width: 112px;
  height: 24px;
  background: #f5f8fb;
  border-radius: 6px;
  flex: none;
  order: 1;
  flex-grow: 0;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #697586;
  justify-content: center;
}

.scenario-info {
  background: #ffffff;
  padding: 20px;
  margin-top: auto;
}

.scenario-name {
  width: 80px;
  height: 28px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.scenario-info .scenario-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
}

.scenario-info .scenario-tag {
  position: absolute;
  right: 20px;
  top: 151px;
}

.scenario-info .scenario-desc {
  margin-top: 16px;
}

.scenario-desc {
  color: #666;
  line-height: 1.6;
  font-size: 13px;
  margin-bottom: 20px;
}

.scenario-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  background-color: #f5f8fb;
  border: 1px solid #d9d9d9;
  color: #666;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 平台五大核心能力 - 完全居中 */
.capabilities-section {
  background: #ffffff;
  padding: 80px 0;
  display: flex;
  justify-content: center;
}

.capabilities-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
}

/* Frame 1597881399 - 主容器 */
.capabilities-main-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 60px;
  width: 100%;
  max-width: 1240px;
}

/* Frame 1597881386 - 标题区域 */
.capabilities-header-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  max-width: 490px;
  text-align: center;
}

.capabilities-main-title {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 48px;
  letter-spacing: 0.04em;
  color: #202939;
  margin: 0;
}

.capabilities-main-subtitle {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #697586;
  margin: 0;
}

/* Frame 1597882044 - 卡片网格容器 */
.capabilities-cards-frame {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  max-width: 1240px;
  flex-wrap: wrap;
}

/* Frame 1597881319 - 数据的规范化与泛化 (大卡片) */
.capability-card-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 10px;
  isolation: isolate;
  width: 402px;
  height: 368px;
  background: linear-gradient(
    117.71deg,
    #f4f4fc 3.38%,
    #fcfdff 50.83%,
    #cce5ff 98.29%
  );
  border-radius: 16px;
  flex: none;
  position: relative;
  overflow: hidden;
}

.capability-card-content-large {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  gap: 64px;
  width: 354px;
  height: 288px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 1;
  z-index: 2;
  position: relative;
}

.capability-text-area-large {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 228px;
  height: 88px;
  margin: 0;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.capability-title-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 180px;
  height: 28px;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.capability-title-large {
  width: 180px;
  height: 28px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.capability-desc-large {
  width: 228px;
  height: 44px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #697586;
  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.capability-link-large {
  width: 228px;
  height: 22px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263fff;
  text-decoration: none;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.capability-image-large {
  position: absolute;
  width: 400px;
  height: 400px;
  right: -80px;
  top: 28px;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
}

.capability-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Frame 1597881409 - 右侧卡片组容器 */
.capability-cards-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 100%;
  max-width: 822px;
  flex: 1;
}

/* Frame 1597881410 - 上排卡片容器 */
.capability-cards-row-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
}

/* Frame 1597882061 - 下排卡片容器 */
.capability-cards-row-bottom {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 0px;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
}

/* 小卡片样式 */
.capability-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 10px;
  isolation: isolate;
  width: 403px;
  height: 176px;
  background: linear-gradient(
    117.71deg,
    #f4f4fc 3.38%,
    #fcfdff 50.83%,
    #cce5ff 98.29%
  );
  border-radius: 16px;
  flex: 1;
  min-width: 350px;
  position: relative;
  overflow: hidden;
}

.capability-card-content-small {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 200px;
  height: 126px;
  flex: none;
  order: 0;
  align-self: flex-start;
  flex-grow: 0;
  z-index: 2;
  position: relative;
}

.capability-title-wrapper-small {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 180px;
  height: 28px;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.capability-title-small {
  width: 180px;
  height: 28px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  color: #202939;
  margin: 0;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.capability-desc-small {
  width: 200px;
  height: 44px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 22px;
  color: #697586;
  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.capability-link-small {
  width: 200px;
  height: 22px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #263fff;
  text-decoration: none;
  flex: none;
  order: 2;
  flex-grow: 0;
}

.capability-image-small {
  position: absolute;
  width: 200px;
  height: 200px;
  right: -30px;
  top: -4px;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 1;
}

.capability-image-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.capability-navigation {
  background: #f8fbff;
  padding: 50px 10px 0;
  display: flex;
  justify-content: center;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-pill {
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #666;
  border: 1px solid #e0e0e0;
}

.nav-pill.active {
  background: #333;
  color: #ffffff;
  border: 1px solid #333;
}

.nav-pill:hover {
  background: #f5f5f5;
}

.nav-pill.active:hover {
  background: #555;
}

.capability-detail {
  padding: 40px 0;
  background: #f8fbff;
  display: flex;
  justify-content: center;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.detail-content {
  background: #ffffff;
  border-radius: 20px;
  padding: 0px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px;
  align-items: stretch;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 500px;
}

.detail-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 60px;
}

.detail-breadcrumb {
  margin-bottom: 8px;
}

.breadcrumb-text {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #202939;
  margin: 0;
  line-height: 1.2;
}

.detail-title {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #202939;
  margin: 0;
  line-height: 1.2;
}

.detail-description {
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.capability-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 8px 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.feature-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e8f4fd;
  flex-shrink: 0;
}

.detail-actions {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.btn-primary {
  padding: 12px 32px;
  background: #263fff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #3367d6;
}

.btn-secondary {
  padding: 12px 32px;
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: "HarmonyOS Sans SC", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.detail-right {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  height: 100%;
}

.capability-image {
  width: 100%;
  height: 100%;
}

.capability-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
  font-size: 16px;
}

.concept-section {
  background: linear-gradient(135deg, #4a9eff 0%, #74b9ff 100%);
  color: white;
  padding: 80px 0;
  display: flex;
  justify-content: center;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.concept-content {
  text-align: center;
}

.concept-title {
  font-size: 36px;
  margin-bottom: 16px;
}

.concept-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

/* 动画效果 */
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
@media (max-width: 1280px) {
  .features-wrapper {
    width: calc(100% - 40px);
    max-width: 1200px;
  }

  .features-content {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  .scenarios-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .capabilities-cards-frame {
    flex-direction: column;
    align-items: center;
  }

  .capability-cards-right {
    max-width: 100%;
  }

  .capability-cards-row-top,
  .capability-cards-row-bottom {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .scroll-down-btn {
    bottom: 70px; /* 移动端调整：原来40px + 30px */
    width: 40px;
    height: 40px;
  }

  .arrow-down {
    width: 20px;
    height: 20px;
  }

  .hero-background-image {
    width: 1200px; /* 移动端适当缩小 */
    height: 675px;
    left: 120px;
  }

  .features-wrapper {
    width: calc(100% - 20px);
    padding: 20px;
    margin: 0 10px;
  }

  .features-title {
    font-size: 28px;
  }

  .feature-group {
    width: 100%;
    max-width: 340px;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
  }

  .capability-card-large {
    width: 100%;
    max-width: 380px;
    height: 300px;
  }

  .capability-cards-row-top,
  .capability-cards-row-bottom {
    flex-direction: column;
    align-items: center;
  }

  .capability-card-small {
    width: 100%;
    max-width: 380px;
    min-width: auto;
  }

  .flow-steps {
    flex-direction: column;
    align-items: center;
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

  .nav-buttons {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .scroll-down-btn {
    bottom: 50px; /* 小屏幕调整：原来30px + 20px */
    width: 36px;
    height: 36px;
  }

  .arrow-down {
    width: 18px;
    height: 18px;
  }

  .features-wrapper {
    padding: 15px;
  }

  .feature-group {
    width: 100%;
    max-width: 300px;
  }

  .capability-card-large,
  .capability-card-small {
    width: 100%;
    max-width: 320px;
  }

  .capability-card-large {
    height: 280px;
    padding: 15px;
  }

  .capability-text-area-large {
    width: 180px;
  }

  .capability-title-wrapper {
    width: 140px;
  }

  .capability-title-large {
    width: 140px;
    font-size: 18px;
    line-height: 24px;
  }

  .capability-desc-large {
    width: 180px;
    font-size: 14px;
    line-height: 20px;
  }

  .capability-link-large {
    width: 180px;
    font-size: 14px;
  }

  .capability-image-large {
    width: 150px;
    height: 150px;
    right: -30px;
    top: 15px;
  }

  .capability-card-small {
    height: 150px;
    padding: 15px;
  }

  .capability-card-content-small {
    width: 160px;
  }

  .capability-title-wrapper-small {
    width: 140px;
  }

  .capability-title-small {
    width: 140px;
    font-size: 18px;
    line-height: 24px;
  }

  .capability-desc-small {
    width: 160px;
    font-size: 14px;
    line-height: 18px;
  }

  .capability-link-small {
    width: 160px;
    font-size: 14px;
  }

  .capability-image-small {
    width: 100px;
    height: 100px;
    right: -15px;
    top: 5px;
  }
}
</style>
