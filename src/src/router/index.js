import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Scenarios from "@/views/Scenarios.vue";
import WirelessData from "@/views/WirelessData.vue"; // 修正路径

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
    path: "/wireless-data",
    name: "WirelessData",
    component: WirelessData,
    meta: {
      title: "无线数据仓库",
    },
  },
  {
    path: "/wireless/:wirelessType/datasets",
    name: "DatasetDetail",
    component: () => import("@/views/wirelessDataWarehouse/DatasetDetail.vue"), // 路径已正确
  },
  {
    path: "/upload",
    name: "DataUpload",
    component: () => import("@/components/data/upload/DataUpload.vue"),
    meta: {
      title: "数据上传",
    },
  },
  {
    path: "/viavi-download",
    name: "ViaviDownload",
    component: () => import("@/components/data/download/ViaviDataDownload.vue"),
    meta: {
      title: "仿真数据下载",
    },
  },
  {
    path: "/livenet-download",
    name: "LiveNetDownload",
    component: () =>
      import("@/components/data/download/LiveNetDataDownload.vue"),
    meta: {
      title: "现网数据下载",
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
    path: "/task-flow-editor",
    name: "TaskFlowEditor",
    component: () =>
      import("@/views/applicationScenario/AIForRAN/TaskFlowEditor.vue"),
    meta: { title: "任务流编辑器" },
  },
  {
    path: "/pingpong-switch",
    name: "PingpongSwitch",
    component: () =>
      import("@/views/applicationScenario/AIForRAN/PingpongSwitch.vue"),
    meta: { title: "乒乓切换优化" },
  },
  {
    path: "/network-optimization-agent",
    name: "NetworkOptimizationAgent",
    component: () =>
      import(
        "@/views/applicationScenario/AIForRAN/NetworkOptimizationAgent.vue"
      ),
    meta: { title: "网优助手" },
  },
  {
    path: "/active-beam-selection",
    name: "ActiveBeamSelection",
    component: () =>
      import("@/views/applicationScenario/AIForRAN/ActiveBeamSelection.vue"),
    meta: { title: "主动波束选择" },
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
