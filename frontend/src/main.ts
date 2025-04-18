import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入 Element Plus 的暗黑模式 CSS
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 引入路由
import { useUserStore } from './stores/user' // 引入用户状态管理

const app = createApp(App);
const pinia = createPinia();

// 先挂载 Pinia
app.use(pinia);

const initAuth = async () => {
  try {
    const userStore = useUserStore();
    
    // 使用fetchCurrentUser替代autoLogin
    if (userStore.token) {
      await userStore.fetchCurrentUser(); // 如果有token，尝试获取当前用户信息
    }
    
    app.use(ElementPlus); // 挂载 Element Plus
    app.use(router); // 挂载路由
    app.mount('#app'); // 挂载应用
  } catch (error) {
    app.use(ElementPlus); // 挂载 Element Plus
    app.use(router); // 挂载路由
    app.mount('#app'); // 挂载应用
    console.error('自动登录失败:', error);
  }
}

// 调用 initAuth 函数启动应用
initAuth();