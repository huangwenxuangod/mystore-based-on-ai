<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <carousel />
    
    <!-- 特色区域 -->
    <div class="featured-section">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(feature, index) in features" :key="index">
          <div class="feature-card">
            <el-icon :size="40" class="feature-icon">
              <component :is="feature.icon"></component>
            </el-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 热门商品 -->
    <div class="home-section">
      <div class="section-header">
        <h2 class="section-title">热门商品</h2>
        <router-link to="/products" class="view-all">查看全部</router-link>
      </div>
      <Products :products="hotProducts" :limit="4" />
    </div>
    
    <!-- 新品上市 -->
    <div class="home-section">
      <div class="section-header">
        <h2 class="section-title">新品上市</h2>
        <router-link to="/new-arrivals" class="view-all">查看全部</router-link>
      </div>
      <Products :products="newProducts" :limit="4" />
    </div>
    
    <!-- 推荐商品 -->
    <div class="home-section">
      <div class="section-header">
        <h2 class="section-title">为您推荐</h2>
        <router-link to="/products" class="view-all">查看全部</router-link>
      </div>
      <Products :products="recommendedProducts" :limit="8" />
    </div>

    <!-- 品牌专区 -->
    <div class="brands-section">
      <h2 class="section-title">品牌专区</h2>
      <el-row :gutter="20">
        <el-col :span="4" v-for="i in 6" :key="i">
          <div class="brand-card">
            <el-image 
              :src="`https://picsum.photos/id/${i+10}/200/200`" 
              fit="contain"
              class="brand-image"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import carousel from '@/components/carousel.vue'
import Products from '@/components/Products.vue'
import { ShoppingBag, TrendCharts, Service, Promotion, Star } from '@element-plus/icons-vue'

// 首页特色区域数据
const features = [
  {
    icon: 'ShoppingBag',
    title: '全球精选',
    description: '汇集全球优质商品，满足您的购物需求'
  },
  {
    icon: 'Service',
    title: '优质服务',
    description: '7×24小时客服支持，购物无忧'
  },
  {
    icon: 'Promotion',
    title: '超值优惠',
    description: '多种优惠活动，给您最实惠的价格'
  }
]

// 模拟热门商品数据
const hotProducts = ref([
  {
    id: 1,
    name: '无线蓝牙耳机',
    price: '¥299.00',
    image: 'https://picsum.photos/id/1/300/300',
    rating: 4.8,
    salesCount: 2341
  },
  {
    id: 2,
    name: '智能手表',
    price: '¥599.00',
    image: 'https://picsum.photos/id/2/300/300',
    rating: 4.6,
    salesCount: 1678
  },
  {
    id: 3,
    name: '便携式充电宝',
    price: '¥199.00',
    image: 'https://picsum.photos/id/3/300/300',
    rating: 4.9,
    salesCount: 3210
  },
  {
    id: 4,
    name: '无线充电器',
    price: '¥129.00',
    image: 'https://picsum.photos/id/4/300/300',
    rating: 4.7,
    salesCount: 1986
  }
])

// 模拟新品数据
const newProducts = ref([
  {
    id: 5,
    name: '智能门锁',
    price: '¥1299.00',
    image: 'https://picsum.photos/id/5/300/300',
    rating: 4.5,
    isNew: true
  },
  {
    id: 6,
    name: '智能音箱',
    price: '¥699.00',
    image: 'https://picsum.photos/id/6/300/300',
    rating: 4.7,
    isNew: true
  },
  {
    id: 7,
    name: '智能台灯',
    price: '¥349.00',
    image: 'https://picsum.photos/id/7/300/300',
    rating: 4.8,
    isNew: true
  },
  {
    id: 8,
    name: '机械键盘',
    price: '¥499.00',
    image: 'https://picsum.photos/id/8/300/300',
    rating: 4.9,
    isNew: true
  }
])

// 模拟推荐商品数据
const recommendedProducts = ref([
  {
    id: 9,
    name: '笔记本电脑',
    price: '¥5999.00',
    image: 'https://picsum.photos/id/9/300/300',
    rating: 4.8,
  },
  {
    id: 10,
    name: '显示器',
    price: '¥2299.00',
    image: 'https://picsum.photos/id/10/300/300',
    rating: 4.7,
  },
  {
    id: 11,
    name: '游戏鼠标',
    price: '¥399.00',
    image: 'https://picsum.photos/id/11/300/300',
    rating: 4.9,
  },
  {
    id: 12,
    name: '机械硬盘',
    price: '¥499.00',
    image: 'https://picsum.photos/id/12/300/300',
    rating: 4.6,
  },
  {
    id: 13,
    name: '蓝牙音箱',
    price: '¥899.00',
    image: 'https://picsum.photos/id/13/300/300',
    rating: 4.7,
  },
  {
    id: 14,
    name: '无线鼠标',
    price: '¥199.00',
    image: 'https://picsum.photos/id/14/300/300',
    rating: 4.5,
  },
  {
    id: 15,
    name: '手机壳',
    price: '¥59.00',
    image: 'https://picsum.photos/id/15/300/300',
    rating: 4.8,
  },
  {
    id: 16,
    name: '数据线',
    price: '¥39.00',
    image: 'https://picsum.photos/id/16/300/300',
    rating: 4.6,
  }
])

// 这里可以添加页面加载时的逻辑，比如从API获取数据
</script>

<style lang="scss" scoped>
.home-page {
  padding: 20px;
}

.featured-section {
  margin: 30px 0;
  
  .feature-card {
    padding: 30px 20px;
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      color: var(--el-color-primary);
      margin-bottom: 15px;
    }
    
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    p {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.home-section {
  margin: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .section-title {
    font-size: 24px;
    position: relative;
    padding-left: 15px;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: var(--el-color-primary);
      border-radius: 2px;
    }
  }
  
  .view-all {
    color: var(--el-color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.brands-section {
  margin: 40px 0;
  
  .brand-card {
    padding: 20px;
    text-align: center;
    border: 1px solid #eee;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--el-color-primary-light-5);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
    
    .brand-image {
      height: 60px;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .featured-section .el-col {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .brands-section .el-col {
    width: 33.33%;
  }
}
</style>