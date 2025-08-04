<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-info">
          <p class="copyright">
            © 2025 {{ appStore.platformInfo.fullName }}. All rights reserved.
          </p>
          <p class="description">
            {{ appStore.platformInfo.slogan }}
          </p>
        </div>

        <div class="footer-links">
          <el-link type="primary" :underline="false">关于我们</el-link>
          <el-link type="primary" :underline="false">联系我们</el-link>
          <el-link type="primary" :underline="false">帮助文档</el-link>
          <el-link type="primary" :underline="false">隐私政策</el-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { useAppStore } from "@/stores/app";

export default {
  name: "AppFooter",
  setup() {
    const appStore = useAppStore();

    return {
      appStore,
    };
  },
};
</script>

<style scoped>
.app-footer {
  background-color: #1a1a1a;
  color: #909399;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info .copyright {
  color: #ffffff;
  margin-bottom: 8px;
}

.footer-info .description {
  font-size: 14px;
  color: #909399;
}

.footer-links {
  display: flex;
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
}
</style>
