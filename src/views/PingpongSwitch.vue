/* eslint-disable */
<template>
  <div class="pingpong-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon class="title-icon"><Connection /></el-icon>
          乒乓切换优化
        </h1>
        <p class="page-subtitle">智能识别与优化无线网络切换问题</p>
      </div>
    </div>

    <div class="main-content">
      <!-- 页面介绍 -->
      <div class="intro-section">
        <div class="section-header">
          <h2 class="section-title">功能介绍</h2>
          <div class="title-line"></div>
        </div>
        <p class="description-text">
          乒乓切换分析专注于解决无线网络中小区间频繁切换的问题，通过分析上传的网络数据，快速识别乒乓切换现象并提供针对性解决建议。
          系统基于智能算法，深入分析不同小区间的切换模式与频率，为网络切换优化提供科学决策支持。
        </p>
      </div>

      <!-- 功能特点 -->
      <div class="features-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon refresh">
              <el-icon><Refresh /></el-icon>
            </div>
            <h3>切换识别</h3>
            <p>精准识别网络中的乒乓切换现象，快速定位问题区域</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon analysis">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <h3>原因分析</h3>
            <p>深入分析乒乓切换产生的原因，从多维度探究问题根源</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon optimize">
              <el-icon><MagicStick /></el-icon>
            </div>
            <h3>优化建议</h3>
            <p>提供专业的参数调整与优化建议，有效解决乒乓切换问题</p>
          </div>
        </div>
      </div>

      <!-- 文件上传部分 -->
      <div class="upload-section">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <span>乒乓切换数据上传</span>
            </div>
          </template>

          <div class="upload-description">
            <p>
              请上传CSV格式的网络切换数据文件，系统将自动分析文件中的切换模式，识别乒乓切换现象，并生成优化建议。
              数据文件应包含基站ID、切换时间、信号强度等相关指标数据，以便系统进行全面分析。
            </p>
          </div>

          <div class="upload-area">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              accept=".csv"
              drag
            >
              <div class="upload-content">
                <el-icon class="upload-dragger-icon"><Upload /></el-icon>
                <div class="upload-text">
                  <p>将文件拖到此处，或<em>点击上传</em></p>
                  <p class="upload-tip">只能上传 CSV 文件</p>
                </div>
              </div>
            </el-upload>
          </div>

          <div v-if="switchResult" class="switch-result">
            <el-alert
              :title="switchResult.message"
              :type="switchResult.success ? 'success' : 'error'"
              show-icon
              class="result-alert"
            />

            <div v-if="switchResult.success" class="result-container">
              <h3 class="result-title">
                <el-icon><Document /></el-icon>
                切换优化建议
              </h3>
              <div class="result-content">
                <el-input
                  v-model="switchResult.suggestion"
                  type="textarea"
                  :rows="12"
                  readonly
                  class="result-textarea"
                  placeholder="等待乒乓切换优化建议..."
                />
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 优化流程 -->
      <div class="process-section">
        <div class="section-header">
          <h3 class="section-title">优化流程</h3>
          <div class="title-line"></div>
        </div>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>数据收集</h4>
              <p>采集网络切换事件与相关性能指标</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>问题识别</h4>
              <p>系统分析并识别乒乓切换现象</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>原因诊断</h4>
              <p>深入分析乒乓切换的根本原因</p>
            </div>
            <div class="step-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h4>参数优化</h4>
              <p>根据建议调整优化网络参数配置</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 优化收益 -->
      <div class="benefits-section">
        <div class="section-header">
          <h2 class="section-title">优化收益</h2>
          <div class="title-line"></div>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon data">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h3>降低切换率</h3>
            <p>减少不必要的小区切换，显著降低乒乓切换现象</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon cpu">
              <el-icon><Cpu /></el-icon>
            </div>
            <h3>减轻网络负担</h3>
            <p>降低信令开销，有效减轻网络负担</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon user">
              <el-icon><User /></el-icon>
            </div>
            <h3>提升用户体验</h3>
            <p>减少掉线率，提高通话质量与数据连续性</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon lightning">
              <el-icon><Lightning /></el-icon>
            </div>
            <h3>提高通话质量</h3>
            <p>保持稳定连接，降低掉话率，提高通话质量</p>
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
import { getApiUrl } from "../utils/api";

// 如需自定义基础 URL，取消注释下面这一行并修改
const baseUrl = null; // 使用全局配置
// const baseUrl = 'http://172.20.10.3:9090'  // 自定义 URL

const uploadUrl = ref(getApiUrl("/api/pingpong/uploadCsv", baseUrl));

// 文件上传表单数据
const uploadForm = reactive({});
const switchResult = ref(null);

// 文件上传相关方法
const beforeUpload = (file) => {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    ElMessage.error("请上传CSV格式的数据文件！");
    return false;
  }

  // 添加日志查看实际的上传URL
  console.log("上传URL:", uploadUrl.value);
  return true;
};

// 打印详细成功信息
const handleUploadSuccess = (response) => {
  console.log("上传响应数据:", response);
  switchResult.value = {
    success: true,
    message: "乒乓切换数据分析完成",
    suggestion: response.suggestion || "暂无乒乓切换优化建议",
  };
};

// 打印详细错误信息
const handleUploadError = (err) => {
  console.error("上传错误:", err);
  const errorMessage = err.message || "未知错误";
  ElMessage.error(`文件上传失败: ${errorMessage}`);
  switchResult.value = {
    success: false,
    message: `文件上传失败: ${errorMessage}`,
  };
};
</script>

<style scoped>
.pingpong-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.pingpong-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  pointer-events: none;
}

/* 页面头部 */
.page-header {
  padding: 80px 0 40px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  font-size: 48px;
  color: #fff;
}

.page-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
  position: relative;
  z-index: 1;
}

/* 通用区域样式 */
.intro-section,
.problems-section,
.process-section,
.benefits-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
}

.title-line {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 0 auto;
  border-radius: 2px;
}

.description-text,
.section-description {
  font-size: 16px;
  line-height: 1.8;
  color: #34495e;
  margin: 0;
}

/* 功能特点 */
.features-section {
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: white;
}

.feature-icon.refresh {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.feature-icon.analysis {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.feature-icon.optimize {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.feature-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* 文件上传 */
.upload-section {
  margin-bottom: 32px;
}

.upload-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.upload-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.upload-icon {
  font-size: 20px;
}

.upload-description {
  margin-bottom: 32px;
  padding: 0 16px;
}

.upload-description p {
  color: #34495e;
  line-height: 1.8;
  margin: 0;
}

.upload-area {
  margin-bottom: 24px;
}

.upload-demo :deep(.el-upload-dragger) {
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-content {
  padding: 40px 20px;
  text-align: center;
}

.upload-dragger-icon {
  font-size: 48px;
  color: #a0aec0;
  margin-bottom: 16px;
}

.upload-text p {
  margin: 8px 0;
  color: #4a5568;
}

.upload-text em {
  color: #667eea;
  font-style: normal;
  text-decoration: underline;
  cursor: pointer;
}

.upload-tip {
  font-size: 12px;
  color: #a0aec0;
}

/* 结果展示 */
.switch-result {
  margin-top: 24px;
}

.result-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

.result-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
}

.result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 18px;
}

.result-content {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.result-textarea :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  background: transparent;
  font-family: "Monaco", "Menlo", monospace;
  line-height: 1.6;
}

/* 问题解析 */
.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.problem-item {
  display: flex;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.problem-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.problem-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  color: white;
  font-size: 18px;
}

.problem-icon.warning {
  background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
}

.problem-icon.error {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 100%);
}

.problem-icon.setting {
  background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
}

.problem-icon.delay {
  background: linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%);
}

.problem-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #2c3e50;
}

.problem-content p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
}

/* 优化流程 */
.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.step {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0 auto 16px;
}

.step-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #2c3e50;
}

.step-content p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
}

.step-arrow {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e0;
  font-size: 20px;
}

.step:last-child .step-arrow {
  display: none;
}

/* 优化收益 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.benefit-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 20px;
  color: white;
}

.benefit-icon.data {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.benefit-icon.cpu {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.benefit-icon.user {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.benefit-icon.lightning {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.benefit-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #2c3e50;
}

.benefit-card p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 32px;
  }

  .main-content {
    padding: 0 16px 40px;
  }

  .intro-section,
  .problems-section,
  .process-section,
  .benefits-section {
    padding: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .problems-grid {
    grid-template-columns: 1fr;
  }

  .process-steps {
    grid-template-columns: 1fr;
  }

  .step-arrow {
    display: none;
  }

  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
