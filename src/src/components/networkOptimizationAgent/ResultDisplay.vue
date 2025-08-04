<template>
  <div class="result-display" v-if="result">
    <!-- 成功标题 -->
    <div class="success-header">
      <div class="success-icon celebrate">🎉</div>
      <h2 class="success-title rainbow-text">优化方案生成完成！</h2>
      <div class="success-subtitle">你的专属网优方案已经准备好啦~</div>
    </div>

    <!-- 方案信息卡片 -->
    <div class="solution-info magic-card">
      <div class="info-header">
        <div class="solution-icon">📊</div>
        <div class="info-details">
          <div class="solution-filename">
            {{ result.filename || "网优方案.txt" }}
          </div>
          <div class="creation-time">
            生成时间：{{ result.createdAt || formatTime(new Date()) }}
          </div>
        </div>
        <div class="status-badge">
          <span class="status-text">已完成</span>
          <span class="status-icon">✨</span>
        </div>
      </div>
    </div>

    <!-- 内容预览区域 -->
    <div class="content-preview magic-card">
      <div class="preview-header">
        <h3 class="preview-title">
          <span class="cute-icon">👀</span>
          方案预览
        </h3>
        <div class="preview-controls">
          <button
            class="control-btn"
            @click="toggleExpanded"
            :class="{ active: isExpanded }"
          >
            {{ isExpanded ? "收起" : "展开" }}
          </button>
          <button
            class="control-btn"
            @click="toggleTypewriter"
            :class="{ active: useTypewriter }"
          >
            {{ useTypewriter ? "关闭动效" : "打字效果" }}
          </button>
        </div>
      </div>

      <div class="preview-content" :class="{ expanded: isExpanded }">
        <div
          class="solution-text"
          :class="{ typewriter: useTypewriter && isTyping }"
          ref="solutionTextRef"
        >
          {{ displayText }}
        </div>

        <!-- 显示更多按钮 -->
        <div v-if="!isExpanded && needsExpansion" class="show-more">
          <button class="magic-button" @click="toggleExpanded">
            查看完整方案
          </button>
        </div>
      </div>
    </div>

    <!-- 文字统计 -->
    <div class="text-stats">
      <div class="stat-item">
        <span class="stat-icon">📝</span>
        <span class="stat-text">字数：{{ textStats.chars }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📄</span>
        <span class="stat-text">段落：{{ textStats.paragraphs }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⏱️</span>
        <span class="stat-text">阅读时间：约{{ textStats.readTime }}分钟</span>
      </div>
    </div>
  </div>

  <!-- 操作按钮区域 -->
  <div class="action-buttons">
    <button class="magic-button rainbow cute-hover" @click="downloadSolution">
      <span class="cute-icon">📥</span>
      下载方案
    </button>

    <button class="magic-button cute-hover" @click="copyToClipboard">
      <span class="cute-icon">📋</span>
      复制内容
    </button>

    <button
      class="magic-button cute-hover"
      @click="shareSolution"
      v-if="canShare"
    >
      <span class="cute-icon">📤</span>
      分享
    </button>

    <button class="magic-button cute-hover new-solution-btn" @click="createNew">
      <span class="cute-icon">🔄</span>
      再次优化
    </button>
  </div>

  <!-- 反馈区域 -->
  <div class="feedback-section magic-card">
    <h4 class="feedback-title">
      <span class="cute-icon">💕</span>
      你觉得这个优化方案怎么样？
    </h4>
    <div class="feedback-buttons">
      <button
        class="feedback-btn"
        :class="{ selected: feedback === 'excellent' }"
        @click="setFeedback('excellent')"
      >
        <span class="feedback-emoji">🎯</span>
        <span class="feedback-text">很实用！</span>
      </button>
      <button
        class="feedback-btn"
        :class="{ selected: feedback === 'good' }"
        @click="setFeedback('good')"
      >
        <span class="feedback-emoji">👍</span>
        <span class="feedback-text">不错</span>
      </button>
      <button
        class="feedback-btn"
        :class="{ selected: feedback === 'ok' }"
        @click="setFeedback('ok')"
      >
        <span class="feedback-emoji">🤔</span>
        <span class="feedback-text">一般</span>
      </button>
    </div>
    <div v-if="feedback" class="feedback-message">
      谢谢你的反馈！我们会继续完善网优助手~
    </div>
  </div>

  <!-- 成功提示 -->
  <Transition name="toast">
    <div v-if="showToast" class="toast-message" :class="toastType">
      {{ toastMessage }}
    </div>
  </Transition>
</template>

<script>
export default {
  name: "ResultDisplay",
  props: {
    result: {
      type: Object,
      default: null,
    },
  },
  emits: ["download", "create-new"],

  data() {
    return {
      isExpanded: false,
      useTypewriter: true,
      isTyping: false,
      displayText: "",
      typewriterSpeed: 30, // 打字速度

      feedback: null,
      showToast: false,
      toastMessage: "",
      toastType: "success",

      canShare: !!navigator.share,
    };
  },

  computed: {
    // 获取预览文本
    previewText() {
      if (!this.result?.preview) return "";
      return this.isExpanded
        ? this.result.preview
        : this.result.preview.slice(0, 500);
    },

    // 检查是否需要展开按钮
    needsExpansion() {
      return this.result?.preview && this.result.preview.length > 500;
    },

    // 文本统计
    textStats() {
      const text = this.result?.preview || "";
      const chars = text.length;
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
      const readTime = Math.ceil(chars / 400); // 每分钟400字

      return { chars, paragraphs, readTime };
    },
  },

  watch: {
    result: {
      immediate: true,
      handler(newResult) {
        if (newResult && this.useTypewriter) {
          this.startTypewriter();
        } else if (newResult) {
          this.displayText = this.previewText;
        }
      },
    },

    previewText(newText) {
      if (this.useTypewriter) {
        this.startTypewriter();
      } else {
        this.displayText = newText;
      }
    },
  },

  methods: {
    // 开始打字机效果
    async startTypewriter() {
      if (!this.result?.preview) return;

      this.isTyping = true;
      this.displayText = "";
      const targetText = this.previewText;

      for (let i = 0; i <= targetText.length; i++) {
        this.displayText = targetText.slice(0, i);
        await this.sleep(this.typewriterSpeed);
      }

      this.isTyping = false;
    },

    // 切换展开状态
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },

    // 切换打字机效果
    toggleTypewriter() {
      this.useTypewriter = !this.useTypewriter;
      if (!this.useTypewriter) {
        this.displayText = this.previewText;
        this.isTyping = false;
      } else {
        this.startTypewriter();
      }
    },

    // 下载方案
    downloadSolution() {
      this.$emit("download");
      this.showToastMessage("开始下载优化方案文件~", "success");
    },

    // 复制到剪贴板
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.result.preview);
        this.showToastMessage("方案内容已复制到剪贴板！", "success");
      } catch (error) {
        // 降级方案
        const textArea = document.createElement("textarea");
        textArea.value = this.result.preview;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        this.showToastMessage("内容已复制！", "success");
      }
    },

    // 分享方案
    async shareSolution() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "我生成了一个网优方案！",
            text: this.result.preview.slice(0, 200) + "...",
            url: window.location.href,
          });
          this.showToastMessage("分享成功！", "success");
        } catch (error) {
          console.log("分享取消");
        }
      }
    },

    // 创建新方案
    createNew() {
      this.$emit("create-new");
    },

    // 设置反馈
    setFeedback(type) {
      this.feedback = type;

      const messages = {
        excellent: "太棒了！这样的方案正是网优工程师需要的！",
        good: "谢谢认可！我们会继续优化算法~",
        ok: "感谢反馈！我们会持续改进方案质量！",
      };

      this.showToastMessage(messages[type], "success");
    },

    // 显示提示消息
    showToastMessage(message, type = "success") {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    // 格式化时间
    formatTime(date) {
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // 睡眠函数
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },

  mounted() {
    // 添加成功动画 - 修复$el问题
    if (this.result) {
      setTimeout(() => {
        // 使用更安全的DOM查询方式
        const header = document.querySelector(".success-header");
        if (header) {
          header.classList.add("success-enter");
        }
      }, 100);
    }
  },
};
</script>

<style scoped>
.result-display {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* 确保没有内部滚动条 */
  box-sizing: border-box;
}

/* 成功标题 */
.success-header {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  animation: successEnter 0.8s ease-out 0.3s forwards;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.success-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #1e3c72, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.success-subtitle {
  font-size: 1.2rem;
  color: #666;
  font-weight: 600;
}

/* 方案信息 */
.solution-info {
  padding: 20px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.solution-icon {
  font-size: 2.5rem;
  animation: solutionFloat 3s ease-in-out infinite;
}

.info-details {
  flex: 1;
}

.solution-filename {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.creation-time {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 内容预览 */
.content-preview {
  padding: 24px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.preview-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  background: rgba(30, 60, 114, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.3);
  border-radius: 12px;
  padding: 6px 12px;
  color: #1e3c72;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn.active {
  background: #1e3c72;
  color: white;
}

.control-btn:hover {
  background: rgba(30, 60, 114, 0.2);
}

.preview-content {
  position: relative;
}

.preview-content.expanded {
  max-height: none;
}

.solution-text {
  line-height: 1.8;
  color: #2c3e50;
  font-size: 1.05rem;
  font-weight: 500;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #1e3c72;
  max-height: 400px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.preview-content.expanded .solution-text {
  max-height: none;
}

.solution-text.typewriter {
  overflow: visible;
}

.solution-text.typewriter::after {
  content: "|";
  color: #1e3c72;
  animation: blink 1s infinite;
}

.show-more {
  text-align: center;
  margin-top: 16px;
}

/* 文字统计 */
.text-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  padding: 16px;
  background: rgba(30, 60, 114, 0.05);
  border-radius: 12px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #666;
  font-weight: 600;
}

.stat-icon {
  font-size: 1.1rem;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 20px 0;
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
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 60, 114, 0.4);
}

.new-solution-btn {
  background: linear-gradient(45deg, #4ecdc4, #44a08d) !important;
}

.new-solution-btn:hover {
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4) !important;
}

.cute-hover {
  transition: all 0.3s ease;
}

.cute-hover:hover {
  transform: translateY(-2px);
}

/* 反馈区域 */
.feedback-section {
  padding: 24px;
  text-align: center;
}

.feedback-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
}

.feedback-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feedback-btn {
  background: white;
  border: 2px solid rgba(30, 60, 114, 0.2);
  border-radius: 15px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 100px;
}

.feedback-btn:hover {
  border-color: #1e3c72;
  background: rgba(30, 60, 114, 0.05);
  transform: translateY(-2px);
}

.feedback-btn.selected {
  background: #1e3c72;
  color: white;
  border-color: #1e3c72;
}

.feedback-emoji {
  font-size: 1.5rem;
}

.feedback-text {
  font-size: 0.9rem;
  font-weight: 600;
}

.feedback-message {
  color: #1e3c72;
  font-weight: 600;
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(30, 60, 114, 0.1);
  border-radius: 12px;
  display: inline-block;
}

/* 提示消息 */
.toast-message {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #2c3e50;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 600;
  border-left: 4px solid #1e3c72;
}

.toast-message.error {
  border-left-color: #ff6b6b;
}

.magic-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(30, 60, 114, 0.1);
}

/* 动画 */
@keyframes successEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes solutionFloat {
  0%,
  100% {
    transform: translateY(0px) rotateZ(0deg);
  }
  50% {
    transform: translateY(-5px) rotateZ(2deg);
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* 过渡效果 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-display {
    padding: 16px;
  }

  .success-title {
    font-size: 2rem;
  }

  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }

  .preview-controls {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons .magic-button {
    min-width: 200px;
  }

  .text-stats {
    flex-direction: column;
    gap: 12px;
  }

  .feedback-buttons {
    flex-direction: column;
    align-items: center;
  }

  .feedback-btn {
    flex-direction: row;
    min-width: 120px;
    gap: 8px;
  }

  .info-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
