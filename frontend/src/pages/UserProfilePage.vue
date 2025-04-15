<template>
  <div class="user-profile-page">
    <div class="page-header">
      <h1>个人中心</h1>
    </div>
    
    <div class="user-profile-container">
      <el-row :gutter="30">
        <!-- 侧边栏 -->
        <el-col :md="6" :sm="24">
          <div class="user-sidebar">
            <div class="user-info">
              <el-avatar :size="80" :icon="UserFilled" src="https://picsum.photos/id/1005/200/200"></el-avatar>
              <h3>{{ userInfo.username }}</h3>
              <p>{{ userInfo.email }}</p>
            </div>
            
            <el-menu 
              class="user-menu" 
              :default-active="activeMenu" 
              @select="handleMenuSelect"
            >
              <el-menu-item index="account">
                <el-icon><User /></el-icon>
                <span>账户信息</span>
              </el-menu-item>
              <el-menu-item index="orders">
                <el-icon><List /></el-icon>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="favorites">
                <el-icon><Star /></el-icon>
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="address">
                <el-icon><Location /></el-icon>
                <span>收货地址</span>
              </el-menu-item>
              <el-menu-item index="security">
                <el-icon><Lock /></el-icon>
                <span>账户安全</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-col>
        
        <!-- 主内容区 -->
        <el-col :md="18" :sm="24">
          <div class="content-panel">
            <!-- 账户信息 -->
            <div v-show="activeMenu === 'account'" class="account-info">
              <h2>账户信息</h2>
              <el-divider />
              
              <el-form :model="userInfo" label-width="100px">
                <el-form-item label="用户名">
                  <el-input v-model="userInfo.username" />
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model="userInfo.phone" />
                </el-form-item>
                <el-form-item label="电子邮箱">
                  <el-input v-model="userInfo.email" />
                </el-form-item>
                <el-form-item label="真实姓名">
                  <el-input v-model="userInfo.realName" />
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio :label="'male'">男</el-radio>
                    <el-radio :label="'female'">女</el-radio>
                    <el-radio :label="'other'">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期">
                  <el-date-picker 
                    v-model="userInfo.birthday" 
                    type="date" 
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 我的订单 -->
            <div v-show="activeMenu === 'orders'" class="orders-info">
              <h2>我的订单</h2>
              <el-divider />
              
              <el-tabs v-model="orderTab">
                <el-tab-pane label="全部订单" name="all">
                  <div v-if="orders.length > 0">
                    <div v-for="order in orders" :key="order.id" class="order-item">
                      <div class="order-header">
                        <span class="order-id">订单号: {{ order.id }}</span>
                        <span class="order-date">{{ order.date }}</span>
                        <span class="order-status">{{ order.status }}</span>
                      </div>
                      <div class="order-products">
                        <div v-for="product in order.products" :key="product.id" class="product-item">
                          <el-image :src="product.image" :alt="product.name" class="product-image"></el-image>
                          <div class="product-info">
                            <h4>{{ product.name }}</h4>
                            <p>{{ product.price }} x {{ product.quantity }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="order-footer">
                        <div class="order-total">
                          <span>订单总计：</span>
                          <span class="price">¥{{ order.total }}</span>
                        </div>
                        <div class="order-actions">
                          <el-button size="small" @click="viewOrderDetail(order.id)">订单详情</el-button>
                          <el-button size="small" type="primary" v-if="order.status === '待付款'">立即付款</el-button>
                          <el-button size="small" v-if="order.status === '待收货'">确认收货</el-button>
                          <el-button size="small" v-if="['已完成', '已收货'].includes(order.status)">评价晒单</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-empty v-else description="暂无订单记录" />
                </el-tab-pane>
                <el-tab-pane label="待付款" name="pending"></el-tab-pane>
                <el-tab-pane label="待发货" name="processing"></el-tab-pane>
                <el-tab-pane label="待收货" name="shipped"></el-tab-pane>
                <el-tab-pane label="已完成" name="completed"></el-tab-pane>
              </el-tabs>
            </div>
            
            <!-- 我的收藏 -->
            <div v-show="activeMenu === 'favorites'" class="favorites-info">
              <h2>我的收藏</h2>
              <el-divider />
              
              <div v-if="favorites.length > 0" class="favorites-grid">
                <el-row :gutter="20">
                  <el-col :span="8" v-for="item in favorites" :key="item.id">
                    <div class="favorite-card">
                      <div class="favorite-image">
                        <el-image :src="item.image" fit="cover"></el-image>
                      </div>
                      <div class="favorite-info">
                        <h4>{{ item.name }}</h4>
                        <p class="price">{{ item.price }}</p>
                        <div class="favorite-actions">
                          <el-button size="small" type="primary">加入购物车</el-button>
                          <el-button size="small" @click="removeFromFavorites(item.id)">取消收藏</el-button>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-empty v-else description="暂无收藏商品" />
            </div>
            
            <!-- 收货地址 -->
            <div v-show="activeMenu === 'address'" class="address-info">
              <h2>收货地址</h2>
              <el-divider />
              
              <div class="address-actions">
                <el-button type="primary" @click="showAddressDialog = true">添加新地址</el-button>
              </div>
              
              <div v-if="addresses.length > 0" class="address-list">
                <div v-for="address in addresses" :key="address.id" class="address-item">
                  <div class="address-content">
                    <div class="address-tags">
                      <el-tag v-if="address.isDefault" type="danger" size="small">默认</el-tag>
                    </div>
                    <h4>{{ address.name }} {{ address.phone }}</h4>
                    <p>{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</p>
                  </div>
                  <div class="address-actions">
                    <el-button size="small" @click="editAddress(address)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteAddress(address.id)">删除</el-button>
                    <el-button size="small" v-if="!address.isDefault" @click="setDefaultAddress(address.id)">设为默认</el-button>
                  </div>
                </div>
              </div>
              <el-empty v-else description="暂无收货地址" />
              
              <!-- 地址表单对话框 -->
              <el-dialog
                v-model="showAddressDialog"
                :title="editingAddress ? '编辑地址' : '新增地址'"
                width="500px"
              >
                <el-form :model="addressForm" label-width="80px">
                  <el-form-item label="收货人">
                    <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
                  </el-form-item>
                  <el-form-item label="手机号码">
                    <el-input v-model="addressForm.phone" placeholder="请输入手机号码" />
                  </el-form-item>
                  <el-form-item label="所在地区">
                    <el-select v-model="addressForm.province" placeholder="省份" style="width: 120px; margin-right: 10px;">
                      <el-option label="北京市" value="北京市"></el-option>
                      <el-option label="上海市" value="上海市"></el-option>
                      <el-option label="广东省" value="广东省"></el-option>
                    </el-select>
                    <el-select v-model="addressForm.city" placeholder="城市" style="width: 120px; margin-right: 10px;">
                      <el-option label="广州市" value="广州市"></el-option>
                      <el-option label="深圳市" value="深圳市"></el-option>
                    </el-select>
                    <el-select v-model="addressForm.district" placeholder="区县" style="width: 120px;">
                      <el-option label="天河区" value="天河区"></el-option>
                      <el-option label="海珠区" value="海珠区"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="详细地址">
                    <el-input v-model="addressForm.detail" type="textarea" :rows="2" placeholder="请输入详细地址信息"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="addressForm.isDefault">设为默认收货地址</el-checkbox>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="showAddressDialog = false">取消</el-button>
                    <el-button type="primary" @click="saveAddress">确认</el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
            
            <!-- 账户安全 -->
            <div v-show="activeMenu === 'security'" class="security-info">
              <h2>账户安全</h2>
              <el-divider />
              
              <div class="security-item">
                <div class="security-content">
                  <h4>登录密码</h4>
                  <p>定期修改密码可以保护您的账户安全</p>
                </div>
                <el-button @click="showPasswordDialog = true">修改密码</el-button>
              </div>
              
              <div class="security-item">
                <div class="security-content">
                  <h4>手机号码</h4>
                  <p>已绑定：{{ userInfo.phone }}</p>
                </div>
                <el-button>修改</el-button>
              </div>
              
              <div class="security-item">
                <div class="security-content">
                  <h4>邮箱验证</h4>
                  <p>已绑定：{{ userInfo.email }}</p>
                </div>
                <el-button>修改</el-button>
              </div>
              
              <!-- 修改密码对话框 -->
              <el-dialog
                v-model="showPasswordDialog"
                title="修改密码"
                width="500px"
              >
                <el-form :model="passwordForm" label-width="100px">
                  <el-form-item label="当前密码">
                    <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码">
                    <el-input v-model="passwordForm.newPassword" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认新密码">
                    <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="showPasswordDialog = false">取消</el-button>
                    <el-button type="primary" @click="changePassword">确认修改</el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  User, UserFilled, List, Star, 
  Location, Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 当前激活的菜单
const activeMenu = ref('account')

// 用户信息
const userInfo = reactive({
  username: '张小明',
  phone: '138****6666',
  email: 'example@email.com',
  realName: '张明',
  gender: 'male',
  birthday: '1990-01-01',
  avatar: ''
})

// 订单相关
const orderTab = ref('all')
const orders = ref([
  {
    id: 'ORD20250415001',
    date: '2025-04-15 14:30:21',
    status: '待付款',
    total: '1299.00',
    products: [
      {
        id: 1,
        name: '智能手表Pro',
        price: '¥999.00',
        quantity: 1,
        image: 'https://picsum.photos/id/26/100/100'
      },
      {
        id: 2,
        name: '无线充电器',
        price: '¥300.00',
        quantity: 1,
        image: 'https://picsum.photos/id/27/100/100'
      }
    ]
  },
  {
    id: 'ORD20250413002',
    date: '2025-04-13 09:15:33',
    status: '已完成',
    total: '299.00',
    products: [
      {
        id: 3,
        name: '无线蓝牙耳机',
        price: '¥299.00',
        quantity: 1,
        image: 'https://picsum.photos/id/28/100/100'
      }
    ]
  }
])

// 收藏商品
const favorites = ref([
  {
    id: 1,
    name: '智能手表Pro',
    price: '¥999.00',
    image: 'https://picsum.photos/id/26/300/300'
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: '¥299.00',
    image: 'https://picsum.photos/id/28/300/300'
  },
  {
    id: 3,
    name: '4K高清投影仪',
    price: '¥3999.00',
    image: 'https://picsum.photos/id/30/300/300'
  }
])

// 收货地址
const addresses = ref([
  {
    id: 1,
    name: '张小明',
    phone: '13812345678',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南路88号智汇大厦3栋1001室',
    isDefault: true
  },
  {
    id: 2,
    name: '张小明',
    phone: '13812345678',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detail: '天河路385号太古汇1期北塔12楼',
    isDefault: false
  }
])

// 地址表单
const showAddressDialog = ref(false)
const editingAddress = ref(null)
const addressForm = reactive({
  id: null,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

// 密码表单
const showPasswordDialog = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

// 保存用户信息
const saveUserInfo = () => {
  ElMessage.success('个人信息保存成功')
}

// 查看订单详情
const viewOrderDetail = (orderId: string) => {
  console.log('查看订单详情：', orderId)
}

// 从收藏夹移除商品
const removeFromFavorites = (itemId: number) => {
  favorites.value = favorites.value.filter(item => item.id !== itemId)
  ElMessage.success('已从收藏夹移除')
}

// 编辑地址
const editAddress = (address: any) => {
  editingAddress.value = address
  Object.assign(addressForm, address)
  showAddressDialog.value = true
}

// 删除地址
const deleteAddress = (addressId: number) => {
  addresses.value = addresses.value.filter(addr => addr.id !== addressId)
  ElMessage.success('地址删除成功')
}

// 设为默认地址
const setDefaultAddress = (addressId: number) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === addressId
  })
  ElMessage.success('已设为默认地址')
}

// 保存地址
const saveAddress = () => {
  if (editingAddress.value) {
    // 更新现有地址
    const index = addresses.value.findIndex(addr => addr.id === addressForm.id)
    if (index !== -1) {
      addresses.value[index] = { ...addressForm }
    }
    
    // 如果设为默认，其他地址不再为默认
    if (addressForm.isDefault) {
      addresses.value.forEach((addr, idx) => {
        if (idx !== index) {
          addr.isDefault = false
        }
      })
    }
    
    ElMessage.success('地址修改成功')
  } else {
    // 添加新地址
    const newAddress = {
      ...addressForm,
      id: addresses.value.length > 0 ? Math.max(...addresses.value.map(addr => addr.id)) + 1 : 1
    }
    
    addresses.value.push(newAddress)
    
    // 如果设为默认，其他地址不再为默认
    if (newAddress.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== newAddress.id) {
          addr.isDefault = false
        }
      })
    }
    
    ElMessage.success('新地址添加成功')
  }
  
  showAddressDialog.value = false
  // 重置表单
  Object.keys(addressForm).forEach(key => {
    if (key !== 'id') {
      addressForm[key] = key === 'isDefault' ? false : ''
    } else {
      addressForm[key] = null
    }
  })
  editingAddress.value = null
}

// 修改密码
const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  
  ElMessage.success('密码修改成功，请重新登录')
  showPasswordDialog.value = false
  
  // 重置表单
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>

<style lang="scss" scoped>
.user-profile-page {
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

.user-profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

// 侧边栏样式
.user-sidebar {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  .user-info {
    padding: 30px 20px;
    text-align: center;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 15px 0 5px;
      font-size: 18px;
    }
    
    p {
      color: #999;
      font-size: 14px;
      margin: 0;
    }
  }
  
  .user-menu {
    border-right: none;
  }
}

// 内容区样式
.content-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 600px;
  
  h2 {
    font-size: 20px;
    margin: 0;
    padding-bottom: 10px;
  }
}

// 订单列表
.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  
  .order-header {
    background: #f8f8f8;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    
    .order-status {
      color: var(--el-color-danger);
      font-weight: bold;
    }
  }
  
  .order-products {
    padding: 15px;
    
    .product-item {
      display: flex;
      margin-bottom: 10px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .product-image {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 15px;
      }
      
      .product-info {
        h4 {
          margin: 0 0 8px;
          font-size: 16px;
        }
        
        p {
          color: #666;
          margin: 0;
        }
      }
    }
  }
  
  .order-footer {
    padding: 15px;
    background: #f8f8f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .order-total {
      .price {
        font-size: 18px;
        color: var(--el-color-danger);
        font-weight: bold;
      }
    }
    
    .order-actions {
      display: flex;
      gap: 10px;
    }
  }
}

// 收藏商品
.favorites-grid {
  .favorite-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    
    .favorite-image {
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
    
    .favorite-info {
      padding: 15px;
      
      h4 {
        margin: 0 0 10px;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .price {
        color: var(--el-color-danger);
        font-weight: bold;
        margin-bottom: 15px;
      }
      
      .favorite-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}

// 地址管理
.address-actions {
  margin-bottom: 20px;
}

.address-list {
  .address-item {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 15px;
    
    .address-content {
      flex: 1;
      
      .address-tags {
        margin-bottom: 10px;
      }
      
      h4 {
        margin: 0 0 10px;
        font-size: 16px;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
    
    .address-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0;
    }
  }
}

// 安全设置
.security-info {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .security-content {
      h4 {
        margin: 0 0 8px;
        font-size: 16px;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  }
}

@media (max-width: 768px) {
  .content-panel {
    padding: 20px 15px;
  }
  
  .order-item {
    .order-footer {
      flex-direction: column;
      align-items: flex-start;
      
      .order-actions {
        margin-top: 15px;
      }
    }
  }
  
  .address-item {
    flex-direction: column;
    
    .address-actions {
      flex-direction: row !important;
      margin-top: 15px !important;
    }
  }
}
</style>