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
            <div v-if="activeMenu === 'account'" class="account-info">
              <h2>账户信息</h2>
              <el-form :model="userInfo" label-width="100px">
                <el-form-item label="用户名">
                  <el-input v-model="userInfo.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                  <el-input v-model="userInfo.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                  <el-date-picker
                    v-model="userInfo.birthday"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateUserInfo">保存修改</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <!-- 我的订单 -->
            <div v-if="activeMenu === 'orders'" class="orders-list">
              <h2>我的订单</h2>
              <el-tabs v-model="orderTab">
                <el-tab-pane label="全部订单" name="all">
                  <el-table :data="orders" style="width: 100%">
                    <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
                    <el-table-column prop="totalAmount" label="订单金额" width="120"></el-table-column>
                    <el-table-column prop="status" label="订单状态" width="120"></el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button type="text" @click="viewOrderDetail(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="待付款" name="unpaid">
                  <el-empty description="暂无待付款订单"></el-empty>
                </el-tab-pane>
                <el-tab-pane label="待发货" name="unshipped">
                  <el-empty description="暂无待发货订单"></el-empty>
                </el-tab-pane>
                <el-tab-pane label="待收货" name="shipped">
                  <el-empty description="暂无待收货订单"></el-empty>
                </el-tab-pane>
                <el-tab-pane label="已完成" name="completed">
                  <el-empty description="暂无已完成订单"></el-empty>
                </el-tab-pane>
              </el-tabs>
            </div>
            
            <!-- 我的收藏 -->
            <div v-if="activeMenu === 'favorites'" class="favorites-list">
              <h2>我的收藏</h2>
              <el-row :gutter="20">
                <el-col :span="6" v-for="item in favorites" :key="item.id">
                  <div class="favorite-item">
                    <el-image :src="item.image" fit="cover"></el-image>
                    <div class="item-info">
                      <h3>{{ item.name }}</h3>
                      <p class="price">{{ item.price }}</p>
                      <div class="actions">
                        <el-button type="primary" size="small" @click="addToCart(item)">加入购物车</el-button>
                        <el-button type="danger" size="small" @click="removeFavorite(item)">取消收藏</el-button>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <!-- 收货地址 -->
            <div v-if="activeMenu === 'address'" class="address-list">
              <h2>收货地址</h2>
              <el-button type="primary" @click="showAddAddressDialog">添加新地址</el-button>
              <el-row :gutter="20">
                <el-col :span="12" v-for="address in addresses" :key="address.id">
                  <div class="address-card">
                    <div class="address-info">
                      <p><strong>{{ address.name }}</strong> {{ address.phone }}</p>
                      <p>{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</p>
                    </div>
                    <div class="address-actions">
                      <el-button type="text" @click="editAddress(address)">编辑</el-button>
                      <el-button type="text" @click="deleteAddress(address)">删除</el-button>
                      <el-button type="text" v-if="!address.isDefault" @click="setDefaultAddress(address)">设为默认</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <!-- 账户安全 -->
            <div v-if="activeMenu === 'security'" class="security-settings">
              <h2>账户安全</h2>
              <el-form :model="securityForm" label-width="120px">
                <el-form-item label="当前密码">
                  <el-input v-model="securityForm.currentPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="securityForm.newPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                  <el-input v-model="securityForm.confirmPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updatePassword">修改密码</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockStore } from '@/stores/mock'
import {
    Location, Lock,
    Star,
    User, UserFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const mockStore = useMockStore()
const loading = ref(true)
const activeMenu = ref('account')
const orderTab = ref('all')
const userInfo = ref({})
const orders = ref([])
const favorites = ref([])
const addresses = ref([])
const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

const fetchUserData = async () => {
  try {
    loading.value = true
    const data = await mockStore.getUserData()
    userInfo.value = data
    addresses.value = data.address || []
  } catch (error) {
    console.error('获取用户数据失败:', error)
  } finally {
    loading.value = false
  }
}

const updateUserInfo = async () => {
  try {
    loading.value = true
    await mockStore.updateUserInfo(userInfo.value)
    ElMessage.success('用户信息更新成功')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败')
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  try {
    loading.value = true
    await mockStore.updatePassword(securityForm.value)
    ElMessage.success('密码修改成功')
    securityForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败')
  } finally {
    loading.value = false
  }
}

const viewOrderDetail = (order: any) => {
  console.log('查看订单详情:', order)
}

const removeFavorite = (item: any) => {
  favorites.value = favorites.value.filter(i => i.id !== item.id)
  ElMessage.success('已从收藏夹移除')
}

const showAddAddressDialog = () => {
  // Implementation of showAddAddressDialog
}

const editAddress = (address: any) => {
  // Implementation of editAddress
}

const deleteAddress = (addressId: number) => {
  addresses.value = addresses.value.filter(addr => addr.id !== addressId)
  ElMessage.success('地址删除成功')
}

const setDefaultAddress = (addressId: number) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === addressId
  })
  ElMessage.success('已设为默认地址')
}

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