<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top">
        <el-row :gutter="20">
          <!-- 公司信息栏 -->
          <el-col :xs="24" :sm="12" :md="6">
            <div class="footer-column">
              <h3 class="footer-title">关于我们</h3>
              <div class="footer-company-info">
                <div class="footer-logo">
                  <el-image :src="logoUrl" style="width: 40px; height: 40px;" />
                  <span class="logo-text">My Store</span>
                </div>
                <p class="footer-description">
                  我们致力于提供高品质的商品和卓越的购物体验，让每一位顾客都能感受到我们的用心与专业。
                </p>
              </div>
            </div>
          </el-col>
          
          <!-- 导航链接栏 -->
          <el-col :xs="24" :sm="12" :md="6">
            <div class="footer-column">
              <h3 class="footer-title">快速链接</h3>
              <ul class="footer-links">
                <li><router-link to="/">首页</router-link></li>
                <li><router-link to="/products">全部商品</router-link></li>
                <li><router-link to="/promotions">优惠活动</router-link></li>
                <li><router-link to="/new">新品上市</router-link></li>
              </ul>
            </div>
          </el-col>
          
          <!-- 客户服务栏 -->
          <el-col :xs="24" :sm="12" :md="6">
            <div class="footer-column">
              <h3 class="footer-title">客户服务</h3>
              <ul class="footer-links">
                <li><a href="#">帮助中心</a></li>
                <li><a href="#">配送方式</a></li>
                <li><a href="#">支付方式</a></li>
                <li><a href="#">售后服务</a></li>
              </ul>
            </div>
          </el-col>
          
          <!-- 联系我们栏 -->
          <el-col :xs="24" :sm="12" :md="6">
            <div class="footer-column">
              <h3 class="footer-title">联系我们</h3>
              <ul class="footer-contact">
                <li>
                  <el-icon><Location /></el-icon>
                  <span>北京市朝阳区科技园区1号楼</span>
                </li>
                <li>
                  <el-icon><Phone /></el-icon>
                  <span>400-123-4567</span>
                </li>
                <li>
                  <el-icon><Message /></el-icon>
                  <span>service@mystore.com</span>
                </li>
              </ul>
              <div class="social-links">
                <a href="#" class="social-link"><el-icon><Platform /></el-icon></a>
                <a href="#" class="social-link"><el-icon><Share /></el-icon></a>
                <a href="#" class="social-link"><el-icon><ChatDotRound /></el-icon></a>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-bottom">
        <div class="copyright">
          © {{ currentYear }} My Store. 保留所有权利.
        </div>
        <div class="footer-policy-links">
          <a href="#">隐私政策</a>
          <span class="divider">|</span>
          <a href="#">使用条款</a>
          <span class="divider">|</span>
          <a href="#">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Location, Phone, Message, Platform, Share, ChatDotRound } from '@element-plus/icons-vue';
import logoUrl from '../assets/logo.png';

// 获取当前年份
const currentYear = ref(new Date().getFullYear());
</script>

<style lang="scss" scoped>
.footer {
  background-color: var(--el-bg-color-page, #f5f7fa);
  color: var(--el-text-color-primary, #303133);
  padding: 60px 0 20px;
  margin-top: 40px;
  border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
  width: 100%;
  box-sizing: border-box;

  // 深色模式下的样式调整
  :root.dark & {
    background-color: var(--el-bg-color, #141414);
    border-top-color: var(--el-border-color-darker, #636363);
  }
}

.footer-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.footer-top {
  margin-bottom: 30px;
}

.footer-column {
  margin-bottom: 30px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 30px;
    height: 2px;
    background-color: var(--el-color-primary);
  }
}

.footer-company-info {
  .footer-logo {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .logo-text {
      margin-left: 10px;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .footer-description {
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-secondary, #606266);
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 12px;
    
    a {
      color: var(--el-text-color-secondary, #606266);
      text-decoration: none;
      transition: color 0.3s;
      
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: var(--el-text-color-secondary, #606266);
    
    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--el-color-info-light-9);
    color: var(--el-text-color-secondary);
    transition: all 0.3s;
    
    &:hover {
      background-color: var(--el-color-primary);
      color: white;
    }
    
    .el-icon {
      font-size: 18px;
    }
  }
}

.footer-divider {
  height: 1px;
  background-color: var(--el-border-color-lighter, #ebeef5);
  margin: 20px 0;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--el-text-color-secondary, #606266);
  
  .copyright {
    margin-bottom: 10px;
  }
  
  .footer-policy-links {
    a {
      color: var(--el-text-color-secondary, #606266);
      text-decoration: none;
      
      &:hover {
        color: var(--el-color-primary);
      }
    }
    
    .divider {
      margin: 0 8px;
    }
  }
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    
    .copyright {
      margin-bottom: 15px;
    }
  }
  
  .footer-title {
    text-align: center;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  
  .footer-company-info {
    .footer-logo {
      justify-content: center;
    }
    
    .footer-description {
      text-align: center;
    }
  }
  
  .footer-links li {
    text-align: center;
  }
  
  .footer-contact li {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>