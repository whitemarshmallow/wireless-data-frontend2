<template>
  <div class="universality-viz">
    <div class="viz-content">
      <div class="data-sources">
        <div class="source-item" v-for="source in dataSources" :key="source.id">
          <el-icon class="source-icon"><component :is="source.icon" /></el-icon>
          <span class="source-name">{{ source.name }}</span>
        </div>
      </div>

      <div class="transformation-arrow">
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        <span class="transform-text">规范化处理</span>
      </div>

      <div class="unified-format">
        <el-icon class="unified-icon"><DataBoard /></el-icon>
        <span class="unified-text">统一数据标准</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "UniversalityViz",
  setup() {
    const dataSources = ref([
      { id: 1, name: "CSV", icon: "Document" },
      { id: 2, name: "JSON", icon: "DocumentCopy" },
      { id: 3, name: "Excel", icon: "Tickets" },
      { id: 4, name: "Database", icon: "Coin" },
    ]);

    return {
      dataSources,
    };
  },
};
</script>

<style scoped>
.universality-viz {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viz-content {
  display: flex;
  align-items: center;
  gap: 40px;
}

.data-sources {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f0f8ff;
  border-radius: 8px;
  color: var(--primary-color);
}

.source-icon {
  font-size: 20px;
}

.transformation-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--success-color);
}

.arrow-icon {
  font-size: 32px;
}

.transform-text {
  font-size: 14px;
  font-weight: bold;
}

.unified-format {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.unified-icon {
  font-size: 48px;
}

.unified-text {
  font-weight: bold;
}
</style>
