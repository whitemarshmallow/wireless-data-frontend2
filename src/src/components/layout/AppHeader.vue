<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <img class="logo-img" src="../../assets/home/logo.png" />
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
          <!-- 无线AI开发平台 (下拉菜单) -->
          <router-link
            to="/"
            class="menu-item dropdown-trigger"
            :class="{ 'is-active': activeIndex === '/' }"
          >
            <el-icon><Monitor /></el-icon>
            <span>无线AI开发平台</span>
          </router-link>
          <!-- 无线数据仓库 -->
          <div class="menu-item-wrapper dropdown-wrapper">
            <router-link
              to="/wireless-data"
              class="menu-item"
              :class="{ 'is-active': activeIndex === '/wireless-data' }"
            >
              <el-icon><DataBoard /></el-icon>
              <span>无线数据仓库</span>
            </router-link>
            <div class="dropdown-menu">
              <router-link
                to="/upload"
                class="dropdown-item"
                :class="{ 'is-active': activeIndex === '/upload' }"
              >
                <el-icon><Setting /></el-icon>
                <span>数据格式转换</span>
              </router-link>
              <router-link
                to="/viavi-download"
                class="dropdown-item"
                :class="{ 'is-active': activeIndex === '/viavi-download' }"
              >
                <el-icon><Setting /></el-icon>
                <span>仿真数据下载</span>
              </router-link>
              <router-link
                to="/livenet-download"
                class="dropdown-item"
                :class="{ 'is-active': activeIndex === '/livenet-download' }"
              >
                <el-icon><Setting /></el-icon>
                <span>现网数据下载</span>
              </router-link>
            </div>
          </div>

          <!-- 无线工具库 -->
          <router-link
            to="/scenarios"
            class="menu-item"
            :class="{ 'is-active': activeIndex === '/scenarios' }"
          >
            <el-icon><Connection /></el-icon>
            <span>应用场景</span>
          </router-link>
        </div>
      </nav>

      <!-- 右侧操作区 -->
      <div class="header-actions">
        <div class="action-buttons">
          <el-button type="text" class="action-btn">
            <el-icon><ChatLineRound /></el-icon>
            开放式平台
          </el-button>
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

.logo-img {
  font-size: 24px;
  color: #409eff;
  margin-right: 8px;
  width: 28px;
  height: 28px;
  opacity: 1;
}

.logo-text {
  font-size: 16px;
  color: #202939;
  font-family: "DingTalk JinBuTi";
  font-weight: 400;
  line-height: 24px;
  font-style: italic;
  font-weight: bold;
}

.platform-name {
  font-size: 16px;
  color: #202939;
  white-space: nowrap;
  font-family: "DingTalk JinBuTi";
  font-weight: 400;
  line-height: 24px;
  font-style: italic;
  font-weight: bold;
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
  opacity: 1;
  gap: 10px;
  border-radius: 8px;
  padding-top: 7px;
  padding-right: 16px;
  padding-bottom: 7px;
  padding-left: 16px;
}

.menu-item-wrapper {
  position: relative;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  width: 130;
  height: 40;
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
  background-color: #263fff1a;
  color: #263fff;
  width: 130;
  height: 40;
  opacity: 1;
  gap: 10px;
  border-radius: 8px;
  padding-top: 7px;
  padding-right: 16px;
  padding-bottom: 7px;
  padding-left: 16px;
}

.menu-item .el-icon {
  font-size: 16px;
}

.el-icon svg {
  color: #263fff;
}

.menu-item span {
  font-size: 14px;
  white-space: nowrap;
  color: #000;
}

/* 下拉菜单样式 */
.dropdown-wrapper:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #409eff;
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.dropdown-wrapper:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: none;
  height: auto;
}

.dropdown-item:hover {
  background-color: #f8fafc;
  color: #409eff;
}

.dropdown-item.is-active {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
  border-bottom: none;
}

.dropdown-item .el-icon {
  font-size: 14px;
}

.dropdown-item span {
  font-size: 14px;
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
  color: black !important;
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

  .dropdown-menu {
    min-width: 150px;
  }

  .dropdown-item span {
    display: block;
  }

  .action-buttons .action-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .menu-item {
    padding: 0 8px;
  }

  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 180px;
  }
}
</style>
