<template>
  <router-link :to="`/product/${product.id}`" class="product-link">
    <el-card class="product-card" shadow="hover">
      <div class="product-image-container">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
      </div>
      <div class="product-info">
        <h3 class="product-title">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-footer">
          <p class="product-price">{{ product.price }}</p>
          <el-button type="primary" size="small" class="buy-now-btn" @click.stop>立即购买</el-button>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script setup lang="ts">
// 定义产品类型接口
interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  tag?: string;
}

// 定义组件属性
defineProps<{
  product: ProductItem;
}>();
</script>

<style scoped lang="scss">
.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.product-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s;
  
  .product-link:hover & {
    transform: scale(1.05);
  }
}

.product-tag {
  position: absolute;
  top: 10px;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px 0 0 4px;
}

.product-info {
  padding: 15px 10px 10px;
}

.product-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 38px;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  margin: 0;
}

.buy-now-btn {
  opacity: 0;
  transition: opacity 0.3s;
  
  .product-link:hover & {
    opacity: 1;
  }
}
</style>
