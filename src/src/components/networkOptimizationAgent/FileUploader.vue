<template>
  <div class="file-uploader">
    <div
      class="upload-area"
      :class="{
        dragover: isDragOver,
        'has-file': uploadedFile,
        error: hasError,
      }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <!-- 文件输入 -->
      <input
        ref="fileInput"
        type="file"
        accept=".txt,.json"
        @change="handleFileSelect"
        style="display: none"
      />

      <!-- 上传状态显示 -->
      <div class="upload-content">
        <!-- 无文件状态 -->
        <div v-if="!uploadedFile && !hasError" class="empty-state">
          <div class="upload-icon">
            <div class="file-icon">📋</div>
            <div class="upload-arrow">⬆️</div>
          </div>
          <div class="upload-title">拖拽文件到这里或点击上传</div>
          <div class="upload-subtitle">支持 .txt/.json 格式的参数配置文件</div>
          <div class="file-limit">文件大小不超过 {{ maxSizeMB }}MB</div>
        </div>

        <!-- 拖拽状态 -->
        <div v-if="isDragOver" class="drag-state">
          <div class="drag-icon">🎯</div>
          <div class="drag-text">松开鼠标放下文件</div>
        </div>

        <!-- 已上传文件状态 -->
        <div v-if="uploadedFile && !hasError" class="file-state">
          <div class="file-info">
            <div class="file-success-icon">✅</div>
            <div class="file-details">
              <div class="file-name">{{ uploadedFile.name }}</div>
              <div class="file-meta">{{ fileSize }} • {{ fileType }}</div>
            </div>
          </div>
          <div class="file-actions">
            <button
              class="action-btn preview-btn"
              @click.stop="previewFile"
              v-if="fileContent"
            >
              <span class="cute-icon">👀</span>
              预览
            </button>
            <button class="action-btn remove-btn" @click.stop="removeFile">
              <span class="cute-icon">🗑️</span>
              移除
            </button>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="hasError" class="error-state">
          <div class="error-icon">❌</div>
          <div class="error-message">{{ errorMessage }}</div>
          <button class="retry-btn magic-button" @click="resetUpload">
            重新选择文件
          </button>
        </div>
      </div>
    </div>

    <!-- 文件预览模态框 -->
    <div v-if="showPreview" class="preview-modal" @click="closePreview">
      <div class="preview-content magic-card" @click.stop>
        <div class="preview-header">
          <h3>参数文件预览</h3>
          <button class="close-btn" @click="closePreview">✕</button>
        </div>
        <div class="preview-body">
          <div class="file-preview">
            {{ fileContent || "文件内容为空" }}
          </div>
        </div>
        <div class="preview-footer">
          <div class="file-stats">
            字符数: {{ fileContent ? fileContent.length : 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateFile } from "../../utils/networkApi.js";

export default {
  name: "FileUploader",
  emits: ["file-uploaded", "file-removed", "file-error"],

  data() {
    return {
      isDragOver: false,
      uploadedFile: null,
      fileContent: "",
      hasError: false,
      errorMessage: "",
      showPreview: false,
      maxSizeMB: 5, // 默认5MB限制
    };
  },

  computed: {
    fileSize() {
      if (!this.uploadedFile) return "";
      const size = this.uploadedFile.size;
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / 1024 / 1024).toFixed(1)} MB`;
    },

    fileType() {
      if (!this.uploadedFile) return "";
      const ext = this.uploadedFile.name.split(".").pop().toLowerCase();
      const types = {
        txt: "text/plain",
        json: "application/json",
      };
      return types[ext] || this.uploadedFile.type || "text/plain";
    },
  },

  methods: {
    // 触发文件选择
    triggerFileInput() {
      if (this.uploadedFile) return; // 如果已有文件，点击不响应
      this.$refs.fileInput.click();
    },

    // 处理文件选择
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },

    // 处理拖拽
    handleDrop(event) {
      event.preventDefault();
      this.isDragOver = false;

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    },

    handleDragOver(event) {
      event.preventDefault();
    },

    handleDragEnter(event) {
      event.preventDefault();
      if (!this.uploadedFile) {
        this.isDragOver = true;
      }
    },

    handleDragLeave(event) {
      event.preventDefault();
      // 只有当离开整个拖拽区域时才设置为false
      if (!event.currentTarget.contains(event.relatedTarget)) {
        this.isDragOver = false;
      }
    },

    // 处理文件
    async processFile(file) {
      this.resetError();

      // 验证文件
      const validation = this.validateNetworkFile(file);
      if (!validation.valid) {
        this.setError(validation.message);
        return;
      }

      try {
        // 读取文件内容
        const content = await this.readFileContent(file);

        this.uploadedFile = file;
        this.fileContent = content;

        // 触发上传事件
        this.$emit("file-uploaded", {
          file: file,
          content: content,
        });

        // 显示成功动画
        this.showSuccessAnimation();
      } catch (error) {
        this.setError("文件读取失败，请重试");
      }
    },

    // 验证网优文件
    validateNetworkFile(file) {
      return validateFile(file);
    },

    // 读取文件内容
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve(event.target.result);
        };

        reader.onerror = () => {
          reject(new Error("文件读取失败"));
        };

        reader.readAsText(file, "UTF-8");
      });
    },

    // 移除文件
    removeFile() {
      this.uploadedFile = null;
      this.fileContent = "";
      this.resetError();
      this.$refs.fileInput.value = "";
      this.$emit("file-removed");
    },

    // 预览文件
    previewFile() {
      this.showPreview = true;
    },

    // 关闭预览
    closePreview() {
      this.showPreview = false;
    },

    // 重置上传
    resetUpload() {
      this.removeFile();
    },

    // 设置错误
    setError(message) {
      this.hasError = true;
      this.errorMessage = message;
      this.uploadedFile = null;
      this.fileContent = "";
      this.$emit("file-error", message);
    },

    // 重置错误
    resetError() {
      this.hasError = false;
      this.errorMessage = "";
    },

    // 成功动画
    showSuccessAnimation() {
      // 触发成功动画效果 - 修复$el问题
      const uploadArea = document.querySelector(".upload-area");
      if (uploadArea) {
        uploadArea.classList.add("success-animation");

        setTimeout(() => {
          uploadArea.classList.remove("success-animation");
        }, 600);
      }
    },
  },
};
</script>

<style scoped>
.file-uploader {
  width: 100%;
  margin: 16px 0;
}

.upload-area {
  border: 2px dashed rgba(30, 60, 114, 0.4);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #1e3c72;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30, 60, 114, 0.2);
}

.upload-area.dragover {
  border-color: #4ecdc4;
  background: rgba(78, 205, 196, 0.1);
  transform: scale(1.02);
  box-shadow: 0 12px 32px rgba(78, 205, 196, 0.3);
}

.upload-area.has-file {
  border-color: #4ecdc4;
  background: rgba(78, 205, 196, 0.1);
  cursor: default;
}

.upload-area.error {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.upload-area.success-animation {
  animation: successPulse 0.6s ease-in-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.upload-content {
  width: 100%;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.file-icon {
  font-size: 4rem;
  opacity: 0.8;
  animation: fileFloat 3s ease-in-out infinite;
}

.upload-arrow {
  position: absolute;
  bottom: 10px;
  right: -10px;
  font-size: 1.5rem;
  animation: arrowBounce 2s ease-in-out infinite;
}

.upload-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 4px;
}

.upload-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;
}

.file-limit {
  font-size: 0.9rem;
  color: #999;
  background: rgba(30, 60, 114, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

/* 拖拽状态样式 */
.drag-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.drag-icon {
  font-size: 4rem;
  animation: targetPulse 1s ease-in-out infinite;
}

.drag-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #4ecdc4;
}

/* 文件状态样式 */
.file-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 16px;
  border: 2px solid rgba(78, 205, 196, 0.3);
}

.file-success-icon {
  font-size: 2rem;
  animation: successBounce 0.6s ease-out;
}

.file-details {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 0.9rem;
  color: #666;
}

.file-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.preview-btn:hover {
  border-color: #1e3c72;
  background: rgba(30, 60, 114, 0.1);
}

.remove-btn:hover {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

/* 错误状态样式 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-icon {
  font-size: 3rem;
  animation: errorShake 0.5s ease-in-out;
}

.error-message {
  font-size: 1.1rem;
  color: #ff6b6b;
  font-weight: 500;
  text-align: center;
}

.retry-btn {
  margin-top: 8px;
}

.magic-button {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  border: none;
  border-radius: 20px;
  color: white;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
}

.magic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 60, 114, 0.3);
}

/* 预览模态框 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.preview-content {
  max-width: 600px;
  max-height: 80vh;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.preview-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.file-preview {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #2c3e50;
  font-family: "Courier New", monospace;
  font-size: 14px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.preview-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  text-align: center;
  background: #f8f9fa;
}

.file-stats {
  font-size: 14px;
  color: #666;
}

.magic-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

/* 动画定义 */
@keyframes fileFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes arrowBounce {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes targetPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes successBounce {
  0% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-area {
    padding: 24px 16px;
    min-height: 150px;
  }

  .file-icon {
    font-size: 3rem;
  }

  .upload-title {
    font-size: 1.1rem;
  }

  .file-actions {
    flex-direction: column;
  }

  .preview-modal {
    padding: 10px;
  }

  .preview-content {
    max-height: 90vh;
  }
}
</style>
