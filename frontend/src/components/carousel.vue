<template>
    <!-- 轮播图部分 -->
  <div class="carousel-container" ref="carouselRef">
    <el-carousel :interval="5000" type="card" height="400px" ref="carousel">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <div class="carousel-content" :style="{backgroundImage: `url(${item.imageUrl})`}">
          <div class="carousel-text">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <el-button type="primary" size="large">{{ item.buttonText }}</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
// 导入防抖函数
import { debounce } from '../utils/debounce';

// 轮播图数据
const carouselItems = ref([
  {
    title: "新款夏季服装上市",
    description: "清凉透气，时尚有型",
    buttonText: "立即查看",
    imageUrl: "https://picsum.photos/id/237/1200/400"
  },
  {
    title: "电子产品大促销",
    description: "限时折扣，不容错过",
    buttonText: "查看详情",
    imageUrl: "https://picsum.photos/id/180/1200/400"
  },
  {
    title: "家居装饰新品",
    description: "为您的家增添温馨",
    buttonText: "去选购",
    imageUrl: "https://picsum.photos/id/160/1200/400"
  },
  {
    title: "运动健身装备",
    description: "健康生活，从这里开始",
    buttonText: "了解更多",
    imageUrl: "https://picsum.photos/id/106/1200/400"
  }
]);

// 轮播图引用
const carouselRef = ref(null);
const carousel = ref(null);

// 处理滚轮事件
const handleWheel = debounce((e) => {
  if (!carousel.value) return;
  
  if (e.deltaY > 0) {
    // 向下滚动，显示下一张
    carousel.value.next();
  } else {
    // 向上滚动，显示上一张
    carousel.value.prev();
  }
}, 300); // 300ms防抖延迟

onMounted(() => {
  // 添加滚轮事件监听
  if (carouselRef.value) {
    carouselRef.value.addEventListener('wheel', handleWheel, { passive: true });
  }
});

onBeforeUnmount(() => {
  // 组件卸载前移除事件监听
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('wheel', handleWheel);
  }
});
</script>

<style lang="scss" scoped>
.carousel-container {
  margin-bottom: 40px;
  
  .el-carousel__item {
    border-radius: 8px;
    overflow: hidden;
  }
}

.carousel-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 50px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
  }
}

.carousel-text {
  position: relative;
  z-index: 2;
  max-width: 500px;
  color: #fff;
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .carousel-content {
    padding: 0 20px;
  }
  
  .carousel-text {
    h2 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
}
</style>