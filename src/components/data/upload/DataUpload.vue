/* eslint-disable */
<template>
  <div class="upload-container">
    <!-- 半透明白色遮罩层 -->
    <div class="page-overlay"></div>

    <!-- 页面标题 -->
    <h1 class="page-title">数据上传平台</h1>

    <!-- 页面介绍 -->
    <div class="intro-section translucent-container">
      <h2 class="section-title">功能介绍</h2>
      <p class="description-text">
        数据上传平台支持多种格式数据的上传与转换，为无线网络数据处理提供便捷入口。
        您可以通过文件上传或直接粘贴的方式提交数据，系统将自动进行处理并提供标准格式的输出结果。
      </p>
    </div>

    <!-- 上传方式选择 -->
    <div class="features-section mb-5">
      <div class="row">
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-upload"></i> 文件上传</h3>
            <p class="description-text">
              支持多种格式文件上传，包括JSON、XML、TXT、NPY、CSV等
            </p>
          </div>
        </div>
        <div class="col">
          <div class="info-card">
            <h3><i class="el-icon-edit"></i> 直接粘贴</h3>
            <p class="description-text">
              可直接粘贴数据内容，支持JSON、XML、TXT等常用文本格式
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-upload mr-2"></i>文件上传</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          通过此功能，您可以上传各种格式的数据文件进行处理。系统将自动识别文件类型并进行相应处理，
          支持将数据转换为标准格式以便后续分析与处理。
        </p>
      </div>

      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            accept=".json,.xml,.txt,.npy,.csv"
            :data="{ outputFormat: uploadForm.outputFormat }"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 .json, .xml, .txt, .npy, .csv 格式文件
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="输出格式">
          <el-select
            v-model="uploadForm.outputFormat"
            placeholder="选择输出格式"
          >
            <el-option label="CSV" value="csv" />
            <el-option label="TXT" value="txt" disabled />
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="uploadResult" class="upload-result">
        <el-alert
          :title="uploadResult.message"
          :type="uploadResult.success ? 'success' : 'error'"
          show-icon
        />
        <el-button
          v-if="uploadResult.success"
          type="primary"
          @click="handleDownload"
          class="mt-3"
        >
          下载转换后的文件
        </el-button>
      </div>
    </el-card>

    <!-- 数据粘贴部分 -->
    <el-card class="mb-5 custom-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-edit mr-2"></i>直接粘贴数据</span>
        </div>
      </template>

      <div class="card-description mb-4">
        <p class="description-text">
          如果您已有格式化的数据内容，可以直接粘贴到下方文本框中进行处理。
          此功能适合处理较小规模的数据或从其他来源临时复制的数据内容。
        </p>
      </div>

      <el-form :model="pasteForm" label-width="120px">
        <el-form-item label="粘贴数据">
          <el-input
            v-model="pasteForm.content"
            type="textarea"
            :rows="10"
            placeholder="在此粘贴数据（支持 JSON, XML, TXT 格式）..."
          />
        </el-form-item>

        <el-form-item label="输出格式">
          <el-select
            v-model="pasteForm.outputFormat"
            placeholder="选择输出格式"
          >
            <el-option label="CSV" value="csv" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitPasteData"
            >提交并转换</el-button
          >
        </el-form-item>
      </el-form>

      <div v-if="pasteResult" class="paste-result">
        <el-alert
          :title="pasteResult.message"
          :type="pasteResult.success ? 'success' : 'error'"
          show-icon
        />
        <el-button
          v-if="pasteResult.success"
          type="primary"
          @click="handlePasteDownload"
          class="mt-3"
        >
          下载转换后的文件
        </el-button>
      </div>
    </el-card>

    <!-- 数据处理流程 -->
    <div class="process-description translucent-container mb-5">
      <h3 class="sub-section-title">数据处理流程</h3>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>数据提交</h4>
            <p>通过文件上传或直接粘贴提交数据</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>格式转换</h4>
            <p>系统自动处理并转换为标准格式</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>结果下载</h4>
            <p>下载处理后的数据用于后续分析</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import "@/styles/global.css";
import { getApiUrl } from "../../../utils/api";

// 如需自定义基础 URL，取消注释下面这一行并修改
const baseUrl = null; // 使用全局配置
// const baseUrl = 'http://172.20.10.3:9090'  // 自定义 URL

// 初始化上传 URL（将在 beforeUpload 中动态修改）
const uploadUrl = ref(getApiUrl("/api/upload", baseUrl));

// 文件上传表单数据
const uploadForm = reactive({
  outputFormat: "csv",
});
const uploadResult = ref(null);

// 数据粘贴表单数据
const pasteForm = reactive({
  content: "",
  outputFormat: "csv",
});
const pasteResult = ref(null);

// 文件上传相关方法
const beforeUpload = (file) => {
  const validTypes = [".json", ".xml", ".txt", ".npy", ".csv"];
  const isValidType = validTypes.some((type) =>
    file.name.toLowerCase().endsWith(type)
  );

  if (!isValidType) {
    ElMessage.error("请上传支持的文件格式!");
    return false;
  }
  return true;
};

//修改，打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log("上传响应数据:", response);
  console.log("outputformat:", uploadForm.outputFormat);
  uploadResult.value = {
    success: true,
    message: "文件处理成功",
    data: response, // 直接存储响应数据
    downloadUrl: response.downloadUrl,
  };
};

//修改，打印详细错误信息
const handleUploadError = (err) => {
  console.error("上传错误:", err);
  const errorMessage = err.message || "未知错误";
  ElMessage.error(`文件上传失败: ${errorMessage}`);
  uploadResult.value = {
    success: false,
    message: `文件上传失败: ${errorMessage}`,
  };
};

const handleDownload = async () => {
  try {
    const downloadUrl =
      uploadResult.value?.downloadUrl || uploadResult.value?.data?.downloadUrl;

    if (downloadUrl) {
      const fullUrl = getApiUrl(downloadUrl, baseUrl);

      // 使用fetch请求数据，无论服务器如何响应
      ElMessage.info("正在准备下载文件...");

      // 执行fetch请求获取文件内容
      const response = await fetch(fullUrl);
      const data = await response.text(); // 获取文本内容，无论响应类型

      // 创建Blob对象
      const blob = new Blob([data], { type: "text/csv" });

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `network_data_${new Date().getTime()}.csv`; // 使用时间戳确保文件名唯一

      // 触发下载
      document.body.appendChild(a);
      a.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      ElMessage.success("文件下载已开始");
    } else {
      // 保留原有的后备方案...
      ElMessage.error("没有可用的下载链接");
    }
  } catch (error) {
    console.error("下载出错:", error);
    ElMessage.error(`下载文件时出错: ${error.message}`);
  }
};

// 数据粘贴相关方法
const submitPasteData = async () => {
  if (!pasteForm.content.trim()) {
    ElMessage.error("请先粘贴数据");
    return;
  }

  try {
    const response = await fetch(getApiUrl("/api/convert", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: pasteForm.content,
        outputFormat: pasteForm.outputFormat,
      }),
    });

    const result = await response.json();

    if (result.success) {
      pasteResult.value = {
        success: true,
        message: "数据转换成功",
        downloadUrl: result.downloadUrl,
      };
    } else {
      pasteResult.value = {
        success: false,
        message: result.message || "转换失败",
      };
    }
  } catch (error) {
    pasteResult.value = {
      success: false,
      message: "提交或转换过程中发生错误",
    };
  }
};

const handlePasteDownload = async () => {
  try {
    if (pasteResult.value?.data) {
      const content =
        typeof pasteResult.value.data === "string"
          ? pasteResult.value.data
          : JSON.stringify(pasteResult.value.data);

      const mimeType =
        pasteForm.outputFormat === "csv" ? "text/csv" : "text/plain";

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pasted_data.${pasteForm.outputFormat}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      ElMessage.success("文件下载开始");
    } else {
      ElMessage.error("没有可用的数据");
    }
  } catch (error) {
    console.error("下载出错:", error);
    ElMessage.error("下载文件时出错");
  }
};
</script>

<style scoped>
/* DataUpload 页面样式 - 基于 global.css 配色系统 */

/* 主容器样式 */
.upload-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  position: relative;
  color: var(--text-primary);
  background: var(--bg-secondary);
  min-height: calc(100vh - 120px);
}

/* 页面遮罩层 */
.page-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(74, 158, 255, 0.03) 0%,
    rgba(116, 185, 255, 0.05) 50%,
    rgba(230, 243, 255, 0.08) 100%
  );
  pointer-events: none;
  z-index: -1;
}

/* 页面标题 */
.page-title {
  font-size: 48px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: -0.02em;
}

/* 半透明容器 */
.translucent-container {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-light);
}

/* 区块标题 */
.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  position: relative;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

/* 描述文字 */
.description-text {
  font-size: 16px;
  color: var(--text-regular);
  line-height: 1.6;
  margin: 0;
}

/* 布局样式 */
.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.col {
  flex: 1;
}

/* 特性区块 */
.features-section {
  margin-bottom: 40px;
}

/* 信息卡片 */
.info-card {
  background: var(--bg-color);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-base);
  border-color: var(--primary-light);
}

.info-card:hover::before {
  opacity: 1;
}

.info-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.info-card h3 i {
  color: var(--primary-color);
  font-size: 20px;
}

.info-card .description-text {
  font-size: 14px;
  color: var(--text-regular);
}

/* 自定义卡片样式 */
.custom-card {
  background: var(--bg-color);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  box-shadow: var(--shadow-base);
  transition: all 0.3s ease;
  margin-bottom: 30px;
  overflow: hidden;
}

.custom-card:hover {
  box-shadow: var(--shadow-dark);
  transform: translateY(-2px);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-header i {
  color: var(--primary-color);
  margin-right: 8px;
}

/* 卡片描述 */
.card-description {
  background: linear-gradient(
    90deg,
    var(--fill-light) 0%,
    rgba(230, 243, 255, 0.3) 100%
  );
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
}

.card-description::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

/* 表单样式覆盖 */
:deep(.el-form-item__label) {
  color: var(--text-primary) !important;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background: var(--gradient-primary);
  border: none;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-base);
}

:deep(.el-select .el-input__inner) {
  border-color: var(--border-light);
}

:deep(.el-textarea .el-textarea__inner) {
  border-color: var(--border-light);
  background: var(--fill-lighter);
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  border: 2px dashed var(--border-light);
  border-radius: 12px;
  background: var(--fill-lighter);
  transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: var(--fill-light);
}

/* 上传/粘贴结果样式 */
.upload-result,
.paste-result {
  margin-top: 24px;
  padding: 20px;
  background: var(--fill-lighter);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: var(--shadow-light);
}

/* 处理流程样式 */
.process-description {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}

.sub-section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 12px;
}

.sub-section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: 1px;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  flex: 1;
  padding: 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  position: relative;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-base);
  border-color: var(--primary-light);
}

.step:not(:last-child)::after {
  content: "→";
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-color);
  font-size: 20px;
  font-weight: bold;
}

.step-number {
  background: var(--gradient-primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: var(--shadow-light);
  font-size: 16px;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.step-content p {
  margin: 0;
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.5;
}

/* 支持与联系样式 */
.support-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  color: var(--text-regular);
  background: var(--bg-color);
  padding: 12px 20px;
  border: 1px solid var(--border-light);
  border-radius: 25px;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: var(--fill-light);
  border-color: var(--primary-light);
  transform: translateY(-2px);
}

.contact-item i {
  margin-right: 8px;
  color: var(--primary-color);
}

/* 工具类 */
.mr-2 {
  margin-right: 8px;
}

.mt-3 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 24px;
}

.mb-5 {
  margin-bottom: 32px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .upload-container {
    padding: 0 16px;
    margin: 20px auto;
  }

  .page-title {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .translucent-container {
    padding: 24px;
    margin-bottom: 20px;
  }

  .row {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .process-steps {
    flex-direction: column;
    gap: 16px;
  }

  .step:not(:last-child)::after {
    content: "↓";
    right: 50%;
    bottom: -20px;
    top: auto;
    transform: translateX(50%);
  }

  .support-contact {
    flex-direction: column;
    gap: 12px;
  }

  .custom-card {
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .translucent-container {
    padding: 20px;
  }

  .info-card {
    padding: 20px;
  }

  .step {
    padding: 16px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>
