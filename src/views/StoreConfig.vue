<template>
  <div class="page">
    <a-card :bordered="false" class="form-card" title="门店基本信息">
      <a-form :model="base" layout="vertical" @submit-success="saveBase">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="name" label="门店名称" required>
              <a-input v-model="base.name" placeholder="门店名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="address" label="门店地址" required>
              <a-input v-model="base.address" placeholder="门店地址" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item field="bg" label="背景图">
          <a-upload action="/" :auto-upload="false" :limit="1" />
        </a-form-item>
        <a-button type="primary" html-type="submit">保存基本信息</a-button>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="form-card" title="客服微信配置">
      <a-form :model="wx" layout="vertical" @submit-success="saveWx">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="account" label="客服微信号" required>
              <a-input v-model="wx.account" placeholder="微信号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="qrcode" label="二维码">
              <a-upload action="/" :auto-upload="false" :limit="1" list-type="picture-card" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit">保存客服配置</a-button>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="form-card" title="专车公告配置">
      <a-form :model="notice" layout="vertical" @submit-success="saveNotice">
        <a-form-item field="announcement" label="专车公告">
          <a-textarea v-model="notice.announcement" placeholder="编辑专车公告内容" :auto-size="{ minRows: 4 }" />
        </a-form-item>
        <a-button type="primary" html-type="submit">保存公告</a-button>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="form-card" title="选车规则配置">
      <a-form :model="rule" layout="vertical" @submit-success="saveRule">
        <a-form-item field="ruleText" label="选车规则说明">
          <a-textarea v-model="rule.ruleText" placeholder="编辑选车规则说明" :auto-size="{ minRows: 4 }" />
        </a-form-item>
        <a-button type="primary" html-type="submit">保存规则</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue'

const base = reactive({ name: '山海绘梦 · 长沙店', address: '长沙市岳麓区XX路88号', bg: '' })
const wx = reactive({ account: 'shanhai_dm001', qrcode: '' })
const notice = reactive({ announcement: '本周新增山海通道·七夕专场，敬请期待。' })
const rule = reactive({ ruleText: '玩家可在打榜期结束后48小时内进行专车选车，逾期视为放弃。' })

const saveBase = () => Message.success('门店基本信息已保存')
const saveWx = () => Message.success('客服微信配置已保存')
const saveNotice = () => Message.success('专车公告已保存')
const saveRule = () => Message.success('选车规则已保存')
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-card {
  border-radius: var(--border-radius-medium);
}
</style>
