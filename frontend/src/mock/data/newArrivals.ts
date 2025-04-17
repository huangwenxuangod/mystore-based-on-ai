import Mock from 'mockjs'

// 定义数据类型接口
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  description: string;
  categoryId: string;
  rating: number;
  salesCount: number;
  releaseDate: string;
  stock?: number;
  discount?: number;
  tags?: string[];
}

interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  shortDescription: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface UpcomingProduct {
  id: number;
  name: string;
  image: string;
  releaseDate: string;
  shortDescription: string;
  countdown: string;
  importance: 'high' | 'medium' | 'low';
}

interface NewArrivalsData {
  products: Product[];
  featuredProducts: FeaturedProduct[];
  categories: Category[];
  upcomingProducts: UpcomingProduct[];
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟新品上市数据
const newArrivalsData: NewArrivalsData = {
  // 新品列表
  products: [
    {
      id: 101,
      name: '新一代智能手机',
      price: '¥5999.00',
      originalPrice: '¥6999.00',
      image: 'https://source.unsplash.com/random/300x300?smartphone',
      description: '最新一代高性能智能手机，配备顶级处理器和专业级摄像系统',
      categoryId: 'electronics',
      rating: 4.9,
      salesCount: 1234,
      releaseDate: '2025-04-01',
      stock: 50,
      discount: 14,
      tags: ['新品', '热卖', '限量']
    },
    {
      id: 102,
      name: '全面屏智能平板',
      price: '¥3999.00',
      originalPrice: '¥4999.00',
      image: 'https://source.unsplash.com/random/300x300?tablet',
      description: '高清全面屏智能平板，适合办公和娱乐',
      categoryId: 'electronics',
      rating: 4.8,
      salesCount: 987,
      releaseDate: '2025-04-02',
      stock: 65,
      discount: 20,
      tags: ['新品', '爆款']
    },
    {
      id: 103,
      name: '智能手表高级版',
      price: '¥1999.00',
      originalPrice: '¥2399.00',
      image: 'https://source.unsplash.com/random/300x300?smartwatch',
      description: '新一代智能手表，支持更多健康监测功能',
      categoryId: 'wearables',
      rating: 4.8,
      salesCount: 876,
      releaseDate: '2025-04-03',
      stock: 100,
      discount: 17,
      tags: ['新品', '健康']
    },
    {
      id: 104,
      name: '主动降噪耳机',
      price: '¥1299.00',
      originalPrice: '¥1599.00',
      image: 'https://source.unsplash.com/random/300x300?headphones',
      description: '新一代主动降噪技术，沉浸式音频体验',
      categoryId: 'audio',
      rating: 4.9,
      salesCount: 765,
      releaseDate: '2025-04-05',
      stock: 80,
      discount: 19,
      tags: ['新品', '音质佳']
    },
    {
      id: 105,
      name: '智能家庭安防套装',
      price: '¥2599.00',
      originalPrice: '¥2999.00',
      image: 'https://source.unsplash.com/random/300x300?security',
      description: '智能家庭安防系统，包含门锁、摄像头和报警器',
      categoryId: 'home-appliances',
      rating: 4.7,
      salesCount: 432,
      releaseDate: '2025-04-07',
      stock: 30,
      discount: 13,
      tags: ['新品', '智能', '安全']
    },
    {
      id: 106,
      name: '便携式投影仪',
      price: '¥2999.00',
      originalPrice: '¥3599.00',
      image: 'https://source.unsplash.com/random/300x300?projector',
      description: '小巧便携的高清投影仪，随时随地享受大屏体验',
      categoryId: 'electronics',
      rating: 4.7,
      salesCount: 321,
      releaseDate: '2025-04-10',
      stock: 25,
      discount: 17,
      tags: ['新品', '便携']
    },
    {
      id: 107,
      name: '智能空气净化器Pro',
      price: '¥1899.00',
      originalPrice: '¥2199.00',
      image: 'https://source.unsplash.com/random/300x300?airpurifier',
      description: '智能空气净化器升级版，配备更高效的过滤系统',
      categoryId: 'home-appliances',
      rating: 4.8,
      salesCount: 543,
      releaseDate: '2025-04-12',
      stock: 40,
      discount: 14,
      tags: ['新品', '健康']
    },
    {
      id: 108,
      name: '机械游戏键盘',
      price: '¥899.00',
      originalPrice: '¥1099.00',
      image: 'https://source.unsplash.com/random/300x300?keyboard',
      description: '专业机械游戏键盘，RGB背光，可编程功能',
      categoryId: 'accessories',
      rating: 4.7,
      salesCount: 789,
      releaseDate: '2025-04-15',
      stock: 60,
      discount: 18,
      tags: ['新品', '游戏']
    }
  ],

  // 重点推荐产品
  featuredProducts: [
    {
      id: 101,
      name: '新一代智能手机',
      price: '¥5999.00',
      image: 'https://source.unsplash.com/random/800x800?smartphone',
      shortDescription: '最新一代高性能智能手机，配备顶级处理器和专业级摄像系统'
    },
    {
      id: 103,
      name: '智能手表高级版',
      price: '¥1999.00',
      image: 'https://source.unsplash.com/random/800x800?smartwatch',
      shortDescription: '新一代智能手表，支持更多健康监测功能'
    },
    {
      id: 106,
      name: '便携式投影仪',
      price: '¥2999.00',
      image: 'https://source.unsplash.com/random/800x800?projector',
      shortDescription: '小巧便携的高清投影仪，随时随地享受大屏体验'
    }
  ],

  // 产品分类
  categories: [
    { id: 'electronics', name: '电子产品', icon: 'Cellphone' },
    { id: 'audio', name: '音频设备', icon: 'Headset' },
    { id: 'wearables', name: '可穿戴设备', icon: 'Watch' },
    { id: 'accessories', name: '配件', icon: 'Mouse' },
    { id: 'home-appliances', name: '家用电器', icon: 'HomeFilled' }
  ],

  // 即将上市产品
  upcomingProducts: [
    {
      id: 201,
      name: '8K超高清电视',
      image: 'https://source.unsplash.com/random/300x300?tv',
      releaseDate: '2025-05-01',
      shortDescription: '8K超高清显示技术，带来极致视觉体验',
      countdown: '15',
      importance: 'high'
    },
    {
      id: 202,
      name: '智能眼镜',
      image: 'https://source.unsplash.com/random/300x300?smartglasses',
      releaseDate: '2025-05-10',
      shortDescription: 'AR增强现实技术，革命性的视觉体验',
      countdown: '24',
      importance: 'high'
    },
    {
      id: 203,
      name: '智能家居控制中心',
      image: 'https://source.unsplash.com/random/300x300?smarthome',
      releaseDate: '2025-05-15',
      shortDescription: '集中控制所有智能家居设备，打造智慧生活',
      countdown: '29',
      importance: 'medium'
    },
    {
      id: 204,
      name: '高性能游戏主机',
      image: 'https://source.unsplash.com/random/300x300?gameconsole',
      releaseDate: '2025-05-20',
      shortDescription: '次世代游戏主机，极致游戏体验',
      countdown: '34',
      importance: 'medium'
    },
    {
      id: 205,
      name: '智能健康手环',
      image: 'https://source.unsplash.com/random/300x300?fitnesstracker',
      releaseDate: '2025-06-01',
      shortDescription: '全天候健康监测，专业运动指导',
      countdown: '45',
      importance: 'low'
    }
  ]
};

// 配置拦截API请求
Mock.mock('/api/new-arrivals', 'get', () => {
  // 添加一些动态生成的数据
  const dynamicProducts: Product[] = Array(2)
    .fill(null)
    .map((_, index) => ({
      id: 1000 + index,
      name: Random.ctitle(4, 8) + Random.pick(['智能设备', '家电', '配件', '数码产品']),
      price: `¥${Random.float(999, 9999, 2, 2)}`,
      originalPrice: `¥${Random.float(1999, 10999, 2, 2)}`,
      image: `https://source.unsplash.com/random/300x300?product${index}`,
      description: Random.cparagraph(1, 3),
      categoryId: Random.pick(['electronics', 'audio', 'wearables', 'accessories', 'home-appliances']),
      rating: Number(Random.float(4.0, 5.0, 1, 1)),
      salesCount: Random.integer(100, 2000),
      releaseDate: Random.date('yyyy-MM-dd'),
      stock: Random.integer(10, 100),
      discount: Random.integer(10, 30),
      tags: Random.shuffle(['新品', '热卖', '限量', '爆款', '智能', '高端']).slice(0, Random.integer(1, 3))
    }));

  return {
    ...newArrivalsData,
    products: [...newArrivalsData.products, ...dynamicProducts],
    timestamp: new Date().getTime(),
    success: true
  };
});