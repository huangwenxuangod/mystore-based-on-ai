<template>
  <div class="user-profile-page">
    <div class="page-header">
      <h1>用户中心</h1>
    </div>
    
    <div class="user-profile-container" v-loading="loading">
      <el-row :gutter="20">
        <!-- 侧边栏菜单 -->
        <el-col :md="6" :sm="24">
          <div class="user-sidebar">
            <div class="user-avatar">
              <el-avatar :size="80" :src="userInfo.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
              <h3>{{ userInfo.username }}</h3>
            </div>
            
            <div class="sidebar-menu">
              <el-menu
                :default-active="activeMenu"
                class="user-menu"
                @select="handleMenuSelect"
              >
                <el-menu-item index="account">
                  <el-icon><User /></el-icon>
                  <span>账户信息</span>
                </el-menu-item>
                <el-menu-item index="orders">
                  <el-icon><UserFilled /></el-icon>
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
                  <el-input v-model="userInfo.username" disabled />
                </el-form-item>
                <el-form-item label="真实姓名">
                  <el-input v-model="userInfo.realName" placeholder="请输入真实姓名" />
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                    <el-radio label="other">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                  <el-date-picker 
                    v-model="userInfo.birthday" 
                    type="date" 
                    placeholder="选择生日"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model="userInfo.phone" placeholder="请输入手机号码" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" disabled />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveUserInfo">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 订单列表 -->
            <div v-show="activeMenu === 'orders'" class="orders-list">
              <h2>我的订单</h2>
              <el-divider />
              
              <div v-for="order in orders" :key="order.id" class="order-item">
                <div class="order-header">
                  <div>
                    <span>订单号: {{ order.id }}</span>
                    <span style="margin-left: 20px">下单时间: {{ order.date }}</span>
                  </div>
                  <div class="order-status">{{ order.status }}</div>
                </div>
                <div class="order-products">
                  <div v-for="(product, index) in order.products" :key="index" class="product-item">
                    <div class="product-image">
                      <el-image :src="product.image" fit="cover"></el-image>
                    </div>
                    <div class="product-info">
                      <h4>{{ product.name }}</h4>
                      <p>{{ product.price }} x {{ product.quantity }}</p>
                    </div>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="order-total">
                    <span>订单金额: </span>
                    <span class="price">¥{{ order.total }}</span>
                  </div>
                  <div>
                    <el-button size="small" @click="viewOrderDetail(order.id)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 收藏列表 -->
            <div v-show="activeMenu === 'favorites'" class="favorites-list">
              <h2>我的收藏</h2>
              <el-divider />
              
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8" v-for="item in favorites" :key="item.id">
                  <div class="favorite-item">
                    <div class="favorite-image">
                      <el-image :src="item.image" fit="cover"></el-image>
                    </div>
                    <div class="favorite-info">
                      <h4>{{ item.name }}</h4>
                      <p class="price">{{ item.price }}</p>
                      <div class="favorite-actions">
                        <el-button size="small" type="primary">加入购物车</el-button>
                        <el-button 
                          size="small" 
                          type="danger" 
                          icon="Delete" 
                          circle
                          @click="removeFromFavorites(item.id)"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <!-- 收货地址 -->
            <div v-show="activeMenu === 'address'" class="address-list">
              <h2>收货地址</h2>
              <el-divider />
              
              <div class="address-actions">
                <el-button type="primary" @click="addAddress">新增地址</el-button>
              </div>
              
              <div v-for="address in addresses" :key="address.id" class="address-item">
                <div class="address-content">
                  <div class="default-tag" v-if="address.isDefault">默认</div>
                  <h4>{{ address.name }} {{ address.phone }}</h4>
                  <p>{{ address.province }} {{ address.city }} {{ address.district }}</p>
                  <p>{{ address.detail }}</p>
                </div>
                <div class="address-actions">
                  <el-button size="small" @click="editAddress(address)">编辑</el-button>
                  <el-button 
                    size="small" 
                    @click="setDefaultAddress(address.id)" 
                    :disabled="address.isDefault"
                  >设为默认</el-button>
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="deleteAddress(address.id)"
                    :disabled="address.isDefault"
                  >删除</el-button>
                </div>
              </div>
              
              <!-- 地址编辑对话框 -->
              <el-dialog
                v-model="showAddressDialog"
                :title="editingAddress ? '编辑地址' : '新增地址'"
                width="500px"
              >
                <el-form :model="addressForm" label-width="100px">
                  <el-form-item label="收货人">
                    <el-input v-model="addressForm.name" placeholder="请输入收货人姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码">
                    <el-input v-model="addressForm.phone" placeholder="请输入手机号码"></el-input>
                  </el-form-item>
                  <el-form-item label="所在地区">
                    <el-input v-model="addressForm.province" placeholder="省份" style="width: 30%; margin-right: 5px"></el-input>
                    <el-input v-model="addressForm.city" placeholder="城市" style="width: 30%; margin-right: 5px"></el-input>
                    <el-input v-model="addressForm.district" placeholder="区县" style="width: 30%"></el-input>
                  </el-form-item>
                  <el-form-item label="详细地址">
                    <el-input v-model="addressForm.detail" type="textarea" rows="2"></el-input>
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
import { ref, reactive, onMounted } from 'vue'
import { 
  User, UserFilled, List, Star, 
  Location, Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import mockService from '@/services/mockService'

// 加载状态
const loading = ref(true)

// 当前激活的菜单
const activeMenu = ref('account')

// 用户信息
const userInfo = reactive({
  username: '',
  email: '',
  phone: '',
  realName: '',
  gender: '',
  birthday: '',
  avatar: ''
})

// 订单列表
const orders = ref([])

// 收藏商品
const favorites = ref([])

// 收货地址
const addresses = ref([])

// 获取用户数据
const fetchUserData = async () => {
  try {
    loading.value = true
    
    // 获取用户信息
    const userData = await mockService.getUserData()
    Object.assign(userInfo, userData)
    
    // 获取订单数据
    const ordersData = await mockService.getOrdersData()
    orders.value = ordersData
    
    // 获取收藏数据
    const favoritesData = await mockService.getFavoritesData()
    favorites.value = favoritesData
    
    // 获取地址数据
    const addressesData = await mockService.getAddressesData()
    addresses.value = addressesData
  } catch (error) {
    console.error('获取用户数据失败', error)
    ElMessage.error('获取用户数据失败')
  } finally {
    loading.value = false
  }
}

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

// 新增地址
const addAddress = () => {
  editingAddress.value = null
  addressForm.id = null
  addressForm.name = ''
  addressForm.phone = ''
  addressForm.province = ''
  addressForm.city = ''
  addressForm.district = ''
  addressForm.detail = ''
  addressForm.isDefault = false
  showAddressDialog.value = true
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

// 页面加载时获取数据
onMounted(() => {
  fetchUserData()
})
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
  padding: 20px 0;
  margin-bottom: 20px;
  
  .user-avatar {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      margin-top: 10px;
      margin-bottom: 0;
      font-size: 18px;
    }
  }
  
  .user-menu {
    border-right: none;
  }
}

// 内容面板
.content-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  
  h2 {
    margin-top: 0;
    font-size: 20px;
  }
}

// 收藏列表
.favorites-list {
  .favorite-item {
    display: flex;
    background: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    
    .favorite-image {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
      
      .el-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .favorite-info {
      flex-grow: 1;
      padding: 15px;
      display: flex;
      flex-direction: column;
      
      h4 {
        margin: 0 0 10px;
        font-size: 16px;
      }
      
      .price {
        color: #ff6b6b;
        font-weight: bold;
        margin-bottom: auto;
      }
      
      .favorite-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
    }
  }
}

// 地址列表
.address-list {
  .address-actions {
    margin-bottom: 20px;
  }
  
  .address-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    
    .address-content {
      position: relative;
      padding-right: 20px;
      
      .default-tag {
        position: absolute;
        top: 0;
        right: 0;
        background: #ff6b6b;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
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
      gap: 10px;
    }
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>