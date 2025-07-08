import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Capabilities from "@/views/Capabilities.vue";
import Scenarios from "@/views/Scenarios.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "首页 - Wi-Dop无线数据一站式平台",
    },
  },
  {
    path: "/capabilities",
    name: "Capabilities",
    component: Capabilities,
    meta: {
      title: "五大能力 - Wi-Dop无线数据一站式平台",
    },
  },
  {
    path: "/scenarios",
    name: "Scenarios",
    component: Scenarios,
    meta: {
      title: "应用场景 - Wi-Dop无线数据一站式平台",
    },
  },
  {
    path: "/scenarios/ai-for-ran",
    name: "AIForRAN",
    component: () => import("@/views/scenarios/AIForRAN.vue"),
    meta: {
      title: "AI for RAN - Wi-Dop平台",
    },
  },
  {
    path: "/scenarios/ran-for-ai",
    name: "RANForAI",
    component: () => import("@/views/scenarios/RANForAI.vue"),
    meta: {
      title: "RAN for AI - Wi-Dop平台",
    },
  },
  {
    path: "/scenarios/digital-twin",
    name: "DigitalTwin",
    component: () => import("@/views/scenarios/DigitalTwin.vue"),
    meta: {
      title: "数字孪生 - Wi-Dop平台",
    },
  },
  {
    path: "/scenarios/data-asset",
    name: "DataAsset",
    component: () => import("@/views/scenarios/DataAsset.vue"),
    meta: {
      title: "数据资产 - Wi-Dop平台",
    },
  },
  {
    path: "/task-flow-editor",
    name: "TaskFlowEditor",
    component: () => import("@/views/TaskFlowEditor.vue"),
    meta: { title: "任务流编辑器" },
  },
  {
    path: "/pingpong-switch",
    name: "PingpongSwitch",
    component: () => import("@/views/PingpongSwitch.vue"),
    meta: { title: "乒乓切换优化" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
