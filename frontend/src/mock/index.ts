// 模拟数据入口文件
import Mock from 'mockjs'
import './data/home'
import './data/products'
import './data/user'
import './data/cart'
import './data/orders'
import './data/promotions'
import './data/newArrivals'
import './data/carousel'
import './data/favorites'
import './data/addresses'

interface MockSetupOptions {
  timeout: string | number;
  responseTime?: number;
}

// 配置拦截响应时间
Mock.setup({
  timeout: '200-600' // 模拟网络请求延迟
} as MockSetupOptions)

console.log('MockJS初始化成功')

export default Mock