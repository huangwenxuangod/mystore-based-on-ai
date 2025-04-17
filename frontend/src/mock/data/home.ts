import Mock from 'mockjs'
import type { CarouselItem } from './carousel';
import type { Product } from './promotions';

// 定义首页相关接口
export interface CategoryEntry {
  id: number | string;
  name: string;
  image: string;
  count?: number;
  parentId?: number | string;
  level?: number;
  children?: CategoryEntry[];
  icon?: string;
  bannerImage?: string;
  description?: string;
}

export interface GridMenu {
  id: number;
  title: string;
  icon: string;
  color: string;
  link: string;
  badge?: string;
  type?: string;
}

export interface RecommendSection {
  id: number;
  title: string;
  subTitle?: string;
  viewAll?: string;
  type: string;
  layoutType?: string;
  products: Product[];
  backgroundColor?: string;
  moreLink?: string;
}

export interface Topic {
  id: number;
  title: string;
  image: string;
  link: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  badge?: string;
}

export interface Brand {
  id: number | string;
  name: string;
  logo: string;
  description?: string;
  link?: string;
  backgroundColor?: string;
}

export interface HomeData {
  carousels: CarouselItem[];
  gridMenus: GridMenu[];
  hotCategories: CategoryEntry[];
  featuredProducts: Product[];
  recommendSections: RecommendSection[];
  trendingTopics: Topic[];
  popularBrands: Brand[];
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 获取首页数据
Mock.mock('/api/home', 'get', (): { data: HomeData; success: boolean } => {
  // 轮播图数据
  const carousels: CarouselItem[] = [
    {
      id: 1,
      image: 'https://picsum.photos/id/3/1200/400',
      title: '新品上市',
      description: '最新科技产品，限时优惠',
      link: '/promotions/new-arrivals',
      buttonText: '立即查看',
      position: 'left',
      tag: '新品'
    },
    {
      id: 2,
      image: 'https://picsum.photos/id/4/1200/400',
      title: '限时特惠',
      description: '全场商品8折起',
      link: '/promotions/flash-sales',
      buttonText: '抢购',
      position: 'center',
      tag: '热卖'
    },
    {
      id: 3,
      image: 'https://picsum.photos/id/5/1200/400',
      title: '春季新品',
      description: '春季新品发布会，抢先体验',
      link: '/categories/spring-collection',
      buttonText: '查看系列',
      position: 'right'
    }
  ];
  
  // 主菜单数据
  const gridMenus: GridMenu[] = [
    { id: 1, title: '新品上市', icon: 'icon-new', color: '#FF6B6B', link: '/new-arrivals', badge: '新品' },
    { id: 2, title: '限时特惠', icon: 'icon-flash', color: '#4ECDC4', link: '/promotions', badge: '折扣' },
    { id: 3, title: '热门分类', icon: 'icon-category', color: '#45B7D1', link: '/categories' },
    { id: 4, title: '品牌专区', icon: 'icon-brand', color: '#F9A826', link: '/brands' },
    { id: 5, title: '每日签到', icon: 'icon-check', color: '#5D5FEF', link: '/sign-in', type: 'activity' },
    { id: 6, title: '我的收藏', icon: 'icon-heart', color: '#FF75A0', link: '/user/favorites' },
    { id: 7, title: '积分商城', icon: 'icon-gift', color: '#4CAF50', link: '/points-mall' },
    { id: 8, title: '会员中心', icon: 'icon-user', color: '#795548', link: '/user/membership' }
  ];
  
  // 热门分类
  const hotCategories: CategoryEntry[] = [
    { 
      id: 'electronics', 
      name: '电子产品', 
      image: 'https://picsum.photos/id/20/200/200', 
      count: 256,
      icon: 'icon-electronics' 
    },
    { 
      id: 'clothing', 
      name: '服装', 
      image: 'https://picsum.photos/id/21/200/200', 
      count: 178,
      icon: 'icon-clothing' 
    },
    { 
      id: 'home', 
      name: '家居', 
      image: 'https://picsum.photos/id/22/200/200', 
      count: 143,
      icon: 'icon-home'
    },
    { 
      id: 'books', 
      name: '图书', 
      image: 'https://picsum.photos/id/23/200/200', 
      count: 112,
      icon: 'icon-book'
    },
    { 
      id: 'beauty', 
      name: '美妆', 
      image: 'https://picsum.photos/id/24/200/200', 
      count: 95,
      icon: 'icon-beauty'
    },
    { 
      id: 'sports', 
      name: '运动', 
      image: 'https://picsum.photos/id/25/200/200', 
      count: 87,
      icon: 'icon-sports'
    }
  ];
  
  // 精选商品
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: '无线蓝牙耳机',
      price: '¥199.00',
      originalPrice: '¥399.00',
      discount: 50,
      image: 'https://picsum.photos/id/1/300/300',
      rating: 4.8,
      salesCount: 2341
    },
    {
      id: 2,
      name: '智能手表',
      price: '¥399.00',
      originalPrice: '¥799.00',
      discount: 50,
      image: 'https://picsum.photos/id/2/300/300',
      rating: 4.9,
      salesCount: 1892
    },
    {
      id: 3,
      name: '机械键盘',
      price: '¥349.00',
      originalPrice: '¥599.00',
      discount: 42,
      image: 'https://picsum.photos/id/60/300/300',
      rating: 4.7,
      salesCount: 1234
    },
    {
      id: 4,
      name: '降噪耳机',
      price: '¥499.00',
      originalPrice: '¥999.00',
      discount: 50,
      image: 'https://picsum.photos/id/62/300/300',
      rating: 4.9,
      salesCount: 987
    },
    {
      id: 5,
      name: '智能音箱',
      price: '¥199.00',
      originalPrice: '¥499.00',
      discount: 60,
      image: 'https://picsum.photos/id/65/300/300',
      rating: 4.7,
      salesCount: 1456
    },
    {
      id: 6,
      name: '无线充电器',
      price: '¥99.00',
      originalPrice: '¥249.00',
      discount: 60,
      image: 'https://picsum.photos/id/64/300/300',
      rating: 4.5,
      salesCount: 1890
    }
  ];
  
  // 推荐商品专区
  const recommendSections: RecommendSection[] = [
    {
      id: 1,
      title: '新品上市',
      subTitle: '探索最新科技产品',
      viewAll: '查看全部',
      type: 'new',
      layoutType: 'grid',
      moreLink: '/new-arrivals',
      products: [
        {
          id: 7,
          name: '4K高清投影仪',
          price: '¥2999.00',
          originalPrice: '¥4999.00',
          discount: 40,
          image: 'https://picsum.photos/id/30/300/300',
          rating: 4.8,
          salesCount: 234
        },
        {
          id: 8,
          name: '智能门锁',
          price: '¥899.00',
          originalPrice: '¥1599.00',
          discount: 44,
          image: 'https://picsum.photos/id/31/300/300',
          rating: 4.7,
          salesCount: 456
        },
        {
          id: 9,
          name: '便携式蓝牙音箱',
          price: '¥299.00',
          originalPrice: '¥499.00',
          discount: 40,
          image: 'https://picsum.photos/id/32/300/300',
          rating: 4.6,
          salesCount: 789
        },
        {
          id: 10,
          name: '电动牙刷',
          price: '¥199.00',
          originalPrice: '¥299.00',
          discount: 33,
          image: 'https://picsum.photos/id/33/300/300',
          rating: 4.5,
          salesCount: 567
        }
      ]
    },
    {
      id: 2,
      title: '热卖爆款',
      subTitle: '大家都在买',
      viewAll: '查看全部',
      type: 'hot',
      layoutType: 'list',
      moreLink: '/products?sort=sales',
      backgroundColor: '#FFF8F0',
      products: [
        {
          id: 11,
          name: '智能手机',
          price: '¥3999.00',
          originalPrice: '¥4999.00',
          discount: 20,
          image: 'https://picsum.photos/id/40/300/300',
          rating: 4.9,
          salesCount: 3456
        },
        {
          id: 12,
          name: '笔记本电脑',
          price: '¥5999.00',
          originalPrice: '¥7999.00',
          discount: 25,
          image: 'https://picsum.photos/id/41/300/300',
          rating: 4.8,
          salesCount: 2345
        },
        {
          id: 13,
          name: '智能手环',
          price: '¥199.00',
          originalPrice: '¥299.00',
          discount: 33,
          image: 'https://picsum.photos/id/42/300/300',
          rating: 4.7,
          salesCount: 4567
        }
      ]
    },
    {
      id: 3,
      title: '限时折扣',
      subTitle: '折扣商品，每日更新',
      viewAll: '查看全部',
      type: 'discount',
      layoutType: 'grid',
      moreLink: '/promotions/discounts',
      products: [
        {
          id: 14,
          name: '游戏手柄',
          price: '¥199.00',
          originalPrice: '¥399.00',
          discount: 50,
          image: 'https://picsum.photos/id/50/300/300',
          rating: 4.6,
          salesCount: 978
        },
        {
          id: 15,
          name: '无线鼠标',
          price: '¥99.00',
          originalPrice: '¥199.00',
          discount: 50,
          image: 'https://picsum.photos/id/51/300/300',
          rating: 4.5,
          salesCount: 1234
        },
        {
          id: 16,
          name: '移动电源',
          price: '¥129.00',
          originalPrice: '¥239.00',
          discount: 46,
          image: 'https://picsum.photos/id/52/300/300',
          rating: 4.7,
          salesCount: 2345
        },
        {
          id: 17,
          name: '智能体重秤',
          price: '¥99.00',
          originalPrice: '¥199.00',
          discount: 50,
          image: 'https://picsum.photos/id/53/300/300',
          rating: 4.4,
          salesCount: 1456
        }
      ]
    }
  ];
  
  // 热门话题
  const trendingTopics: Topic[] = [
    {
      id: 1,
      title: '家居智能化',
      image: 'https://picsum.photos/id/111/400/200',
      link: '/topics/smart-home',
      description: '探索智能家居新趋势',
      backgroundColor: '#EBF5FB',
      textColor: '#2874A6'
    },
    {
      id: 2,
      title: '健康生活',
      image: 'https://picsum.photos/id/112/400/200',
      link: '/topics/healthy-living',
      description: '科技助力健康生活',
      backgroundColor: '#E8F8F5',
      textColor: '#16A085'
    },
    {
      id: 3,
      title: '高效办公',
      image: 'https://picsum.photos/id/113/400/200',
      link: '/topics/efficient-work',
      description: '提升办公效率的科技产品',
      backgroundColor: '#F9EBEA',
      textColor: '#C0392B'
    }
  ];
  
  // 热门品牌
  const popularBrands: Brand[] = [
    { id: 'brand1', name: '品牌1', logo: 'https://picsum.photos/id/71/200/100' },
    { id: 'brand2', name: '品牌2', logo: 'https://picsum.photos/id/72/200/100' },
    { id: 'brand3', name: '品牌3', logo: 'https://picsum.photos/id/73/200/100' },
    { id: 'brand4', name: '品牌4', logo: 'https://picsum.photos/id/74/200/100' },
    { id: 'brand5', name: '品牌5', logo: 'https://picsum.photos/id/75/200/100' },
    { id: 'brand6', name: '品牌6', logo: 'https://picsum.photos/id/76/200/100' }
  ];
  
  const homeData: HomeData = {
    carousels,
    gridMenus,
    hotCategories,
    featuredProducts,
    recommendSections,
    trendingTopics,
    popularBrands
  };
  
  return {
    data: homeData,
    success: true
  };
});

// 获取单个推荐专区数据
Mock.mock(/\/api\/home\/sections\/\w+$/, 'get', (options: any) => {
  const type = options.url.split('/').pop();
  
  // 基于类型返回不同的商品专区
  const sections = {
    'new': {
      id: 1,
      title: '新品上市',
      subTitle: '探索最新科技产品',
      type: 'new',
      products: Array.from({ length: 8 }).map((_, i) => ({
        id: 100 + i,
        name: `新品${i + 1}`,
        price: `¥${Random.integer(99, 9999)}`,
        originalPrice: `¥${Random.integer(99, 9999)}`,
        discount: Random.integer(10, 80),
        image: `https://picsum.photos/id/${80 + i}/300/300`,
        rating: Random.float(3.5, 5, 1, 1),
        salesCount: Random.integer(10, 5000),
        tags: ['新品']
      }))
    },
    'hot': {
      id: 2,
      title: '热卖爆款',
      subTitle: '大家都在买',
      type: 'hot',
      products: Array.from({ length: 8 }).map((_, i) => ({
        id: 200 + i,
        name: `热销产品${i + 1}`,
        price: `¥${Random.integer(99, 9999)}`,
        originalPrice: `¥${Random.integer(99, 9999)}`,
        discount: Random.integer(10, 80),
        image: `https://picsum.photos/id/${90 + i}/300/300`,
        rating: Random.float(3.5, 5, 1, 1),
        salesCount: Random.integer(1000, 10000),
        tags: ['热卖', '爆款']
      }))
    },
    'discount': {
      id: 3,
      title: '限时折扣',
      subTitle: '折扣商品，每日更新',
      type: 'discount',
      products: Array.from({ length: 8 }).map((_, i) => ({
        id: 300 + i,
        name: `折扣商品${i + 1}`,
        price: `¥${Random.integer(99, 9999)}`,
        originalPrice: `¥${Random.integer(99, 9999)}`,
        discount: Random.integer(30, 80),
        image: `https://picsum.photos/id/${100 + i}/300/300`,
        rating: Random.float(3.5, 5, 1, 1),
        salesCount: Random.integer(100, 5000),
        tags: ['折扣', '限时']
      }))
    }
  };
  
  const section = sections[type as keyof typeof sections];
  
  if (section) {
    return {
      section,
      success: true
    };
  } else {
    return {
      success: false,
      message: '找不到相应的专区数据'
    };
  }
});