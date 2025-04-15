<template>
  <div class="products-page">
    <el-row :gutter="20">
      <!-- 左侧筛选区域 -->
      <el-col :md="6" :sm="24">
        <div class="filter-section">
          <div class="filter-card">
            <h3>分类</h3>
            <div class="category-list">
              <el-checkbox-group v-model="selectedCategories" @change="handleFiltersChange">
                <el-checkbox
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.id"
                  border
                >
                  {{ category.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          
          <div class="filter-card">
            <h3>价格区间</h3>
            <div class="price-range">
              <el-slider
                v-model="priceRange"
                range
                :min="0"
                :max="10000"
                :step="100"
                @change="handleFiltersChange"
              />
              <div class="price-inputs">
                <el-input
                  v-model="priceRange[0]"
                  type="number"
                  placeholder="最低"
                  size="small"
                  @change="handleFiltersChange"
                />
                <span>-</span>
                <el-input
                  v-model="priceRange[1]"
                  type="number"
                  placeholder="最高"
                  size="small"
                  @change="handleFiltersChange"
                />
              </div>
            </div>
          </div>
          
          <div class="filter-card">
            <h3>品牌</h3>
            <div class="brand-list">
              <el-checkbox-group v-model="selectedBrands" @change="handleFiltersChange">
                <el-checkbox
                  v-for="brand in brands"
                  :key="brand.id"
                  :label="brand.id"
                  border
                >
                  {{ brand.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          
          <div class="filter-card">
            <h3>用户评分</h3>
            <div class="rating-filter">
              <el-checkbox-group v-model="selectedRatings" @change="handleFiltersChange">
                <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-item">
                  <el-checkbox :label="rating">
                    <el-rate
                      :model-value="rating"
                      disabled
                      :colors="['#ffd21e', '#ffd21e', '#ffd21e']"
                    />
                    <span v-if="rating === 5">与以上</span>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
          
          <el-button type="primary" @click="handleFiltersChange">应用筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </el-col>
      
      <!-- 右侧商品列表 -->
      <el-col :md="18" :sm="24">
        <div class="products-section">
          <div class="products-header">
            <div class="result-count">
              共找到 <span class="highlight">{{ totalProducts }}</span> 个商品
            </div>
            
            <div class="sort-options">
              <el-radio-group v-model="sortBy" size="small" @change="handleSortChange">
                <el-radio-button label="default">默认排序</el-radio-button>
                <el-radio-button label="price-asc">价格从低到高</el-radio-button>
                <el-radio-button label="price-desc">价格从高到低</el-radio-button>
                <el-radio-button label="rating">评分最高</el-radio-button>
                <el-radio-button label="sales">销量最高</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          
          <div class="products-list" v-loading="loading">
            <template v-if="!loading && displayProducts.length > 0">
              <el-row :gutter="20">
                <el-col
                  :xs="12"
                  :sm="8"
                  :md="8"
                  :lg="6"
                  :xl="6"
                  v-for="product in displayProducts"
                  :key="product.id"
                >
                  <div class="product-card" @click="goToProduct(product.id)">
                    <div class="product-image">
                      <el-image :src="product.image" fit="cover"></el-image>
                      <div class="discount-tag" v-if="product.discount">
                        -{{ product.discount }}%
                      </div>
                    </div>
                    <div class="product-info">
                      <h3 class="product-name" :title="product.name">
                        {{ product.name }}
                      </h3>
                      <div class="product-price">
                        <span class="current-price">{{ product.price }}</span>
                        <span class="original-price" v-if="product.originalPrice">
                          {{ product.originalPrice }}
                        </span>
                      </div>
                      <div class="product-meta">
                        <div class="rating">
                          <el-rate
                            v-model="product.rating"
                            disabled
                            :colors="['#ffd21e', '#ffd21e', '#ffd21e']"
                          />
                          <span class="rating-count">({{ product.reviewCount || 0 }})</span>
                        </div>
                        <div class="sold">已售{{ product.salesCount || 0 }}</div>
                      </div>
                      <div class="product-actions">
                        <el-button
                          type="primary"
                          size="small"
                          @click.stop="addToCart(product)"
                        >
                          加入购物车
                        </el-button>
                        <el-button
                          icon="Star"
                          circle
                          size="small"
                          @click.stop="addToFavorites(product)"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </template>
            
            <el-empty v-else-if="!loading && displayProducts.length === 0" description="没有找到符合条件的商品"></el-empty>
          </div>
          
          <div class="pagination-container" v-if="totalPages > 1">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="totalProducts"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import mockService from '@/services/mockService';
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 加载状态
const loading = ref(true);

// 商品列表和过滤选项
const allProducts = ref<any[]>([]);
const categories = ref([
  { id: 'electronics', name: '电子产品' },
  { id: 'audio', name: '音频设备' },
  { id: 'wearables', name: '可穿戴设备' },
  { id: 'accessories', name: '配件' },
  { id: 'home-appliances', name: '家用电器' }
]);
const brands = ref([
  { id: 'brand1', name: '品牌1' },
  { id: 'brand2', name: '品牌2' },
  { id: 'brand3', name: '品牌3' },
  { id: 'brand4', name: '品牌4' }
]);

// 筛选条件
const selectedCategories = ref<string[]>([]);
const priceRange = ref<number[]>([0, 10000]);
const selectedBrands = ref<string[]>([]);
const selectedRatings = ref<number[]>([]);
const sortBy = ref('default');

// 分页
const currentPage = ref(1);
const pageSize = ref(12);

// 获取所有商品数据
const fetchProducts = async () => {
  try {
    loading.value = true;
    
    // 构建查询参数
    const params: any = {};
    
    if (selectedCategories.value.length > 0) {
      params.categoryId = selectedCategories.value.join(',');
    }
    
    if (selectedBrands.value.length > 0) {
      params.brandId = selectedBrands.value.join(',');
    }
    
    if (priceRange.value[0] !== 0 || priceRange.value[1] !== 10000) {
      params.priceRange = `${priceRange.value[0]}-${priceRange.value[1]}`;
    }
    
    if (selectedRatings.value.length > 0) {
      params.rating = selectedRatings.value.join(',');
    }
    
    // 通过API获取商品数据
    const data = await mockService.getAllProducts(params);
    allProducts.value = data;
  } catch (error) {
    console.error('获取商品数据失败', error);
    ElMessage.error('获取商品数据失败');
  } finally {
    loading.value = false;
  }
};

// 路由查询参数处理
const updateFiltersFromQuery = () => {
  const { category, price, brand, rating, sort, page } = route.query;
  
  if (category) {
    selectedCategories.value = Array.isArray(category) ? category : [category as string];
  }
  
  if (price && typeof price === 'string') {
    const [min, max] = price.split('-').map(v => parseInt(v));
    if (!isNaN(min) && !isNaN(max)) {
      priceRange.value = [min, max];
    }
  }
  
  if (brand) {
    selectedBrands.value = Array.isArray(brand) ? brand : [brand as string];
  }
  
  if (rating && typeof rating === 'string') {
    selectedRatings.value = rating.split(',').map(r => parseInt(r));
  }
  
  if (sort) {
    sortBy.value = sort as string;
  }
  
  if (page) {
    currentPage.value = parseInt(page as string) || 1;
  }
};

// 更新URL查询参数
const updateQueryParams = () => {
  const query: any = {};
  
  if (selectedCategories.value.length > 0) {
    query.category = selectedCategories.value;
  }
  
  if (priceRange.value[0] !== 0 || priceRange.value[1] !== 10000) {
    query.price = `${priceRange.value[0]}-${priceRange.value[1]}`;
  }
  
  if (selectedBrands.value.length > 0) {
    query.brand = selectedBrands.value;
  }
  
  if (selectedRatings.value.length > 0) {
    query.rating = selectedRatings.value.join(',');
  }
  
  if (sortBy.value !== 'default') {
    query.sort = sortBy.value;
  }
  
  if (currentPage.value > 1) {
    query.page = currentPage.value;
  }
  
  router.push({ query });
};

// 过滤和排序后的商品列表
const filteredProducts = computed(() => {
  // 所有条件的商品都已在API请求时过滤
  return allProducts.value;
});

// 排序商品
const sortedProducts = computed(() => {
  const products = [...filteredProducts.value];
  
  switch (sortBy.value) {
    case 'price-asc':
      return products.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('¥', ''));
        const priceB = parseFloat(b.price.replace('¥', ''));
        return priceA - priceB;
      });
    case 'price-desc':
      return products.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('¥', ''));
        const priceB = parseFloat(b.price.replace('¥', ''));
        return priceB - priceA;
      });
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating);
    case 'sales':
      return products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    default:
      return products;
  }
});

// 当前页商品
const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedProducts.value.slice(start, end);
});

// 商品总数和总页数
const totalProducts = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value));

// 处理筛选条件变化
const handleFiltersChange = () => {
  currentPage.value = 1;
  updateQueryParams();
  fetchProducts();
};

// 处理排序方式变化
const handleSortChange = () => {
  currentPage.value = 1;
  updateQueryParams();
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  updateQueryParams();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 重置所有筛选条件
const resetFilters = () => {
  selectedCategories.value = [];
  priceRange.value = [0, 10000];
  selectedBrands.value = [];
  selectedRatings.value = [];
  sortBy.value = 'default';
  currentPage.value = 1;
  updateQueryParams();
  fetchProducts();
};

// 跳转到商品详情页
const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};

// 添加到购物车
const addToCart = (product: any) => {
  ElMessage.success(`已将 ${product.name} 加入购物车`);
};

// 添加到收藏夹
const addToFavorites = (product: any) => {
  ElMessage.success(`已将 ${product.name} 加入收藏夹`);
};

// 监听查询参数变化
watch(() => route.query, () => {
  updateFiltersFromQuery();
  fetchProducts();
}, { deep: true });

// 初始加载
onMounted(() => {
  updateFiltersFromQuery();
  fetchProducts();
});
</script>

<style lang="scss" scoped>
.products-page {
  padding: 20px;
}

.filter-section {
  .filter-card {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-lighter);

    h3 {
      margin: 0 0 15px;
      font-size: 16px;
      color: var(--el-text-color-primary);
    }
  }

  .category-list,
  .brand-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    :deep(.el-checkbox) {
      margin-right: 0;
      width: 100%;
      
      .el-checkbox__label {
        color: var(--el-text-color-regular);
      }
    }

    :deep(.el-checkbox.is-bordered) {
      background-color: var(--el-bg-color);
      border-color: var(--el-border-color);
      margin-bottom: 0;

      &:hover {
        border-color: var(--el-color-primary);
      }

      &.is-checked {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);

        .el-checkbox__label {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .price-range {
    .price-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 15px;

      span {
        color: var(--el-text-color-regular);
      }

      :deep(.el-input__wrapper) {
        background-color: var(--el-bg-color);
      }
    }
  }

  .rating-filter {
    .rating-item {
      margin-bottom: 10px;

      :deep(.el-checkbox) {
        display: flex;
        align-items: center;
        margin-right: 0;

        .el-checkbox__label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }

  .el-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.products-section {
  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    
    .result-count {
      margin-bottom: 10px;
      
      .highlight {
        color: #409eff;
        font-weight: bold;
      }
    }
    
    .sort-options {
      margin-bottom: 10px;
    }
  }
  
  .products-list {
    min-height: 300px;
  }
  
  .product-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: all 0.3s;
    height: 100%;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .product-image {
      height: 200px;
      position: relative;
      overflow: hidden;
      
      .el-image {
        width: 100%;
        height: 100%;
        transition: transform 0.3s;
        
        &:hover {
          transform: scale(1.05);
        }
      }
      
      .discount-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff6b6b;
        color: #fff;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    .product-info {
      padding: 15px;
      
      .product-name {
        margin: 0 0 10px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .product-price {
        margin-bottom: 10px;
        
        .current-price {
          color: #ff6b6b;
          font-weight: bold;
          font-size: 18px;
          margin-right: 8px;
        }
        
        .original-price {
          color: #999;
          font-size: 14px;
          text-decoration: line-through;
        }
      }
      
      .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .rating {
          display: flex;
          align-items: center;
          
          .rating-count {
            margin-left: 5px;
            font-size: 12px;
            color: #666;
          }
        }
        
        .sold {
          font-size: 12px;
          color: #666;
        }
      }
      
      .product-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .filter-section {
    position: static;
    margin-bottom: 20px;
  }
  
  .products-header {
    flex-direction: column;
    align-items: flex-start;
    
    .sort-options {
      width: 100%;
      overflow-x: auto;
    }
  }
}
</style>
