<template>
  <div class="header-container">
    <el-row :gutter="20" class="header-row" align="middle">
      <!-- 网站 Logo -->
      <el-col :span="2">
        <div class="logo-container">
          <img src="" alt="我的商城" class="logo" />
        </div>
      </el-col>
         
      <!-- 主导航 -->
      <el-col :span="10">
        <el-menu
          mode="horizontal"
          :router="true"
          class="main-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/products">全部商品</el-menu-item>
          <el-menu-item index="/promotions">优惠活动</el-menu-item>
          <el-menu-item index="/new">新品上市</el-menu-item>
        </el-menu>
      </el-col>
      
      <!-- 搜索框 -->
      <!-- TODO 这里我需要做一个搜索框消失效果,当点击搜索按钮时,搜索框才出现 -->
      <el-col :span="8">
        <div class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search" @click="onSearch"></el-button>
            </template>
          </el-input>
        </div>
      </el-col>
      
      <!-- 用户区域 -->
      <el-col :span="4">
        <div class="user-actions">
          <el-button type="primary" :icon="ShoppingCart" circle class="action-btn"></el-button>
          <el-dropdown>
            <el-avatar :size="32" :icon="UserFilled"></el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>我的订单</el-dropdown-item>
                <el-dropdown-item>我的收藏</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, ShoppingCart, UserFilled } from '@element-plus/icons-vue'

const isSearch=ref(false);
const searchKeyword = ref('')

const onSearch = () => {
  console.log('搜索:', searchKeyword.value)
  // 这里添加搜索逻辑
}
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
  
  .logo {
    height: 40px;
    margin-right: 10px;
  }
  
}

.search-container {
  .search-input {
    width: 100%;
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
  gap: 15px;
  
  .action-btn {
    font-size: 16px;
  }
}
</style>