import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // 当前选中的场景
    currentScenario: null,

    // 平台核心信息
    platformInfo: {
      name: "Wi-Dop",
      fullName: "无线数据一站式平台",
      englishName: "Wireless Data One-stop Platform",
      slogan: "一站聚合，双擎智变，三性护航，四景落地，五维进化",
    },

    // 三大特性
    coreFeatures: [
      {
        id: "comprehensive",
        name: "全",
        title: "全",
        description:
          "覆盖无线通信全领域数据，包括运营、运维、网优和网规划等业务场景，提供从底层信号到上层应用的全栈数据支持。",
        icon: "DataBoard",
      },
      {
        id: "intelligent",
        name: "智",
        title: "智",
        description:
          "集成AI算法与智能分析工具，提供数据增强、特征提取、模型训练等全流程智能化支持，加速研究进程。",
        icon: "cpu",
      },
      {
        id: "trustworthy",
        name: "信",
        title: "信",
        description:
          "依托现网数据和高质量仿真数据的交叉认证，借助数据脱敏技术，保障数据安全与隐私。",
        icon: "Lock",
      },
    ],

    // 五大能力
    capabilities: [
      {
        id: "universality",
        name: "数据通用能力",
        title: "数据的规范化与泛化",
        description: "规范适配无线数据进行，支持需求定制，保障数据的通用性",
        icon: "Connection",
        color: "#409EFF",
        image: require("@/assets/1.png"),
      },
      {
        id: "incubation",
        name: "数据孵化能力",
        title: "数据分类增强筛选",
        description: "支持数据清洗、标注、增强等预处理，提升数据价值",
        icon: "DataAnalysis",
        color: "#67C23A",
        image: require("@/assets/2.png"),
      },
      {
        id: "processing",
        name: "数据加工能力",
        title: "数据处理工具链",
        description: "提供单独工具和工具串联，实现原始数据到高质量数据的转换",
        icon: "Setting",
        color: "#E6A23C",
        image: require("@/assets/3.png"),
      },
      {
        id: "validation",
        name: "数据评估能力",
        title: "数据评估验证体系",
        description: "提供多维度的数据质量评估与分析，确保数据可用性",
        icon: "CircleCheck",
        color: "#F56C6C",
        image: require("@/assets/4.png"),
      },
      {
        id: "ecosystem",
        name: "数据生态能力",
        title: "开放协作生态",
        description:
          "构建开放共享的数据协作生态，实现数据、工具和模型的开发共享，促进跨领域合作创新",
        icon: "Share",
        color: "#909399",
        image: require("@/assets/5.png"),
      },
    ],

    // 四大应用场景
    applicationScenarios: [
      {
        id: "operation",
        name: "运营场景",
        title: "智能运营数据服务",
        description:
          "提供用户行为分析、业务质量评估、资源优化等数据服务，助力运营商提升网络运营效率与用户体验",
        icon: "TrendCharts",
        image: require("@/assets/operation.png"),
        color: "#409EFF",
      },
      {
        id: "maintenance",
        name: "运维场景",
        title: "智能运维数据服务",
        description:
          "提供设备状态监测、故障预测、性能优化等数据服务，实现网络运维的智能化与自动化",
        icon: "Tools",
        image: require("@/assets/maintenance.png"),
        color: "#67C23A",
      },
      {
        id: "optimization",
        name: "网优场景",
        title: "网络优化数据服务",
        description:
          "提供覆盖分析、干扰识别、参数优化等数据服务，提升网络质量与容量，降低优化成本",
        icon: "Connection",
        image: require("@/assets/optimization.png"),
        color: "#E6A23C",
      },
      {
        id: "planning",
        name: "网规场景",
        title: "网络规划数据服务",
        description:
          "提供覆盖预测、容量规划、站点选址等数据服务，支持网络建设的科学决策与高效实施",
        icon: "MapLocation",
        image: require("@/assets/planning.png"),
        color: "#F56C6C",
      },
    ],
    scenarios: [
      {
        id: "ai-for-ran",
        name: "AI for RAN",
        title: "网络智能优化",
        description: "利用AI技术优化无线网络性能",
        icon: "Cpu",
        cases: ["乒乓切换优化", "多案例链式编排"],
      },
      {
        id: "ran-for-ai",
        name: "RAN for AI",
        title: "RAN辅助AI",
        description: "网络数据辅助AI模型训练和优化",
        icon: "DataBoard",
        status: "coming-soon",
      },
      {
        id: "digital-twin",
        name: "数字孪生",
        title: "网络数字孪生",
        description: "构建网络的数字化镜像",
        icon: "Monitor",
        status: "coming-soon",
      },
      {
        id: "data-asset",
        name: "数据资产",
        title: "数据资产管理",
        description: "无线数据的资产化管理",
        icon: "Coin",
        status: "coming-soon",
      },
    ],
  }),

  getters: {
    // 获取可用的场景（排除即将推出的）
    availableScenarios: (state) => {
      return state.scenarios.filter((scenario) => !scenario.status);
    },

    // 根据ID获取能力信息
    getCapabilityById: (state) => {
      return (id) => state.capabilities.find((cap) => cap.id === id);
    },

    // 根据ID获取场景信息
    getScenarioById: (state) => {
      return (id) => state.scenarios.find((scenario) => scenario.id === id);
    },

    // 根据ID获取应用场景信息
    getApplicationScenarioById: (state) => {
      return (id) =>
        state.applicationScenarios.find((scenario) => scenario.id === id);
    },
  },

  actions: {
    // 设置当前场景
    setCurrentScenario(scenarioId) {
      this.currentScenario = scenarioId;
    },

    // 清除当前场景
    clearCurrentScenario() {
      this.currentScenario = null;
    },
  },
});
