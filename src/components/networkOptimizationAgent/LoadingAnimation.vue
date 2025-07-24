<template>
  <div class="loading-container">
    <!-- 机器人动画 -->
    <div class="robot-container">
      <div class="robot-body">
        <div class="robot-head">
          <div class="robot-eyes">
            <div class="eye left-eye" :class="{ blink: isBlinking }"></div>
            <div class="eye right-eye" :class="{ blink: isBlinking }"></div>
          </div>
          <div class="robot-mouth" :class="{ smile: progress > 50 }"></div>
        </div>
        <div class="robot-arms">
          <div class="arm left-arm"></div>
          <div class="arm right-arm"></div>
        </div>
      </div>

      <!-- 思考气泡 -->
      <div class="thought-bubble" v-if="showThought">
        <div class="bubble-content">
          {{ currentThought }}
        </div>
      </div>
    </div>

    <!-- 加载文字 -->
    <div class="loading-text rainbow-text">
      {{ loadingText }}<span class="loading-dots"></span>
    </div>

    <!-- 进度条 -->
    <div class="progress-container">
      <div class="magic-progress">
        <div
          class="magic-progress-bar"
          :style="{ width: Math.min(progress, 100) + '%' }"
        ></div>
      </div>
      <div class="progress-text">
        {{ Math.round(Math.min(progress, 100)) }}%
      </div>
    </div>

    <!-- 鼓励词汇 -->
    <div class="encouragement" v-if="currentEncouragement">
      <span class="cute-icon">{{ encouragementIcon }}</span>
      {{ currentEncouragement }}
    </div>

    <!-- 浮动粒子效果 -->
    <div class="particles">
      <div
        v-for="i in 6"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingAnimation",
  props: {
    loadingText: {
      type: String,
      default: "🤖 AI正在分析网络问题",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isBlinking: false,
      showThought: false,
      currentThought: "",
      currentEncouragement: "",
      encouragementIcon: "✨",

      thoughts: [
        "💭 分析网络拓扑...",
        "📊 计算KPI指标...",
        "🔍 定位问题根因...",
        "🛠️ 生成优化方案...",
        "📈 评估优化效果...",
        "🎯 调整参数配置...",
      ],

      encouragements: [
        { text: "正在深度分析中！", icon: "🔍" },
        { text: "马上就有结果了！", icon: "⏰" },
        { text: "方案即将生成！", icon: "📋" },
        { text: "请耐心等待~", icon: "😊" },
        { text: "AI正在努力工作！", icon: "💪" },
        { text: "优化方案即将完成！", icon: "🎉" },
      ],
    };
  },

  mounted() {
    this.startAnimations();
  },

  methods: {
    startAnimations() {
      // 眨眼动画
      this.blinkInterval = setInterval(() => {
        this.isBlinking = true;
        setTimeout(() => {
          this.isBlinking = false;
        }, 150);
      }, 3000);

      // 思考气泡动画
      this.thoughtInterval = setInterval(() => {
        this.showThought = true;
        this.currentThought =
          this.thoughts[Math.floor(Math.random() * this.thoughts.length)];

        setTimeout(() => {
          this.showThought = false;
        }, 3000);
      }, 5000);

      // 鼓励词汇动画
      this.encouragementInterval = setInterval(() => {
        const encouragement =
          this.encouragements[
            Math.floor(Math.random() * this.encouragements.length)
          ];
        this.currentEncouragement = encouragement.text;
        this.encouragementIcon = encouragement.icon;

        setTimeout(() => {
          this.currentEncouragement = "";
        }, 4000);
      }, 6000);
    },

    getParticleStyle(index) {
      const angle = (index * 60 * Math.PI) / 180;
      const radius = 100 + Math.sin(Date.now() / 1000 + index) * 20;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        transform: `translate(${x}px, ${y}px)`,
        animationDelay: `${index * 0.2}s`,
      };
    },
  },

  beforeUnmount() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    if (this.thoughtInterval) clearInterval(this.thoughtInterval);
    if (this.encouragementInterval) clearInterval(this.encouragementInterval);
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  min-height: 400px;
}

/* 机器人样式 */
.robot-container {
  position: relative;
  margin-bottom: 32px;
}

.robot-body {
  position: relative;
  z-index: 2;
}

.robot-head {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border-radius: 20px;
  position: relative;
  margin: 0 auto 16px;
  animation: robotFloat 3s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(30, 60, 114, 0.3);
}

.robot-eyes {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.eye {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: relative;
  transition: all 0.15s ease;
}

.eye::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  animation: eyeMove 4s ease-in-out infinite;
}

.eye.blink {
  height: 2px;
  border-radius: 2px;
}

.robot-mouth {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  border: 2px solid white;
  border-top: none;
  border-radius: 0 0 20px 20px;
  transition: all 0.3s ease;
}

.robot-mouth.smile {
  width: 30px;
  height: 15px;
  border-radius: 0 0 30px 30px;
}

.robot-arms {
  display: flex;
  justify-content: space-between;
  width: 120px;
  margin: 0 auto;
}

.arm {
  width: 8px;
  height: 40px;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border-radius: 8px;
  animation: armWave 2s ease-in-out infinite;
}

.left-arm {
  animation-delay: 0s;
  transform-origin: top center;
}

.right-arm {
  animation-delay: 1s;
  transform-origin: top center;
}

/* 思考气泡 */
.thought-bubble {
  position: absolute;
  top: -60px;
  right: -80px;
  background: white;
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 3;
  opacity: 0;
  animation: thoughtFadeIn 0.5s ease forwards;
}

.thought-bubble::before {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top-color: white;
}

.bubble-content {
  font-size: 14px;
  color: #1e3c72;
  font-weight: 500;
  white-space: nowrap;
}

/* 加载文字 */
.loading-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 24px;
  text-align: center;
}

.loading-dots::after {
  content: "...";
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%,
  20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: #1e3c72;
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 #1e3c72, 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%,
  100% {
    text-shadow: 0.25em 0 0 #1e3c72, 0.5em 0 0 #1e3c72;
  }
}

/* 进度条容器 */
.progress-container {
  width: 300px;
  margin: 24px 0;
}

.magic-progress {
  width: 100%;
  height: 12px;
  background: rgba(30, 60, 114, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(30, 60, 114, 0.2);
}

.magic-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1e3c72, #4ecdc4, #2a5298, #44a08d);
  border-radius: 6px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.magic-progress-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1e3c72;
}

/* 鼓励文字 */
.encouragement {
  font-size: 18px;
  font-weight: 600;
  color: #4ecdc4;
  text-align: center;
  margin-top: 16px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
  animation: encouragementPulse 2s ease-in-out infinite;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(45deg, #1e3c72, #4ecdc4);
  border-radius: 50%;
  animation: particleFloat 4s ease-in-out infinite;
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

@keyframes armWave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes eyeMove {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-2px, 0);
  }
  50% {
    transform: translate(0, -1px);
  }
  75% {
    transform: translate(2px, 0);
  }
}

@keyframes thoughtFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes encouragementPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes particleFloat {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-container {
    padding: 32px 16px;
  }

  .progress-container {
    width: 250px;
  }

  .robot-head {
    width: 60px;
    height: 60px;
  }

  .robot-arms {
    width: 100px;
  }

  .thought-bubble {
    right: -60px;
    font-size: 12px;
  }

  .loading-text {
    font-size: 1.1rem;
  }

  .progress-text {
    font-size: 16px;
  }

  .encouragement {
    font-size: 16px;
    padding: 10px 20px;
  }
}
</style>
