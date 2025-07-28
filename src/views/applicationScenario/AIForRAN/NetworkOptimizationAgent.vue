<template>
  <div class="app-container">
    <!-- 主标题 -->
    <h1 class="app-title">🛰️ 网优智能助手</h1>

    <p class="app-subtitle">用 AI 帮你定位问题、生成优化思路与仿真脚本！</p>

    <!-- 网优助手组件容器 -->
    <div class="generator-container">
      <NetworkOptimizer />
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-robot">🤖</div>
      <div class="loading-text">{{ loadingText }}</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- 结果展示 -->
    <div v-if="result" class="result-container">
      <!-- 成功标题 -->
      <div class="result-header">
        <div class="result-icon">🎉</div>
        <h2 class="result-title">网优方案生成完成！</h2>
        <div class="result-subtitle">你的专属优化方案已经准备好啦~</div>
      </div>

      <!-- 方案内容 -->
      <div class="solution-content">
        {{ result }}
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="copyResult" class="btn btn--primary">
          📋 复制内容
        </button>
        <button @click="startNew" class="btn btn--secondary">
          ✨ 再次优化
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkOptimizer from "../../../components/networkOptimizationAgent/NetworkOptimizer.vue";

export default {
  name: "NetworkOptimizationAgent",

  components: {
    NetworkOptimizer,
  },

  data() {
    return {
      currentTheme: "theme-network",
      themes: [
        { name: "网优主题", class: "theme-network", icon: "🛰️" },
        { name: "专业主题", class: "theme-professional", icon: "📊" },
        { name: "简约主题", class: "theme-simple", icon: "🔧" },
      ],
      prompt: "",
      result: "",
      isLoading: false,
      loadingText: "🤖 AI正在分析网络问题",
      progress: 0,
      showSuggestions: true,
      promptSuggestions: [
        "弱覆盖/盲点定位",
        "乒乓切换抑制",
        "PRB 高负载均衡",
        "RSRQ 断崖定位",
        "NR/LTE 跨频切换掉线",
        "Viavi UE 指标解读",
        "TDD 上下行配比优化",
        "PCI 冲突/混淆处理",
        "VoNR 时延异常分析",
        "小区节能策略评估",
      ],
    };
  },

  computed: {
    promptLength() {
      return this.prompt.length;
    },
    canGenerate() {
      return this.prompt.trim().length > 0 && !this.isLoading;
    },
  },

  methods: {
    // 切换主题
    switchTheme(themeClass) {
      this.currentTheme = themeClass;
      try {
        localStorage.setItem("network-theme", themeClass);
      } catch (error) {
        console.warn("保存主题失败:", error);
      }
      console.log("切换主题:", themeClass);
    },

    addSuggestion(suggestion) {
      const currentPrompt = this.prompt.trim();
      if (currentPrompt) {
        this.prompt = currentPrompt + "，" + suggestion;
      } else {
        this.prompt = "需要分析" + suggestion + "的问题";
      }
      this.showSuggestions = false;
    },

    async startOptimization() {
      console.log("开始网优分析功能被调用");
    },

    async copyResult() {
      try {
        await navigator.clipboard.writeText(this.result);
        console.log("复制成功");
      } catch (error) {
        console.log("复制失败，使用降级方案");
        const textArea = document.createElement("textarea");
        textArea.value = this.result;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    },

    startNew() {
      this.result = "";
      this.prompt = "";
      this.isLoading = false;
      this.progress = 0;
      console.log("重新开始");
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },

  mounted() {
    console.log("🛰️ 网优智能助手已启动！");
    console.log("📊 正在测试NetworkOptimizer组件引用...");

    // 从本地存储加载主题
    try {
      const savedTheme = localStorage.getItem("network-theme");
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }
    } catch (error) {
      console.warn("加载主题失败:", error);
    }
  },
};
</script>

<style scoped>
:root {
  --primary-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  --primary-color: #1e3c72;
  --secondary-color: #4ecdc4;
  --success-color: #2a5298;
  --text-dark: #2c3e50;
  --text-light: #666;
  --white: #ffffff;
  --white-transparent: rgba(255, 255, 255, 0.98);
  --white-blur: rgba(255, 255, 255, 0.3);
  --shadow-light: 0 8px 32px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 12px 40px rgba(0, 0, 0, 0.15);
  --border-radius: 20px;
  --border-radius-large: 24px;
  --border-radius-small: 12px;
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 40px;
  --spacing-xxl: 48px;
}

/* 应用容器 */
.app-container {
  width: 100%;
  min-height: 100vh;
  background: var(--primary-gradient);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-family: "Arial", sans-serif;
  color: var(--white);
  text-align: center;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

/* 主标题 */
.app-title {
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  font-weight: 700;
  color: var(--white);
}

/* 副标题 */
.app-subtitle {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 生成器容器 */
.generator-container {
  width: 100%;
  max-width: 900px;
  background: var(--white-transparent);
  border-radius: var(--border-radius-large);
  padding: 0;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--white-blur);
  backdrop-filter: blur(20px);
}

/* 加载状态容器 */
.loading-container {
  background: var(--white-transparent);
  border-radius: var(--border-radius);
  padding: var(--spacing-xxl);
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--white-blur);
}

.loading-robot {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: robotFloat 2s ease-in-out infinite;
}

.loading-text {
  font-size: 1.2rem;
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: none;
}

.progress-bar {
  width: 300px;
  height: 10px;
  background: rgba(30, 60, 114, 0.2);
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid rgba(30, 60, 114, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e3c72, #4ecdc4, #2a5298, #44a08d);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(30, 60, 114, 0.4);
}

/* 结果展示容器 */
.result-container {
  background: var(--white-transparent);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  max-width: 800px;
  width: 100%;
  border: 2px solid rgba(30, 60, 114, 0.3);
  box-shadow: var(--shadow-light);
}

.result-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.result-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-sm);
}

.result-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  text-shadow: none;
}

.result-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  font-weight: 600;
}

/* 方案内容 */
.solution-content {
  line-height: 1.8;
  color: var(--text-dark);
  font-size: 1.05rem;
  font-weight: 500;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-small);
  border-left: 4px solid var(--primary-color);
  margin-bottom: var(--spacing-md);
  text-align: left;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

/* 按钮基础样式 */
.btn {
  border: none;
  border-radius: 25px;
  color: var(--white);
  font-size: 16px;
  font-weight: 700;
  padding: 14px 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  min-width: 140px;
}

.btn--primary {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  box-shadow: 0 6px 16px rgba(30, 60, 114, 0.4);
}

.btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(30, 60, 114, 0.5);
}

.btn--secondary {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  box-shadow: 0 6px 16px rgba(78, 205, 196, 0.4);
}

.btn--secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.5);
}

/* 动画定义 */
@keyframes robotFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }

  .app-subtitle {
    font-size: 1.1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 200px;
  }

  .progress-bar {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: var(--spacing-sm);
  }

  .app-title {
    font-size: 2rem;
  }

  .loading-container,
  .result-container {
    padding: var(--spacing-md);
  }

  .progress-bar {
    width: 200px;
  }
}
</style>
