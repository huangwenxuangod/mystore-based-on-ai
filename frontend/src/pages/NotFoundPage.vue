<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1 class="error-title">页面不见了</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被删除</p>
      
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button size="large" @click="goBack">
          <el-icon><Back /></el-icon>
          返回上一页
        </el-button>
      </div>
      
      <div class="suggestions">
        <h2>您可能想找：</h2>
        <div class="suggestion-links">
          <router-link to="/products" class="suggestion-link">
            <el-icon><ShoppingBag /></el-icon>
            <span>全部商品</span>
          </router-link>
          <router-link to="/new-arrivals" class="suggestion-link">
            <el-icon><Star /></el-icon>
            <span>新品上市</span>
          </router-link>
          <router-link to="/promotions" class="suggestion-link">
            <el-icon><Discount /></el-icon>
            <span>优惠活动</span>
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="error-illustration">
      <el-image src="https://picsum.photos/id/20/600/400" fit="contain" alt="页面不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Back, 
  ShoppingBag, 
  Star, 
  Discount 
} from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 70vh;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9eef5 100%);
  
  @media (min-width: 992px) {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
  }
}

.not-found-container {
  max-width: 600px;
  z-index: 2;
  
  @media (min-width: 992px) {
    margin-right: 40px;
  }
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: var(--el-color-primary);
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 992px) {
    font-size: 10rem;
  }
}

.error-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  
  @media (min-width: 992px) {
    font-size: 3rem;
  }
}

.error-message {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  
  @media (min-width: 992px) {
    font-size: 1.4rem;
  }
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
  
  @media (min-width: 992px) {
    justify-content: flex-start;
  }
  
  .el-button {
    display: flex;
    align-items: center;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}

.suggestions {
  margin-top: 20px;
  
  h2 {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 15px;
  }
  
  .suggestion-links {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    
    @media (min-width: 992px) {
      justify-content: flex-start;
    }
    
    .suggestion-link {
      background: #fff;
      border-radius: 8px;
      padding: 15px;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        color: var(--el-color-primary);
      }
      
      .el-icon {
        margin-right: 8px;
        font-size: 20px;
      }
      
      span {
        font-weight: 500;
      }
    }
  }
}

.error-illustration {
  max-width: 400px;
  margin-top: 40px;
  
  @media (min-width: 992px) {
    margin-top: 0;
  }
  
  img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
  }
}
</style>
