<script setup lang="ts">
import Header from './components/Header.vue'
import Tail from './components/Tail.vue'
</script>

<template>
  <div id="app">
    <div class="common-layout">
      <el-container>
        <el-header><Header /></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer><Tail /></el-footer>
      </el-container>
    </div>
  </div>
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden; /* 防止水平滚动条 */
}

body {
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.common-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-header {
  padding: 0;
  flex-shrink: 0; /* 防止头部被压缩 */
  z-index: 1000; /* 确保头部在最上层 */
}

.el-main {
  flex: 1;
  padding: 0;
  overflow-y: auto; /* 只在内容区域允许垂直滚动 */
}

.el-footer {
  padding: 0;
  flex-shrink: 0; /* 防止尾部被压缩 */
}

/* 设置router-view样式 */
.el-main > router-view {
  display: block;
  min-height: 100%; /* 确保内容区域至少占满主要区域 */
}

/* 清除页面各组件默认的边距 */
* {
  box-sizing: border-box;
}
</style>
