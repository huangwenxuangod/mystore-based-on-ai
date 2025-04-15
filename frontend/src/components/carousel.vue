<template>
    <!-- 轮播图部分 -->
  <div class="carousel-container" ref="carouselRef" v-loading="loading">
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
import mockService from '@/services/mockService';

// 加载状态
const loading = ref(true);

// 轮播图数据
const carouselItems = ref([]);

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

// 获取轮播图数据
const fetchCarouselData = async () => {
  try {
    loading.value = true;
    const data = await mockService.getCarouselData();
    carouselItems.value = data;
  } catch (error) {
    console.error('获取轮播图数据失败', error);
    // 设置默认数据
    carouselItems.value = [
      {
        title: "数据加载失败",
        description: "请稍后重试",
        buttonText: "刷新页面",
        imageUrl: "https://picsum.photos/id/237/1200/400"
      }
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 获取轮播图数据
  fetchCarouselData();
  
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