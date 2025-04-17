import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import { useUserStore } from '../stores/user'

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/ProductsPage.vue'),
    meta: {
      title: '全部商品'
    }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: () => import('../pages/PromotionsPage.vue'),
    meta: {
      title: '优惠活动'
    }
  },
  {
    path: '/new',
    name: 'NewArrivals',
    component: () => import('../pages/NewArrivalsPage.vue'),
    meta: {
      title: '新品上市'
    }
  },
  // 添加产品详情页路由
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../pages/ProductDetailPage.vue'),
    meta: {
      title: '商品详情'
    }
  },
  // 添加购物车页面路由
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/CartPage.vue'),
    meta: {
      title: '购物车'
    }
  },
  // 添加结账页面路由
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../pages/CheckoutPage.vue'),
    meta: {
      title: '订单确认',
      requiresAuth: true
    }
  },
  // 添加支付页面路由
  {
    path: '/payment/:orderId',
    name: 'Payment',
    component: () => import('../pages/PaymentPage.vue'),
    meta: {
      title: '订单支付',
      requiresAuth: true
    }
  },
  // 添加支付结果页面路由
  {
    path: '/payment-result/:orderId',
    name: 'PaymentResult',
    component: () => import('../pages/PaymentResultPage.vue'),
    meta: {
      title: '支付结果',
      requiresAuth: true
    }
  },
  // 添加个人中心页面路由
  {
    path: '/user',
    name: 'UserProfile',
    component: () => import('../pages/UserProfilePage.vue'),
    meta: {
      title: '个人中心'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 我的商城`
  }

  // 添加路由认证检查
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 使用userStore而不是直接从localStorage获取
    const userStore = useUserStore()
    
    if (!userStore.isAuthenticated) {
      // 如果没有登录，重定向到登录页
      next({
        path: '/user',
        query: { redirect: to.fullPath }
      })
    } else {
      // 验证token有效性
      try {
        const valid = await userStore.validateToken()
        if (valid) {
          next()
        } else {
          next({
            path: '/user',
            query: { redirect: to.fullPath }
          })
        }
      } catch (error) {
        next({
          path: '/user',
          query: { redirect: to.fullPath }
        })
      }
    }
  } else {
    next()
  }
})

export default router
