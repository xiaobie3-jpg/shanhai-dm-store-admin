<template>
  <a-layout class="layout">
    <!-- 侧边栏：菜单导航 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :collapsed-width="56"
      :width="220"
      class="sider"
    >
      <div class="logo">
        <div class="logo-badge"><icon-book /></div>
        <span v-if="!collapsed" class="logo-text">山海绘梦·门店端</span>
      </div>
      <a-menu
        theme="dark"
        :selected-keys="selectedKeys"
        class="menu"
        @menu-item-click="onMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon><icon-dashboard /></template>
          首页概览
        </a-menu-item>
        <a-menu-item key="ranking">
          <template #icon><icon-trophy /></template>
          打榜管理
        </a-menu-item>
        <a-menu-item key="dm">
          <template #icon><icon-user /></template>
          DM 管理
        </a-menu-item>
        <a-menu-item key="script">
          <template #icon><icon-book /></template>
          剧本车次
        </a-menu-item>
        <a-menu-item key="config">
          <template #icon><icon-settings /></template>
          门店配置
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧主区 -->
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <span class="header-dot" />
          <div class="header-title">{{ currentTitle }}</div>
        </div>
        <div class="header-right">
          <a-tag color="orangered" size="small">门店管理员</a-tag>
          <span class="header-store">山海绘梦 · 长沙店</span>
          <a-button type="text" size="small" @click="openPwd">修改密码</a-button>
          <a-button type="text" size="small" status="danger" @click="doLogout">退出登录</a-button>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <a-card class="content-card" :bordered="false">
          <router-view />
        </a-card>
      </a-layout-content>
    </a-layout>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="pwdVisible"
      title="修改密码"
      @cancel="pwdVisible = false"
      @before-ok="submitPwd"
    >
      <a-form :model="pwdForm" layout="vertical">
        <a-form-item field="oldPwd" label="原密码" required>
          <a-input-password v-model="pwdForm.oldPwd" placeholder="请输入原密码" />
        </a-form-item>
        <a-form-item field="newPwd" label="新密码" required>
          <a-input-password v-model="pwdForm.newPwd" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item field="confirmPwd" label="确认新密码" required>
          <a-input-password v-model="pwdForm.confirmPwd" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconDashboard,
  IconTrophy,
  IconUser,
  IconBook,
  IconSettings
} from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.name as string])
const currentTitle = computed(() => (route.meta.title as string) || '门店管理')

// 菜单与路由同步
watch(
  () => route.name,
  (name) => {
    selectedKeys.value = [name as string]
  },
  { immediate: true }
)

const onMenuClick = (key: string) => {
  router.push({ name: key })
}

// 修改密码
const pwdVisible = ref(false)
const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
const openPwd = () => {
  pwdForm.oldPwd = ''
  pwdForm.newPwd = ''
  pwdForm.confirmPwd = ''
  pwdVisible.value = true
}
const submitPwd = () => {
  if (!pwdForm.oldPwd || !pwdForm.newPwd) {
    Message.warning('请填写完整密码信息')
    return false
  }
  if (pwdForm.newPwd !== pwdForm.confirmPwd) {
    Message.error('两次新密码不一致')
    return false
  }
  Message.success('密码修改成功')
  return true
}

const doLogout = () => {
  localStorage.removeItem('sh_store_logged')
  router.push({ name: 'login' })
  Message.info('已退出登录')
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.sider {
  background: var(--color-menu-dark-bg);
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  padding: 0 16px;
  color: var(--color-white);
  font-weight: 600;
  font-size: var(--font-size-title-3);
}
.logo-badge {
  width: 30px;
  height: 30px;
  border-radius: var(--border-radius-circle);
  background: var(--color-primary-light-1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.logo-text {
  overflow: hidden;
  white-space: nowrap;
}
.menu {
  height: calc(100vh - 60px);
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--border-radius-circle);
  background: var(--color-primary);
}
.header-title {
  font-weight: 600;
  font-size: var(--font-size-title-4);
  color: var(--color-text-1);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-store {
  color: var(--color-text-3);
  font-size: var(--font-size-body-2);
}
.content {
  padding: 20px;
  background: var(--color-bg-1);
  overflow: auto;
}
.content-card {
  background: var(--color-bg-2);
  border-radius: var(--border-radius-medium);
}
</style>
