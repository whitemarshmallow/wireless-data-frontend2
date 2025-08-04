<template>
  <div class="data-asset-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="header-container">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <router-link to="/scenarios">应用场景</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>数据资产</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">数据资产</h1>
            <p class="page-subtitle">
              无线数据的资产化管理，释放数据价值，推动商业创新
            </p>
            <div class="coming-soon-badge">
              <el-icon><Clock /></el-icon>
              <span>即将推出</span>
            </div>
          </div>

          <div class="header-icon">
            <el-icon class="scenario-icon"><Coin /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 价值主张 -->
    <section class="value-proposition">
      <div class="section-container">
        <h2 class="section-title">数据资产化的价值</h2>

        <div class="value-grid">
          <div class="value-item">
            <el-icon class="value-icon"><TrendCharts /></el-icon>
            <h3 class="value-title">价值发现</h3>
            <p class="value-desc">
              通过数据分析和挖掘，发现隐藏在无线网络数据中的商业价值和洞察
            </p>
          </div>

          <div class="value-item">
            <el-icon class="value-icon"><Tickets /></el-icon>
            <h3 class="value-title">资产盘点</h3>
            <p class="value-desc">
              建立完整的数据资产目录，实现数据资产的统一管理和标准化描述
            </p>
          </div>

          <div class="value-item">
            <el-icon class="value-icon"><DocumentCopy /></el-icon>
            <h3 class="value-title">合规治理</h3>
            <p class="value-desc">
              确保数据使用符合法规要求，建立数据安全和隐私保护机制
            </p>
          </div>

          <div class="value-item">
            <el-icon class="value-icon"><Share /></el-icon>
            <h3 class="value-title">价值变现</h3>
            <p class="value-desc">
              通过数据交易和服务创新，将数据资产转化为实际的商业收益
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能模块 -->
    <section class="function-modules">
      <div class="section-container">
        <h2 class="section-title">核心功能模块</h2>

        <div class="modules-container">
          <div class="module-nav">
            <div
              v-for="module in modules"
              :key="module.id"
              class="nav-item"
              :class="{ active: activeModule === module.id }"
              @click="setActiveModule(module.id)"
            >
              <el-icon><component :is="module.icon" /></el-icon>
              <span>{{ module.name }}</span>
            </div>
          </div>

          <div class="module-content">
            <transition name="fade" mode="out-in">
              <div :key="activeModule" class="content-panel">
                <h3 class="panel-title">{{ currentModule.name }}</h3>
                <p class="panel-desc">{{ currentModule.description }}</p>

                <div class="panel-features">
                  <div
                    v-for="feature in currentModule.features"
                    :key="feature"
                    class="feature-item"
                  >
                    <el-icon class="feature-check"><Check /></el-icon>
                    <span>{{ feature }}</span>
                  </div>
                </div>

                <div class="panel-image">
                  <div class="image-placeholder">
                    <el-icon class="placeholder-icon"
                      ><component :is="currentModule.icon"
                    /></el-icon>
                    <span>{{ currentModule.name }}示意图</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用收益 -->
    <section class="benefits-section">
      <div class="section-container">
        <h2 class="section-title">应用收益</h2>

        <div class="benefits-showcase">
          <div class="benefit-stats">
            <div class="stat-item">
              <div class="stat-number">80%</div>
              <div class="stat-label">数据利用率提升</div>
            </div>

            <div class="stat-item">
              <div class="stat-number">60%</div>
              <div class="stat-label">运营成本降低</div>
            </div>

            <div class="stat-item">
              <div class="stat-number">150%</div>
              <div class="stat-label">数据价值增长</div>
            </div>

            <div class="stat-item">
              <div class="stat-number">90%</div>
              <div class="stat-label">合规达标率</div>
            </div>
          </div>

          <div class="benefit-chart">
            <div class="chart-container">
              <h4>数据资产价值增长趋势</h4>
              <div class="chart-placeholder">
                <el-icon class="chart-icon"><TrendCharts /></el-icon>
                <p>数据价值增长可视化图表</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 实施路径 -->
    <section class="roadmap-section">
      <div class="section-container">
        <h2 class="section-title">实施路径</h2>

        <div class="roadmap-timeline">
          <div class="phase-item">
            <div class="phase-number">1</div>
            <div class="phase-content">
              <h4>资产盘点</h4>
              <p>梳理现有数据资产，建立数据目录和分类体系</p>
              <div class="phase-duration">1-2个月</div>
            </div>
          </div>

          <div class="phase-connector">
            <el-icon><ArrowRight /></el-icon>
          </div>

          <div class="phase-item">
            <div class="phase-number">2</div>
            <div class="phase-content">
              <h4>价值评估</h4>
              <p>建立数据价值评估模型，量化数据资产价值</p>
              <div class="phase-duration">2-3个月</div>
            </div>
          </div>

          <div class="phase-connector">
            <el-icon><ArrowRight /></el-icon>
          </div>

          <div class="phase-item">
            <div class="phase-number">3</div>
            <div class="phase-content">
              <h4>治理体系</h4>
              <p>建立数据治理制度，确保数据质量和合规性</p>
              <div class="phase-duration">2-4个月</div>
            </div>
          </div>

          <div class="phase-connector">
            <el-icon><ArrowRight /></el-icon>
          </div>

          <div class="phase-item">
            <div class="phase-number">4</div>
            <div class="phase-content">
              <h4>价值变现</h4>
              <p>开展数据服务和交易，实现数据价值变现</p>
              <div class="phase-duration">持续进行</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系咨询 -->
    <section class="contact-section">
      <div class="section-container">
        <div class="contact-card">
          <el-icon class="contact-icon"><Service /></el-icon>
          <h3 class="contact-title">专业咨询服务</h3>
          <p class="contact-desc">
            我们提供数据资产化的专业咨询服务，帮助您制定个性化的数据资产管理策略
          </p>

          <div class="contact-info">
            <div class="info-item">
              <el-icon class="info-icon"><Phone /></el-icon>
              <span>咨询热线：400-123-4567</span>
            </div>
            <div class="info-item">
              <el-icon class="info-icon"><Message /></el-icon>
              <span>邮箱：dataasset@widop.com</span>
            </div>
          </div>

          <el-button
            type="primary"
            size="large"
            @click="showConsultDialog = true"
          >
            预约咨询
          </el-button>
        </div>
      </div>
    </section>

    <!-- 咨询对话框 -->
    <el-dialog
      v-model="showConsultDialog"
      title="预约咨询"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="consultForm" label-width="80px">
        <el-form-item label="姓名" required>
          <el-input v-model="consultForm.name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="公司" required>
          <el-input
            v-model="consultForm.company"
            placeholder="请输入公司名称"
          />
        </el-form-item>
        <el-form-item label="职位">
          <el-input
            v-model="consultForm.position"
            placeholder="请输入您的职位"
          />
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input v-model="consultForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="consultForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="需求描述">
          <el-input
            v-model="consultForm.requirement"
            type="textarea"
            :rows="3"
            placeholder="请简单描述您的数据资产管理需求"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showConsultDialog = false">取消</el-button>
          <el-button type="primary" @click="submitConsult">确认预约</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "DataAsset",
  setup() {
    const activeModule = ref("catalog");
    const showConsultDialog = ref(false);

    // 功能模块数据
    const modules = ref([
      {
        id: "catalog",
        name: "数据目录",
        icon: "Menu",
        description: "建立全面的数据资产目录，实现数据资产的统一管理和检索",
        features: [
          "自动化数据发现和识别",
          "元数据管理和标准化",
          "数据血缘关系追踪",
          "智能标签和分类体系",
        ],
      },
      {
        id: "evaluation",
        name: "价值评估",
        icon: "TrendCharts",
        description: "基于多维度指标体系，科学评估数据资产的商业价值",
        features: [
          "数据质量评估模型",
          "商业价值量化算法",
          "使用频率和影响分析",
          "投资回报率计算",
        ],
      },
      {
        id: "governance",
        name: "治理体系",
        icon: "Shield",
        description: "建立完善的数据治理框架，确保数据安全、合规和质量",
        features: [
          "数据安全策略制定",
          "隐私保护机制",
          "访问权限管理",
          "合规性监控和审计",
        ],
      },
      {
        id: "trading",
        name: "交易平台",
        icon: "ShoppingCart",
        description: "提供安全可信的数据交易环境，实现数据价值的商业化变现",
        features: [
          "数据产品包装和发布",
          "安全的数据交易机制",
          "智能定价模型",
          "交易过程监控和结算",
        ],
      },
    ]);

    // 咨询表单
    const consultForm = reactive({
      name: "",
      company: "",
      position: "",
      email: "",
      phone: "",
      requirement: "",
    });

    // 当前激活的模块
    const currentModule = computed(() => {
      return modules.value.find((m) => m.id === activeModule.value);
    });

    // 设置激活模块
    const setActiveModule = (moduleId) => {
      activeModule.value = moduleId;
    };

    // 重置表单
    const resetForm = () => {
      Object.keys(consultForm).forEach((key) => {
        consultForm[key] = "";
      });
    };

    // 提交咨询
    const submitConsult = () => {
      if (
        !consultForm.name ||
        !consultForm.company ||
        !consultForm.email ||
        !consultForm.phone
      ) {
        ElMessage.warning("请填写必要信息");
        return;
      }

      ElMessage.success("预约成功！我们会在24小时内与您联系");
      showConsultDialog.value = false;
      resetForm();
    };

    return {
      modules,
      activeModule,
      currentModule,
      showConsultDialog,
      consultForm,
      setActiveModule,
      resetForm,
      submitConsult,
    };
  },
};
</script>

<style scoped>
.data-asset-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  color: white;
  padding: 40px 0 60px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 16px;
}

.coming-soon-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.scenario-icon {
  font-size: 120px;
  opacity: 0.3;
}

/* 价值主张 */
.value-proposition {
  padding: 60px 0;
  background: white;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 48px;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.value-item {
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  background: #f8fafe;
  transition: transform 0.3s ease;
}

.value-item:hover {
  transform: translateY(-4px);
}

.value-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.value-title {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.value-desc {
  color: var(--text-regular);
  line-height: 1.6;
}

/* 功能模块 */
.function-modules {
  padding: 60px 0;
}

.modules-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.module-nav {
  background: #f8fafe;
  padding: 32px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-regular);
}

.nav-item:hover,
.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.module-content {
  padding: 40px;
}

.content-panel {
  max-width: 600px;
}

.panel-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.panel-desc {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 32px;
}

.panel-features {
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--text-regular);
}

.feature-check {
  color: var(--success-color);
  font-size: 16px;
}

.panel-image {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  border: 2px dashed #d4d7de;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.placeholder-icon {
  font-size: 48px;
}

/* 应用收益 */
.benefits-section {
  background: white;
  padding: 60px 0;
}

.benefits-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.benefit-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 24px;
  background: #f8fafe;
  border-radius: 12px;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.benefit-chart {
  background: #f5f7fa;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.chart-container h4 {
  color: var(--text-primary);
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d4d7de;
  border-radius: 8px;
  color: var(--text-secondary);
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* 实施路径 */
.roadmap-section {
  padding: 60px 0;
}

.roadmap-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.phase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 200px;
}

.phase-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.phase-content h4 {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.phase-content p {
  color: var(--text-regular);
  line-height: 1.5;
  margin-bottom: 12px;
}

.phase-duration {
  background: #f0f8ff;
  color: var(--primary-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.phase-connector {
  font-size: 24px;
  color: var(--primary-color);
}

/* 联系咨询 */
.contact-section {
  background: white;
  padding: 60px 0;
}

.contact-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.contact-title {
  font-size: 28px;
  margin-bottom: 16px;
}

.contact-desc {
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 32px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.info-icon {
  font-size: 16px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .value-grid {
    grid-template-columns: 1fr;
  }

  .modules-container {
    grid-template-columns: 1fr;
  }

  .benefits-showcase {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .benefit-stats {
    grid-template-columns: 1fr;
  }

  .roadmap-timeline {
    flex-direction: column;
  }

  .phase-connector {
    transform: rotate(90deg);
  }

  .contact-info {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
