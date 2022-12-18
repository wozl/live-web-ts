import {createApp} from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/css/icon.css'
import piniaPlugins from 'pinia-plugin-persistedstate' //pinia数据持久化插件

const app = createApp(App)

app.use(createPinia().use(piniaPlugins)) //pinia应用数据持久化插件
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
    size:'small',
    zIndex:3000
})
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.mount('#app')