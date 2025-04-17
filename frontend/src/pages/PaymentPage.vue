<template>
  <div class="payment-page">
    <div class="page-header">
      <h1>订单支付</h1>
    </div>
    
    <div class="payment-container" v-loading="loading">
      <!-- 步骤条 -->
      <div class="payment-steps">
        <el-steps :active="2" finish-status="success" simple>
          <el-step title="确认订单"></el-step>
          <el-step title="支付订单"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      
      <template v-if="!loading && order">
        <!-- 订单信息 -->
        <div class="section order-info-section">
          <div class="order-info">
            <div class="order-id">订单编号：{{ order.id }}</div>
            <div class="order-amount">应付金额：<span class="amount">{{ order.totalAmount }}</span></div>
            <div class="order-time">下单时间：{{ formatTime(order.date) }}</div>
          </div>
        </div>
        
        <!-- 支付二维码 -->
        <div class="section qrcode-section">
          <div class="qrcode-container">
            <h2>{{ paymentInfo.paymentMethod === 'wechat' ? '微信' : '支付宝' }}扫码支付</h2>
            <div class="qrcode">
              <el-image :src="paymentInfo.qrCode" fit="contain"></el-image>
            </div>
            <div class="qrcode-tip">
              <p>请使用{{ paymentInfo.paymentMethod === 'wechat' ? '微信' : '支付宝' }}扫一扫</p>
              <p>扫描二维码支付</p>
            </div>
            
            <!-- 订单超时倒计时 -->
            <div class="countdown">
              <p>支付剩余时间：{{ countdown }}</p>
            </div>
            
            <!-- 支付结果按钮 -->
            <div class="payment-actions">
              <el-button @click="checkPaymentStatus">我已支付</el-button>
              <el-button @click="cancelOrder">取消订单</el-button>
              <el-button @click="changePaymentMethod">更换支付方式</el-button>
            </div>
          </div>
        </div>
        
        <!-- 更换支付方式对话框 -->
        <el-dialog v-model="changePaymentMethodVisible" title="选择支付方式" width="400px">
          <div class="payment-method-options">
            <div 
              class="payment-method-option"
              :class="{ 'active': selectedPaymentMethod === 'wechat' }"
              @click="selectedPaymentMethod = 'wechat'"
            >
              <img src="https://picsum.photos/id/87/48/48" alt="微信支付">
              <span>微信支付</span>
            </div>
            <div 
              class="payment-method-option"
              :class="{ 'active': selectedPaymentMethod === 'alipay' }"
              @click="selectedPaymentMethod = 'alipay'"
            >
              <img src="https://picsum.photos/id/89/48/48" alt="支付宝">
              <span>支付宝</span>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="changePaymentMethodVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmChangePaymentMethod">确认</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 测试用：模拟支付成功按钮 -->
        <div class="mock-payment-success" v-if="import.meta.env.DEV">
          <el-button 
            type="success" 
            @click="mockPaymentSuccess" 
            :disabled="checkingPayment"
          >
            (测试用)模拟支付成功
          </el-button>
        </div>
      </template>
      
      <div v-else-if="!loading && !order" class="error-message">
        <el-empty description="未找到订单信息">
          <el-button @click="goToOrders">返回订单列表</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiService from '@/services/apiService';
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const checkingPayment = ref(false);

// 订单信息
const order = ref<any>(null);
const orderId = computed(() => route.params.orderId as string);

// 支付相关
const paymentInfo = ref<any>({
  paymentId: '',
  paymentMethod: 'wechat',
  qrCode: ''
});
const changePaymentMethodVisible = ref(false);
const selectedPaymentMethod = ref('wechat');

// 倒计时
const countdown = ref('14:59');
let countdownTimer: number | null = null;
let checkStatusTimer: number | null = null;

// 获取订单信息
const fetchOrderInfo = async () => {
  try {
    loading.value = true;
    const result = await apiService.getOrderById(orderId.value);
    if (result && result.id) {
      order.value = result;
      // 发起支付请求
      await initiatePayment(order.value.paymentMethod || 'wechat');
    } else {
      ElMessage.error('获取订单信息失败');
    }
  } catch (error) {
    console.error('获取订单信息失败', error);
    ElMessage.error('获取订单信息失败');
  } finally {
    loading.value = false;
  }
};

// 发起支付请求
const initiatePayment = async (method: string) => {
  try {
    const result = await apiService.initiatePayment(orderId.value, method);
    if (result && result.paymentId) {
      paymentInfo.value = result;
      // 启动支付状态检查
      startPaymentStatusCheck();
      // 启动倒计时
      startCountdown();
    } else {
      ElMessage.error('发起支付请求失败');
    }
  } catch (error) {
    console.error('发起支付请求失败', error);
    ElMessage.error('发起支付请求失败');
  }
};

// 手动检查支付状态
const checkPaymentStatus = async () => {
  if (!paymentInfo.value.paymentId) {
    ElMessage.warning('支付尚未初始化');
    return;
  }
  
  try {
    checkingPayment.value = true;
    await checkPayment();
  } finally {
    checkingPayment.value = false;
  }
};

// 检查支付状态
const checkPayment = async () => {
  try {
    const result = await apiService.checkPaymentStatus(paymentInfo.value.paymentId);
    if (result && result.status === 'success') {
      // 支付成功，跳转到结果页面
      clearTimers();
      ElMessage.success('支付成功，正在跳转到支付结果页');
      router.push(`/payment-result/${orderId.value}?status=success`);
    }
  } catch (error) {
    console.error('检查支付状态失败', error);
  }
};

// 测试用：模拟支付成功
const mockPaymentSuccess = async () => {
  try {
    checkingPayment.value = true;
    const result = await apiService.mockCompletePayment(paymentInfo.value.paymentId);
    if (result && result.status === 'success') {
      clearTimers();
      ElMessage.success('支付成功，正在跳转到支付结果页');
      router.push(`/payment-result/${orderId.value}?status=success`);
    }
  } catch (error) {
    console.error('模拟支付失败', error);
    ElMessage.error('模拟支付失败');
  } finally {
    checkingPayment.value = false;
  }
};

// 取消订单
const cancelOrder = () => {
  ElMessageBox.confirm(
    '确定要取消此订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    clearTimers();
    ElMessage.info('订单已取消');
    router.push(`/payment-result/${orderId.value}?status=cancel`);
  }).catch(() => {
    // 用户取消操作
  });
};

// 更换支付方式
const changePaymentMethod = () => {
  selectedPaymentMethod.value = paymentInfo.value.paymentMethod || 'wechat';
  changePaymentMethodVisible.value = true;
};

// 确认更换支付方式
const confirmChangePaymentMethod = async () => {
  if (selectedPaymentMethod.value === paymentInfo.value.paymentMethod) {
    changePaymentMethodVisible.value = false;
    return;
  }
  
  changePaymentMethodVisible.value = false;
  clearTimers();
  
  // 重新发起支付
  await initiatePayment(selectedPaymentMethod.value);
  ElMessage.success('支付方式已更新');
};

// 返回订单列表
const goToOrders = () => {
  router.push('/user');
};

// 启动支付状态检查定时器
const startPaymentStatusCheck = () => {
  // 清除旧的定时器
  if (checkStatusTimer !== null) {
    clearInterval(checkStatusTimer);
  }
  
  // 每5秒检查一次支付状态
  checkStatusTimer = window.setInterval(checkPayment, 5000);
};

// 启动倒计时
const startCountdown = () => {
  // 清除旧的定时器
  if (countdownTimer !== null) {
    clearInterval(countdownTimer);
  }
  
  // 设置倒计时时间（15分钟）
  let totalSeconds = 15 * 60;
  
  // 更新倒计时显示
  const updateCountdown = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    countdown.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (totalSeconds <= 0) {
      clearTimers();
      ElMessage.warning('支付超时，订单已取消');
      router.push(`/payment-result/${orderId.value}?status=timeout`);
    }
    
    totalSeconds--;
  };
  
  // 初始化倒计时显示
  updateCountdown();
  
  // 每秒更新一次倒计时
  countdownTimer = window.setInterval(updateCountdown, 1000);
};

// 清除所有定时器
const clearTimers = () => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  
  if (checkStatusTimer !== null) {
    clearInterval(checkStatusTimer);
    checkStatusTimer = null;
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

// 初始化
onMounted(() => {
  fetchOrderInfo();
});

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style lang="scss" scoped>
.payment-page {
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

.payment-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.payment-steps {
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

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 30px;
  
  .order-id, .order-time {
    color: #606266;
  }
  
  .order-amount {
    .amount {
      color: #f56c6c;
      font-weight: bold;
      font-size: 18px;
    }
  }
}

.qrcode-section {
  display: flex;
  justify-content: center;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  
  h2 {
    margin: 0 0 20px 0;
    font-weight: 500;
  }
  
  .qrcode {
    width: 200px;
    height: 200px;
    border: 1px solid #ebeef5;
    padding: 10px;
  }
  
  .qrcode-tip {
    margin-top: 15px;
    text-align: center;
    
    p {
      margin: 5px 0;
      color: #606266;
    }
  }
  
  .countdown {
    margin-top: 15px;
    font-size: 14px;
    color: #f56c6c;
  }
  
  .payment-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}

.mock-payment-success {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px dashed #ebeef5;
}

.payment-method-options {
  display: flex;
  justify-content: space-around;
  
  .payment-method-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    width: 120px;
    
    &:hover {
      border-color: #409eff;
    }
    
    &.active {
      border-color: #409eff;
      box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
    }
    
    img {
      width: 32px;
      height: 32px;
      margin-bottom: 10px;
    }
  }
}
</style>