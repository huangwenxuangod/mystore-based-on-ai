<template>
  <div class="promotions-page">
    <div class="page-header">
      <h1>促销活动</h1>
      <p>了解最新促销信息，抢购限时特价商品</p>
    </div>
    
    <!-- 促销Banner -->
    <div class="promo-banners" v-loading="loading">
      <el-carousel :interval="5000" height="300px" arrow="always">
        <el-carousel-item v-for="banner in promotionsData.banners" :key="banner.id">
          <div class="banner-content" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
            <div class="banner-info">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="primary">查看详情</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 限时抢购 -->
    <div class="section flash-deals" v-loading="loading">
      <div class="section-header">
        <h2>限时抢购</h2>
        <div class="countdown">
          <span>距结束还剩: </span>
          <strong>{{ countdown.hours }}</strong> 时
          <strong>{{ countdown.minutes }}</strong> 分
          <strong>{{ countdown.seconds }}</strong> 秒
        </div>
      </div>
      
      <div class="products-grid">
        <div v-for="product in promotionsData.flashSales" :key="product.id" class="product-card">
          <div class="product-image">
            <el-image :src="product.image" fit="cover"></el-image>
            <div class="discount-badge">
              -{{ product.discount }}%
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">{{ product.price }}</span>
              <span class="original-price">{{ product.originalPrice }}</span>
            </div>
            <div class="sold-progress">
              <el-progress 
                :percentage="product.soldPercentage" 
                :stroke-width="8" 
                color="#ff6b6b"
              ></el-progress>
              <div class="sold-text">
                已售{{ product.soldPercentage }}%
              </div>
            </div>
            <el-button type="danger" size="large">立即抢购</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 优惠券领取 -->
    <div class="section coupons" v-loading="loading">
      <div class="section-header">
        <h2>优惠券中心</h2>
        <span class="more-link">查看全部 &gt;</span>
      </div>
      
      <div class="coupons-container">
        <div 
          v-for="coupon in promotionsData.coupons" 
          :key="coupon.id" 
          class="coupon-card"
          :class="{ 'unavailable': coupon.status !== 'available' }"
        >
          <div class="coupon-content">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="value">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-info">
              <h4>{{ coupon.name }}</h4>
              <p>满{{ coupon.minSpend }}元可用</p>
              <p class="coupon-scope">{{ coupon.scope }}</p>
              <p class="coupon-time">{{ coupon.validUntil }}</p>
            </div>
          </div>
          <div class="coupon-action">
            <el-button 
              :type="coupon.status === 'available' ? 'primary' : 'info'"
              :disabled="coupon.status !== 'available'"
              class="get-coupon-btn"
            >
              {{ coupon.status === 'available' ? '立即领取' : '已领取' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 专题活动 -->
    <div class="section special-promotions">
      <div class="section-header">
        <h2>专题活动</h2>
      </div>
      
      <div class="special-grid">
        <div class="special-item large">
          <div class="special-image">
            <el-image src="https://picsum.photos/id/1059/800/400" fit="cover"></el-image>
            <div class="special-overlay">
              <div class="special-content">
                <h3>年中大促</h3>
                <p>全场低至5折起，满减优惠多多</p>
                <el-button>查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="special-item">
          <div class="special-image">
            <el-image src="https://picsum.photos/id/1083/400/200" fit="cover"></el-image>
            <div class="special-overlay">
              <div class="special-content">
                <h3>新品发布会</h3>
                <p>新品提前预约，好礼送不停</p>
                <el-button>查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="special-item">
          <div class="special-image">
            <el-image src="https://picsum.photos/id/160/400/200" fit="cover"></el-image>
            <div class="special-overlay">
              <div class="special-content">
                <h3>限时秒杀</h3>
                <p>每天10点，抢购爆款商品</p>
                <el-button>查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import apiService from '@/services/apiService';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';

// 加载状态
const loading = ref(true);

// 促销数据
const promotionsData = reactive({
  banners: [],
  flashSales: [],
  coupons: []
});

// 倒计时
const countdown = reactive({
  hours: '00',
  minutes: '00',
  seconds: '00'
});

let countdownTimer: number | null = null;

// 获取促销数据
const fetchPromotionsData = async () => {
  try {
    loading.value = true;
    const data = await apiService.getPromotionsData();
    
    // 更新促销数据
    promotionsData.banners = data.banners || [];
    promotionsData.flashSales = data.flashSales || [];
    promotionsData.coupons = data.coupons || [];
    
  } catch (error) {
    console.error('获取促销数据失败', error);
    ElMessage.error('获取促销数据失败');
  } finally {
    loading.value = false;
  }
};

// 处理倒计时逻辑
const startCountdown = () => {
  // 设置倒计时结束时间（假设为每天晚上24点）
  const now = new Date();
  const endTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );
  
  const updateCountdown = () => {
    const now = new Date();
    const diff = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
    
    const hoursValue = Math.floor(diff / 3600);
    const minutesValue = Math.floor((diff % 3600) / 60);
    const secondsValue = diff % 60;
    
    countdown.hours = hoursValue < 10 ? `0${hoursValue}` : `${hoursValue}`;
    countdown.minutes = minutesValue < 10 ? `0${minutesValue}` : `${minutesValue}`;
    countdown.seconds = secondsValue < 10 ? `0${secondsValue}` : `${secondsValue}`;
  };
  
  updateCountdown();
  countdownTimer = window.setInterval(updateCountdown, 1000);
};

// 领取优惠券
const claimCoupon = (couponId: number) => {
  ElMessage.success('优惠券领取成功，已发放到您的账户');
};

onMounted(() => {
  fetchPromotionsData();
  startCountdown();
});

onBeforeUnmount(() => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped lang="scss">
.promotions-page {
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 16px;
  }
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 22px;
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
  
  .more-link {
    color: #409eff;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

/* 促销Banner样式 */
.promo-banners {
  margin-bottom: 30px;
  
  .banner-content {
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .banner-info {
    max-width: 50%;
    padding: 30px;
    opacity: 0.9;
    border-radius: 8px;
    margin-left: 50px;
    
    h2 {
      margin-top: 0;
      font-size: 24px;
    }
    
    p {
      margin-bottom: 20px;
    }
  }
}

/* 限时抢购样式 */
.flash-deals {
  .countdown {
    font-size: 16px;
    
    strong {
      display: inline-block;
      background-color: #ff6b6b;
      color: white;
      padding: 2px 6px;
      margin: 0 3px;
      border-radius: 4px;
      min-width: 28px;
      text-align: center;
    }
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background-color: white;
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .product-image {
      height: 200px;
      position: relative;
      
      .el-image {
        width: 100%;
        height: 100%;
      }
      
      .discount-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ff6b6b;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-weight: bold;
      }
    }
    
    .product-info {
      padding: 15px;
      
      h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .product-price {
        margin-bottom: 15px;
        
        .current-price {
          color: #ff6b6b;
          font-size: 22px;
          font-weight: bold;
          margin-right: 10px;
        }
        
        .original-price {
          color: #999;
          text-decoration: line-through;
        }
      }
      
      .sold-progress {
        margin-bottom: 15px;
        
        .sold-text {
          font-size: 12px;
          text-align: right;
          color: #666;
          margin-top: 5px;
        }
      }
      
      .el-button {
        width: 100%;
      }
    }
  }
}

/* 优惠券样式 */
.coupons {
  .coupons-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .coupon-card {
    display: flex;
    width: calc(25% - 15px);
    min-width: 250px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 25%;
      width: 1px;
      background: repeating-linear-gradient(#eee 0, #eee 5px, transparent 5px, transparent 10px);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 25%;
      width: 1px;
      background: repeating-linear-gradient(#eee 0, #eee 5px, transparent 5px, transparent 10px);
    }
    
    &.unavailable {
      opacity: 0.6;
      
      &::before, &::after {
        background: repeating-linear-gradient(#ccc 0, #ccc 5px, transparent 5px, transparent 10px);
      }
    }
    
    .coupon-content {
      flex-grow: 3;
      display: flex;
      padding: 15px;
      background-color: white;
      
      .coupon-amount {
        display: flex;
        align-items: center;
        padding-right: 15px;
        
        .currency {
          font-size: 18px;
          color: #ff6b6b;
          align-self: flex-start;
          margin-top: 5px;
        }
        
        .value {
          font-size: 36px;
          font-weight: bold;
          color: #ff6b6b;
        }
      }
      
      .coupon-info {
        flex-grow: 1;
        padding-left: 15px;
        
        h4 {
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        p {
          margin: 3px 0;
          color: #666;
          font-size: 14px;
        }
        
        .coupon-scope {
          font-size: 12px;
        }
        
        .coupon-time {
          color: #999;
          font-size: 12px;
        }
      }
    }
    
    .coupon-action {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background-color: #f9f9f9;
      
      .get-coupon-btn {
        width: 100%;
      }
    }
  }
}

/* 专题活动样式 */
.special-promotions {
  .special-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto auto;
    gap: 20px;
  }
  
  .special-item {
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    
    &.large {
      grid-column: span 2;
      grid-row: span 1;
    }
    
    .special-image {
      height: 100%;
      
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    
    .special-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 1;
      }
    }
    
    .special-content {
      text-align: center;
      color: white;
      padding: 20px;
      
      h3 {
        margin-top: 0;
        font-size: 24px;
      }
      
      p {
        margin-bottom: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .promo-banners {
    .banner-info {
      max-width: 80%;
      margin-left: 20px;
    }
  }
  
  .coupon-card {
    width: 100% !important;
  }
  
  .special-grid {
    grid-template-columns: 1fr !important;
    
    .special-item {
      &.large {
        grid-column: span 1;
      }
    }
  }
}
</style>
