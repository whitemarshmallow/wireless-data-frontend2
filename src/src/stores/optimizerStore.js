import { defineStore } from "pinia";
import {
  generateOptimization,
  downloadOptimization,
} from "../utils/networkApi";

export const useOptimizerStore = defineStore("optimizer", {
  state: () => ({
    // 输入相关
    prompt: "",
    framework: "",
    frameworkFile: null,
    showFramework: false,

    // 生成状态
    isLoading: false,
    loadingText: "正在分析网络问题...",
    progress: 0,

    // 结果
    result: null,
    error: null,

    // 历史记录
    history: [],
  }),

  getters: {
    canGenerate: (state) => {
      return state.prompt.trim().length > 0 && !state.isLoading;
    },
  },

  actions: {
    // 设置问题描述
    setPrompt(prompt) {
      this.prompt = prompt;
    },

    // 设置参数框架
    setFramework(framework) {
      this.framework = framework;
    },

    // 设置参数文件
    setFrameworkFile(file) {
      this.frameworkFile = file;
    },

    // 切换框架显示
    toggleFramework() {
      this.showFramework = !this.showFramework;
    },

    // 设置错误
    setError(error) {
      this.error = error;
      this.isLoading = false;
    },

    // 清除错误
    clearError() {
      this.error = null;
    },

    // 重置状态
    reset() {
      this.prompt = "";
      this.framework = "";
      this.frameworkFile = null;
      this.showFramework = false;
      this.result = null;
      this.error = null;
      this.isLoading = false;
      this.progress = 0;
    },

    // 开始新优化
    startNew() {
      this.result = null;
      this.error = null;
      this.isLoading = false;
      this.progress = 0;
    },

    // 生成优化方案（调用真实API）
    async generateOptimization() {
      if (!this.canGenerate) return;

      this.isLoading = true;
      this.error = null;
      this.progress = 0;

      // 清除之前的进度更新
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      try {
        // 模拟进度更新
        this.progressInterval = setInterval(() => {
          if (this.progress < 90) {
            this.progress += Math.random() * 15;

            // 更新加载文字
            if (this.progress < 20) {
              this.loadingText = "🔍 正在分析网络问题...";
            } else if (this.progress < 40) {
              this.loadingText = "📊 计算KPI指标...";
            } else if (this.progress < 60) {
              this.loadingText = "🛠️ 生成优化方案...";
            } else if (this.progress < 80) {
              this.loadingText = "📈 评估优化效果...";
            } else {
              this.loadingText = "✨ 完善方案细节...";
            }
          }
        }, 500);

        // 准备API调用数据
        const requestData = {
          prompt: this.prompt,
        };

        // 检查是否需要添加参数框架（快捷上传条件）
        const hasFrameworkKeywords =
          this.prompt.includes("参数模板") ||
          this.prompt.includes("仿真配置") ||
          this.prompt.includes("Viavi");

        if (hasFrameworkKeywords) {
          if (this.framework) {
            requestData.framework = this.framework;
          }
          if (this.frameworkFile) {
            requestData.framework_file = this.frameworkFile;
          }
        }

        // 调用真实API
        console.log("🚀 开始调用API生成优化方案...");
        const response = await generateOptimization(requestData);

        clearInterval(this.progressInterval);
        this.progress = 100;
        this.loadingText = "🎉 优化方案生成完成！";

        // 处理API响应
        if (response.data.success) {
          this.result = {
            title: "网络优化方案",
            filename: response.data.filename,
            preview: response.data.preview,
            downloadUrl: response.data.download_url,
            wordCount: response.data.preview ? response.data.preview.length : 0,
            sections: this.calculateSections(response.data.preview),
            createdAt: new Date().toLocaleString(),
          };

          console.log("✅ 优化方案生成成功:", this.result);
          this.addToHistory();
        } else {
          throw new Error(response.data.message || "生成失败");
        }
      } catch (error) {
        console.error("❌ 优化方案生成失败:", error);
        clearInterval(this.progressInterval);
        this.setError(error.message || "优化过程中出现了问题，请重试");
      } finally {
        this.isLoading = false;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
      }
    },

    // 计算方案章节数
    calculateSections(content) {
      if (!content) return 1;
      // 简化处理，按段落数量估算
      const paragraphs = content
        .split("\n\n")
        .filter((p) => p.trim().length > 0);
      return Math.max(1, Math.ceil(paragraphs.length / 3));
    },

    // 下载结果 - 修复版本
    downloadResult() {
      if (!this.result) {
        console.error("❌ 没有可下载的内容");
        return;
      }

      try {
        // 方法1：如果有downloadUrl，使用API下载
        if (this.result.downloadUrl) {
          console.log("📥 使用API下载:", this.result.downloadUrl);
          downloadOptimization(this.result.downloadUrl, this.result.filename);
        }
        // 方法2：降级方案，直接下载预览内容
        else if (this.result.preview) {
          console.log("📥 使用降级方案下载预览内容");
          this.downloadTextAsFile(
            this.result.preview,
            this.result.filename || "optimization_solution.txt"
          );
        } else {
          throw new Error("没有可下载的内容");
        }
      } catch (error) {
        console.error("❌ 下载失败:", error);

        // 最终降级方案：下载预览内容
        if (this.result.preview) {
          console.log("📥 使用最终降级方案");
          this.downloadTextAsFile(
            this.result.preview,
            this.result.filename || "optimization_solution.txt"
          );
        } else {
          this.setError("下载失败：" + error.message);
        }
      }
    },

    // 直接下载文本内容的辅助方法
    downloadTextAsFile(content, filename) {
      try {
        // 创建Blob对象
        const blob = new Blob([content], {
          type: "text/plain;charset=utf-8",
        });

        // 创建下载URL
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";

        // 添加到页面并点击
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("✅ 文件下载成功:", filename);
      } catch (error) {
        console.error("❌ 文本下载失败:", error);
        throw new Error("文件下载失败");
      }
    },

    // 添加到历史记录
    addToHistory() {
      const historyItem = {
        id: Date.now(),
        prompt: this.prompt,
        framework: this.framework,
        hasFile: !!this.frameworkFile,
        timestamp: new Date().toLocaleString(),
        result: this.result,
      };

      this.history.unshift(historyItem);

      // 只保留最近10条记录
      if (this.history.length > 10) {
        this.history = this.history.slice(0, 10);
      }

      this.saveHistory();
    },

    // 从历史记录加载
    loadFromHistory(item) {
      this.prompt = item.prompt;
      this.framework = item.framework || "";
      this.frameworkFile = null;
      this.result = null;
      this.error = null;

      if (item.framework) {
        this.showFramework = true;
      }
    },

    // 保存历史记录
    saveHistory() {
      try {
        localStorage.setItem("optimizer-history", JSON.stringify(this.history));
      } catch (error) {
        console.warn("保存历史记录失败:", error);
      }
    },

    // 初始化历史记录
    initHistory() {
      try {
        const saved = localStorage.getItem("optimizer-history");
        if (saved) {
          this.history = JSON.parse(saved);
        }
      } catch (error) {
        console.warn("加载历史记录失败:", error);
        this.history = [];
      }
    },
  },
});
