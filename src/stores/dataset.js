import { defineStore } from "pinia";

export const useDatasetStore = defineStore("dataset", {
  state: () => ({
    // 预置数据集 - 按无线数据类型分类
    presetDatasets: {
      "ai-for-ran": [
        {
          id: "dataset-001",
          name: "网络编排数据集 v1.0",
          description: "包含5G网络资源编排和负载均衡的综合数据集",
          size: "2.3 GB",
          format: "CSV, JSON",
          uploadTime: "2024-01-15 10:30:00",
          downloadCount: 156,
        },
        {
          id: "dataset-002",
          name: "智能调度数据集 v2.1",
          description: "基于机器学习的网络资源智能调度训练数据",
          size: "1.8 GB",
          format: "TensorFlow Record",
          uploadTime: "2024-01-20 14:45:00",
          downloadCount: 89,
        },
        {
          id: "dataset-003",
          name: "网络性能优化数据集",
          description: "多场景下的网络性能优化实验数据",
          size: "3.1 GB",
          format: "HDF5, CSV",
          uploadTime: "2024-02-01 09:15:00",
          downloadCount: 234,
        },
        {
          id: "dataset-004",
          name: "边缘计算编排数据集",
          description: "边缘计算环境下的资源编排和管理数据",
          size: "1.5 GB",
          format: "JSON, YAML",
          uploadTime: "2024-02-10 16:20:00",
          downloadCount: 67,
        },
      ],
      "ran-for-ai": [
        {
          id: "dataset-101",
          name: "RAN智能优化数据集",
          description: "用于RAN网络智能优化的训练和测试数据",
          size: "4.2 GB",
          format: "CSV, Parquet",
          uploadTime: "2024-01-25 11:20:00",
          downloadCount: 123,
        },
      ],
      "digital-twin": [
        {
          id: "dataset-201",
          name: "网络数字孪生基础数据集",
          description: "构建网络数字孪生模型的基础数据集合",
          size: "5.7 GB",
          format: "JSON, XML, CSV",
          uploadTime: "2024-02-05 13:30:00",
          downloadCount: 78,
        },
      ],
      "data-asset": [
        {
          id: "dataset-301",
          name: "网络数据资产目录",
          description: "标准化的网络数据资产分类和管理目录",
          size: "0.8 GB",
          format: "Excel, CSV",
          uploadTime: "2024-01-30 10:45:00",
          downloadCount: 95,
        },
      ],
    },

    // 当前正在查看的数据集类型
    currentWirelessType: null,

    // 搜索和筛选状态
    searchFilters: {
      keyword: "",
      status: "",
      category: "",
      tags: [],
    },

    // 排序设置
    sortConfig: {
      field: "uploadTime", // 排序字段
      order: "desc", // 排序方向: asc | desc
    },
  }),

  getters: {
    // 根据无线数据类型获取所有数据集（预置 + 本地存储）
    getDatasetsByType: (state) => {
      return (wirelessType) => {
        const presetDatasets = state.presetDatasets[wirelessType] || [];
        const localStorageKey = `datasets_${wirelessType}`;
        const localDatasets = JSON.parse(
          localStorage.getItem(localStorageKey) || "[]"
        );
        return [...presetDatasets, ...localDatasets];
      };
    },

    // 获取当前类型的数据集
    getCurrentDatasets: (state) => {
      if (!state.currentWirelessType) return [];
      const presetDatasets =
        state.presetDatasets[state.currentWirelessType] || [];
      const localStorageKey = `datasets_${state.currentWirelessType}`;
      const localDatasets = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );
      return [...presetDatasets, ...localDatasets];
    },

    // 获取过滤后的数据集
    getFilteredDatasets: (state, getters) => {
      if (!state.currentWirelessType) return [];

      const allDatasets = getters.getCurrentDatasets;
      let filtered = [...allDatasets];

      // 关键词搜索
      if (state.searchFilters.keyword) {
        const keyword = state.searchFilters.keyword.toLowerCase();
        filtered = filtered.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(keyword) ||
            dataset.description.toLowerCase().includes(keyword) ||
            dataset.author.toLowerCase().includes(keyword) ||
            dataset.tags.some((tag) => tag.toLowerCase().includes(keyword))
        );
      }

      // 状态筛选
      if (state.searchFilters.status) {
        filtered = filtered.filter(
          (dataset) => dataset.status === state.searchFilters.status
        );
      }

      // 分类筛选
      if (state.searchFilters.category) {
        filtered = filtered.filter(
          (dataset) => dataset.category === state.searchFilters.category
        );
      }

      // 标签筛选
      if (state.searchFilters.tags.length > 0) {
        filtered = filtered.filter((dataset) =>
          state.searchFilters.tags.some((tag) => dataset.tags.includes(tag))
        );
      }

      // 排序
      filtered.sort((a, b) => {
        const field = state.sortConfig.field;
        const order = state.sortConfig.order;

        let aValue = a[field];
        let bValue = b[field];

        // 特殊处理不同数据类型
        if (field === "uploadTime") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (field === "downloadCount") {
          aValue = parseInt(aValue) || 0;
          bValue = parseInt(bValue) || 0;
        } else if (field === "size") {
          // 将大小转换为GB进行比较
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      return filtered;
    },

    // 获取数据集统计信息 - 修复 this 引用问题
    getDatasetStats: (state, getters) => {
      return (wirelessType) => {
        // 使用 getters.getDatasetsByType 而不是 this.getDatasetsByType
        const datasets = getters.getDatasetsByType(wirelessType);

        const stats = {
          total: datasets.length,
          published: datasets.filter((d) => d.status === "已发布").length,
          reviewing: datasets.filter((d) => d.status === "审核中").length,
          totalDownloads: datasets.reduce(
            (sum, d) => sum + (d.downloadCount || 0),
            0
          ),
          totalSize: 0,
          categories: {},
          topTags: {},
        };

        // 计算总大小
        datasets.forEach((dataset) => {
          const sizeStr = dataset.size || "0 GB";
          const sizeMatch = sizeStr.match(/([\d.]+)\s*(GB|MB|KB)/i);
          if (sizeMatch) {
            const size = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toUpperCase();
            let sizeInGB = size;

            if (unit === "MB") {
              sizeInGB = size / 1024;
            } else if (unit === "KB") {
              sizeInGB = size / (1024 * 1024);
            }

            stats.totalSize += sizeInGB;
          }
        });

        // 统计分类
        datasets.forEach((dataset) => {
          const category = dataset.category || "其他";
          stats.categories[category] = (stats.categories[category] || 0) + 1;
        });

        // 统计热门标签
        datasets.forEach((dataset) => {
          dataset.tags?.forEach((tag) => {
            stats.topTags[tag] = (stats.topTags[tag] || 0) + 1;
          });
        });

        return stats;
      };
    },

    // 获取所有可用的分类
    getAllCategories: (state, getters) => {
      if (!state.currentWirelessType) return [];
      const datasets = getters.getCurrentDatasets;
      const categories = [
        ...new Set(datasets.map((d) => d.category).filter(Boolean)),
      ];
      return categories.sort();
    },

    // 获取所有可用的标签
    getAllTags: (state, getters) => {
      if (!state.currentWirelessType) return [];
      const datasets = getters.getCurrentDatasets;
      const tags = [...new Set(datasets.flatMap((d) => d.tags || []))];
      return tags.sort();
    },

    // 根据ID获取数据集
    getDatasetById: (state, getters) => {
      return (datasetId) => {
        if (!state.currentWirelessType) return null;
        const datasets = getters.getCurrentDatasets;
        return datasets.find((d) => d.id === datasetId);
      };
    },
  },

  actions: {
    // 设置当前数据集类型
    setCurrentWirelessType(wirelessType) {
      this.currentWirelessType = wirelessType;
      // 重置搜索筛选条件
      this.resetFilters();
    },

    // 重置筛选条件
    resetFilters() {
      this.searchFilters = {
        keyword: "",
        status: "",
        category: "",
        tags: [],
      };
    },

    // 设置搜索关键词
    setSearchKeyword(keyword) {
      this.searchFilters.keyword = keyword;
    },

    // 设置状态筛选
    setStatusFilter(status) {
      this.searchFilters.status = status;
    },

    // 设置分类筛选
    setCategoryFilter(category) {
      this.searchFilters.category = category;
    },

    // 设置标签筛选
    setTagsFilter(tags) {
      this.searchFilters.tags = Array.isArray(tags) ? tags : [tags];
    },

    // 设置排序
    setSortConfig(field, order = "desc") {
      this.sortConfig = { field, order };
    },

    // 添加数据集
    addDataset(wirelessType, datasetData) {
      const localStorageKey = `datasets_${wirelessType}`;
      const existingDatasets = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );

      const newDataset = {
        ...datasetData,
        id: `dataset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uploadTime: new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        downloadCount: 0,
        status: "审核中",
      };

      existingDatasets.push(newDataset);
      localStorage.setItem(localStorageKey, JSON.stringify(existingDatasets));

      // 触发数据更新事件
      window.dispatchEvent(
        new CustomEvent("datasetUpdate", {
          detail: { type: "add", wirelessType, dataset: newDataset },
        })
      );

      return newDataset;
    },

    // 更新数据集
    updateDataset(wirelessType, datasetId, updatedData) {
      const localStorageKey = `datasets_${wirelessType}`;
      const existingDatasets = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );

      const index = existingDatasets.findIndex((d) => d.id === datasetId);
      if (index !== -1) {
        // 更新本地存储的数据集
        existingDatasets[index] = {
          ...existingDatasets[index],
          ...updatedData,
        };
        localStorage.setItem(localStorageKey, JSON.stringify(existingDatasets));
        return true;
      } else {
        // 尝试更新预置数据集（注意：这只在当前会话有效）
        const presetDatasets = this.presetDatasets[wirelessType] || [];
        const presetIndex = presetDatasets.findIndex((d) => d.id === datasetId);
        if (presetIndex !== -1) {
          presetDatasets[presetIndex] = {
            ...presetDatasets[presetIndex],
            ...updatedData,
          };
          return true;
        }
      }

      return false;
    },

    // 删除数据集
    removeDataset(wirelessType, datasetId) {
      const localStorageKey = `datasets_${wirelessType}`;
      const existingDatasets = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );

      const filteredDatasets = existingDatasets.filter(
        (d) => d.id !== datasetId
      );

      if (filteredDatasets.length !== existingDatasets.length) {
        // 成功从本地存储中删除
        localStorage.setItem(localStorageKey, JSON.stringify(filteredDatasets));
        return true;
      } else {
        // 尝试从预置数据集中删除（注意：这只在当前会话有效）
        const presetDatasets = this.presetDatasets[wirelessType] || [];
        const index = presetDatasets.findIndex((d) => d.id === datasetId);
        if (index !== -1) {
          presetDatasets.splice(index, 1);
          return true;
        }
      }

      return false;
    },

    // 增加下载次数
    incrementDownloadCount(wirelessType, datasetId) {
      // 使用 getters 获取数据集
      const dataset = this.getDatasetById(datasetId);
      if (dataset) {
        const newDownloadCount = (dataset.downloadCount || 0) + 1;
        this.updateDataset(wirelessType, datasetId, {
          downloadCount: newDownloadCount,
        });
        return newDownloadCount;
      }
      return 0;
    },

    // 批量操作：发布数据集
    publishDatasets(wirelessType, datasetIds) {
      const results = [];
      datasetIds.forEach((id) => {
        const success = this.updateDataset(wirelessType, id, {
          status: "已发布",
        });
        results.push({ id, success });
      });
      return results;
    },

    // 批量操作：删除数据集
    removeMultipleDatasets(wirelessType, datasetIds) {
      const results = [];
      datasetIds.forEach((id) => {
        const success = this.removeDataset(wirelessType, id);
        results.push({ id, success });
      });
      return results;
    },

    // 清空指定类型的本地数据集
    clearLocalDatasets(wirelessType) {
      const localStorageKey = `datasets_${wirelessType}`;
      localStorage.removeItem(localStorageKey);
    },

    // 导出数据集列表
    exportDatasets(wirelessType, format = "json") {
      // 使用 getters 获取数据集
      const datasets = this.getDatasetsByType(wirelessType);

      if (format === "json") {
        return JSON.stringify(datasets, null, 2);
      } else if (format === "csv") {
        // 简单的CSV导出
        const headers = [
          "名称",
          "描述",
          "版本",
          "大小",
          "格式",
          "状态",
          "作者",
          "上传时间",
        ];
        const rows = datasets.map((d) => [
          d.name,
          d.description,
          d.version,
          d.size,
          d.format,
          d.status,
          d.author,
          d.uploadTime,
        ]);

        const csvContent = [headers, ...rows]
          .map((row) => row.map((field) => `"${field}"`).join(","))
          .join("\n");

        return csvContent;
      }

      return datasets;
    },

    // 导入数据集
    importDatasets(wirelessType, datasetsData) {
      const localStorageKey = `datasets_${wirelessType}`;
      const existingDatasets = JSON.parse(
        localStorage.getItem(localStorageKey) || "[]"
      );

      // 为导入的数据集生成新的ID以避免冲突
      const importedDatasets = datasetsData.map((dataset) => ({
        ...dataset,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uploadTime: new Date().toLocaleString("zh-CN"),
      }));

      const allDatasets = [...existingDatasets, ...importedDatasets];
      localStorage.setItem(localStorageKey, JSON.stringify(allDatasets));

      return importedDatasets.length;
    },
  },
});
