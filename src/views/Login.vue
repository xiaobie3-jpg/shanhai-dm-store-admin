<template>
  <div class="login">
    <div class="login-aside">
      <div class="aside-inner">
        <div class="brand">
          <icon-book class="brand-icon" />
          <span>山海绘梦</span>
        </div>
        <h1 class="aside-title">门店运营管理后台</h1>
        <p class="aside-desc">DM 打榜预约小程序 · 单门店经营中枢</p>
        <a-divider class="aside-divider" />
        <ul class="aside-list">
          <li><icon-check-circle class="li-icon" />打榜榜单与 DM 排班管理</li>
          <li><icon-check-circle class="li-icon" />剧本车次 / 场次排期配置</li>
          <li><icon-check-circle class="li-icon" />门店信息与经营数据看板</li>
        </ul>
      </div>
    </div>

    <div class="login-main">
      <a-card class="login-card" :bordered="false">
        <div class="login-head">
          <icon-book class="login-icon" />
          <h2 class="login-title">欢迎登录</h2>
          <p class="login-sub">门店管理端 · 请使用门店账号登录</p>
        </div>

        <a-form :model="loginForm" layout="vertical" @submit-success="doLogin">
          <a-form-item field="username" label="管理员账号" required>
            <a-input v-model="loginForm.username" placeholder="请输入管理员账号" allow-clear>
              <template #prefix><icon-user /></template>
            </a-input>
          </a-form-item>
          <a-form-item field="password" label="密码" required>
            <a-input-password v-model="loginForm.password" placeholder="请输入密码" allow-clear>
              <template #prefix><icon-lock /></template>
            </a-input-password>
          </a-form-item>
          <a-button type="primary" long size="large" html-type="submit" class="login-btn">
            登 录
          </a-button>
        </a-form>

        <a-typography-text type="secondary" class="login-tip">
          演示账号：admin / 123456
        </a-typography-text>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconBook, IconCheckCircle, IconUser, IconLock } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const loginForm = reactive({ username: '', password: '' })

const doLogin = () => {
  if (!loginForm.username || !loginForm.password) {
    Message.warning('请输入账号和密码')
    return
  }
  Message.success('登录成功，欢迎门店管理员')
  localStorage.setItem('sh_store_logged', '1')
  router.push({ name: 'dashboard' })
}
</script>

<style scoped>
.login {
  height: 100vh;
  display: flex;
}
.login-aside {
  width: 420px;
  flex-shrink: 0;
  background: linear-gradient(155deg, var(--color-primary), var(--color-primary-light-2));
  color: var(--color-white);
  display: flex;
  align-items: center;
  padding: 0 56px;
}
.aside-inner {
  width: 100%;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-title-3);
  font-weight: 600;
}
.brand-icon {
  font-size: 28px;
}
.aside-title {
  margin: 28px 0 8px;
  font-size: var(--font-size-display-1);
  font-weight: 600;
  line-height: 1.3;
}
.aside-desc {
  margin: 0;
  font-size: var(--font-size-body-1);
  color: var(--color-white);
  opacity: 0.85;
}
.aside-divider {
  margin: 28px 0;
  border-color: var(--color-white);
  opacity: 0.3;
}
.aside-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: var(--font-size-body-1);
}
.aside-list li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.li-icon {
  font-size: 18px;
  color: var(--color-white);
  opacity: 0.95;
  flex-shrink: 0;
}
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-1);
  padding: 24px;
}
.login-card {
  width: 380px;
  max-width: 100%;
  padding: 8px 16px;
  border-radius: var(--border-radius-large);
  border: 1px solid var(--color-border-2);
  background: var(--color-bg-2);
}
.login-head {
  text-align: center;
  margin: 16px 0 28px;
}
.login-icon {
  font-size: 32px;
  color: var(--color-primary);
}
.login-title {
  margin: 8px 0 4px;
  color: var(--color-text-1);
  font-size: var(--font-size-title-3);
  font-weight: 600;
}
.login-sub {
  margin: 0;
  color: var(--color-text-3);
  font-size: var(--font-size-body-2);
}
.login-btn {
  margin-top: 8px;
}
.login-tip {
  display: block;
  text-align: center;
  margin: 20px 0 8px;
  font-size: var(--font-size-body-2);
}
@media (max-width: 768px) {
  .login-aside {
    display: none;
  }
}
</style>
