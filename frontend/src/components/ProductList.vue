<template>
  <div class="product-list">
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in products" :key="product.id">
        <el-card :body-style="{ padding: '0px' }" class="product-card">
          <img :src="product.image" class="product-image">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">¥{{ product.price }}</p>
            <div class="bottom">
              <el-button type="primary" @click="addToCart(product)">加入购物车</el-button>
              <el-button @click="viewDetail(product)">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import api from '@/services/api';
import { useCartStore } from '@/stores/cart';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();
const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('获取产品列表失败:', error);
  }
};

const addToCart = (product) => {
  cartStore.addToCart(product);
};

const viewDetail = (product) => {
  router.push(`/product/${product.id}`);
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.product-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 14px;
}

.product-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style> 