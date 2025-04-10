<script setup lang="ts">
import Header from './components/Header.vue'
import Tail from './components/Tail.vue'
import HomePage from './components/HomePage.vue'
</script>

<template>
    <div class="common-layout">
      <el-container>
        <el-header><Header /></el-header>
        <el-main><HomePage /></el-main>
        <el-footer><Tail /></el-footer>
      </el-container>
    </div>
</template>

<style scoped>
  
</style>
