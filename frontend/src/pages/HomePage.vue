<template>
  <div class="home-page">
    <!-- 轮播图部分 -->
    <carousel />
    
    <!-- 特色服务区 -->
    <div class="featured-section">
      <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" v-for="(feature, index) in features" :key="index">
          <div class="feature-card">
            <component :is="getIconComponent(feature.icon)" size="16" class="feature-icon"></component>
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
        <el-col :span="4" v-for="(brand, index) in brands" :key="index">
          <div class="brand-card">
            <el-image :src="brand.logo" fit="contain"></el-image>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import carousel from '@/components/carousel.vue';
import Products from '@/components/Products.vue';
import { useMockStore } from '@/stores/mock';
import { Promotion, Service, ShoppingBag, TrendCharts } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';

const mockStore = useMockStore()

// 加载中状态
const loading = ref(true);

// 首页数据
const features = ref([]);
const hotProducts = ref([]);
const newProducts = ref([]);
const recommendedProducts = ref([]);
const brands = ref([
  { logo: 'https://picsum.photos/id/1/200/100' },
  { logo: 'https://picsum.photos/id/2/200/100' },
  { logo: 'https://picsum.photos/id/3/200/100' },
  { logo: 'https://picsum.photos/id/4/200/100' },
  { logo: 'https://picsum.photos/id/5/200/100' },
  { logo: 'https://picsum.photos/id/6/200/100' }
])

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
    const data = await mockStore.getHomeData();
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
  padding: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-section {
  margin: 20px auto;
  max-width: 900px;
}

.feature-card {
  text-align: center;
  padding: 10px;
  background-color: var(--el-bg-color);
  border-radius: 6px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  margin-bottom: 10px;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.feature-icon {
  margin-bottom: 8px;
  color: var(--el-color-primary);
  font-size: 16px;
}

.feature-card h3 {
  margin: 6px 0;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.feature-card p {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.recommended-section {
  margin: 40px 0;
}

.section-title {
  margin-bottom: 24px;
  font-size: 24px;
  color: var(--el-text-color-primary);
  text-align: center;
}

.product-card {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.price {
  margin: 8px 0;
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.rating {
  margin: 8px 0;
}

.brands-section {
  margin: 40px 0;
}

.brand-card {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-image) {
  width: 100%;
  height: 100%;
}

:deep(.el-button) {
  width: 100%;
  margin-top: 8px;
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