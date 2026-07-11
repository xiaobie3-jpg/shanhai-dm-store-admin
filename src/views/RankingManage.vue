<template>
  <div class="page">
    <div class="toolbar">
      <a-button type="primary" @click="openCreate">
        <template #icon><icon-plus /></template>
        新建打榜
      </a-button>
    </div>

    <a-card :bordered="false" class="table-card">
      <a-table :columns="cols" :data="periods" :pagination="{ pageSize: 8 }">
        <template #status="{ record }">
          <a-tag v-if="record.status === 'running'" color="green">进行中</a-tag>
          <a-tag v-else-if="record.status === 'waiting'" color="orange">未开始</a-tag>
          <a-tag v-else color="red">已结束</a-tag>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="openEdit(record)">编辑期数</a-button>
            <a-button type="text" size="small" @click="openDetail">查看榜单</a-button>
            <a-button
              v-if="record.status === 'running'"
              type="text"
              size="small"
              status="warning"
              @click="endPeriod(record)"
            >
              提前结束
            </a-button>
            <a-popconfirm content="确认删除该期打榜？" @ok="removePeriod(record)">
              <a-button type="text" size="small" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="editing ? '编辑打榜' : '新建打榜'"
      @cancel="modalVisible = false"
      @before-ok="submitForm"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item field="name" label="期数名称" required>
          <a-input v-model="form.name" placeholder="如：第3期·七夕专场" />
        </a-form-item>
        <a-form-item field="start" label="开始时间" required>
          <a-date-picker v-model="form.start" show-time style="width: 100%" />
        </a-form-item>
        <a-form-item field="end" label="结束时间" required>
          <a-date-picker v-model="form.end" show-time style="width: 100%" />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="form.status" placeholder="选择状态">
            <a-option value="waiting">未开始</a-option>
            <a-option value="running">进行中</a-option>
            <a-option value="ended">已结束</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 榜单明细弹窗 -->
    <a-modal
      v-model:visible="detailVisible"
      title="榜单明细"
      :footer="false"
      :width="720"
    >
      <a-tabs default-active-key="pop">
        <a-tab-pane key="pop" title="人气榜">
          <a-table :columns="rankCols" :data="popRank" :pagination="false" />
        </a-tab-pane>
        <a-tab-pane key="player" title="玩家榜">
          <a-table :columns="rankCols" :data="playerRank" :pagination="false" />
        </a-tab-pane>
        <a-tab-pane key="reward" title="打赏明细">
          <a-table :columns="rewardCols" :data="rewardDetail" :pagination="false" />
        </a-tab-pane>
      </a-tabs>
      <a-button long style="margin-top: 16px" @click="Message.success('榜单已导出为 Excel')">
        导出 Excel
      </a-button>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const cols = [
  { title: '期数', dataIndex: 'name', width: 200 },
  { title: '开始时间', dataIndex: 'start', width: 180 },
  { title: '结束时间', dataIndex: 'end', width: 180 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '操作', slotName: 'action', width: 240 }
]

const periods = ref([
  { key: '1', name: '第2期·盛夏恋曲', start: '2026-07-01 20:00', end: '2026-07-15 20:00', status: 'running' },
  { key: '2', name: '第1期·初见山海', start: '2026-06-15 20:00', end: '2026-06-30 20:00', status: 'ended' }
])

const modalVisible = ref(false)
const editing = ref(false)
const form = reactive({ key: '0', name: '', start: '', end: '', status: 'waiting' })

const openCreate = () => {
  editing.value = false
  Object.assign(form, { key: '0', name: '', start: '', end: '', status: 'waiting' })
  modalVisible.value = true
}
const openEdit = (r: any) => {
  editing.value = true
  Object.assign(form, r)
  modalVisible.value = true
}
const submitForm = () => {
  if (!form.name) {
    Message.warning('请填写期数名称')
    return false
  }
  if (editing.value) {
    const i = periods.value.findIndex((p) => p.key === form.key)
    if (i > -1) periods.value[i] = { ...periods.value[i], ...form }
    Message.success('打榜已更新')
  } else {
    periods.value.unshift({
      key: String(Date.now()),
      name: form.name,
      start: String(form.start),
      end: String(form.end),
      status: form.status
    })
    Message.success('打榜已创建')
  }
  return true
}
const endPeriod = (record: any) => {
  record.status = 'ended'
  Message.success(`「${record.name}」已提前结束`)
}
const removePeriod = (record: any) => {
  periods.value = periods.value.filter((p) => p.key !== record.key)
  Message.success('已删除该期打榜')
}

const detailVisible = ref(false)
const openDetail = () => {
  detailVisible.value = true
}
const rankCols = [
  { title: '排名', dataIndex: 'rank', width: 80 },
  { title: '名称', dataIndex: 'name', width: 160 },
  { title: '积分', dataIndex: 'point', width: 120 }
]
const popRank = [
  { rank: 1, name: '山海·小鹿', point: 48200 },
  { rank: 2, name: '绘梦·阿九', point: 39600 },
  { rank: 3, name: '山海·云川', point: 28100 }
]
const playerRank = [
  { rank: 1, name: '梦归人', point: 12000 },
  { rank: 2, name: '醉里看花', point: 9800 },
  { rank: 3, name: '青衫旧', point: 7200 }
]
const rewardCols = [
  { title: '用户', dataIndex: 'user', width: 140 },
  { title: 'DM', dataIndex: 'dm', width: 140 },
  { title: '积分', dataIndex: 'point', width: 100 },
  { title: '时间', dataIndex: 'time', width: 180 }
]
const rewardDetail = [
  { user: '梦归人', dm: '山海·小鹿', point: 2000, time: '2026-07-10 21:30' },
  { user: '青衫旧', dm: '山海·云川', point: 5000, time: '2026-07-10 20:15' },
  { user: '听雨眠', dm: '绘梦·青禾', point: 500, time: '2026-07-09 22:40' }
]
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
}
.table-card {
  border-radius: var(--border-radius-medium);
}
</style>
