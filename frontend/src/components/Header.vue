<template>
  <div class="header-container">
    <el-row :gutter="20" class="header-row" align="middle">
      <!-- 网站 Logo -->
      <el-col :span="4">
        <div class="logo-container">
          <el-image
            style="width: 40px; height: 40px;border-radius: 12px;"
            :src="logoUrl"
            fit="contain"
          />
          <h4>My Store</h4>
        </div>
      </el-col>
         
      <!-- 主导航 -->
      <el-col :span="8">
        <el-menu
          mode="horizontal"
          :router="true"
          class="main-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/products">全部商品</el-menu-item>
          <el-menu-item index="/promotions">优惠活动</el-menu-item>
          <el-menu-item index="/new">新品上市</el-menu-item>
          <!-- 对所有登录用户显示产品管理菜单 -->
          <el-menu-item v-if="userStore.isAuthenticated" index="/admin/products">产品管理</el-menu-item>
        </el-menu>
      </el-col>
      
      <!-- 搜索框 -->
      <el-col :span="8">
        <div class="search-container">
          <template v-if="isSearch">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入搜索内容"
              class="search-input"
              clearable
              @keyup.enter="onSearch"
            >
            </el-input>
          </template>
        </div>
      </el-col>
      
      <!-- 用户区域 -->
      <el-col :span="4">
        <div class="user-actions">
          <el-button :icon="Search" @click="toggleSearch" circle></el-button>
          <el-button type="primary" :icon="themeStore.isDarkMode ? Moon : Sunny" @click="themeStore.toggleTheme" circle></el-button>
          <el-button type="primary" :icon="ShoppingCart" @click="goToCart" circle></el-button>
          <!-- 未登录显示登录按钮 -->
          <el-button v-if="!userStore.isAuthenticated" @click="router.push('/login')" class="action-btn">登录</el-button>
          
          <!-- 已登录显示用户下拉菜单 -->
          <el-dropdown class="user-dropdown" @command="handleCommand">
            <el-avatar :size="32" :icon="UserFilled"></el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
                <!-- 所有用户都显示产品管理选项 -->
                <el-dropdown-item command="adminProducts" divided>产品管理</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, ShoppingCart, UserFilled, Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '../stores/theme' // 引入主题状态存储
import { useUserStore } from '../stores/user' // 引入用户状态存储
import { useRouter } from 'vue-router'

// 导入图片
import logoUrl from '../assets/logo.png'

// 使用 Pinia store
const themeStore = useThemeStore()
const userStore = useUserStore() // 获取用户状态
const isSearch = ref(true);
const searchKeyword = ref('');
const router = useRouter();

const toggleSearch = () => {
  isSearch.value = !isSearch.value;
}

/* TODO search搜索框 */
const onSearch = () => {
  // 搜索逻辑
}

const goToCart = () => {
  router.push('/cart');
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'userCenter':
      router.push('/user');
      break;
    case 'orders':
      router.push('/user?tab=orders');
      break;
    case 'favorites':
      router.push('/user?tab=favorites');
      break;
    case 'adminProducts':
      router.push('/admin/products');
      break;
    case 'logout':
      // 退出登录逻辑
      break;
  }
}

onMounted(() => {
  // 初始化主题，现在由 Pinia store 的 actions 处理
  themeStore.initTheme()
})
</script>

<style lang="scss" scoped>
.header-container {
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-row {
  height: 60px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  .logo {
    height: 40px;
    margin-right: 10px;
  }
  
}

.search-container {
  .search-input {
    width: 100%;
    border-radius: 8px;
  }
}

.main-menu {
  display: flex;
  justify-content: space-around;
  border-bottom: none;

}

.user-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  .action-btn {
    font-size: 16px;
  }
  .user-dropdown {
    cursor: pointer;
    padding:8px;
  }
}
</style>