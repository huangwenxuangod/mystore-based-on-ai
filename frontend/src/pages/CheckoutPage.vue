<template>
  <div class="checkout-page">
    <div class="page-header">
      <h1>订单确认</h1>
    </div>
    
    <div class="checkout-container" v-loading="loading">
      <!-- 步骤条 -->
      <div class="checkout-steps">
        <el-steps :active="1" finish-status="success" simple>
          <el-step title="确认订单"></el-step>
          <el-step title="支付订单"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      
      <!-- 地址选择 -->
      <div class="section address-section">
        <div class="section-header">
          <h2>收货地址</h2>
          <el-button type="primary" plain size="small" @click="showAddressForm = true">
            添加新地址
          </el-button>
        </div>
        
        <div class="address-list">
          <el-empty v-if="addresses.length === 0" description="暂无收货地址"></el-empty>
          
          <template v-else>
            <div
              v-for="address in addresses"
              :key="address.id"
              class="address-card"
              :class="{ 'active': selectedAddressId === address.id }"
              @click="selectedAddressId = address.id"
            >
              <div class="address-content">
                <div class="address-info">
                  <div class="name-phone">
                    <span class="name">{{ address.name }}</span>
                    <span class="phone">{{ address.phone }}</span>
                  </div>
                  <div class="address-detail">
                    {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                  </div>
                </div>
                <div class="address-action">
                  <el-tag v-if="address.isDefault" type="success" size="small">默认</el-tag>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 新增地址表单 -->
        <el-dialog
          v-model="showAddressForm"
          title="添加收货地址"
          width="500px"
          destroy-on-close
        >
          <el-form :model="addressForm" label-width="80px">
            <el-form-item label="收货人">
              <el-input v-model="addressForm.name" placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="addressForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="所在地区">
              <el-input v-model="addressForm.province" placeholder="省份"></el-input>
              <el-input v-model="addressForm.city" placeholder="城市" style="margin: 0 10px;"></el-input>
              <el-input v-model="addressForm.district" placeholder="区/县"></el-input>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="addressForm.detail" type="textarea" placeholder="详细地址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showAddressForm = false">取消</el-button>
              <el-button type="primary" @click="saveAddress">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      
      <!-- 支付方式 -->
      <div class="section payment-section">
        <div class="section-header">
          <h2>支付方式</h2>
        </div>
        
        <div class="payment-methods">
          <div 
            class="payment-method"
            :class="{ 'active': paymentMethod === 'wechat' }"
            @click="paymentMethod = 'wechat'"
          >
            <div class="payment-logo">
              <img src="https://picsum.photos/id/87/48/48" alt="微信支付">
            </div>
            <div class="payment-info">
              <div class="payment-name">微信支付</div>
              <div class="payment-desc">使用微信扫码支付</div>
            </div>
          </div>
          
          <div 
            class="payment-method"
            :class="{ 'active': paymentMethod === 'alipay' }"
            @click="paymentMethod = 'alipay'"
          >
            <div class="payment-logo">
              <img src="https://picsum.photos/id/89/48/48" alt="支付宝">
            </div>
            <div class="payment-info">
              <div class="payment-name">支付宝</div>
              <div class="payment-desc">使用支付宝扫码支付</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品信息 -->
      <div class="section order-items-section">
        <div class="section-header">
          <h2>商品信息</h2>
        </div>
        
        <el-table :data="selectedItems" style="width: 100%">
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
          <el-table-column label="数量" width="100" prop="quantity"></el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="scope">
              <span class="subtotal">{{ calculateSubtotal(scope.row) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 订单摘要 -->
      <div class="section order-summary-section">
        <div class="order-summary">
          <div class="summary-item">
            <span>商品金额：</span>
            <span>{{ totalPrice }}</span>
          </div>
          <div class="summary-item">
            <span>优惠金额：</span>
            <span class="discount">-{{ discountAmount }}</span>
          </div>
          <div class="summary-item">
            <span>运费：</span>
            <span>¥0.00</span>
          </div>
          <div class="summary-item total">
            <span>应付金额：</span>
            <span class="final-price">{{ finalPrice }}</span>
          </div>
          
          <div class="submit-order">
            <el-button 
              type="primary" 
              size="large" 
              @click="submitOrder" 
              :loading="submitting"
              :disabled="!canSubmit"
            >
              提交订单
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiService from '@/services/apiService';
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const loading = ref(true);
const submitting = ref(false);
const showAddressForm = ref(false);

// 收货地址
const addresses = ref<any[]>([]);
const selectedAddressId = ref<number | null>(null);
const addressForm = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
});

// 从本地存储或API获取购物车数据
const selectedItems = ref<any[]>([]);
const paymentMethod = ref('wechat');

// 获取地址数据
const fetchAddresses = async () => {
  try {
    const data = await apiService.getAddressesData();
    addresses.value = data;
    
    // 如果有默认地址，选中它
    const defaultAddress = addresses.value.find(addr => addr.isDefault);
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress.id;
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id;
    }
  } catch (error) {
    console.error('获取地址数据失败', error);
    ElMessage.error('获取地址数据失败');
  }
};

// 获取购物车中选中的商品
const fetchCartItems = async () => {
  try {
    loading.value = true;
    const data = await apiService.getCartItems();
    if (data && data.items) {
      // 只获取选中的商品
      selectedItems.value = data.items.filter(item => item.selected);
    } else {
      selectedItems.value = [];
      ElMessage.warning('购物车中没有选中的商品');
      router.push('/cart');
    }
  } catch (error) {
    console.error('获取购物车数据失败', error);
    ElMessage.error('获取购物车数据失败');
  } finally {
    loading.value = false;
  }
};

// 保存新地址
const saveAddress = async () => {
  // 这里应该调用API保存地址，但目前只模拟添加到本地数组
  const newAddress = {
    id: Date.now(),
    ...addressForm
  };
  
  addresses.value.push(newAddress);
  selectedAddressId.value = newAddress.id;
  showAddressForm.value = false;
  
  // 重置表单
  Object.keys(addressForm).forEach(key => {
    addressForm[key] = key === 'isDefault' ? false : '';
  });
  
  ElMessage.success('地址添加成功');
};

// 计算商品小计
const calculateSubtotal = (item) => {
  const price = parseFloat(item.price.replace('¥', ''));
  return `¥${(price * item.quantity).toFixed(2)}`;
};

// 商品总价
const totalPrice = computed(() => {
  let total = 0;
  selectedItems.value.forEach(item => {
    total += parseFloat(item.price.replace('¥', '')) * item.quantity;
  });
  return `¥${total.toFixed(2)}`;
});

// 优惠金额
const discountAmount = computed(() => {
  let discount = 0;
  selectedItems.value.forEach(item => {
    if (item.originalPrice) {
      const originalPrice = parseFloat(item.originalPrice.replace('¥', ''));
      const currentPrice = parseFloat(item.price.replace('¥', ''));
      discount += (originalPrice - currentPrice) * item.quantity;
    }
  });
  return `¥${discount.toFixed(2)}`;
});

// 最终金额
const finalPrice = computed(() => {
  const total = parseFloat(totalPrice.value.replace('¥', ''));
  const discount = parseFloat(discountAmount.value.replace('¥', ''));
  return `¥${(total).toFixed(2)}`;
});

// 是否可以提交订单
const canSubmit = computed(() => {
  return selectedItems.value.length > 0 && selectedAddressId.value !== null;
});

// 提交订单
const submitOrder = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址');
    return;
  }
  
  if (selectedItems.value.length === 0) {
    ElMessage.warning('没有选中的商品');
    return;
  }
  
  try {
    submitting.value = true;
    
    // 准备订单数据
    const selectedAddress = addresses.value.find(addr => addr.id === selectedAddressId.value);
    
    const orderData = {
      address: selectedAddress,
      items: selectedItems.value,
      totalAmount: finalPrice.value,
      paymentMethod: paymentMethod.value
    };
    
    // 调用API创建订单
    const result = await apiService.createOrder(orderData);
    
    if (result && result.id) {
      ElMessage.success('订单创建成功，即将跳转到支付页面');
      
      // 跳转到支付页面
      router.push(`/payment/${result.id}`);
    } else {
      ElMessage.error('订单创建失败');
    }
  } catch (error) {
    console.error('提交订单失败', error);
    ElMessage.error('提交订单失败，请重试');
  } finally {
    submitting.value = false;
  }
};

// 初始化
onMounted(async () => {
  // 并行获取数据
  await Promise.all([fetchAddresses(), fetchCartItems()]);
});
</script>

<style lang="scss" scoped>
.checkout-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
  
  h1 {
    font-size: 24px;
    margin: 0;
  }
}

.checkout-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.checkout-steps {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.section {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  
  &:last-child {
    border-bottom: none;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h2 {
    font-size: 18px;
    margin: 0;
    font-weight: 500;
  }
}

/* 地址样式 */
.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.address-card {
  width: calc(50% - 8px);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
  }
  
  &.active {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
  }
}

.address-content {
  display: flex;
  justify-content: space-between;
}

.address-info {
  flex: 1;
}

.name-phone {
  margin-bottom: 10px;
  
  .name {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .phone {
    color: #606266;
  }
}

.address-detail {
  color: #606266;
  line-height: 1.5;
}

/* 支付方式样式 */
.payment-methods {
  display: flex;
  gap: 20px;
}

.payment-method {
  width: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
  }
  
  &.active {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
  }
}

.payment-logo {
  margin-right: 10px;
  
  img {
    width: 32px;
    height: 32px;
  }
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.payment-desc {
  font-size: 12px;
  color: #909399;
}

/* 商品列表样式 */
.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  margin: 0 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-attributes {
  margin: 0;
  font-size: 12px;
  color: #606266;
  
  span {
    margin-right: 10px;
  }
}

.price-info {
  .current-price {
    color: #f56c6c;
    margin-bottom: 5px;
  }
  
  .original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 12px;
  }
}

.subtotal {
  color: #f56c6c;
  font-weight: bold;
}

/* 订单摘要样式 */
.order-summary {
  margin-left: auto;
  width: 300px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &.total {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ebeef5;
    font-weight: bold;
  }
  
  .discount {
    color: #f56c6c;
  }
  
  .final-price {
    color: #f56c6c;
    font-size: 20px;
  }
}

.submit-order {
  margin-top: 20px;
  text-align: right;
}
</style>