<template>
  <div class="page">
    <a-tabs default-active-key="script">
      <!-- 剧本管理 -->
      <a-tab-pane key="script" title="剧本管理">
        <div class="toolbar">
          <a-button type="primary" @click="openScript(null)">
            <template #icon><icon-plus /></template>
            新增剧本
          </a-button>
        </div>
        <a-card :bordered="false" class="table-card">
          <a-table :columns="scriptCols" :data="scripts" :pagination="{ pageSize: 8 }">
            <template #channel="{ record }">
              <a-tag color="arcoblue">{{ channelName(record.channel) }}</a-tag>
            </template>
            <template #online="{ record }">
              <a-switch v-model="record.online" @change="() => Message.info(`${record.name} 已${record.online ? '上架' : '下架'}`)" />
            </template>
            <template #action="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="openScript(record)">编辑</a-button>
                <a-popconfirm content="确认删除该剧本？" @ok="delScript(record)">
                  <a-button type="text" size="small" status="danger">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <!-- 专车通道 -->
      <a-tab-pane key="channel" title="专车通道">
        <div class="toolbar">
          <a-button type="primary" @click="openChannel(null)">新增通道</a-button>
        </div>
        <a-card :bordered="false" class="table-card">
          <a-table :columns="channelCols" :data="channels" :pagination="{ pageSize: 8 }">
            <template #scripts="{ record }">
              <a-space wrap>
                <a-tag v-for="n in channelScripts(record.key)" :key="n" color="arcoblue">{{ n }}</a-tag>
                <span v-if="!channelScripts(record.key).length" class="muted">暂无剧本</span>
              </a-space>
            </template>
            <template #action="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="openChannel(record)">编辑</a-button>
                <a-popconfirm content="确认删除该通道？" @ok="delChannel(record)">
                  <a-button type="text" size="small" status="danger">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <!-- 车次管理 -->
      <a-tab-pane key="train" title="车次管理">
        <div class="toolbar">
          <a-button type="primary" @click="openTrain(null)">新增车次</a-button>
        </div>
        <a-card :bordered="false" class="table-card">
          <a-table :columns="trainCols" :data="trains" :pagination="{ pageSize: 8 }">
            <template #script="{ record }">
              <a-tag color="green">{{ scriptName(record.script) }}</a-tag>
            </template>
            <template #session="{ record }">
              <a-tag :color="record.session === '下午场' ? 'orange' : 'purple'">{{ record.session }}</a-tag>
            </template>
            <template #action="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="openTrain(record)">编辑</a-button>
                <a-popconfirm content="确认删除该车次？" @ok="delTrain(record)">
                  <a-button type="text" size="small" status="danger">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- 剧本弹窗 -->
    <a-modal v-model:visible="scriptVisible" :title="scriptEditing ? '编辑剧本' : '新增剧本'" @cancel="scriptVisible = false" @before-ok="submitScript">
      <a-form :model="scriptForm" layout="vertical">
        <a-form-item field="name" label="剧本名称" required>
          <a-input v-model="scriptForm.name" placeholder="如：山海绘梦·红妆" />
        </a-form-item>
        <a-form-item field="type" label="类型">
          <a-select v-model="scriptForm.type" placeholder="选择类型">
            <a-option value="古风">古风</a-option>
            <a-option value="恋陪">恋陪</a-option>
            <a-option value="悬疑">悬疑</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="channel" label="所属专车通道" required>
          <a-select v-model="scriptForm.channel" placeholder="选择所属通道">
            <a-option v-for="c in channels" :key="c.key" :value="c.key">{{ c.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="intro" label="简介">
          <a-textarea v-model="scriptForm.intro" placeholder="一句话简介" :auto-size="{ minRows: 2 }" />
        </a-form-item>
        <a-form-item field="cover" label="剧本封面">
          <a-upload action="/" :auto-upload="false" :limit="1" />
        </a-form-item>
        <a-form-item field="online" label="上架">
          <a-switch v-model="scriptForm.online" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 通道弹窗 -->
    <a-modal v-model:visible="channelVisible" :title="channelEditing ? '编辑通道' : '新增通道'" @cancel="channelVisible = false" @before-ok="submitChannel">
      <a-form :model="channelForm" layout="vertical">
        <a-form-item field="name" label="通道名称" required>
          <a-input v-model="channelForm.name" placeholder="如：山海通道" />
        </a-form-item>
        <a-form-item field="desc" label="说明">
          <a-textarea v-model="channelForm.desc" placeholder="通道说明" :auto-size="{ minRows: 2 }" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 车次弹窗 -->
    <a-modal v-model:visible="trainVisible" :title="trainEditing ? '编辑车次' : '新增车次'" @cancel="trainVisible = false" @before-ok="submitTrain">
      <a-form :model="trainForm" layout="vertical">
        <a-form-item field="no" label="车次号" required>
          <a-input v-model="trainForm.no" placeholder="如：SC001" />
        </a-form-item>
        <a-form-item field="script" label="所属剧本" required>
          <a-select v-model="trainForm.script" placeholder="选择剧本">
            <a-option v-for="s in scripts" :key="s.key" :value="s.key">{{ s.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="date" label="车次日期" required>
          <a-date-picker v-model="trainForm.date" value-format="YYYY-MM-DD" style="width:100%" />
        </a-form-item>
        <a-form-item field="session" label="场次" required>
          <a-select v-model="trainForm.session" placeholder="选择场次">
            <a-option value="下午场">下午场</a-option>
            <a-option value="晚场">晚场</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const scriptCols = [
  { title: '剧本名称', dataIndex: 'name', width: 180 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '所属专车通道', slotName: 'channel', width: 160 },
  { title: '上架', slotName: 'online', width: 100 },
  { title: '操作', slotName: 'action', width: 160 }
]
const scripts = ref([
  { key: '1', name: '山海绘梦·红妆', type: '古风', channel: '1', intro: '古风沉浸式主秀', online: true },
  { key: '2', name: '恋陪·余生', type: '恋陪', channel: '2', intro: '治愈系恋陪专场', online: true },
  { key: '3', name: '悬疑·夜行', type: '悬疑', channel: '1', intro: '烧脑悬疑夜场', online: false }
])

const channelCols = [
  { title: '通道名称', dataIndex: 'name', width: 180 },
  { title: '说明', dataIndex: 'desc', ellipsis: true },
  { title: '包含剧本', slotName: 'scripts', width: 240 },
  { title: '操作', slotName: 'action', width: 160 }
]
const channels = ref([
  { key: '1', name: '山海通道', desc: '古风沉浸式剧本专场' },
  { key: '2', name: '绘梦通道', desc: '恋陪治愈系专场' }
])

const trainCols = [
  { title: '车次号', dataIndex: 'no', width: 140 },
  { title: '所属剧本', slotName: 'script', width: 180 },
  { title: '车次日期', dataIndex: 'date', width: 160 },
  { title: '场次', slotName: 'session', width: 120 },
  { title: '操作', slotName: 'action', width: 160 }
]
const trains = ref([
  { key: '1', no: 'SC001', script: '1', date: '2026-07-12', session: '下午场' },
  { key: '2', no: 'SC002', script: '2', date: '2026-07-13', session: '晚场' }
])

const channelName = (k: string) => (channels.value.find((c) => c.key === k)?.name as string) || '未分配'
const scriptName = (k: string) => (scripts.value.find((s) => s.key === k)?.name as string) || '未分配'
const channelScripts = (channelKey: string) =>
  scripts.value.filter((s) => s.channel === channelKey).map((s) => s.name)

// 剧本
const scriptVisible = ref(false)
const scriptEditing = ref(false)
const scriptForm = reactive({ key: '0', name: '', type: '古风', channel: '', intro: '', cover: '', online: true })
const openScript = (r: any) => {
  scriptEditing.value = !!r
  Object.assign(scriptForm, r || { key: '0', name: '', type: '古风', channel: '', intro: '', cover: '', online: true })
  scriptVisible.value = true
}
const submitScript = () => {
  if (!scriptForm.name) { Message.warning('请填写剧本名称'); return false }
  if (!scriptForm.channel) { Message.warning('请选择所属专车通道'); return false }
  if (scriptEditing.value) {
    const i = scripts.value.findIndex((s) => s.key === scriptForm.key)
    if (i > -1) scripts.value[i] = { ...scripts.value[i], ...scriptForm }
    Message.success('剧本已更新')
  } else {
    scripts.value.unshift({ ...scriptForm, key: String(Date.now()) })
    Message.success('剧本已新增')
  }
  return true
}
const delScript = (r: any) => {
  scripts.value = scripts.value.filter((s) => s.key !== r.key)
  Message.success('已删除')
}

// 通道
const channelVisible = ref(false)
const channelEditing = ref(false)
const channelForm = reactive({ key: '0', name: '', desc: '' })
const openChannel = (r: any) => {
  channelEditing.value = !!r
  Object.assign(channelForm, r || { key: '0', name: '', desc: '' })
  channelVisible.value = true
}
const submitChannel = () => {
  if (!channelForm.name) { Message.warning('请填写通道名称'); return false }
  if (channelEditing.value) {
    const i = channels.value.findIndex((c) => c.key === channelForm.key)
    if (i > -1) channels.value[i] = { ...channels.value[i], ...channelForm }
    Message.success('通道已更新')
  } else {
    channels.value.unshift({ ...channelForm, key: String(Date.now()) })
    Message.success('通道已新增')
  }
  return true
}
const delChannel = (r: any) => {
  channels.value = channels.value.filter((c) => c.key !== r.key)
  Message.success('已删除')
}

// 车次
const trainVisible = ref(false)
const trainEditing = ref(false)
const trainForm = reactive({ key: '0', no: '', script: '', date: '', session: '下午场' })
const openTrain = (r: any) => {
  trainEditing.value = !!r
  Object.assign(trainForm, r || { key: '0', no: '', script: '', date: '', session: '下午场' })
  trainVisible.value = true
}
const submitTrain = () => {
  if (!trainForm.no) { Message.warning('请填写车次号'); return false }
  if (!trainForm.script) { Message.warning('请选择所属剧本'); return false }
  if (!trainForm.date) { Message.warning('请选择车次日期'); return false }
  if (!trainForm.session) { Message.warning('请选择场次'); return false }
  if (trainEditing.value) {
    const i = trains.value.findIndex((t) => t.key === trainForm.key)
    if (i > -1) trains.value[i] = { ...trains.value[i], ...trainForm }
    Message.success('车次已更新')
  } else {
    trains.value.unshift({ ...trainForm, key: String(Date.now()) })
    Message.success('车次已新增')
  }
  return true
}
const delTrain = (r: any) => {
  trains.value = trains.value.filter((t) => t.key !== r.key)
  Message.success('已删除')
}
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
  margin-bottom: 12px;
}
.table-card {
  border-radius: var(--border-radius-medium);
}
.muted {
  color: var(--color-text-3);
  font-size: var(--font-size-body-2);
}
</style>
