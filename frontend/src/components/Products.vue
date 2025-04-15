<template>
  <div class="products-container">
    <div class="products-header">
      <h2 class="section-title">热门商品</h2>
      <el-button type="text" class="view-more">查看更多 <el-icon><ArrowRight /></el-icon></el-button>
    </div>
    
    <div class="products">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
          <div class="product-wrapper">
            <Product :product="product" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Product from './Product.vue';
import { ArrowRight } from '@element-plus/icons-vue';

// 产品数据
const products = ref([
  {
    id: 1,
    name: "无线蓝牙耳机",
    description: "高品质音效，长久续航，舒适佩戴",
    price: "¥299.00",
    image: "https://picsum.photos/id/1/300/300",
    tag: "新品"
  },
  {
    id: 2,
    name: "智能手表",
    description: "健康监测，运动记录，消息提醒",
    price: "¥599.00",
    image: "https://picsum.photos/id/2/300/300"
  },
  {
    id: 3,
    name: "便携式充电宝",
    description: "大容量，快速充电，多端口输出",
    price: "¥129.00",
    image: "https://picsum.photos/id/3/300/300",
    tag: "热卖"
  },
  {
    id: 4,
    name: "智能家居套装",
    description: "语音控制，远程操作，智能联动",
    price: "¥899.00",
    image: "https://picsum.photos/id/4/300/300"
  },
  {
    id: 5,
    name: "4K超清显示器",
    description: "画面细腻，色彩鲜艳，护眼不闪屏",
    price: "¥1299.00",
    image: "https://picsum.photos/id/5/300/300"
  },
  {
    id: 6,
    name: "机械键盘",
    description: "机械轴体，RGB背光，人体工学设计",
    price: "¥349.00",
    image: "https://picsum.photos/id/6/300/300"
  },
  {
    id: 7,
    name: "无线充电器",
    description: "快速充电，兼容多设备，简约设计",
    price: "¥129.00",
    image: "https://picsum.photos/id/7/300/300"
  },
  {
    id: 8,
    name: "游戏手柄",
    description: "人体工学，高精度触控，兼容多平台",
    price: "¥199.00",
    image: "https://picsum.photos/id/8/300/300"
  }
]);
</script>

<style scoped lang="scss">
.products-container {
  padding: 20px 0;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-title {
  font-size: 24px;
  margin: 0;
  position: relative;
  padding-left: 15px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    width: 4px;
    background-color: #ff6b6b;
    border-radius: 2px;
  }
}

.view-more {
  font-size: 14px;
  display: flex;
  align-items: center;
  
  .el-icon {
    margin-left: 4px;
    transition: transform 0.3s;
  }
  
  &:hover .el-icon {
    transform: translateX(4px);
  }
}

.product-wrapper {
  margin-bottom: 25px;
}

@media (max-width: 768px) {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>