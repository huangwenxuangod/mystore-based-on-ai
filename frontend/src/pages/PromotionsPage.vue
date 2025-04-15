<template>
  <div class="promotions-page">
    <div class="page-header">
      <h1>优惠活动</h1>
      <p class="page-description">发现当前正在进行的限时特惠</p>
    </div>

    <!-- 主打活动 Banner -->
    <div class="main-promotion">
      <el-carousel height="400px">
        <el-carousel-item v-for="banner in mainBanners" :key="banner.id">
          <div class="promotion-banner" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="danger" size="large" @click="goToPromotion(banner.link)">立即查看</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 限时特惠 -->
    <div class="promotion-section flash-sale">
      <div class="section-header">
        <div class="section-title">
          <el-icon><Timer /></el-icon>
          <h2>限时特惠</h2>
        </div>
        <div class="countdown">
          <span>剩余时间:</span>
          <div class="timer">
            <div class="time-block">{{ countdown.hours }}</div>
            <span>:</span>
            <div class="time-block">{{ countdown.minutes }}</div>
            <span>:</span>
            <div class="time-block">{{ countdown.seconds }}</div>
          </div>
        </div>
      </div>

      <div class="products-grid">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" v-for="product in flashSaleProducts" :key="product.id">
            <router-link :to="`/product/${product.id}`" class="product-link">
              <div class="product-card">
                <div class="product-image-container">
                  <el-image :src="product.image" class="product-image" fit="cover" />
                  <span class="discount-tag">{{ product.discount }}% OFF</span>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-price">
                    <div class="current-price">{{ product.price }}</div>
                    <div class="original-price">{{ product.originalPrice }}</div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-text">已售 {{ product.soldPercentage }}%</div>
                    <el-progress :percentage="product.soldPercentage" :show-text="false" status="exception" />
                  </div>
                </div>
              </div>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 优惠券区域 -->
    <div class="promotion-section coupons">
      <div class="section-header">
        <div class="section-title">
          <el-icon><Ticket /></el-icon>
          <h2>优惠券</h2>
        </div>
        <router-link to="/coupons" class="view-all">查看全部</router-link>
      </div>

      <div class="coupons-grid">
        <div v-for="coupon in coupons" :key="coupon.id" class="coupon-card">
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">满{{ coupon.minSpend }}元可用</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-time">{{ coupon.validUntil }}</div>
            <div class="coupon-type">{{ coupon.scope }}</div>
            <el-button type="danger" size="small" @click="claimCoupon(coupon.id)">
              立即领取
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动专区 -->
    <div class="promotion-section promo-categories">
      <div class="section-header">
        <div class="section-title">
          <el-icon><Present /></el-icon>
          <h2>活动专区</h2>
        </div>
      </div>

      <div class="category-cards">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="category in promoCategories" :key="category.id">
            <div class="promo-category-card" @click="goToPromotion(category.link)">
              <div class="category-image-container">
                <el-image :src="category.image" fit="cover" class="category-image" />
              </div>
              <div class="category-info">
                <h3>{{ category.name }}</h3>
                <p>{{ category.description }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 会员专享 -->
    <div class="promotion-section member-benefits">
      <div class="section-header">
        <div class="section-title">
          <el-icon><UserFilled /></el-icon>
          <h2>会员专享</h2>
        </div>
        <el-button type="text" @click="goToMemberCenter">了解会员权益 <el-icon><ArrowRight /></el-icon></el-button>
      </div>

      <div class="member-benefits-content">
        <div class="member-banner">
          <div class="member-info">
            <h3>成为会员，享受更多特权</h3>
            <ul class="benefit-list">
              <li><el-icon><Check /></el-icon> 专属优惠折扣</li>
              <li><el-icon><Check /></el-icon> 生日特别礼遇</li>
              <li><el-icon><Check /></el-icon> 专属客服通道</li>
              <li><el-icon><Check /></el-icon> 提前购新品</li>
            </ul>
            <el-button type="warning">立即加入会员</el-button>
          </div>
          <div class="member-image">
            <el-image src="https://picsum.photos/id/60/500/300" fit="cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Timer, Ticket, Present, UserFilled, 
  ArrowRight, Check 
} from '@element-plus/icons-vue'

const router = useRouter()

// 倒计时数据
const countdown = reactive({
  hours: '00',
  minutes: '00',
  seconds: '00'
})

// 主Banner数据
const mainBanners = ref([
  {
    id: 1,
    title: '年中大促',
    description: '全场商品低至5折，限时抢购',
    image: 'https://picsum.photos/id/40/1200/400',
    link: '/products?promotion=mid-year'
  },
  {
    id: 2,
    title: '新品首发',
    description: '新款智能手表上市，预购享优惠',
    image: 'https://picsum.photos/id/41/1200/400',
    link: '/products?category=wearables'
  },
  {
    id: 3,
    title: '品牌特惠',
    description: '精选品牌联合促销，满减优惠',
    image: 'https://picsum.photos/id/42/1200/400',
    link: '/products?brand=brand1'
  }
])

// 限时特惠产品
const flashSaleProducts = ref([
  {
    id: 1,
    name: '智能手表Pro',
    price: '¥999',
    originalPrice: '¥1999',
    discount: 50,
    image: 'https://picsum.photos/id/50/300/300',
    soldPercentage: 85
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: '¥199',
    originalPrice: '¥399',
    discount: 50,
    image: 'https://picsum.photos/id/51/300/300',
    soldPercentage: 76
  },
  {
    id: 3,
    name: '高清投影仪',
    price: '¥2999',
    originalPrice: '¥3999',
    discount: 25,
    image: 'https://picsum.photos/id/52/300/300',
    soldPercentage: 45
  },
  {
    id: 4,
    name: '便携式音箱',
    price: '¥299',
    originalPrice: '¥499',
    discount: 40,
    image: 'https://picsum.photos/id/53/300/300',
    soldPercentage: 92
  }
])

// 优惠券数据
const coupons = ref([
  {
    id: 1,
    name: '全品类通用券',
    amount: 50,
    minSpend: 500,
    validUntil: '2025-06-30前有效',
    scope: '全场通用',
    status: 'available'
  },
  {
    id: 2,
    name: '电子产品专用券',
    amount: 100,
    minSpend: 1000,
    validUntil: '2025-05-31前有效',
    scope: '限电子产品品类',
    status: 'available'
  },
  {
    id: 3,
    name: '新人专享券',
    amount: 20,
    minSpend: 100,
    validUntil: '领取后7天内有效',
    scope: '新用户首单专享',
    status: 'available'
  },
  {
    id: 4,
    name: '会员生日券',
    amount: 200,
    minSpend: 1000,
    validUntil: '生日当月有效',
    scope: '会员专享',
    status: 'available'
  }
])

// 活动专区数据
const promoCategories = ref([
  {
    id: 1,
    name: '手机数码',
    description: '精选数码产品，限时特惠',
    image: 'https://picsum.photos/id/54/300/200',
    link: '/products?category=electronics'
  },
  {
    id: 2,
    name: '智能家居',
    description: '打造智能生活，品质之选',
    image: 'https://picsum.photos/id/55/300/200',
    link: '/products?category=smart-home'
  },
  {
    id: 3,
    name: '服饰鞋包',
    description: '时尚穿搭，潮流单品',
    image: 'https://picsum.photos/id/56/300/200',
    link: '/products?category=fashion'
  },
  {
    id: 4,
    name: '美妆个护',
    description: '焕发魅力，气质出众',
    image: 'https://picsum.photos/id/57/300/200',
    link: '/products?category=beauty'
  }
])

// 倒计时计算
let timer: number | null = null
const calculateCountdown = () => {
  // 设置倒计时结束时间
  const endDate = new Date('2025-05-01T00:00:00')
  const now = new Date()
  
  // 计算剩余时间（毫秒）
  let diff = endDate.getTime() - now.getTime()
  
  // 如果倒计时已结束，则显示00:00:00
  if (diff <= 0) {
    countdown.hours = '00'
    countdown.minutes = '00'
    countdown.seconds = '00'
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    return
  }
  
  // 计算时分秒
  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * 1000 * 60 * 60
  
  const minutes = Math.floor(diff / (1000 * 60))
  diff -= minutes * 1000 * 60
  
  const seconds = Math.floor(diff / 1000)
  
  // 格式化为两位数
  countdown.hours = hours < 10 ? `0${hours}` : `${hours}`
  countdown.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  countdown.seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
}

// 领取优惠券
const claimCoupon = (couponId: number) => {
  // 实际项目中应该调用API领取优惠券
  console.log(`领取优惠券ID: ${couponId}`)
  // 提示用户已领取
  window.$message?.success('优惠券领取成功')
}

// 跳转到促销页面
const goToPromotion = (link: string) => {
  router.push(link)
}

// 跳转到会员中心
const goToMemberCenter = () => {
  router.push('/member-center')
}

// 页面加载时初始化倒计时
onMounted(() => {
  calculateCountdown()
  timer = setInterval(calculateCountdown, 1000) as unknown as number
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.promotions-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
  
  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .page-description {
    color: #666;
    font-size: 16px;
  }
}

.main-promotion {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.promotion-banner {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  }
  
  .banner-content {
    position: relative;
    color: #fff;
    padding: 0 40px;
    max-width: 500px;
    
    h2 {
      font-size: 36px;
      margin-bottom: 15px;
    }
    
    p {
      font-size: 18px;
      margin-bottom: 25px;
    }
  }
}

.promotion-section {
  margin-bottom: 50px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      display: flex;
      align-items: center;
      
      .el-icon {
        font-size: 24px;
        color: var(--el-color-primary);
        margin-right: 10px;
      }
      
      h2 {
        font-size: 24px;
        margin: 0;
      }
    }
    
    .view-all {
      color: var(--el-color-primary);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.flash-sale {
  .countdown {
    display: flex;
    align-items: center;
    
    span {
      margin-right: 10px;
      font-size: 16px;
    }
    
    .timer {
      display: flex;
      align-items: center;
      
      .time-block {
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        font-weight: bold;
        min-width: 34px;
        text-align: center;
        font-size: 18px;
      }
      
      span {
        margin: 0 5px;
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}

.products-grid {
  .product-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    margin-bottom: 20px;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
  }
}

.product-link {
  text-decoration: none;
  color: inherit;
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .discount-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ff6b6b;
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
  }
}

.product-info {
  padding: 15px;
  
  .product-name {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-price {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .current-price {
      color: #ff6b6b;
      font-weight: 600;
      font-size: 18px;
    }
    
    .original-price {
      color: #999;
      font-size: 14px;
      margin-left: 10px;
      text-decoration: line-through;
    }
  }
  
  .progress-container {
    .progress-text {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
  }
}

.coupons-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  .coupon-card {
    display: flex;
    width: calc(50% - 10px);
    height: 120px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 25%;
      width: 1px;
      background: radial-gradient(circle, #ddd 0, #ddd 2px, transparent 2px);
      background-size: 1px 10px;
      background-repeat: repeat-y;
    }
    
    .coupon-left {
      width: 25%;
      background: linear-gradient(135deg, var(--el-color-danger) 0%, #ff9b9b 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .coupon-amount {
        font-size: 24px;
        font-weight: bold;
        
        .currency {
          font-size: 16px;
          vertical-align: super;
        }
      }
      
      .coupon-condition {
        font-size: 12px;
        margin-top: 5px;
      }
    }
    
    .coupon-right {
      width: 75%;
      padding: 15px 20px;
      display: flex;
      flex-direction: column;
      
      .coupon-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .coupon-time,
      .coupon-type {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .el-button {
        margin-top: auto;
        align-self: flex-end;
      }
    }
  }
}

.promo-category-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  .category-image-container {
    height: 160px;
    overflow: hidden;
    
    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .category-info {
    padding: 15px;
    
    h3 {
      font-size: 18px;
      margin-bottom: 5px;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.member-banner {
  display: flex;
  background: linear-gradient(to right, #fcaf17, #f7d770);
  border-radius: 8px;
  overflow: hidden;
  
  .member-info {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    
    h3 {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    
    .benefit-list {
      list-style: none;
      padding: 0;
      margin: 0 0 25px 0;
      
      li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .el-icon {
          margin-right: 10px;
          background: #fff;
          color: #fcaf17;
          border-radius: 50%;
          font-size: 16px;
        }
      }
    }
  }
  
  .member-image {
    flex: 1;
    overflow: hidden;
    
    .el-image {
      height: 100%;
      
      img {
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

@media (max-width: 992px) {
  .coupons-grid .coupon-card {
    width: 100%;
  }
  
  .member-banner {
    flex-direction: column;
    
    .member-image {
      height: 200px;
    }
  }
}

@media (max-width: 768px) {
  .flash-sale .countdown {
    flex-direction: column;
    align-items: flex-start;
    
    span {
      margin-bottom: 5px;
    }
  }
  
  .promotion-banner .banner-content {
    padding: 0 20px;
    
    h2 {
      font-size: 28px;
    }
    
    p {
      font-size: 16px;
    }
  }
}
</style>
