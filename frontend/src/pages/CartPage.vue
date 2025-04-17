<template>
  <div class="cart-page">
    <div class="page-header">
      <h1>购物车</h1>
    </div>
    
    <div class="cart-container" v-loading="loading">
      <template v-if="cartItems.length > 0">
        <!-- 购物车商品列表 -->
        <div class="cart-list">
          <el-table
            :data="cartItems"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品信息" min-width="400">
              <template #default="scope">
                <div class="product-info">
                  <el-image :src="scope.row.image" class="product-image" fit="cover"></el-image>
                  <div class="product-details">
                    <h4 class="product-name">{{ scope.row.name }}</h4>
                    <p class="product-attributes" v-if="scope.row.attributes">
                      <span v-for="(value, key) in scope.row.attributes" :key="key">
                        {{ key }}: {{ value }}
                      </span>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="scope">
                <div class="price-info">
                  <p class="current-price">{{ scope.row.price }}</p>
                  <p class="original-price" v-if="scope.row.originalPrice">{{ scope.row.originalPrice }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template #default="scope">
                <el-input-number 
                  v-model="scope.row.quantity" 
                  :min="1" 
                  :max="99" 
                  size="small"
                  @change="updateItemQuantity(scope.row.id, scope.row.quantity)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="小计" width="120">
              <template #default="scope">
                <span class="subtotal">{{ calculateSubtotal(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  :icon="Delete" 
                  circle
                  size="small"
                  @click="removeFromCart(scope.row.id)"
                ></el-button>
                <el-button 
                  :icon="Star"
                  circle
                  size="small"
                  @click="moveToFavorites(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 购物车底部区域 -->
        <div class="cart-footer">
          <div class="cart-ops">
            <el-checkbox 
              v-model="allSelected" 
              @change="handleSelectAllChange"
            >全选</el-checkbox>
            <el-button size="small" @click="batchRemove">批量删除</el-button>
            <el-button size="small" @click="clearCart">清空购物车</el-button>
          </div>
          <div class="cart-total">
            <div class="total-info">
              <p>已选择 <span class="highlighted">{{ selectedItems.length }}</span> 件商品</p>
              <p>商品合计: <span class="highlighted price">{{ totalPrice }}</span></p>
              <p>优惠金额: <span class="highlighted discount">-{{ discountAmount }}</span></p>
            </div>
            <div class="checkout-action">
              <p class="final-price">应付金额: <span>{{ finalPrice }}</span></p>
              <el-button type="primary" size="large" @click="checkout" :disabled="selectedItems.length === 0">
                去结算({{ selectedItems.length }})
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 猜你喜欢 -->
        <div class="recommended-section">
          <h2 class="section-title">猜你喜欢</h2>
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" v-for="item in recommendedProducts" :key="item.id">
              <div class="product-card">
                <div class="product-image-container">
                  <el-image :src="item.image" fit="cover"></el-image>
                </div>
                <div class="product-info">
                  <h4>{{ item.name }}</h4>
                  <p class="product-price">{{ item.price }}</p>
                  <el-button type="primary" size="small" @click="addToCart(item)">加入购物车</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      
      <!-- 空购物车状态 -->
      <div v-else class="empty-cart">
        <el-empty :image-size="200" description="您的购物车是空的">
          <template #description>
            <p>您的购物车还是空的，快去挑选心仪的商品吧！</p>
          </template>
          <el-button type="primary" @click="goToShopping">去购物</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiService from '@/services/apiService';
import { ref, computed, reactive, onMounted } from 'vue'
import { Delete, Star } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)

// 购物车商品数据
const cartItems = ref([])
// 推荐商品
const recommendedProducts = ref([])

// 获取购物车数据
const fetchCartData = async () => {
  try {
    loading.value = true;
    
    // 检查用户是否已登录，通过验证localStorage中是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      // 如果没有token，提示用户登录
      ElMessageBox.confirm(
        '您需要登录后才能查看购物车',
        '提示',
        {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // 跳转到登录页，并在登录后返回购物车页面
          router.push({
            path: '/user',
            query: { redirect: '/cart' }
          });
        })
        .catch(() => {
          // 用户取消，显示空购物车
          cartItems.value = [];
        });
      return;
    }
    
    const data = await apiService.getCartItems();
    if (data && data.items) {
      cartItems.value = data.items;
      // 默认选中所有商品
      cartItems.value.forEach(item => {
        item.selected = true;
      });
    } else {
      console.error('获取到的购物车数据格式不正确', data);
      ElMessage.error('购物车数据格式不正确');
    }
  } catch (error) {
    console.error('获取购物车数据失败', error);
    
    // 检查是否是权限错误(403)
    if (error.response && error.response.status === 403) {
      ElMessageBox.confirm(
        '您可能需要重新登录',
        '访问权限不足',
        {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          // 清除可能过期的token
          localStorage.removeItem('token');
          // 跳转到登录页，并在登录后返回购物车页面
          router.push({
            path: '/user',
            query: { redirect: '/cart' }
          });
        })
        .catch(() => {
          // 用户取消，显示空购物车
          cartItems.value = [];
        });
    } else {
      ElMessage.error('获取购物车数据失败');
    }
  } finally {
    loading.value = false;
  }
};

// 被选中的商品
const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

// 全选状态
const allSelected = computed({
  get: () => {
    return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  },
  set: (value) => {
    cartItems.value.forEach(item => item.selected = value)
  }
})

// 商品总价
const totalPrice = computed(() => {
  let total = 0
  selectedItems.value.forEach(item => {
    total += parseFloat(item.price.replace('¥', '')) * item.quantity
  })
  return `¥${total.toFixed(2)}`
})

// 优惠金额
const discountAmount = computed(() => {
  let discount = 0
  selectedItems.value.forEach(item => {
    if (item.originalPrice) {
      const originalPrice = parseFloat(item.originalPrice.replace('¥', ''))
      const currentPrice = parseFloat(item.price.replace('¥', ''))
      discount += (originalPrice - currentPrice) * item.quantity
    }
  })
  return `¥${discount.toFixed(2)}`
})

// 最终金额
const finalPrice = computed(() => {
  const total = parseFloat(totalPrice.value.replace('¥', ''))
  const discount = parseFloat(discountAmount.value.replace('¥', ''))
  return `¥${(total).toFixed(2)}`
})

// 更改商品选中状态
const handleSelectionChange = (selection) => {
  // 更新每个商品的选中状态
  cartItems.value.forEach(item => {
    item.selected = selection.some(selected => selected.id === item.id)
  })
}

// 处理全选/取消全选
const handleSelectAllChange = (val) => {
  cartItems.value.forEach(item => item.selected = val)
}

// 计算商品小计
const calculateSubtotal = (item) => {
  const price = parseFloat(item.price.replace('¥', ''))
  return `¥${(price * item.quantity).toFixed(2)}`
}

// 更新商品数量
const updateItemQuantity = (itemId, quantity) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity = quantity
  }
}

// 从购物车移除商品
const removeFromCart = (itemId) => {
  ElMessageBox.confirm(
    '确定要从购物车移除此商品吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cartItems.value = cartItems.value.filter(item => item.id !== itemId)
      ElMessage({
        type: 'success',
        message: '商品已移除',
      })
    })
    .catch(() => {
      // 取消操作
    })
}

// 批量删除选中商品
const batchRemove = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  
  ElMessageBox.confirm(
    `确定要移除选中的${selectedItems.value.length}件商品吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const selectedIds = selectedItems.value.map(item => item.id)
      cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
      ElMessage.success('已移除选中商品')
    })
    .catch(() => {
      // 取消操作
    })
}

// 清空购物车
const clearCart = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车已为空')
    return
  }
  
  ElMessageBox.confirm(
    '确定要清空购物车吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cartItems.value = []
      ElMessage.success('购物车已清空')
    })
    .catch(() => {
      // 取消操作
    })
}

// 移入收藏夹
const moveToFavorites = (item) => {
  ElMessage.success(`商品"${item.name}"已移入收藏夹`)
}

// 去结算
const checkout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请至少选择一件商品')
    return
  }
  
  router.push('/checkout')
}

// 去购物
const goToShopping = () => {
  router.push('/products')
}

// 添加商品到购物车
const addToCart = (product) => {
  // 检查商品是否已在购物车中
  const existingItem = cartItems.value.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
    ElMessage.success('商品数量已增加')
  } else {
    const newItem = {
      ...product,
      quantity: 1,
      selected: true
    }
    cartItems.value.push(newItem)
    ElMessage.success('商品已添加到购物车')
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchCartData()
})
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--el-bg-color);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  color: var(--el-text-color-primary);
  margin: 0;
}

.cart-container {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
}

.cart-list {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
}

.product-attributes {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-price {
  color: var(--el-color-danger);
  font-size: 16px;
  margin: 0;
}

.original-price {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  text-decoration: line-through;
  margin: 0;
}

.subtotal {
  color: var(--el-color-danger);
  font-weight: bold;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  margin-top: 20px;
}

.cart-ops {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-total {
  display: flex;
  align-items: center;
  gap: 30px;
}

.total-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-info p {
  margin: 0;
  color: var(--el-text-color-regular);
}

.highlighted {
  color: var(--el-color-danger);
  font-weight: bold;
}

.checkout-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.final-price {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 18px;
}

.final-price span {
  color: var(--el-color-danger);
  font-size: 24px;
  font-weight: bold;
}

.recommended-section {
  margin-top: 40px;
}

.section-title {
  color: var(--el-text-color-primary);
  font-size: 20px;
  margin-bottom: 20px;
}

.product-card {
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 var(--el-box-shadow-color);
}

.product-image-container {
  height: 200px;
  overflow: hidden;
}

.product-image-container .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.product-card:hover .product-image-container .el-image {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-info h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
}

.product-price {
  color: var(--el-color-danger);
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
}

.empty-cart p {
  color: var(--el-text-color-regular);
  margin: 10px 0;
}
</style>