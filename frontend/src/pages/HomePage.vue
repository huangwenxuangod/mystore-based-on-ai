<template>
  <div class="home-page">
    <!-- 轮播图部分 -->
    <carousel />
    
    <!-- 特色服务区 -->
    <div class="featured-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" v-for="(feature, index) in features" :key="index">
          <div class="feature-card">
            <component :is="getIconComponent(feature.icon)" size="24" class="feature-icon"></component>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 热门商品区 -->
    <div class="section-container">
      <h2 class="section-title">热门商品</h2>
      <el-row :gutter="24" v-loading="loading">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-for="item in hotProducts" :key="item.id">
          <div class="product-card">
            <div class="product-image">
              <el-image :src="item.image" fit="cover"></el-image>
            </div>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">{{ item.price }}</p>
              <div class="rating">
                <el-rate disabled :model-value="getValidRating(item.rating)" :colors="['#FFA41C', '#FFA41C', '#FFA41C']"></el-rate>
              </div>
              <el-button type="primary" size="small" :icon="ShoppingBag" @click="addToCart(item)">加入购物车</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 新品上市区 -->
    <div class="section-container">
      <h2 class="section-title">新品上市</h2>
      <el-row :gutter="24" v-loading="loading">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-for="item in newProducts" :key="item.id">
          <div class="product-card">
            <div class="product-image">
              <el-image :src="item.image" fit="cover"></el-image>
            </div>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">{{ item.price }}</p>
              <div class="rating">
                <el-rate disabled :model-value="getValidRating(item.rating)" :colors="['#FFA41C', '#FFA41C', '#FFA41C']"></el-rate>
              </div>
              <el-button type="primary" size="small" :icon="ShoppingBag" @click="addToCart(item)">加入购物车</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 推荐商品区 -->
    <div class="section-container">
      <h2 class="section-title">为您推荐</h2>
      <el-row :gutter="24" v-loading="loading">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-for="item in recommendedProducts" :key="item.id">
          <div class="product-card">
            <div class="product-image">
              <el-image :src="item.image" fit="cover"></el-image>
            </div>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="price">{{ item.price }}</p>
              <div class="rating">
                <el-rate disabled :model-value="getValidRating(item.rating)" :colors="['#FFA41C', '#FFA41C', '#FFA41C']"></el-rate>
              </div>
              <el-button type="primary" size="small" :icon="ShoppingBag" @click="addToCart(item)">加入购物车</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 品牌区 -->
    <div class="section-container">
      <h2 class="section-title">合作品牌</h2>
      <el-row :gutter="24">
        <el-col :xs="12" :sm="8" :md="6" :xl="4" v-for="(brand, index) in brands" :key="index">
          <div class="brand-card">
            <el-image :src="brand.logo" fit="contain"></el-image>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 产品管理快捷访问按钮 - 对所有登录用户显示 -->
    <el-backtop 
      v-if="userStore.isAuthenticated" 
      class="admin-shortcut"
      :bottom="150" 
      :right="40" 
      @click="goToAdminProducts"
    >
      <div class="admin-icon">
        <el-tooltip content="产品管理" placement="left">
          <el-icon style="font-size: 20px;"><Setting /></el-icon>
        </el-tooltip>
      </div>
    </el-backtop>
  </div>
</template>

<script setup lang="ts">
import carousel from '@/components/carousel.vue';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { Promotion, Service, ShoppingBag, TrendCharts, Goods, Timer, StarFilled, House, Briefcase, Van, Setting } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import apiService from '@/services/apiService';
import type { Feature, Product, Brand } from '@/types';

const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();

// 加载中状态
const loading = ref(true);

// 首页数据
const features = ref<Feature[]>([]);
const hotProducts = ref<Product[]>([]);
const newProducts = ref<Product[]>([]);
const recommendedProducts = ref<Product[]>([]);
const brands = ref<Brand[]>([
  { id: 1, name: 'Brand 1', logo: 'https://picsum.photos/id/1/200/100' },
  { id: 2, name: 'Brand 2', logo: 'https://picsum.photos/id/2/200/100' },
  { id: 3, name: 'Brand 3', logo: 'https://picsum.photos/id/3/200/100' },
  { id: 4, name: 'Brand 4', logo: 'https://picsum.photos/id/4/200/100' },
  { id: 5, name: 'Brand 5', logo: 'https://picsum.photos/id/5/200/100' },
  { id: 6, name: 'Brand 6', logo: 'https://picsum.photos/id/6/200/100' }
]);

// 确保评分是有效的数字
const getValidRating = (rating: any): number => {
  const numRating = parseFloat(rating);
  return !isNaN(numRating) ? numRating : 0;
};

// 获取图标组件
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'ShoppingBag': ShoppingBag,
    'TrendCharts': TrendCharts,
    'Service': Service,
    'Promotion': Promotion,
    'Goods': Goods,
    'Timer': Timer,
    'StarFilled': StarFilled,
    'House': House,
    'Briefcase': Briefcase,
    'Van': Van
  };
  
  return iconMap[iconName] || ShoppingBag;
};

// 添加到购物车
const addToCart = async (product: Product) => {
  try {
    await cartStore.addToCart(product, 1);
    ElMessage.success('已添加到购物车');
  } catch (error) {
    ElMessage.error('添加购物车失败');
  }
};

// 去产品管理页面
const goToAdminProducts = () => {
  router.push('/admin/products');
};

// 获取首页数据
const fetchHomeData = async () => {
  try {
    loading.value = true;
    const data = await apiService.getHomeData();
    
    // 确保对每个数据源进行正确处理，防止出现空值导致的错误
    // 处理特色服务数据
    features.value = data.features || [];
    
    // 处理热门商品数据 - 修正字段名匹配
    if (Array.isArray(data.recommendProducts)) {
      hotProducts.value = data.recommendProducts;
    } else if (Array.isArray(data.products)) {
      hotProducts.value = data.products;
    } else {
      hotProducts.value = [];
      console.warn('未找到热门商品数据');
    }
    
    // 处理新品上市数据
    if (data.newArrivals && Array.isArray(data.newArrivals)) {
      newProducts.value = data.newArrivals;
    } else {
      // 如果没有专门的新品数据，可以使用推荐商品作为备选
      newProducts.value = hotProducts.value.slice(0, 4);
    }
    
    // 获取推荐商品，单独处理以便捕获特定错误
    try {
      const recommendedData = await apiService.getRecommendedProducts();
      if (recommendedData && recommendedData.products && Array.isArray(recommendedData.products)) {
        recommendedProducts.value = recommendedData.products;
      } else if (Array.isArray(recommendedData)) {
        recommendedProducts.value = recommendedData;
      } else {
        console.warn('获取到的推荐商品数据为空或格式不正确');
        // 使用热门商品作为备选
        recommendedProducts.value = hotProducts.value.slice(0, 6);
      }
    } catch (recommendError) {
      console.error('获取推荐商品失败', recommendError);
      // 推荐商品获取失败时使用一些默认数据
      recommendedProducts.value = [
        {
          id: 101,
          name: '智能手表',
          price: '¥499',
          image: 'https://picsum.photos/id/26/300/300',
          rating: 4.5
        },
        {
          id: 102, 
          name: '无线耳机',
          price: '¥299',
          image: 'https://picsum.photos/id/27/300/300',
          rating: 4.7
        },
        {
          id: 103,
          name: '智能音箱',
          price: '¥399',
          image: 'https://picsum.photos/id/28/300/300',
          rating: 4.6
        }
      ];
    }
    
    // 获取品牌数据
    if (data.popularBrands && Array.isArray(data.popularBrands)) {
      brands.value = data.popularBrands;
    }
    // 默认品牌数据在组件中已经定义
  } catch (error) {
    console.error('获取首页数据失败', error);
    console.log('错误详情:', error.response || error.message || error);
    ElMessage.error('获取数据失败，请稍后重试');
    
    // 如果获取失败，使用一些默认数据以确保UI正常显示
    if (features.value.length === 0) {
      features.value = [
        { icon: 'Goods', title: '品质保证', description: '精选优质商品' },
        { icon: 'Timer', title: '限时折扣', description: '会员专享优惠' },
        { icon: 'Van', title: '极速配送', description: '24小时送达' },
        { icon: 'StarFilled', title: '无忧退换', description: '7天无理由退换' }
      ];
    }
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchHomeData();
});
</script>

<style lang="scss">
/* 全局样式覆盖 */
:root {
  --card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>

<style lang="scss" scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.featured-section {
  margin: 30px auto;
  max-width: 1000px;
}

.section-container {
  margin: 50px 0;
}

.feature-card {
  text-align: center;
  padding: 15px 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  margin-bottom: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
  }
  
  .feature-icon {
    margin-bottom: 12px;
    color: #409EFF;
    font-size: 24px;
  }
  
  h3 {
    margin: 6px 0;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
  
  p {
    margin: 0;
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
  }
}

.section-title {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #409EFF;
    margin: 12px auto 0;
    border-radius: 2px;
  }
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #EBEEF5;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
  }

  .product-image {
    height: 200px;
    overflow: hidden;
    
    .el-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover .product-image .el-image {
    transform: scale(1.05);
  }
  
  .product-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    
    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.4;
    }
    
    .price {
      color: #F56C6C;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 12px;
    }
    
    .rating {
      margin-bottom: 16px;
    }
    
    .el-button {
      margin-top: auto;
    }
  }
}

.brand-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
  }
  
  .el-image {
    height: 60px;
    max-width: 90%;
  }
}

.admin-shortcut {
  background-color: #409EFF !important;
  
  .admin-icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  
  &:hover {
    background-color: #337ECC !important;
    cursor: pointer;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .home-page {
    padding: 15px 10px;
  }
  
  .feature-card {
    padding: 10px;
    
    h3 {
      font-size: 14px;
    }
    
    p {
      font-size: 12px;
    }
  }
  
  .product-card .product-image {
    height: 160px;
  }
  
  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .brand-card {
    height: 80px;
  }
}
</style>