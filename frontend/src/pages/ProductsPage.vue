<template>
  <div class="products-page">
    <div class="page-header">
      <h1>全部商品</h1>
      <p class="page-description">浏览我们精选的商品系列</p>
    </div>

    <div class="products-layout">
      <!-- 左侧分类栏 -->
      <div class="category-sidebar">
        <div class="category-header">
          <h3>商品分类</h3>
        </div>
        
        <el-menu
          :default-active="activeCategory"
          @select="handleCategoryChange"
          class="category-menu"
        >
          <el-menu-item index="">
            <el-icon><List /></el-icon>
            <span>全部商品</span>
          </el-menu-item>
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id">
            <el-icon><component :is="category.icon" /></el-icon>
            <span>{{ category.name }}</span>
          </el-menu-item>
        </el-menu>

        <div class="filter-box">
          <h3>价格筛选</h3>
          <el-slider
            v-model="priceRange"
            range
            :min="0"
            :max="10000"
            :step="100"
            :marks="{0: '¥0', 5000: '¥5000', 10000: '¥10000'}"
            @change="handlePriceChange"
          ></el-slider>
          <div class="price-range-display">
            <span>¥{{ priceRange[0] }}</span>
            <span>-</span>
            <span>¥{{ priceRange[1] }}</span>
          </div>
        </div>

        <div class="filter-box">
          <h3>品牌筛选</h3>
          <el-checkbox-group v-model="selectedBrands" @change="handleBrandChange">
            <el-checkbox v-for="brand in brands" :key="brand.id" :label="brand.id">
              {{ brand.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="filter-box">
          <h3>评分筛选</h3>
          <div class="rating-filter">
            <div v-for="rating in 5" :key="rating" class="rating-item" @click="toggleRatingFilter(rating)">
              <el-rate
                disabled
                :colors="['#ffa41c', '#ffa41c', '#ffa41c']"
              ></el-rate>
              <el-checkbox v-model="ratingFilter[rating]" @change="handleRatingChange">
                {{ rating }}星及以上
              </el-checkbox>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <el-button type="primary" @click="applyFilters">应用筛选</el-button>
          <el-button @click="resetFilters">重置筛选</el-button>
        </div>
      </div>

      <!-- 右侧商品展示区 -->
      <div class="products-container">
        <!-- 商品排序工具栏 -->
        <div class="products-toolbar">
          <div class="products-count">
            共 <strong>{{ filteredProducts.length }}</strong> 件商品
          </div>
          <div class="products-sort">
            <span>排序方式：</span>
            <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
              <el-radio-button label="default">综合排序</el-radio-button>
              <el-radio-button label="sales">销量优先</el-radio-button>
              <el-radio-button label="price-asc">价格从低到高</el-radio-button>
              <el-radio-button label="price-desc">价格从高到低</el-radio-button>
              <el-radio-button label="rating">好评优先</el-radio-button>
            </el-radio-group>
          </div>
          <div class="products-view">
            <el-tooltip content="网格视图" placement="top">
              <el-button 
                :type="viewMode === 'grid' ? 'primary' : ''" 
                :icon="Grid" 
                circle 
                @click="viewMode = 'grid'"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列表视图" placement="top">
              <el-button 
                :type="viewMode === 'list' ? 'primary' : ''" 
                :icon="Menu" 
                circle 
                @click="viewMode = 'list'"
              ></el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 商品展示区 -->
        <div :class="['products-grid', {'list-view': viewMode === 'list'}]" v-loading="loading">
          <el-empty v-if="filteredProducts.length === 0 && !loading" description="暂无符合条件的商品"></el-empty>
          
          <div v-for="product in paginatedProducts" :key="product.id" :class="['product-item', {'product-list-item': viewMode === 'list'}]">
            <router-link :to="`/product/${product.id}`" class="product-link">
              <div class="product-card">
                <div class="product-image-container">
                  <el-image :src="product.image" class="product-image" fit="cover"></el-image>
                  <span v-if="product.discount" class="discount-tag">{{ product.discount }}% OFF</span>
                </div>
                
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p v-if="viewMode === 'list'" class="product-description">{{ product.description }}</p>
                  <div class="product-meta">
                    <div class="product-price">
                      <span class="current-price">{{ product.price }}</span>
                      <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice }}</span>
                    </div>
                    <div class="product-rating">
                      <el-rate 
                        v-model="product.rating" 
                        disabled 
                        :colors="['#ffa41c', '#ffa41c', '#ffa41c']"
                        :show-score="true"
                        :score-template="product.rating + ''"
                      ></el-rate>
                      <span class="review-count">({{ product.reviewCount || 0 }})</span>
                    </div>
                  </div>
                  <div class="product-sales">
                    <span>月销 {{ product.salesCount || 0 }} 件</span>
                    <span v-if="viewMode === 'list'" class="product-brand">品牌：{{ getBrandName(product.brandId) }}</span>
                  </div>
                  <div v-if="viewMode === 'list'" class="product-actions">
                    <el-button type="primary" size="small">
                      <el-icon><ShoppingCart /></el-icon>
                      加入购物车
                    </el-button>
                    <el-button type="danger" size="small">立即购买</el-button>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-container" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalProducts"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  List, Menu, Grid, ShoppingCart, Monitor, Refrigerator,
  Headset, Watch, Camera, OfficeBuilding, Basketball, Box
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 视图模式与分页
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)

// 分类与筛选
const activeCategory = ref('')
const priceRange = ref([0, 10000])
const selectedBrands = ref([])
const ratingFilter = ref({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false
})
const sortBy = ref('default')

// 商品分类数据
const categories = [
  { id: 'electronics', name: '电子产品', icon: 'Monitor' },
  { id: 'home-appliances', name: '家用电器', icon: 'Refrigerator' },
  { id: 'audio', name: '音频设备', icon: 'Headset' },
  { id: 'wearables', name: '智能穿戴', icon: 'Watch' },
  { id: 'photography', name: '摄影摄像', icon: 'Camera' },
  { id: 'office', name: '办公设备', icon: 'OfficeBuilding' },
  { id: 'sports', name: '运动健康', icon: 'Basketball' },
  { id: 'accessories', name: '配件周边', icon: 'Box' },
]

// 品牌数据
const brands = [
  { id: 'brand1', name: '品牌A' },
  { id: 'brand2', name: '品牌B' },
  { id: 'brand3', name: '品牌C' },
  { id: 'brand4', name: '品牌D' },
  { id: 'brand5', name: '品牌E' },
]

// 模拟商品数据
const products = ref([
  {
    id: 1,
    name: '高清智能电视',
    description: '4K超高清分辨率，支持智能语音控制，超薄机身设计',
    price: '¥4999',
    originalPrice: '¥5999',
    image: 'https://picsum.photos/id/20/300/300',
    rating: 4.7,
    reviewCount: 325,
    salesCount: 1280,
    categoryId: 'electronics',
    brandId: 'brand1',
    discount: 17
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    description: '高品质音效，降噪功能，超长续航时间，舒适佩戴',
    price: '¥299',
    image: 'https://picsum.photos/id/21/300/300',
    rating: 4.9,
    reviewCount: 612,
    salesCount: 4580,
    categoryId: 'audio',
    brandId: 'brand2'
  },
  {
    id: 3,
    name: '智能手表',
    description: '健康监测，长续航，多种运动模式，支持消息通知',
    price: '¥899',
    originalPrice: '¥1299',
    image: 'https://picsum.photos/id/22/300/300',
    rating: 4.6,
    reviewCount: 246,
    salesCount: 890,
    categoryId: 'wearables',
    brandId: 'brand1',
    discount: 30
  },
  {
    id: 4,
    name: '便携式空气净化器',
    description: '高效过滤，静音设计，智能控制，适合家庭办公室使用',
    price: '¥1299',
    image: 'https://picsum.photos/id/23/300/300',
    rating: 4.5,
    reviewCount: 158,
    salesCount: 456,
    categoryId: 'home-appliances',
    brandId: 'brand3'
  },
  {
    id: 5,
    name: '数码相机',
    description: '高像素，多功能，便携设计，适合摄影爱好者',
    price: '¥3999',
    originalPrice: '¥4599',
    image: 'https://picsum.photos/id/24/300/300',
    rating: 4.8,
    reviewCount: 89,
    salesCount: 245,
    categoryId: 'photography',
    brandId: 'brand4',
    discount: 13
  },
  {
    id: 6,
    name: '智能门锁',
    description: '指纹识别，人脸识别，密码验证，远程控制，安全可靠',
    price: '¥1599',
    image: 'https://picsum.photos/id/25/300/300',
    rating: 4.7,
    reviewCount: 176,
    salesCount: 532,
    categoryId: 'home-appliances',
    brandId: 'brand5'
  },
  {
    id: 7,
    name: '机械键盘',
    description: '青轴机械键盘，RGB背光，人体工程学设计，游戏办公两相宜',
    price: '¥399',
    originalPrice: '¥499',
    image: 'https://picsum.photos/id/26/300/300',
    rating: 4.9,
    reviewCount: 342,
    salesCount: 1254,
    categoryId: 'office',
    brandId: 'brand2',
    discount: 20
  },
  {
    id: 8,
    name: '智能手环',
    description: '心率监测，睡眠分析，运动追踪，信息提醒，续航长',
    price: '¥199',
    image: 'https://picsum.photos/id/27/300/300',
    rating: 4.6,
    reviewCount: 465,
    salesCount: 2154,
    categoryId: 'wearables',
    brandId: 'brand1'
  },
  {
    id: 9,
    name: '无线充电器',
    description: '快速充电，多设备兼容，智能保护，简约设计',
    price: '¥129',
    originalPrice: '¥159',
    image: 'https://picsum.photos/id/28/300/300',
    rating: 4.5,
    reviewCount: 278,
    salesCount: 1765,
    categoryId: 'accessories',
    brandId: 'brand3',
    discount: 19
  },
  {
    id: 10,
    name: '运动蓝牙耳机',
    description: '防水防汗，稳固佩戴，高音质，适合运动使用',
    price: '¥249',
    image: 'https://picsum.photos/id/29/300/300',
    rating: 4.7,
    reviewCount: 187,
    salesCount: 986,
    categoryId: 'audio',
    brandId: 'brand2'
  },
  {
    id: 11,
    name: '电动牙刷',
    description: '智能感应，多种模式，高频震动，深层清洁',
    price: '¥299',
    originalPrice: '¥399',
    image: 'https://picsum.photos/id/30/300/300',
    rating: 4.8,
    reviewCount: 221,
    salesCount: 754,
    categoryId: 'home-appliances',
    brandId: 'brand5',
    discount: 25
  },
  {
    id: 12,
    name: '智能体脂秤',
    description: '精准测量，多项身体指标，APP记录分析，智能管理健康',
    price: '¥199',
    image: 'https://picsum.photos/id/31/300/300',
    rating: 4.6,
    reviewCount: 176,
    salesCount: 598,
    categoryId: 'sports',
    brandId: 'brand4'
  },
  {
    id: 13,
    name: '便携式蓝牙音箱',
    description: '高音质，防水设计，长续航，小巧便携，户外必备',
    price: '¥399',
    originalPrice: '¥499',
    image: 'https://picsum.photos/id/32/300/300',
    rating: 4.9,
    reviewCount: 298,
    salesCount: 1234,
    categoryId: 'audio',
    brandId: 'brand2',
    discount: 20
  },
  {
    id: 14,
    name: '电动剃须刀',
    description: '多刀头设计，全身水洗，充电快速，剃须干净舒适',
    price: '¥499',
    image: 'https://picsum.photos/id/33/300/300',
    rating: 4.7,
    reviewCount: 165,
    salesCount: 432,
    categoryId: 'home-appliances',
    brandId: 'brand5'
  },
  {
    id: 15,
    name: '折叠自拍杆',
    description: '轻巧便携，蓝牙遥控，多角度调节，稳固耐用',
    price: '¥79',
    originalPrice: '¥99',
    image: 'https://picsum.photos/id/34/300/300',
    rating: 4.5,
    reviewCount: 217,
    salesCount: 876,
    categoryId: 'accessories',
    brandId: 'brand3',
    discount: 20
  },
  {
    id: 16,
    name: '游戏鼠标',
    description: '高精准度，可编程按键，RGB灯效，舒适握感',
    price: '¥249',
    image: 'https://picsum.photos/id/35/300/300',
    rating: 4.8,
    reviewCount: 324,
    salesCount: 1345,
    categoryId: 'office',
    brandId: 'brand2'
  }
])

// 根据品牌ID获取品牌名称
const getBrandName = (brandId: string) => {
  const brand = brands.find(b => b.id === brandId)
  return brand ? brand.name : '未知品牌'
}

// 切换评分筛选
const toggleRatingFilter = (rating: number) => {
  ratingFilter.value[rating] = !ratingFilter.value[rating]
  handleRatingChange()
}

// 筛选后的产品
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 分类筛选
  if (activeCategory.value) {
    result = result.filter(p => p.categoryId === activeCategory.value)
  }
  
  // 价格筛选
  result = result.filter(p => {
    const price = parseInt(p.price.replace('¥', ''))
    return price >= priceRange.value[0] && price <= priceRange.value[1]
  })
  
  // 品牌筛选
  if (selectedBrands.value.length > 0) {
    result = result.filter(p => selectedBrands.value.includes(p.brandId))
  }
  
  // 评分筛选
  const minRating = Object.entries(ratingFilter.value)
    .filter(([_, value]) => value)
    .map(([key, _]) => parseInt(key))
    .sort((a, b) => b - a)[0]
    
  if (minRating) {
    result = result.filter(p => p.rating >= minRating)
  }
  
  // 排序
  result = sortProducts(result)
  
  return result
})

// 产品排序函数
const sortProducts = (productsList) => {
  const sorted = [...productsList]
  
  switch (sortBy.value) {
    case 'sales':
      sorted.sort((a, b) => b.salesCount - a.salesCount)
      break
    case 'price-asc':
      sorted.sort((a, b) => parseFloat(a.price.replace('¥', '')) - parseFloat(b.price.replace('¥', '')))
      break
    case 'price-desc':
      sorted.sort((a, b) => parseFloat(b.price.replace('¥', '')) - parseFloat(a.price.replace('¥', '')))
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      // 默认排序，综合考虑销量、评分等
      sorted.sort((a, b) => {
        const scoreA = a.salesCount * 0.5 + a.rating * 100
        const scoreB = b.salesCount * 0.5 + b.rating * 100
        return scoreB - scoreA
      })
  }
  
  return sorted
}

// 分页相关计算属性
const totalProducts = computed(() => filteredProducts.value.length)
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// 处理分类变更
const handleCategoryChange = (categoryId: string) => {
  activeCategory.value = categoryId
  currentPage.value = 1
  updateRouteQuery()
}

// 处理价格筛选变更
const handlePriceChange = () => {
  currentPage.value = 1
  updateRouteQuery()
}

// 处理品牌筛选变更
const handleBrandChange = () => {
  currentPage.value = 1
  updateRouteQuery()
}

// 处理评分筛选变更
const handleRatingChange = () => {
  currentPage.value = 1
  updateRouteQuery()
}

// 处理排序变更
const handleSortChange = () => {
  currentPage.value = 1
  updateRouteQuery()
}

// 应用筛选
const applyFilters = () => {
  currentPage.value = 1
  updateRouteQuery()
}

// 重置筛选条件
const resetFilters = () => {
  activeCategory.value = ''
  priceRange.value = [0, 10000]
  selectedBrands.value = []
  Object.keys(ratingFilter.value).forEach(key => {
    ratingFilter.value[key] = false
  })
  sortBy.value = 'default'
  currentPage.value = 1
  updateRouteQuery()
}

// 页面变更处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  updateRouteQuery()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 更新路由查询参数，便于页面刷新后保留筛选状态
const updateRouteQuery = () => {
  const query = {
    ...(activeCategory.value ? { category: activeCategory.value } : {}),
    ...(sortBy.value !== 'default' ? { sort: sortBy.value } : {}),
    ...(currentPage.value > 1 ? { page: currentPage.value.toString() } : {}),
    ...(priceRange.value[0] > 0 || priceRange.value[1] < 10000 ? 
      { price: `${priceRange.value[0]}-${priceRange.value[1]}` } : {}),
    ...(selectedBrands.value.length ? { brands: selectedBrands.value.join(',') } : {})
  }
  
  // 评分筛选
  const activeRatings = Object.entries(ratingFilter.value)
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
  
  if (activeRatings.length) {
    query.rating = activeRatings.join(',')
  }
  
  router.replace({ query })
}

// 从URL参数恢复筛选状态
const restoreFiltersFromQuery = () => {
  const { category, sort, page, price, brands, rating } = route.query
  
  if (category) activeCategory.value = category as string
  if (sort) sortBy.value = sort as string
  if (page) currentPage.value = parseInt(page as string)
  
  if (price) {
    const [min, max] = (price as string).split('-').map(v => parseInt(v))
    if (!isNaN(min) && !isNaN(max)) {
      priceRange.value = [min, max]
    }
  }
  
  if (brands) {
    selectedBrands.value = (brands as string).split(',')
  }
  
  if (rating) {
    const ratings = (rating as string).split(',')
    ratings.forEach(r => {
      ratingFilter.value[r] = true
    })
  }
}

// 初始化加载数据
onMounted(() => {
  loading.value = true
  
  // 从URL恢复筛选状态
  restoreFiltersFromQuery()
  
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false
  }, 800)
})

// 监听查询参数变化
watch(() => route.query, () => {
  if (Object.keys(route.query).length === 0) {
    // 如果查询参数为空，重置筛选
    resetFilters()
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
.products-page {
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

.products-layout {
  display: flex;
  gap: 30px;
}

.category-sidebar {
  width: 260px;
  flex-shrink: 0;
  
  .category-header {
    margin-bottom: 15px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .category-menu {
    margin-bottom: 20px;
    border-radius: 8px;
  }
  
  .filter-box {
    margin-bottom: 25px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .price-range-display {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      color: #666;
    }
    
    .rating-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
      
      .el-checkbox {
        margin-left: 8px;
      }
    }
  }
  
  .filter-actions {
    display: flex;
    gap: 10px;
    
    .el-button {
      flex: 1;
    }
  }
}

.products-container {
  flex: 1;
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 15px;
  background: #f9f9f9;
  border-radius: 8px;
  
  .products-sort {
    display: flex;
    align-items: center;
    
    span {
      margin-right: 10px;
      color: #666;
    }
  }
  
  .products-view {
    display: flex;
    gap: 10px;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  &.list-view {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    
    .product-image {
      transform: scale(1.05);
    }
  }
}

.product-list-item {
  .product-card {
    display: flex;
    
    .product-image-container {
      width: 240px;
      height: 240px;
    }
    
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
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
  
  .discount-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ff6b6b;
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
  }
}

.product-link {
  text-decoration: none;
  color: inherit;
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
  
  .product-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
  }
  
  .product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .product-price {
      .current-price {
        color: #ff6b6b;
        font-weight: 600;
        font-size: 18px;
      }
      
      .original-price {
        color: #999;
        font-size: 14px;
        margin-left: 5px;
        text-decoration: line-through;
      }
    }
    
    .product-rating {
      display: flex;
      align-items: center;
      
      .review-count {
        margin-left: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .product-sales {
    font-size: 13px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
  
  .product-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .products-layout {
    flex-direction: column;
  }
  
  .category-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .products-toolbar {
    flex-wrap: wrap;
    
    .products-count,
    .products-sort,
    .products-view {
      margin-bottom: 10px;
    }
    
    .products-sort {
      width: 100%;
      order: 3;
      justify-content: space-between;
    }
  }
  
  .product-list-item .product-card {
    flex-direction: column;
    
    .product-image-container {
      width: 100%;
    }
  }
}
</style>
