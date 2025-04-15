<template>
  <div class="home-page">
    <!-- 轮播图部分 -->
    <carousel />
    
    <!-- 特色服务区 -->
    <div class="featured-section">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(feature, index) in features" :key="index">
          <div class="feature-card">
            <component :is="getIconComponent(feature.icon)" size="30" class="feature-icon"></component>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 热门商品区 -->
    <Products title="热门商品" product-type="popular" :editable="false" />
    
    <!-- 新品上市区 -->
    <Products title="新品上市" product-type="new" :editable="false" />
    
    <!-- 推荐商品区 -->
    <div class="recommended-section">
      <h2 class="section-title">为您推荐</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-for="item in recommendedProducts" :key="item.id">
          <div class="product-card">
            <div class="product-image">
              <el-image :src="item.image" fit="cover"></el-image>
            </div>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">{{ item.price }}</p>
              <div class="rating">
                <el-rate disabled v-model="item.rating" :colors="['#FFA41C', '#FFA41C', '#FFA41C']"></el-rate>
              </div>
              <el-button type="primary" size="small" :icon="ShoppingBag">加入购物车</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 品牌区 -->
    <div class="brands-section">
      <h2 class="section-title">合作品牌</h2>
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
import { ref, onMounted, computed } from 'vue'
import carousel from '@/components/carousel.vue'
import Products from '@/components/Products.vue'
import { ShoppingBag, TrendCharts, Service, Promotion } from '@element-plus/icons-vue'
import mockService from '@/services/mockService';

// 加载中状态
const loading = ref(true);

// 首页数据
const features = ref([]);
const hotProducts = ref([]);
const newProducts = ref([]);
const recommendedProducts = ref([]);

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'ShoppingBag': ShoppingBag,
    'TrendCharts': TrendCharts,
    'Service': Service,
    'Promotion': Promotion
  };
  
  return iconMap[iconName] || ShoppingBag;
};

// 获取首页数据
const fetchHomeData = async () => {
  try {
    loading.value = true;
    const data = await mockService.getHomeData();
    features.value = data.features;
    hotProducts.value = data.hotProducts;
    newProducts.value = data.newProducts;
    recommendedProducts.value = data.recommendedProducts;
  } catch (error) {
    console.error('获取首页数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchHomeData();
});
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
    height: 100%;
    background-color: var(--el-bg-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      color: #409eff;
      margin-bottom: 15px;
    }
    
    h3 {
      font-size: 18px;
      margin: 10px 0;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  position: relative;
  padding-left: 15px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: #409eff;
    border-radius: 2px;
  }
}

.recommended-section {
  margin: 40px 0;
  
  .product-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: all 0.3s;
    height: 100%;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .product-image {
      height: 200px;
      overflow: hidden;
      
      .el-image {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    
    .product-info {
      padding: 15px;
      
      h3 {
        margin: 0 0 10px;
        font-size: 16px;
      }
      
      .price {
        color: #ff6b6b;
        font-weight: bold;
        margin: 10px 0;
      }
      
      .rating {
        margin-bottom: 15px;
      }
    }
  }
}

.brands-section {
  margin: 40px 0;
  
  .brand-card {
    padding: 20px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: all 0.3s;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .brand-image {
      max-width: 100%;
      max-height: 60px;
    }
  }
}

@media (max-width: 768px) {
  .feature-card {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>