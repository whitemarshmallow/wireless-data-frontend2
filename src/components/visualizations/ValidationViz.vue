<template>
  <div class="validation-viz">
    <div class="validation-process">
      <div class="metrics-circle">
        <div class="metric" v-for="metric in metrics" :key="metric.name">
          <div class="metric-value">{{ metric.value }}%</div>
          <div class="metric-name">{{ metric.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ValidationViz",
  setup() {
    const metrics = ref([
      { name: "准确性", value: 95 },
      { name: "完整性", value: 88 },
      { name: "一致性", value: 92 },
    ]);

    return { metrics };
  },
};
</script>

<style scoped>
.validation-viz {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metrics-circle {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.metric {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--success-color);
}

.metric-name {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
