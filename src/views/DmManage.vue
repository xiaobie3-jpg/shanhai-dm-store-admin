<template>
  <div class="page">
    <div class="toolbar">
      <a-button type="primary" @click="openCreate">
        <template #icon><icon-plus /></template>
        新增 DM
      </a-button>
    </div>

    <a-card :bordered="false" class="table-card">
      <a-table :columns="cols" :data="list" :pagination="{ pageSize: 8 }">
        <template #avatar="{ record }">
          <a-avatar :style="{ backgroundColor: record.color }">{{ record.name.slice(0, 1) }}</a-avatar>
        </template>
        <template #online="{ record }">
          <a-switch v-model="record.online" @change="toggleOnline(record)" />
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="openEdit(record)">编辑</a-button>
            <a-popconfirm content="确认软删除该 DM？" @ok="remove(record)">
              <a-button type="text" size="small" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="modalVisible"
      :title="editing ? '编辑 DM' : '新增 DM'"
      @cancel="modalVisible = false"
      @before-ok="submitForm"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item field="name" label="DM 昵称" required>
          <a-input v-model="form.name" placeholder="如：山海·小鹿" />
        </a-form-item>
        <a-form-item field="tag" label="标签">
          <a-input v-model="form.tag" placeholder="如：古风 / 恋陪" />
        </a-form-item>
        <a-form-item field="intro" label="简介">
          <a-textarea v-model="form.intro" placeholder="一句话简介" :auto-size="{ minRows: 3 }" />
        </a-form-item>
        <a-form-item field="avatar" label="头像">
          <a-upload action="#" :auto-upload="false" :limit="1" list-type="picture-card" />
        </a-form-item>
        <a-form-item field="bgm" label="背景音乐">
          <a-upload action="#" :auto-upload="false" :limit="1" accept="audio/*" />
        </a-form-item>
        <a-form-item field="covers" label="轮播图">
          <a-upload action="#" :auto-upload="false" multiple list-type="picture-card" />
        </a-form-item>
        <a-form-item field="online" label="是否上架">
          <a-switch v-model="form.online" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'

const cols = [
  { title: '头像', slotName: 'avatar', width: 80 },
  { title: '昵称', dataIndex: 'name', width: 160 },
  { title: '标签', dataIndex: 'tag', width: 140 },
  { title: '简介', dataIndex: 'intro', ellipsis: true },
  { title: '累计被打赏积分', dataIndex: 'rewardPoint', width: 140 },
  { title: '上架', slotName: 'online', width: 100 },
  { title: '操作', slotName: 'action', width: 160 }
]

const list = ref([
  { key: '1', name: '山海·小鹿', tag: '古风/恋陪', intro: '温润如玉的引梦人', color: '#FF6B8A', rewardPoint: 48200, online: true },
  { key: '2', name: '绘梦·阿九', tag: '甜系/治愈', intro: '把心事写成诗', color: '#7B68EE', rewardPoint: 39600, online: true },
  { key: '3', name: '山海·云川', tag: '清冷/剧情', intro: '一局山河入梦来', color: '#4FC3F7', rewardPoint: 28100, online: false }
])

const modalVisible = ref(false)
const editing = ref(false)
const form = reactive({ key: '0', name: '', tag: '', intro: '', avatar: '', bgm: '', covers: [], online: true })

const openCreate = () => {
  editing.value = false
  Object.assign(form, { key: '0', name: '', tag: '', intro: '', avatar: '', bgm: '', covers: [], online: true })
  modalVisible.value = true
}
const openEdit = (record: any) => {
  editing.value = true
  Object.assign(form, record)
  modalVisible.value = true
}
const submitForm = () => {
  if (!form.name) {
    Message.warning('请填写 DM 昵称')
    return false
  }
  if (editing.value) {
    const i = list.value.findIndex((d) => d.key === form.key)
    if (i > -1) list.value[i] = { ...list.value[i], ...form }
    Message.success('DM 已更新')
  } else {
    list.value.unshift({ ...form, key: String(Date.now()), color: '#FF6B8A', rewardPoint: 0 })
    Message.success('DM 已新增')
  }
  return true
}
const toggleOnline = (record: any) => {
  Message.info(`${record.name} 已${record.online ? '上架' : '下架'}`)
}
const remove = (record: any) => {
  list.value = list.value.filter((d) => d.key !== record.key)
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
}
.table-card {
  border-radius: var(--border-radius-medium);
}
</style>
