<template>
  <div class="ecosystem-viz">
    <div class="ecosystem-network">
      <div class="center-node">
        <el-icon class="center-icon"><Share /></el-icon>
        <span class="center-span">生态中心</span>
      </div>
      <div class="outer-nodes">
        <div v-for="node in nodes" :key="node.id" class="eco-node">
          <el-icon><component :is="node.icon" /></el-icon>
          <span>{{ node.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "EcosystemViz",
  setup() {
    const nodes = ref([
      { id: 1, name: "贡献者", icon: "User" },
      { id: 2, name: "开发者", icon: "Monitor" },
      { id: 3, name: "研究者", icon: "Reading" },
      { id: 4, name: "企业", icon: "OfficeBuilding" },
    ]);

    return { nodes };
  },
};
</script>

<style scoped>
.ecosystem-viz {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ecosystem-network {
  position: relative;
  width: 300px;
  height: 300px;
}

.center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  justify-content: center;
}

.center-span {
  width: 64px;
}

.center-icon {
  font-size: 24px;
}

.outer-nodes {
  position: relative;
  width: 100%;
  height: 100%;
}

.eco-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
}

.eco-node:nth-child(1) {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.eco-node:nth-child(2) {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.eco-node:nth-child(3) {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.eco-node:nth-child(4) {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
