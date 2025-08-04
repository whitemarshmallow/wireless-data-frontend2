import { defineStore } from "pinia";
import { getApiUrl } from "../utils/api";

// API配置
const baseUrl = null; // 使用全局配置

export const useBeamSelectionStore = defineStore("beamSelection", {
  state: () => ({
    // 步骤状态
    steps: [
      { id: 1, name: "数据输入", status: "pending" }, // pending, loaded, selected
      { id: 2, name: "模型训练", status: "pending" },
      { id: 3, name: "模型部署&推理", status: "pending" },
    ],

    // 可选择的训练数据文件
    availableTrainingFiles: [
      {
        id: 1,
        name: "无线网络参数.json",
        size: "1.2M",
        date: "2023-10-12",
      },
      {
        id: 2,
        name: "无线网络数据_Raw.json",
        size: "2.8M",
        date: "2023-10-14",
      },
    ],

    // 已加载的训练数据列表
    loadedTrainingDataList: [],
    selectedTrainingFileId: null,
    selectedTrainingData: null,

    // 可选择的预测模型文件
    availableModelFiles: [
      {
        id: 1,
        name: "Retrival-augmented GAT",
        type: "非线性模型",
        date: "2025-07-24",
      },
    ],

    // 已加载的模型列表
    loadedModelList: [],
    selectedModelFileId: null,
    selectedModel: null,

    // 数据情况选择
    dataTypes: [
      { key: "RawData", label: "原始数据", checked: false },
      { key: "FinelyFiltered", label: "粗筛数据", checked: false },
      { key: "CoarselyFiltered", label: "精筛数据", checked: false },
    ],

    // 性能指标数据
    performanceData: [
      {
        metric: "平均速率",
        rawData: "18.93",
        finelyFiltered: "18.93",
        coarselyFiltered: "15.95",
      },
      {
        metric: "90百分位速率",
        rawData: "25.55",
        finelyFiltered: "25.55",
        coarselyFiltered: "23.09",
      },
      {
        metric: "10百分位数据",
        rawData: "7.58",
        finelyFiltered: "7.58",
        coarselyFiltered: "5.55",
      },
    ],

    // 结果显示状态
    showResults: false,
    showPerformanceChart: false,
    showPerformanceTable: false,
    resultImages: [],
  }),

  getters: {
    canStart: (state) => {
      return (
        state.selectedTrainingData &&
        state.selectedModel &&
        state.dataTypes.some((type) => type.checked)
      );
    },

    canReset: (state) => {
      return state.showPerformanceChart || state.showPerformanceTable;
    },

    canLoadTrainingData: (state) => {
      return state.selectedTrainingFileId !== null;
    },

    canLoadModel: (state) => {
      return state.selectedModelFileId !== null;
    },

    selectedDataTypes: (state) => {
      return state.dataTypes
        .filter((type) => type.checked)
        .map((type) => type.key);
    },
  },

  actions: {
    // 选择训练数据文件
    selectTrainingFile(fileId) {
      this.selectedTrainingFileId = fileId;
    },

    // 加载训练数据
    loadTrainingData() {
      if (!this.selectedTrainingFileId) return;

      const file = this.availableTrainingFiles.find(
        (f) => f.id === this.selectedTrainingFileId
      );
      if (file) {
        const loadedData = {
          ...file,
          status: "已加载",
          loadedAt: new Date().toLocaleString(),
        };

        // 检查是否已经加载过
        const existingIndex = this.loadedTrainingDataList.findIndex(
          (d) => d.id === file.id
        );
        if (existingIndex > -1) {
          this.loadedTrainingDataList[existingIndex] = loadedData;
        } else {
          this.loadedTrainingDataList.push(loadedData);
        }

        this.selectedTrainingData = loadedData;
        this.steps[0].status = "loaded";
      }
    },

    // 删除训练数据
    deleteTrainingData(dataId) {
      const index = this.loadedTrainingDataList.findIndex(
        (data) => data.id === dataId
      );
      if (index > -1) {
        this.loadedTrainingDataList.splice(index, 1);
        if (this.selectedTrainingData?.id === dataId) {
          this.selectedTrainingData = null;
          this.steps[0].status = "pending";
        }
      }
    },

    // 选择预测模型文件
    selectModelFile(fileId) {
      this.selectedModelFileId = fileId;
    },

    // 加载预测模型
    loadModel() {
      if (!this.selectedModelFileId) return;

      const file = this.availableModelFiles.find(
        (f) => f.id === this.selectedModelFileId
      );
      if (file) {
        const loadedModel = {
          ...file,
          status: "已选择",
          loadedAt: new Date().toLocaleString(),
        };

        // 检查是否已经加载过
        const existingIndex = this.loadedModelList.findIndex(
          (m) => m.id === file.id
        );
        if (existingIndex > -1) {
          this.loadedModelList[existingIndex] = loadedModel;
        } else {
          this.loadedModelList.push(loadedModel);
        }

        this.selectedModel = loadedModel;
        this.steps[1].status = "selected";
      }
    },

    // 删除预测模型
    deleteModel(modelId) {
      const index = this.loadedModelList.findIndex(
        (model) => model.id === modelId
      );
      if (index > -1) {
        this.loadedModelList.splice(index, 1);
        if (this.selectedModel?.id === modelId) {
          this.selectedModel = null;
          this.steps[1].status = "pending";
        }
      }
    },

    // 切换数据类型选择
    toggleDataType(key) {
      const dataType = this.dataTypes.find((type) => type.key === key);
      if (dataType) {
        dataType.checked = !dataType.checked;
      }
    },

    // 启动分析
    async startAnalysis() {
      if (!this.canStart) return;

      try {
        // API调用
        const selectedTypes = this.selectedDataTypes.map((type) => type.key);

        const response = await fetch(
          getApiUrl("/api/beam-selection/image", baseUrl),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedTypes }),
          }
        );

        if (!response.ok) {
          throw new Error("图像生成失败");
        }

        const result = await response.json();
        console.log("图像生成结果:", result);

        this.resultImages = result.images;
        console.log("resultImages:", this.resultImages);

        this.showResults = true;
        this.showPerformanceChart = true;
        this.showPerformanceTable = true;
        this.steps[2].status = "completed";

        return result;
      } catch (error) {
        console.error("启动分析失败:", error);
        throw error;
      }
    },

    resetAnalysis() {
      this.showResults = false;
      this.showPerformanceChart = false;
      this.showPerformanceTable = false;
      this.resultImages = [];
      this.steps[2].status = "pending";
    },

    // 关闭结果显示
    closeResults() {
      this.showResults = false;
    },
  },
});
