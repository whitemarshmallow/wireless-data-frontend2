import axios from "axios";
import { getApiUrl } from "./api.js";
import globalConfig from "../config/globalConfig.js";

// 创建axios实例
const optimizerAPI = axios.create({
  timeout: globalConfig.requestTimeout || 600000, // 增加超时时间
});

// 请求拦截器
optimizerAPI.interceptors.request.use(
  (config) => {
    console.log("🚀 发送请求:", config.url);
    console.log("📤 请求数据:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ 请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
optimizerAPI.interceptors.response.use(
  (response) => {
    console.log("✅ 请求成功:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ 请求失败:", error);

    // 处理不同类型的错误
    let message = "网络错误，请重试";

    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400) {
        message = data.message || "请求参数错误";
      } else if (status === 413) {
        message = "文件太大，请选择较小的文件";
      } else if (status === 500) {
        message = "服务器内部错误，请稍后重试";
      } else {
        message = data.message || `服务器错误 (${status})`;
      }
    } else if (error.request) {
      // 网络错误
      message = "网络连接失败，请检查网络";
    } else if (error.code === "ECONNABORTED") {
      // 超时错误
      message = "请求超时，请重试";
    }

    return Promise.reject(new Error(message));
  }
);

/**
 * 生成网络优化方案API - 严格按照后端接口规范
 * @param {Object} data - 请求数据
 * @param {string} data.prompt - 必填，网优问题描述或需求
 * @param {string} [data.framework] - 可选，参数框架文本
 * @param {File} [data.framework_file] - 可选，参数配置文件(txt/json)
 * @returns {Promise} API响应
 */
export const generateOptimization = async (data) => {
  const url = getApiUrl("/api/novel/generate");

  // 检查是否需要快捷上传参数框架
  const hasFrameworkKeywords =
    data.prompt.includes("参数模板") ||
    data.prompt.includes("仿真配置") ||
    data.prompt.includes("Viavi");

  // 判断是否需要文件上传
  const needsFileUpload = hasFrameworkKeywords && data.framework_file;

  if (needsFileUpload) {
    // 使用FormData进行文件上传
    const formData = new FormData();
    formData.append("prompt", data.prompt);

    if (data.framework) {
      formData.append("framework", data.framework);
    }

    if (data.framework_file) {
      formData.append("framework_file", data.framework_file);
    }

    return optimizerAPI.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    // 普通JSON请求
    const requestData = { prompt: data.prompt };

    // 只有在包含关键词且有框架时才添加framework
    if (hasFrameworkKeywords && data.framework) {
      requestData.framework = data.framework;
    }

    return optimizerAPI.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

/**
 * 下载优化方案文件
 * @param {string} downloadUrl - 下载URL路径
 * @param {string} filename - 文件名
 */
export const downloadOptimization = (downloadUrl, filename) => {
  // 如果是相对路径，转换为完整URL
  const url = downloadUrl.startsWith("http")
    ? downloadUrl
    : getApiUrl(downloadUrl);

  // 创建隐藏的下载链接
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "optimization_solution.txt";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 验证文件类型和大小
 * @param {File} file - 要验证的文件
 * @returns {Object} 验证结果
 */
export const validateFile = (file) => {
  const maxSize = globalConfig.maxFileSize || 5 * 1024 * 1024; // 5MB
  const allowedTypes = globalConfig.allowedFileTypes || [".txt", ".json"];

  // 检查文件类型
  const fileExtension = "." + file.name.split(".").pop().toLowerCase();
  if (!allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      message: `只支持 ${allowedTypes.join(", ")} 格式的参数配置文件`,
    };
  }

  // 检查文件大小
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      message: `文件大小不能超过 ${sizeMB}MB`,
    };
  }

  // 检查文件内容是否为空
  if (file.size === 0) {
    return {
      valid: false,
      message: "参数文件不能为空",
    };
  }

  return { valid: true, message: "文件验证通过" };
};

/**
 * 检查API服务状态
 * @returns {Promise<boolean>} 服务是否可用
 */
export const checkApiStatus = async () => {
  try {
    const url = getApiUrl("/api/health"); // 假设有健康检查接口
    const response = await optimizerAPI.get(url, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn("网优API服务检查失败:", error.message);
    return false;
  }
};
