<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <a-card class="welcome" :bordered="false">
      <div class="welcome-row">
        <div>
          <div class="welcome-title">欢迎回来，门店管理员</div>
          <div class="welcome-sub">山海绘梦 · 长沙店 · 今日经营一览</div>
        </div>
        <a-tag color="arcoblue" size="large" class="welcome-tag">{{ today }}</a-tag>
      </div>
    </a-card>

    <!-- 核心指标 -->
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-flex">
            <div class="stat-badge b-blue"><icon-trophy /></div>
            <div class="stat-meta">
              <div class="stat-title">进行中打榜</div>
              <div class="stat-value">{{ fmt(stats.ranking) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-flex">
            <div class="stat-badge b-green"><icon-user /></div>
            <div class="stat-meta">
              <div class="stat-title">在册 DM</div>
              <div class="stat-value">{{ fmt(stats.dm) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-flex">
            <div class="stat-badge b-orange"><icon-thumb-up /></div>
            <div class="stat-meta">
              <div class="stat-title">打赏总额(积分)</div>
              <div class="stat-value">{{ fmt(stats.reward) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-flex">
            <div class="stat-badge b-red"><icon-book /></div>
            <div class="stat-meta">
              <div class="stat-title">在册剧本</div>
              <div class="stat-value">{{ fmt(stats.script) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 最近打赏记录 -->
    <a-card class="table-card" :bordered="false" title="最近打赏记录">
      <template #extra>
        <a-button type="text" size="small" @click="Message.info('查看全部打赏明细')">查看全部</a-button>
      </template>
      <a-table :columns="cols" :data="rewards" :pagination="false">
        <template #status="{ record }">
          <a-tag v-if="record.status === 'success'" color="green">成功</a-tag>
          <a-tag v-else color="orangered">待确认</a-tag>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  IconTrophy,
  IconUser,
  IconThumbUp,
  IconBook
} from '@arco-design/web-vue/es/icon'

const fmt = (n: number) => n.toLocaleString('en-US')

const stats = { ranking: 2, dm: 12, reward: 184600, script: 6 }

const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

const cols = [
  { title: '用户', dataIndex: 'user', width: 140 },
  { title: '打赏 DM', dataIndex: 'dm', width: 140 },
  { title: '积分', dataIndex: 'point', width: 100 },
  { title: '时间', dataIndex: 'time', width: 180 },
  { title: '状态', slotName: 'status', width: 100 }
]

const rewards = [
  { user: '梦归人', dm: '山海·小鹿', point: 2000, time: '2026-07-10 14:22', status: 'success' },
  { user: '醉里看花', dm: '绘梦·阿九', point: 1000, time: '2026-07-10 13:10', status: 'success' },
  { user: '青衫旧', dm: '山海·云川', point: 5000, time: '2026-07-10 11:45', status: 'success' },
  { user: '听雨眠', dm: '绘梦·青禾', point: 500, time: '2026-07-10 10:30', status: 'pending' },
  { user: '北城荒', dm: '山海·夜渊', point: 1000, time: '2026-07-09 22:18', status: 'success' }
]
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.welcome {
  border-radius: var(--border-radius-medium);
  background: linear-gradient(120deg, var(--color-primary-light-1), var(--color-bg-2));
  border: 1px solid var(--color-primary-light-2);
}
.welcome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.welcome-title {
  font-size: var(--font-size-title-3);
  font-weight: 600;
  color: var(--color-text-1);
}
.welcome-sub {
  margin-top: 6px;
  font-size: var(--font-size-body-2);
  color: var(--color-text-3);
}
.welcome-tag {
  flex-shrink: 0;
}
.stat-card {
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-2);
  background: var(--color-bg-2);
  transition: transform 0.2s, border-color 0.2s;
}
.stat-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-primary-light-2);
}
.stat-flex {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 4px;
}
.stat-badge {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.b-blue { background: var(--color-primary-light-1); color: var(--color-primary); }
.b-green { background: var(--color-success-light-1); color: var(--color-success); }
.b-orange { background: var(--color-warning-light-1); color: var(--color-warning); }
.b-red { background: var(--color-danger-light-1); color: var(--color-danger); }
.stat-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.stat-title {
  font-size: var(--font-size-body-2);
  color: var(--color-text-3);
}
.stat-value {
  font-size: var(--font-size-title-2);
  font-weight: 600;
  color: var(--color-text-1);
  line-height: 1.2;
}
.table-card {
  border-radius: var(--border-radius-medium);
  background: var(--color-bg-2);
}
</style>
