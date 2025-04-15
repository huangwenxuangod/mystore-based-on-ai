<template>
  <div class="new-arrivals-page">
    <div class="page-header">
      <h1>新品上市</h1>
      <p class="page-description">发现我们最新上架的精选商品</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="sortBy" placeholder="排序方式" class="filter-select">
            <el-option label="最新上架" value="newest" />
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="评分最高" value="rating" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="categoryFilter" placeholder="商品分类" class="filter-select">
            <el-option label="全部分类" value="" />
            <el-option label="电子产品" value="electronics" />
            <el-option label="智能家居" value="smart-home" />
            <el-option label="配件" value="accessories" />
            <el-option label="家居生活" value="home" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="priceFilter" placeholder="价格范围" class="filter-select">
            <el-option label="全部价格" value="" />
            <el-option label="0-100元" value="0-100" />
            <el-option label="100-500元" value="100-500" />
            <el-option label="500-1000元" value="500-1000" />
            <el-option label="1000元以上" value="1000+" />
          </el-select>
        </el-col>
        <el-col :span="6" class="filter-reset">
          <el-button @click="resetFilters">重置筛选</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 新品展示 -->
    <div class="products-grid" v-loading="loading">
      <el-empty v-if="filteredProducts.length === 0 && !loading" description="暂无符合条件的商品" />
      
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in filteredProducts" :key="product.id">
          <router-link :to="`/product/${product.id}`" class="product-link">
            <div class="product-card">
              <div class="product-image-container">
                <el-image :src="product.image" class="product-image" fit="cover" />
                <span class="new-tag">新品</span>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-meta">
                  <div class="product-price">{{ product.price }}</div>
                  <div class="product-rating">
                    <el-rate 
                      v-model="product.rating" 
                      disabled 
                      text-color="#ff9900"
                      :show-score="true"
                      :score-template="product.rating + ''"
                    />
                  </div>
                </div>
                <div class="product-release-date">发布日期: {{ product.releaseDate }}</div>
              </div>
            </div>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalProducts"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 筛选和排序状态
const sortBy = ref('newest')
const categoryFilter = ref('')
const priceFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)

// 模拟新品数据
const newProducts = ref([
  {
    id: 1,
    name: '智能门锁',
    price: '¥1299.00',
    image: 'https://picsum.photos/id/5/300/300',
    rating: 4.5,
    category: 'smart-home',
    releaseDate: '2025-04-01',
  },
  {
    id: 2,
    name: '智能音箱',
    price: '¥699.00',
    image: 'https://picsum.photos/id/6/300/300',
    rating: 4.7,
    category: 'smart-home',
    releaseDate: '2025-04-05',
  },
  {
    id: 3,
    name: '智能台灯',
    price: '¥349.00',
    image: 'https://picsum.photos/id/7/300/300',
    rating: 4.8,
    category: 'smart-home',
    releaseDate: '2025-04-08',
  },
  {
    id: 4,
    name: '机械键盘',
    price: '¥499.00',
    image: 'https://picsum.photos/id/8/300/300',
    rating: 4.9,
    category: 'accessories',
    releaseDate: '2025-04-10',
  },
  {
    id: 5,
    name: '无线耳机',
    price: '¥799.00',
    image: 'https://picsum.photos/id/9/300/300',
    rating: 4.6,
    category: 'electronics',
    releaseDate: '2025-04-12',
  },
  {
    id: 6,
    name: '蓝牙音箱',
    price: '¥599.00',
    image: 'https://picsum.photos/id/10/300/300',
    rating: 4.5,
    category: 'electronics',
    releaseDate: '2025-04-13',
  },
  {
    id: 7,
    name: '智能体脂秤',
    price: '¥199.00',
    image: 'https://picsum.photos/id/11/300/300',
    rating: 4.4,
    category: 'smart-home',
    releaseDate: '2025-04-14',
  },
  {
    id: 8,
    name: '超薄移动电源',
    price: '¥149.00',
    image: 'https://picsum.photos/id/12/300/300',
    rating: 4.7,
    category: 'accessories',
    releaseDate: '2025-04-15',
  },
  {
    id: 9,
    name: '智能手环',
    price: '¥299.00',
    image: 'https://picsum.photos/id/13/300/300',
    rating: 4.6,
    category: 'electronics',
    releaseDate: '2025-04-12',
  },
  {
    id: 10,
    name: '香薰机',
    price: '¥129.00',
    image: 'https://picsum.photos/id/14/300/300',
    rating: 4.8,
    category: 'home',
    releaseDate: '2025-04-10',
  },
  {
    id: 11,
    name: '摄像头',
    price: '¥399.00',
    image: 'https://picsum.photos/id/15/300/300',
    rating: 4.5,
    category: 'electronics',
    releaseDate: '2025-04-08',
  },
  {
    id: 12,
    name: '护眼台灯',
    price: '¥259.00',
    image: 'https://picsum.photos/id/16/300/300',
    rating: 4.7,
    category: 'home',
    releaseDate: '2025-04-05',
  }
])

// 计算筛选后的产品
const filteredProducts = computed(() => {
  let result = [...newProducts.value]
  
  // 分类筛选
  if (categoryFilter.value) {
    result = result.filter(product => product.category === categoryFilter.value)
  }
  
  // 价格筛选
  if (priceFilter.value) {
    if (priceFilter.value === '0-100') {
      result = result.filter(product => parseInt(product.price.slice(1)) < 100)
    } else if (priceFilter.value === '100-500') {
      result = result.filter(product => {
        const price = parseInt(product.price.slice(1))
        return price >= 100 && price <= 500
      })
    } else if (priceFilter.value === '500-1000') {
      result = result.filter(product => {
        const price = parseInt(product.price.slice(1))
        return price > 500 && price <= 1000
      })
    } else if (priceFilter.value === '1000+') {
      result = result.filter(product => parseInt(product.price.slice(1)) > 1000)
    }
  }
  
  // 排序
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  } else if (sortBy.value === 'price-asc') {
    result.sort((a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)))
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => parseInt(b.price.slice(1)) - parseInt(a.price.slice(1)))
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }
  
  return result
})

// 分页相关计算属性
const totalProducts = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// 重置筛选
const resetFilters = () => {
  sortBy.value = 'newest'
  categoryFilter.value = ''
  priceFilter.value = ''
  currentPage.value = 1
}

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 模拟加载数据
onMounted(() => {
  loading.value = true
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<style lang="scss" scoped>
.new-arrivals-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .page-description {
    color: #666;
    font-size: 16px;
  }
}

.filter-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  .filter-select {
    width: 100%;
  }
  
  .filter-reset {
    display: flex;
    justify-content: flex-end;
  }
}

.product-link {
  text-decoration: none;
  color: inherit;
}

.product-card {
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  
  .new-tag {
    position: absolute;
    top: 10px;
    left: 10px;
    background: var(--el-color-primary);
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
  }
}

.product-info {
  padding: 15px;
  
  .product-name {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .product-price {
      color: #ff6b6b;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  .product-release-date {
    font-size: 12px;
    color: #999;
  }
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
