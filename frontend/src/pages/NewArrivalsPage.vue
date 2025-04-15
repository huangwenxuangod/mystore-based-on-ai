<template>
  <div class="new-arrivals-page">
    <div class="page-header">
      <div class="header-content">
        <h1>新品上市</h1>
        <p>发现最新上架的潮流商品</p>
      </div>
    </div>
    
    <!-- 新品上市滚动横幅 -->
    <div class="banner-section" v-loading="loading">
      <el-carousel :interval="4000" type="card" height="320px">
        <el-carousel-item v-for="product in featuredProducts" :key="product.id">
          <div 
            class="banner-item"
            :style="{ backgroundImage: `url(${product.image})` }"
            @click="goToProduct(product.id)"
          >
            <div class="banner-content">
              <div class="new-tag">NEW</div>
              <h3>{{ product.name }}</h3>
              <p>{{ product.shortDescription }}</p>
              <div class="banner-price">{{ product.price }}</div>
              <el-button type="primary" size="large" @click.stop="goToProduct(product.id)">
                查看详情
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 新品分类展示 -->
    <div class="category-section" v-loading="loading">
      <div class="section-title">
        <h2>按分类浏览</h2>
      </div>
      <div class="category-tabs">
        <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
          <el-tab-pane 
            v-for="category in productCategories"
            :key="category.id" 
            :label="category.name" 
            :name="category.id"
          >
            <div class="product-grid">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="product-card"
                @click="goToProduct(product.id)"
              >
                <div class="product-image">
                  <el-image :src="product.image" fit="cover"></el-image>
                  <span class="new-label">NEW</span>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-price">{{ product.price }}</div>
                  <div class="product-release-date">{{ product.releaseDate }}</div>
                  <div class="product-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      @click.stop="addToCart(product)"
                    >
                      加入购物车
                    </el-button>
                    <el-button 
                      icon="Star" 
                      circle 
                      size="small"
                      @click.stop="addToFavorites(product)"
                    ></el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    
    <!-- 新品发售时间表 -->
    <div class="coming-soon-section" v-loading="loading">
      <div class="section-title">
        <h2>即将发售</h2>
        <p>关注这些即将上架的新品</p>
      </div>
      
      <div class="timeline">
        <el-timeline>
          <el-timeline-item
            v-for="item in upcomingProducts"
            :key="item.id"
            :timestamp="item.releaseDate"
            :type="item.importance === 'high' ? 'primary' : ''"
            :hollow="item.importance !== 'high'"
          >
            <div class="timeline-item-content">
              <div class="timeline-product-image">
                <el-image :src="item.image" fit="cover"></el-image>
              </div>
              <div class="timeline-product-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.shortDescription }}</p>
                <div class="countdown" v-if="item.countdown">
                  还有 {{ item.countdown }} 天发售
                </div>
                <el-button type="primary" plain size="small">
                  提醒我
                </el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    
    <!-- 订阅新品通知 -->
    <div class="subscribe-section">
      <div class="subscribe-content">
        <h2>订阅新品发布通知</h2>
        <p>成为第一个了解我们新品发布的人，并获得独家优惠</p>
        <div class="subscribe-form">
          <el-input
            v-model="subscribeEmail"
            placeholder="请输入您的邮箱"
            class="subscribe-input"
          >
          </el-input>
          <el-button type="primary" @click="subscribeNewsletter">
            订阅
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import mockService from '@/services/mockService';

const router = useRouter();
const loading = ref(true);

// 订阅邮箱
const subscribeEmail = ref('');

// 商品数据
const allNewProducts = ref<any[]>([]);
const featuredProducts = ref<any[]>([]);
const upcomingProducts = ref<any[]>([]);

// 分类数据
const productCategories = ref<any[]>([]);
const activeCategory = ref('');

// 获取新品上市数据
const fetchNewArrivalsData = async () => {
  try {
    loading.value = true;
    
    // 通过API获取新品上市数据
    const data = await mockService.getNewArrivalsData();
    
    allNewProducts.value = data.products || [];
    featuredProducts.value = data.featuredProducts || [];
    upcomingProducts.value = data.upcomingProducts || [];
    productCategories.value = data.categories || [];
    
    // 如果有分类，默认选择第一个
    if (productCategories.value.length > 0) {
      activeCategory.value = productCategories.value[0].id;
    }
    
  } catch (error) {
    console.error('获取新品上市数据失败', error);
    ElMessage.error('获取新品上市数据失败');
  } finally {
    loading.value = false;
  }
};

// 根据选中的分类筛选商品
const filteredProducts = computed(() => {
  if (!activeCategory.value) return [];
  return allNewProducts.value.filter(product => 
    product.categoryId === activeCategory.value
  );
});

// 处理分类切换
const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId;
};

// 订阅新品通知
const subscribeNewsletter = () => {
  if (!subscribeEmail.value || !/\S+@\S+\.\S+/.test(subscribeEmail.value)) {
    ElMessage.warning('请输入有效的邮箱地址');
    return;
  }
  
  ElMessage.success('订阅成功！我们会及时向您推送新品信息');
  subscribeEmail.value = '';
};

// 跳转到商品详情页
const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};

// 添加到购物车
const addToCart = (product: any) => {
  ElMessage.success(`已将 ${product.name} 加入购物车`);
};

// 添加到收藏夹
const addToFavorites = (product: any) => {
  ElMessage.success(`已将 ${product.name} 加入收藏夹`);
};

// 页面加载时获取数据
onMounted(() => {
  fetchNewArrivalsData();
});
</script>

<style scoped lang="scss">
.new-arrivals-page {
  padding: 20px;
}

.page-header {
  background-image: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 40px 20px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 30px;
  
  .header-content {
    h1 {
      font-size: 32px;
      margin: 0;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      margin: 0;
      opacity: 0.8;
    }
  }
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    margin: 0;
  }
}

.banner-section {
  margin-bottom: 40px;
  
  .banner-item {
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
  }
  
  .banner-content {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
    padding: 30px;
    color: white;
    width: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    
    .new-tag {
      display: inline-block;
      background-color: #ff6b6b;
      color: white;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 10px;
    }
    
    h3 {
      margin: 0;
      margin-bottom: 10px;
      font-size: 22px;
    }
    
    p {
      margin: 0;
      margin-bottom: 15px;
      opacity: 0.8;
    }
    
    .banner-price {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
}

.category-section {
  margin-bottom: 40px;
  
  .category-tabs {
    margin-top: 20px;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .product-card {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .product-image {
      height: 200px;
      position: relative;
      overflow: hidden;
      
      .el-image {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;
      }
      
      &:hover .el-image {
        transform: scale(1.05);
      }
      
      .new-label {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: #ff6b6b;
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    .product-info {
      padding: 15px;
      
      .product-name {
        margin: 0 0 10px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .product-price {
        color: #ff6b6b;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .product-release-date {
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
      }
      
      .product-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        
        .el-button {
          flex-grow: 1;
        }
      }
    }
  }
}

.coming-soon-section {
  margin-bottom: 40px;
  
  .timeline {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .timeline-item-content {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .timeline-product-image {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      
      .el-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .timeline-product-info {
      h3 {
        margin: 0 0 10px;
      }
      
      p {
        margin: 0 0 10px;
        color: #666;
      }
      
      .countdown {
        color: #ff6b6b;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }
}

.subscribe-section {
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  
  .subscribe-content {
    max-width: 600px;
    margin: 0 auto;
    
    h2 {
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    p {
      margin-bottom: 20px;
      color: #666;
    }
    
    .subscribe-form {
      display: flex;
      gap: 10px;
      justify-content: center;
      
      .subscribe-input {
        max-width: 400px;
      }
    }
  }
}

@media (max-width: 768px) {
  .banner-content {
    padding: 15px !important;
    
    h3 {
      font-size: 18px !important;
    }
    
    p {
      font-size: 14px !important;
    }
    
    .banner-price {
      font-size: 18px !important;
    }
  }
  
  .timeline-item-content {
    flex-direction: column;
    align-items: flex-start !important;
    
    .timeline-product-image {
      width: 80px !important;
      height: 80px !important;
    }
  }
  
  .subscribe-form {
    flex-direction: column;
  }
}
</style>
