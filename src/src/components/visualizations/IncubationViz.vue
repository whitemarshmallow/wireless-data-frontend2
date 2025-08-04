<template>
  <div class="incubation-viz">
    <div class="viz-container">
      <div class="data-flow">
        <div class="flow-step">
          <el-icon class="step-icon"><Document /></el-icon>
          <span>原始数据</span>
        </div>
        <el-icon class="flow-arrow"><ArrowRight /></el-icon>
        <div class="flow-step processing">
          <el-icon class="step-icon"><Setting /></el-icon>
          <span>智能分类</span>
        </div>
        <el-icon class="flow-arrow"><ArrowRight /></el-icon>
        <div class="flow-step">
          <el-icon class="step-icon"><Star /></el-icon>
          <span>增强数据</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IncubationViz",
};
</script>

<style scoped>
.incubation-viz {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-flow {
  display: flex;
  align-items: center;
  gap: 24px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.processing {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
}

.step-icon {
  font-size: 32px;
}

.flow-arrow {
  font-size: 24px;
  color: var(--primary-color);
}
</style>
