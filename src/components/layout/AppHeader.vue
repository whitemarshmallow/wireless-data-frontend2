<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <el-icon class="logo-icon"><DataBoard /></el-icon>
            <span class="logo-text">{{ appStore.platformInfo.name }}</span>
          </div>
          <span class="platform-name">{{
            appStore.platformInfo.fullName
          }}</span>
        </router-link>
      </div>

      <!-- 自定义导航菜单 -->
      <nav class="nav-menu">
        <div class="custom-menu">
          <router-link
            to="/"
            class="menu-item"
            :class="{ 'is-active': activeIndex === '/' }"
          >
            <el-icon><House /></el-icon>
            <span>无线AI开发平台</span>
          </router-link>

          <router-link
            to="/capabilities"
            class="menu-item"
            :class="{ 'is-active': activeIndex === '/capabilities' }"
          >
            <el-icon><Setting /></el-icon>
            <span>平台五大能力</span>
          </router-link>

          <router-link
            to="/scenarios"
            class="menu-item"
            :class="{ 'is-active': activeIndex === '/scenarios' }"
          >
            <el-icon><Monitor /></el-icon>
            <span>无线工具库</span>
          </router-link>
        </div>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <div class="action-buttons">
          <el-button type="text" class="action-btn">
            <el-icon><Document /></el-icon>
            文档
          </el-button>

          <el-button type="text" class="action-btn">
            <el-icon><ChatLineRound /></el-icon>
            社区
          </el-button>

          <el-button type="primary" class="login-btn"> 登录 </el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";

export default {
  name: "AppHeader",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const appStore = useAppStore();

    // 当前激活的菜单项
    const activeIndex = computed(() => {
      return route.path;
    });

    return {
      appStore,
      activeIndex,
    };
  },
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--header-bg);
  border-bottom: 1px solid #2c2c2c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Logo区域 */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
  margin-right: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.platform-name {
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
}

/* 自定义导航菜单 */
.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.custom-menu {
  display: flex;
  align-items: center;
  gap: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  height: 60px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #409eff;
}

.menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
  border-bottom-color: #409eff;
}

.menu-item .el-icon {
  font-size: 16px;
}

.menu-item span {
  font-size: 14px;
  white-space: nowrap;
}

/* 右侧操作区 */
.header-actions {
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  color: #ffffff !important;
  padding: 8px 16px;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #409eff !important;
}

.login-btn {
  margin-left: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .platform-name {
    display: none;
  }

  .menu-item {
    padding: 0 12px;
  }

  .menu-item span {
    display: none;
  }

  .action-buttons .action-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .menu-item {
    padding: 0 8px;
  }
}
</style>
