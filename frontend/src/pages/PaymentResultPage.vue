<template>
  <div class="payment-result-page">
    <div class="result-container">
      <!-- 步骤条 -->
      <div class="result-steps">
        <el-steps :active="3" finish-status="success" simple>
          <el-step title="确认订单"></el-step>
          <el-step title="支付订单"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      
      <div class="result-content" v-loading="loading">
        <!-- 支付成功 -->
        <template v-if="paymentStatus === 'success'">
          <div class="result-icon success">
            <el-icon :size="64"><CircleCheckFilled /></el-icon>
          </div>
          <div class="result-title">支付成功</div>
          <div class="result-info">
            <p>订单号：{{ orderId }}</p>
            <p>支付金额：<span class="amount">{{ order.totalAmount || '¥0.00' }}</span></p>
            <p>支付方式：{{ getPaymentMethodText(order.paymentMethod) }}</p>
            <p>支付时间：{{ formatTime(order.paymentTime) }}</p>
          </div>
        </template>
        
        <!-- 支付取消 -->
        <template v-else-if="paymentStatus === 'cancel'">
          <div class="result-icon cancel">
            <el-icon :size="64"><CircleCloseFilled /></el-icon>
          </div>
          <div class="result-title">订单已取消</div>
          <div class="result-info">
            <p>订单号：{{ orderId }}</p>
            <p>订单金额：<span>{{ order.totalAmount || '¥0.00' }}</span></p>
            <p>您可以重新下单或查看其他商品</p>
          </div>
        </template>
        
        <!-- 支付超时 -->
        <template v-else-if="paymentStatus === 'timeout'">
          <div class="result-icon timeout">
            <el-icon :size="64"><WarnTriangleFilled /></el-icon>
          </div>
          <div class="result-title">支付超时</div>
          <div class="result-info">
            <p>订单号：{{ orderId }}</p>
            <p>订单金额：<span>{{ order.totalAmount || '¥0.00' }}</span></p>
            <p>您可以重新下单或查看其他商品</p>
          </div>
        </template>
        
        <!-- 默认状态（处理中或失败） -->
        <template v-else>
          <div class="result-icon pending">
            <el-icon :size="64"><MoreFilled /></el-icon>
          </div>
          <div class="result-title">处理中</div>
          <div class="result-info">
            <p>订单号：{{ orderId }}</p>
            <p>订单金额：<span>{{ order.totalAmount || '¥0.00' }}</span></p>
            <p>订单正在处理中，请稍后查看</p>
          </div>
        </template>
        
        <!-- 操作按钮 -->
        <div class="result-actions">
          <el-button type="primary" @click="viewOrder">查看订单</el-button>
          <el-button @click="continueShopping">继续购物</el-button>
        </div>
        
        <!-- 推荐商品 -->
        <div class="recommend-section" v-if="recommendedProducts.length > 0">
          <h3 class="recommend-title">为您推荐</h3>
          <div class="recommend-list">
            <el-row :gutter="20">
              <el-col 
                :xs="12"
                :sm="8"
                :md="6"
                v-for="product in recommendedProducts" 
                :key="product.id"
              >
                <div class="product-card" @click="goToProduct(product.id)">
                  <div class="product-image">
                    <el-image :src="product.image" fit="cover"></el-image>
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">{{ product.price }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiService from '@/services/apiService';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { CircleCheckFilled, CircleCloseFilled, WarnTriangleFilled, MoreFilled } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);

// 订单信息
const order = ref<any>({});
const orderId = computed(() => route.params.orderId as string);
const paymentStatus = computed(() => route.query.status || '');

// 推荐商品
const recommendedProducts = ref<any[]>([]);

// 获取订单信息
const fetchOrderInfo = async () => {
  try {
    loading.value = true;
    // 获取订单详情
    const orderData = await apiService.getOrderById(orderId.value);
    if (orderData) {
      order.value = orderData;
      
      // 如果是成功状态，设置支付时间
      if (paymentStatus.value === 'success' && !order.value.paymentTime) {
        order.value.paymentTime = new Date().toISOString();
      }
    }
    
    // 获取推荐商品
    const recommended = await apiService.getRecommendedProducts();
    if (Array.isArray(recommended)) {
      recommendedProducts.value = recommended.slice(0, 4);
    }
  } catch (error) {
    console.error('获取数据失败', error);
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 获取支付方式文本
const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'wechat':
      return '微信支付';
    case 'alipay':
      return '支付宝';
    default:
      return '在线支付';
  }
};

// 格式化时间
const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  try {
    const date = new Date(timeString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  } catch (e) {
    return timeString;
  }
};

// 查看订单详情
const viewOrder = () => {
  router.push('/user');
};

// 继续购物
const continueShopping = () => {
  router.push('/products');
};

// 跳转到商品详情
const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};

// 初始化
onMounted(() => {
  fetchOrderInfo();
});
</script>

<style lang="scss" scoped>
.payment-result-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.result-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.result-steps {
  padding-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 30px;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.result-icon {
  margin-bottom: 20px;
  
  &.success {
    color: #67c23a;
  }
  
  &.cancel, &.timeout {
    color: #f56c6c;
  }
  
  &.pending {
    color: #e6a23c;
  }
}

.result-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
}

.result-info {
  text-align: center;
  margin-bottom: 30px;
  
  p {
    margin: 10px 0;
    color: #606266;
    
    .amount {
      color: #f56c6c;
      font-weight: bold;
    }
  }
}

.result-actions {
  margin-bottom: 40px;
  
  .el-button {
    min-width: 120px;
    margin: 0 10px;
  }
}

.recommend-section {
  width: 100%;
  border-top: 1px solid #ebeef5;
  padding-top: 30px;
}

.recommend-title {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.recommend-list {
  padding: 0 10px;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  .product-image {
    height: 200px;
    
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .product-info {
    padding: 10px;
    
    .product-name {
      font-size: 14px;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .product-price {
      color: #f56c6c;
      font-weight: bold;
    }
  }
}
</style>