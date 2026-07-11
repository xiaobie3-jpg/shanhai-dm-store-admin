import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import router from './router'
import App from './App.vue'

// 仅全局注册 Arco 组件库；图标在各 .vue 内按需 import
const app = createApp(App)
app.use(ArcoVue)
app.use(router)
app.mount('#app')
