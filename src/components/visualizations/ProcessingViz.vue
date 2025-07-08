<template>
  <div class="processing-viz">
    <div class="tools-grid">
      <div v-for="tool in tools" :key="tool.id" class="tool-item">
        <el-icon class="tool-icon"><component :is="tool.icon" /></el-icon>
        <span class="tool-name">{{ tool.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ProcessingViz",
  setup() {
    const tools = ref([
      { id: 1, name: "数据清洗", icon: "Brush" },
      { id: 2, name: "特征提取", icon: "Filter" },
      { id: 3, name: "格式转换", icon: "Switch" },
      { id: 4, name: "质量检测", icon: "View" },
    ]);

    return { tools };
  },
};
</script>

<style scoped>
.processing-viz {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f0f8ff;
  border-radius: 8px;
  color: var(--primary-color);
}

.tool-icon {
  font-size: 28px;
}

.tool-name {
  font-size: 14px;
  font-weight: bold;
}
</style>
