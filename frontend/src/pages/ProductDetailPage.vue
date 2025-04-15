<template>
  <div class="product-detail-page">
    <div class="product-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/products' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div v-if="product" class="product-content" v-loading="loading">
      <!-- 商品图片 -->
      <div class="product-gallery">
        <el-image
          class="product-main-image"
          :src="product.image"
          :preview-src-list="product.images || [product.image]"
          fit="cover"
        />
        <div class="product-thumbnails" v-if="product.images && product.images.length > 1">
          <div
            v-for="(image, index) in product.images"
            :key="index"
            class="thumbnail"
            :class="{ active: currentImage === index }"
            @click="currentImage = index"
          >
            <el-image :src="image" fit="cover" />
          </div>
        </div>
      </div>
      
      <!-- 商品信息 -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        
        <div class="product-meta">
          <div class="product-rating">
            <el-rate v-model="product.rating" disabled text-color="#ff9900" />
            <span class="rating-count">{{ product.reviewCount || 0 }} 人评分</span>
          </div>
          <div class="product-sales">销量: {{ product.salesCount || 0 }}</div>
        </div>
        
        <div class="product-price-container">
          <span class="product-price">{{ product.price }}</span>
          <span class="product-original-price" v-if="product.originalPrice">{{ product.originalPrice }}</span>
          <span class="product-discount" v-if="product.discount">{{ product.discount }}% OFF</span>
        </div>
        
        <div class="product-stock">
          <span>库存: </span>
          <span :class="{'low-stock': product.stock < 10}">{{ product.stock || 'NA' }}</span>
        </div>
        
        <div class="product-actions">
          <div class="quantity-selector">
            <span>数量:</span>
            <el-input-number v-model="quantity" :min="1" :max="product.stock" size="small" />
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" size="large" :icon="ShoppingCart" @click="addToCart">
              加入购物车
            </el-button>
            <el-button size="large">立即购买</el-button>
            <el-button icon="Star" circle></el-button>
          </div>
        </div>
        
        <div class="product-features" v-if="product.features && product.features.length">
          <h3>产品特点</h3>
          <ul>
            <li v-for="(feature, index) in product.features" :key="index">
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 产品详情标签页 -->
    <div class="product-tabs" v-if="product">
      <el-tabs>
        <el-tab-pane label="商品详情">
          <div class="product-description">
            <h3>商品描述</h3>
            <p>{{ product.description }}</p>
            
            <template v-if="product.specifications">
              <h3>商品规格</h3>
              <el-table :data="specificationArray" stripe style="width: 100%">
                <el-table-column prop="key" label="参数" width="180" />
                <el-table-column prop="value" label="值" />
              </el-table>
            </template>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="商品评价">
          <div class="product-reviews">
            <h3>用户评价</h3>
            <p>暂无评价</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <div v-else class="loading-container" v-loading="loading">
      <el-empty v-if="!loading" description="商品不存在或已下架"></el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingCart } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import mockService from '@/services/mockService';

// 路由参数
const route = useRoute();
const productId = route.params.id;

// 加载状态
const loading = ref(true);

// 商品数据
const product = ref<any>(null);
const currentImage = ref(0);
const quantity = ref(1);

// 转换规格参数为表格数据
const specificationArray = computed(() => {
  if (!product.value || !product.value.specifications) return [];
  
  return Object.entries(product.value.specifications).map(([key, value]) => ({
    key,
    value
  }));
});

// 获取商品数据
const fetchProduct = async (id: string | string[]) => {
  try {
    loading.value = true;
    
    // 通过API获取商品数据
    const data = await mockService.getProductDetail(id);
    product.value = data;
    
  } catch (error) {
    console.error('获取商品详情失败', error);
    ElMessage.error('获取商品详情失败');
  } finally {
    loading.value = false;
  }
};

// 添加到购物车
const addToCart = () => {
  ElMessage.success(`已将${quantity.value}件 ${product.value.name} 加入购物车`);
};

// 页面加载时获取数据
onMounted(async () => {
  await fetchProduct(productId);
});
</script>

<style scoped lang="scss">
.product-detail-page {
  padding: 20px;
}

.product-breadcrumb {
  margin-bottom: 20px;
}

.product-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.product-gallery {
  flex: 1;
  min-width: 300px;
}

.product-main-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.product-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  
  .thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;
    
    &.active {
      border-color: #409eff;
    }
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

.product-info {
  flex: 1;
  min-width: 300px;
}

.product-name {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 24px;
}

.product-meta {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .product-rating {
    display: flex;
    align-items: center;
    
    .rating-count {
      margin-left: 10px;
      color: #666;
      font-size: 14px;
    }
  }
  
  .product-sales {
    margin-left: auto;
    color: #666;
    font-size: 14px;
  }
}

.product-price-container {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .product-price {
    font-size: 28px;
    color: #ff6b6b;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .product-original-price {
    font-size: 16px;
    color: #999;
    text-decoration: line-through;
  }
  
  .product-discount {
    margin-left: 10px;
    padding: 2px 6px;
    background-color: #ff6b6b;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
  }
}

.product-stock {
  margin-bottom: 20px;
  
  .low-stock {
    color: #ff6b6b;
    font-weight: bold;
  }
}

.product-actions {
  margin-bottom: 30px;
  
  .quantity-selector {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    span {
      margin-right: 15px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 15px;
    
    .el-button {
      font-size: 16px;
    }
  }
}

.product-features {
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  ul {
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
    }
  }
}

.product-tabs {
  margin-top: 40px;
  
  h3 {
    margin-top: 0;
    font-size: 18px;
  }
  
  .product-description {
    p {
      line-height: 1.6;
    }
  }
}

.loading-container {
  padding: 40px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
  }
  
  .product-main-image {
    height: 300px;
  }
  
  .product-actions {
    .action-buttons {
      flex-wrap: wrap;
      
      .el-button {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
