<template>
  <div class="product-detail-page" v-if="product">
    <div class="product-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/products' }">全部商品</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="product-content">
      <div class="product-gallery">
        <el-image
          :src="product.image"
          fit="contain"
          :preview-src-list="[product.image]"
          class="product-main-image"
        />
      </div>
      
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-price">{{ product.price }}</div>
        
        <div class="product-actions">
          <el-input-number v-model="quantity" :min="1" :max="99"></el-input-number>
          <el-button type="primary" size="large" class="add-to-cart-btn">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
          <el-button type="danger" size="large">立即购买</el-button>
        </div>
        
        <div class="product-meta">
          <p><span>商品编号:</span> {{ product.id }}</p>
          <p><span>库存状态:</span> 有货</p>
          <p><span>配送:</span> 免运费</p>
        </div>
      </div>
    </div>
    
    <div class="product-tabs">
      <el-tabs>
        <el-tab-pane label="商品详情">
          <div class="product-details">
            <h3>商品详情</h3>
            <p>这里是商品的详细描述和参数...</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户评价">
          <div class="product-reviews">
            <h3>用户评价</h3>
            <p>暂无评价</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div v-else class="loading-container">
    <el-empty description="商品不存在或已下架"></el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ShoppingCart } from '@element-plus/icons-vue';

const route = useRoute();
const productId = route.params.id;
const quantity = ref(1);
const product = ref(null);

// 模拟获取商品数据
const fetchProduct = async (id: string) => {
  // 这里应该是一个API调用
  const mockProducts = [
    {
      id: 1,
      name: "无线蓝牙耳机",
      description: "高品质音效，长久续航，舒适佩戴，兼容多种设备，操作简单方便，轻松畅享音乐世界。采用先进蓝牙5.0技术，连接稳定，音质清晰，内置高性能麦克风，通话更加清晰。",
      price: "¥299.00",
      image: "https://picsum.photos/id/1/800/800"
    },
    {
      id: 2,
      name: "智能手表",
      description: "健康监测，运动记录，消息提醒，多功能于一体。24小时心率监测，血氧检测，睡眠质量分析，50+运动模式，5ATM防水，长达14天续航。",
      price: "¥599.00",
      image: "https://picsum.photos/id/2/800/800"
    },
    // 可以添加更多模拟数据
  ];

  return mockProducts.find(p => p.id === parseInt(id as string)) || null;
};

onMounted(async () => {
  product.value = await fetchProduct(productId as string);
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

.product-info {
  flex: 1;
  min-width: 300px;
}

.product-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.product-price {
  font-size: 28px;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 20px;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
  
  .add-to-cart-btn {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.product-meta {
  border-top: 1px solid #eee;
  padding-top: 20px;
  
  p {
    margin: 10px 0;
    color: #666;
    
    span {
      color: #999;
      margin-right: 10px;
    }
  }
}

.product-tabs {
  margin-top: 40px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
  }
  
  .product-main-image {
    height: 300px;
  }
}
</style>
