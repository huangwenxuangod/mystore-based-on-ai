<template>
  <div class="cart-page">
    <div class="page-header">
      <h1>购物车</h1>
    </div>
    
    <div class="cart-container">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Delete, Star } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 购物车商品数据
const cartItems = ref([
  {
    id: 1,
    name: '智能手表Pro',
    price: '¥999.00',
    originalPrice: '¥1599.00',
    quantity: 1,
    image: 'https://picsum.photos/id/26/300/300',
    attributes: {
      '颜色': '黑色',
      '尺寸': '42mm'
    },
    selected: true
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: '¥299.00',
    originalPrice: '¥399.00',
    quantity: 2,
    image: 'https://picsum.photos/id/28/300/300',
    attributes: {
      '颜色': '白色'
    },
    selected: true
  },
  {
    id: 3,
    name: '超薄移动电源',
    price: '¥149.00',
    quantity: 1,
    image: 'https://picsum.photos/id/12/300/300',
    selected: false
  }
])

// 推荐商品
const recommendedProducts = ref([
  {
    id: 101,
    name: '机械键盘',
    price: '¥499.00',
    image: 'https://picsum.photos/id/60/300/300'
  },
  {
    id: 102,
    name: '高清摄像头',
    price: '¥349.00',
    image: 'https://picsum.photos/id/61/300/300'
  },
  {
    id: 103,
    name: '降噪耳机',
    price: '¥799.00',
    image: 'https://picsum.photos/id/62/300/300'
  },
  {
    id: 104,
    name: '智能台灯',
    price: '¥239.00',
    image: 'https://picsum.photos/id/63/300/300'
  }
])

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
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

// 购物车列表
.cart-list {
  margin-bottom: 30px;
  
  .product-info {
    display: flex;
    align-items: center;
    
    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      margin-right: 15px;
    }
    
    .product-details {
      .product-name {
        margin: 0 0 10px;
        font-weight: 500;
        font-size: 16px;
      }
      
      .product-attributes {
        margin: 0;
        font-size: 14px;
        color: #666;
        
        span {
          margin-right: 10px;
          
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  
  .price-info {
    .current-price {
      margin: 0 0 5px;
      font-weight: 600;
      color: #ff6b6b;
    }
    
    .original-price {
      margin: 0;
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }
  }
  
  .subtotal {
    color: #ff6b6b;
    font-weight: 600;
  }
}

// 购物车底部
.cart-footer {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .cart-ops {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .cart-total {
    display: flex;
    align-items: center;
    
    .total-info {
      margin-right: 40px;
      text-align: right;
      
      p {
        margin: 5px 0;
        
        .highlighted {
          font-weight: 600;
          
          &.price {
            color: #ff6b6b;
          }
          
          &.discount {
            color: #67c23a;
          }
        }
      }
    }
    
    .checkout-action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .final-price {
        margin: 0 0 10px;
        
        span {
          color: #ff6b6b;
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
  }
}

// 空购物车
.empty-cart {
  padding: 40px 0;
  
  .el-empty {
    margin-bottom: 30px;
  }
}

// 推荐商品
.recommended-section {
  margin-top: 40px;
  
  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
    position: relative;
    padding-left: 15px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background-color: #ff6b6b;
      border-radius: 2px;
    }
  }
  
  .product-card {
    background: var(--el-bg-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    
    .product-image-container {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    
    .product-info {
      padding: 15px;
      
      h4 {
        margin: 0 0 10px;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .product-price {
        color: #ff6b6b;
        font-weight: bold;
        margin-bottom: 15px;
      }
    }
  }
}

@media (max-width: 768px) {
  .cart-footer {
    flex-direction: column;
    
    .cart-ops {
      margin-bottom: 20px;
      width: 100%;
      justify-content: space-between;
    }
    
    .cart-total {
      width: 100%;
      flex-direction: column;
      
      .total-info {
        margin-right: 0;
        margin-bottom: 20px;
        width: 100%;
      }
      
      .checkout-action {
        width: 100%;
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>