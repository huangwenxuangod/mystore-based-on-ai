<template>
  <div class="carousel-container">
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="item in carouselItems" :key="item.id">
        <div class="carousel-item">
          <el-image :src="item.image" fit="cover" class="carousel-image" :lazy="true">
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <p>加载图片失败</p>
              </div>
            </template>
          </el-image>
          <div class="carousel-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <el-button type="primary" v-if="item.link">了解更多</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';
import type { CarouselItem } from '@/types';
import { Picture } from '@element-plus/icons-vue';

const carouselItems = ref<CarouselItem[]>([
  // 默认轮播图数据，避免空数据导致的显示问题
  {
    id: 1,
    image: 'https://picsum.photos/id/11/1200/400',
    title: '夏季新品',
    description: '清凉一夏，折扣享不停'
  },
  {
    id: 2,
    image: 'https://picsum.photos/id/12/1200/400',
    title: '智能家居',
    description: '科技改变生活'
  },
  {
    id: 3,
    image: 'https://picsum.photos/id/13/1200/400',
    title: '时尚服饰',
    description: '展现自我风采'
  }
]);

const fetchCarouselData = async () => {
  try {
    const data = await apiService.getCarouselData();
    // 只有在成功获取到轮播图数据且数组不为空时才更新
    if (data && Array.isArray(data) && data.length > 0) {
      carouselItems.value = data;
    }
  } catch (error) {
    console.error('获取轮播图数据失败', error);
    // 发生错误时保持默认数据
  }
};

onMounted(() => {
  fetchCarouselData();
});
</script>

<style lang="scss" scoped>
.carousel-container {
  margin-bottom: 40px;
}

.carousel-item {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: #fff;
  
  h2 {
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: bold;
  }
  
  p {
    margin: 0 0 20px;
    font-size: 16px;
    opacity: 0.9;
  }
}

.image-error {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: #f5f7fa;
  
  .el-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  p {
    margin: 0;
  }
}

:deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.2);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

:deep(.el-carousel__indicators) {
  bottom: 20px;
}

:deep(.el-carousel__button) {
  width: 30px;
  height: 3px;
  border-radius: 1.5px;
}
</style>