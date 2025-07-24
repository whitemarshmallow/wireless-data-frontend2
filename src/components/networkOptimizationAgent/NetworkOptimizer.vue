<template>
  <div class="network-optimizer">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 输入区域 -->
      <div
        class="input-section magic-card rainbow-border"
        v-if="!optimizerStore.isLoading && !optimizerStore.result"
      >
        <div class="section-header">
          <h2 class="section-title">
            <span class="cute-icon">🚦</span>
            开始你的优化之旅
          </h2>
          <p class="section-subtitle">
            告诉 AI 你的网络场景 / KPI 痛点 / 仿真需求，让优化从这里开始！
          </p>
        </div>

        <!-- 问题输入 -->
        <div class="prompt-section">
          <label class="input-label">
            <span class="label-text">
              <span class="cute-icon">💬</span>
              你现在遇到的网优问题或需求是？
              <span class="required">*</span>
            </span>
            <span class="char-count" :class="{ warning: promptLength > 500 }">
              {{ promptLength }}/1000
            </span>
          </label>

          <textarea
            v-model="optimizerStore.prompt"
            class="magic-input magic-textarea"
            placeholder="例如：高速场景乒乓切换严重，想用 Viavi 仿真验证不同 TTT/Hys 参数对 HO 成功率的影响..."
            maxlength="1000"
            rows="6"
            @input="handlePromptInput"
          ></textarea>

          <!-- 场景建议 -->
          <div class="prompt-suggestions" v-if="showSuggestions">
            <div class="suggestions-title">💡 场景/问题提示：</div>
            <div class="suggestion-tags">
              <button
                v-for="suggestion in promptSuggestions"
                :key="suggestion"
                class="suggestion-tag"
                @click="addSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- 参数模板上传区域 -->
        <div class="framework-section">
          <div class="framework-toggle">
            <button
              class="toggle-btn"
              :class="{ active: optimizerStore.showFramework }"
              @click="toggleFramework"
            >
              <span class="cute-icon">📋</span>
              {{ optimizerStore.showFramework ? "隐藏" : "添加" }}仿真/参数模板
              <span class="toggle-hint">(可选)</span>
            </button>
          </div>

          <Transition name="slide-down">
            <div v-if="optimizerStore.showFramework" class="framework-content">
              <div class="framework-info bubble">
                <div class="info-icon">🎯</div>
                <div class="info-text">
                  <strong>仿真/参数模板</strong>
                  可以帮助AI更好地理解你的网络环境和需求。
                  你可以直接输入文字或上传txt/json文件。
                </div>
              </div>

              <!-- 文字模板输入 -->
              <div class="framework-text">
                <label class="input-label">
                  <span class="label-text">
                    <span class="cute-icon">📝</span>
                    参数模板
                  </span>
                </label>
                <textarea
                  v-model="optimizerStore.framework"
                  class="magic-input magic-textarea"
                  placeholder="示例：Viavi UE 轨迹、场景说明、KPI 目标、邻区参数表...&#10;比如：TTT=320ms, Hys=3dB, RSRP阈值=-110dBm..."
                  rows="4"
                  maxlength="2000"
                ></textarea>
              </div>

              <!-- 文件上传 -->
              <div class="framework-file">
                <label class="input-label">
                  <span class="label-text">
                    <span class="cute-icon">📁</span>
                    或上传参数文件
                  </span>
                </label>
                <FileUploader
                  @file-uploaded="handleFileUploaded"
                  @file-removed="handleFileRemoved"
                  @file-error="handleFileError"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- 优化按钮 -->
        <div class="action-section">
          <button
            class="create-btn magic-button rainbow sparkle"
            :disabled="!optimizerStore.canGenerate"
            @click="startOptimization"
          >
            <span class="cute-icon">🚀</span>
            开始诊断并生成方案
            <span class="cute-icon">✨</span>
          </button>

          <div class="help-text" v-if="!optimizerStore.canGenerate">
            请先输入问题或上传参数模板哦~
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="optimizerStore.isLoading" class="loading-section magic-card">
        <LoadingAnimation
          :loading-text="optimizerStore.loadingText"
          :progress="optimizerStore.progress"
        />
      </div>

      <!-- 结果展示 -->
      <div
        v-if="optimizerStore.result && !optimizerStore.isLoading"
        class="result-section"
      >
        <ResultDisplay
          :result="optimizerStore.result"
          @download="downloadSolution"
          @create-new="startNewOptimization"
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="optimizerStore.error" class="error-section magic-card">
        <div class="error-content">
          <div class="error-icon">😔</div>
          <h3 class="error-title">哎呀，出了点小问题</h3>
          <p class="error-message">{{ optimizerStore.error }}</p>
          <div class="error-actions">
            <button class="magic-button" @click="retryOptimization">
              <span class="cute-icon">🔄</span>
              重试
            </button>
            <button class="magic-button" @click="optimizerStore.reset()">
              <span class="cute-icon">🆕</span>
              重新开始
            </button>
          </div>
        </div>
      </div>

      <!-- 历史记录 -->
      <div
        v-if="optimizerStore.history.length > 0 && !optimizerStore.isLoading"
        class="history-section"
      >
        <div class="history-header">
          <h3 class="history-title">
            <span class="cute-icon">📚</span>
            历史记录
          </h3>
          <button class="toggle-history-btn" @click="toggleHistory">
            {{ showHistory ? "收起" : "展开" }}
          </button>
        </div>

        <Transition name="slide-down">
          <div v-if="showHistory" class="history-content">
            <div
              v-for="item in optimizerStore.history.slice(0, 5)"
              :key="item.id"
              class="history-item magic-card cute-hover"
              @click="loadFromHistory(item)"
            >
              <div class="history-info">
                <div class="history-prompt">
                  {{ item.prompt.slice(0, 50) }}...
                </div>
                <div class="history-time">{{ item.timestamp }}</div>
              </div>
              <div class="history-meta">
                <span v-if="item.framework" class="meta-tag">📋 有模板</span>
                <span v-if="item.hasFile" class="meta-tag">📁 有文件</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 小贴士 -->
    <div class="tips-section" v-if="!optimizerStore.isLoading">
      <div class="tips-card magic-card">
        <h4 class="tips-title">
          <span class="cute-icon">🔧</span>
          小贴士
        </h4>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🎯</span>
            <span class="tip-text"
              >描述越具体，定位越精准（覆盖区域、KPI、场景速度等）</span
            >
          </div>
          <div class="tip-item">
            <span class="tip-icon">📋</span>
            <span class="tip-text">上传参数/模板可让建议更贴近现网</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">✨</span>
            <span class="tip-text"
              >善用关键指标：RSRP/RSRQ/SINR、BLER、PRB、HO 成功率...</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOptimizerStore } from "../../stores/optimizerStore.js";
import LoadingAnimation from "./LoadingAnimation.vue";
import ResultDisplay from "./ResultDisplay.vue";
import FileUploader from "./FileUploader.vue";

export default {
  name: "NetworkOptimizer",
  components: {
    LoadingAnimation,
    ResultDisplay,
    FileUploader,
  },

  setup() {
    const optimizerStore = useOptimizerStore();
    return { optimizerStore };
  },

  data() {
    return {
      showSuggestions: true,
      showHistory: false,

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
      return this.optimizerStore.prompt.length;
    },
  },

  methods: {
    // 处理问题输入
    handlePromptInput() {
      // 自动隐藏建议当用户开始输入时
      if (this.optimizerStore.prompt.length > 10) {
        this.showSuggestions = false;
      } else if (this.optimizerStore.prompt.length === 0) {
        this.showSuggestions = true;
      }
    },

    // 添加建议到问题描述
    addSuggestion(suggestion) {
      const currentPrompt = this.optimizerStore.prompt.trim();
      if (currentPrompt) {
        this.optimizerStore.setPrompt(currentPrompt + "，" + suggestion);
      } else {
        this.optimizerStore.setPrompt("需要解决" + suggestion + "的问题");
      }
      this.showSuggestions = false;
    },

    // 切换模板显示
    toggleFramework() {
      this.optimizerStore.toggleFramework();
    },

    // 处理文件上传
    handleFileUploaded(data) {
      this.optimizerStore.setFrameworkFile(data.file);
      // 如果文字模板为空，则填入文件内容
      if (!this.optimizerStore.framework.trim() && data.content) {
        this.optimizerStore.setFramework(data.content);
      }
    },

    // 处理文件移除
    handleFileRemoved() {
      this.optimizerStore.setFrameworkFile(null);
    },

    // 处理文件错误
    handleFileError(error) {
      this.optimizerStore.setError(error);
    },

    // 开始优化
    async startOptimization() {
      if (!this.optimizerStore.canGenerate) return;

      try {
        await this.optimizerStore.generateOptimization();

        // 优化成功后的庆祝效果
        if (this.optimizerStore.result) {
          this.showCelebration();
        }
      } catch (error) {
        console.error("优化失败:", error);
      }
    },

    // 重试优化
    async retryOptimization() {
      this.optimizerStore.clearError();
      await this.startOptimization();
    },

    // 下载方案
    downloadSolution() {
      this.optimizerStore.downloadResult();
    },

    // 开始新优化
    startNewOptimization() {
      this.optimizerStore.startNew();
      this.showSuggestions = true;

      // 滚动到顶部
      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },

    // 切换历史记录显示
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },

    // 从历史记录加载
    loadFromHistory(item) {
      this.optimizerStore.loadFromHistory(item);
      this.showSuggestions = false;

      // 滚动到输入区域
      this.$nextTick(() => {
        const inputSection = this.$el.querySelector(".input-section");
        if (inputSection) {
          inputSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },

    // 显示庆祝效果
    showCelebration() {
      // 创建庆祝粒子效果
      const colors = ["#1e3c72", "#4ecdc4", "#2a5298", "#44a08d", "#667eea"];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          this.createCelebrationParticle(colors[i % colors.length]);
        }, i * 50);
      }
    },

    // 创建庆祝粒子
    createCelebrationParticle(color) {
      const particle = document.createElement("div");
      particle.style.position = "fixed";
      particle.style.width = "10px";
      particle.style.height = "10px";
      particle.style.background = color;
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";

      const startX = Math.random() * window.innerWidth;
      const startY = window.innerHeight;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = Math.random() * window.innerHeight * 0.5;

      particle.style.left = startX + "px";
      particle.style.top = startY + "px";

      document.body.appendChild(particle);

      // 动画
      particle.animate(
        [
          { transform: "translate(0, 0) scale(0)", opacity: 1 },
          {
            transform: `translate(${endX - startX}px, ${
              endY - startY
            }px) scale(1)`,
            opacity: 1,
          },
          {
            transform: `translate(${endX - startX}px, ${
              endY - startY - 50
            }px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 2000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      ).onfinish = () => {
        document.body.removeChild(particle);
      };
    },
  },

  mounted() {
    // 初始化历史记录
    this.optimizerStore.initHistory();

    // 添加页面进入动画
    this.$nextTick(() => {
      const cards = this.$el.querySelectorAll(".magic-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          card.style.transition = "all 0.6s ease-out";

          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        }, index * 100);
      });
    });
  },
};
</script>

<style scoped>
.network-optimizer {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  /* 确保容器内容不会产生滚动条 */
  box-sizing: border-box;
}

/* 主要内容 */
.main-content {
  display: flex;
  flex-direction: column;
}

/* 输入区域 */
.input-section {
  padding: 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

/* 问题输入区域 */
.prompt-section {
  margin-bottom: 32px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.label-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ff6b6b;
  margin-left: 4px;
}

.char-count {
  font-size: 0.9rem;
  color: #999;
  font-weight: normal;
}

.char-count.warning {
  color: #ff6b6b;
}

.magic-textarea {
  width: 100%;
  font-family: inherit;
  border: 2px solid rgba(30, 60, 114, 0.2);
  border-radius: 12px;
  padding: 16px;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.3s ease;
  background: white;
  resize: vertical;
}

.magic-textarea:focus {
  outline: none;
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}

/* 场景建议 */
.prompt-suggestions {
  margin-top: 16px;
  padding: 16px;
  background: rgba(30, 60, 114, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.suggestions-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 12px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  background: white;
  border: 1px solid rgba(30, 60, 114, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1e3c72;
}

.suggestion-tag:hover {
  background: #1e3c72;
  color: white;
  transform: translateY(-1px);
}

/* 模板区域 */
.framework-section {
  margin-bottom: 32px;
}

.framework-toggle {
  text-align: center;
  margin-bottom: 20px;
}

.toggle-btn {
  background: rgba(30, 60, 114, 0.1);
  border: 2px solid rgba(30, 60, 114, 0.3);
  border-radius: 25px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  color: #1e3c72;
}

.toggle-btn.active {
  background: #1e3c72;
  color: white;
  border-color: #1e3c72;
}

.toggle-btn:hover {
  background: rgba(30, 60, 114, 0.2);
  transform: translateY(-1px);
}

.toggle-hint {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-left: 8px;
}

.framework-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.framework-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 8px;
  background: rgba(78, 205, 196, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(78, 205, 196, 0.2);
}

.info-icon {
  font-size: 1.5rem;
  margin-top: 2px;
}

.info-text {
  color: #666;
  line-height: 1.5;
}

.framework-text,
.framework-file {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 操作区域 */
.action-section {
  text-align: center;
  margin-top: 20px;
}

.create-btn {
  font-size: 1.2rem;
  padding: 18px 36px;
  min-width: 280px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(30, 60, 114, 0.3);
}

.create-btn:hover {
  background: linear-gradient(45deg, #2a5298, #1e3c72);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 60, 114, 0.4);
}

.create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.help-text {
  margin-top: 12px;
  color: #999;
  font-size: 0.9rem;
}

/* 加载区域 */
.loading-section {
  text-align: center;
}

/* 错误区域 */
.error-section {
  padding: 32px;
  text-align: center;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-icon {
  font-size: 4rem;
}

.error-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.error-message {
  color: #666;
  font-size: 1.1rem;
  max-width: 400px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.magic-button {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 60, 114, 0.3);
}

/* 历史记录 */
.history-section {
  margin-top: 40px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}

.toggle-history-btn {
  background: rgba(30, 60, 114, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.3);
  border-radius: 12px;
  padding: 6px 16px;
  color: #1e3c72;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-history-btn:hover {
  background: rgba(30, 60, 114, 0.2);
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.history-item:hover {
  background: rgba(30, 60, 114, 0.05);
  border-color: rgba(30, 60, 114, 0.2);
}

.history-info {
  flex: 1;
}

.history-prompt {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 4px;
  font-weight: 500;
}

.history-time {
  font-size: 0.85rem;
  color: #999;
}

.history-meta {
  display: flex;
  gap: 8px;
}

.meta-tag {
  background: rgba(30, 60, 114, 0.1);
  color: #1e3c72;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
}

/* 小贴士 */
.tips-section {
  margin-top: 40px;
}

.tips-card {
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tips-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: rgba(30, 60, 114, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.tip-icon {
  font-size: 1.2rem;
  margin-top: 2px;
}

.tip-text {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  transform-origin: top;
}

.slide-down-enter-from {
  opacity: 0;
  transform: scaleY(0);
}

.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

.magic-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.1);
}

.cute-hover {
  transition: all 0.3s ease;
}

.cute-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .network-optimizer {
    padding: 16px;
  }

  .input-section {
    padding: 24px 20px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .create-btn {
    min-width: 240px;
    font-size: 1.1rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .history-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }

  .suggestion-tags {
    justify-content: center;
  }

  .tip-text {
    font-size: 0.85rem;
  }
}
</style>
