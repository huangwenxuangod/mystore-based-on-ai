import Mock from 'mockjs'

// 定义产品接口
export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  image: string;
  rating?: number;
  salesCount?: number;
  description?: string;
  categoryId?: string;
  brandId?: string;
  tags?: string[];
  stock?: number;
}

// 定义促销接口类型
export interface Promotion {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  type: string;
  discount?: string;
  condition?: string;
  code?: string;
  products?: number[];
  categories?: number[];
  status: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟促销数据
const promotions: Promotion[] = [
  {
    id: 1,
    title: '新年大促',
    description: '全场商品8折起，限时抢购',
    image: 'https://picsum.photos/id/100/800/300',
    startDate: '2025-01-20',
    endDate: '2025-02-10',
    type: 'discount',
    discount: '8折',
    condition: '全场商品',
    products: [1, 2, 3, 4, 5],
    status: 'active'
  },
  {
    id: 2,
    title: '满300减50',
    description: '全场满300元减50元',
    image: 'https://picsum.photos/id/101/800/300',
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    type: 'fullReduction',
    condition: '满300减50',
    code: 'SAVE50',
    status: 'active'
  },
  {
    id: 3,
    title: '数码产品专场',
    description: '数码产品限时9折',
    image: 'https://picsum.photos/id/102/800/300',
    startDate: '2025-01-10',
    endDate: '2025-02-28',
    type: 'categoryDiscount',
    discount: '9折',
    categories: [1, 2],
    status: 'active'
  },
  {
    id: 4,
    title: '服装清仓',
    description: '精选服装低至5折',
    image: 'https://picsum.photos/id/103/800/300',
    startDate: '2025-02-01',
    endDate: '2025-03-01',
    type: 'clearance',
    discount: '5折起',
    categories: [3, 4],
    status: 'coming'
  },
  {
    id: 5,
    title: '会员专享优惠',
    description: '会员专享额外95折',
    image: 'https://picsum.photos/id/104/800/300',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    type: 'memberDiscount',
    discount: '额外95折',
    condition: '会员专享',
    status: 'active'
  },
  {
    id: 6,
    title: '限时闪购',
    description: '每日10点开始，限时3小时',
    image: 'https://picsum.photos/id/106/800/300',
    startDate: '2025-02-15',
    endDate: '2025-02-20',
    type: 'flashSale',
    discount: '低至3折',
    products: [10, 11, 12],
    status: 'coming'
  }
];

// 生成更多随机促销数据
for (let i = 0; i < 10; i++) {
  const id = promotions.length + 1;
  const type = ['discount', 'fullReduction', 'categoryDiscount', 'flashSale', 'memberDiscount', 'coupon'][Random.integer(0, 5)];
  const status = ['active', 'coming', 'ended'][Random.integer(0, 2)];
  
  const startDate = Random.date('yyyy-MM-dd');
  const endDateObj = new Date(startDate);
  endDateObj.setDate(endDateObj.getDate() + Random.integer(10, 60));
  const endDate = endDateObj.toISOString().split('T')[0];
  
  promotions.push({
    id,
    title: `${Random.ctitle(4, 8)}${type === 'discount' ? '折扣' : type === 'fullReduction' ? '满减' : type === 'flashSale' ? '闪购' : '优惠'}活动`,
    description: Random.ctitle(10, 20),
    image: `https://picsum.photos/id/${110 + i}/800/300`,
    startDate,
    endDate,
    type,
    discount: type === 'discount' || type === 'categoryDiscount' || type === 'flashSale' ? `${Random.integer(5, 9)}折` : undefined,
    condition: type === 'fullReduction' ? `满${Random.integer(1, 5)}00减${Random.integer(30, 100)}` : undefined,
    code: type === 'coupon' ? Random.string('upper', 6) : undefined,
    products: type === 'flashSale' ? Array.from({ length: Random.integer(3, 8) }, () => Random.integer(1, 20)) : undefined,
    categories: type === 'categoryDiscount' ? Array.from({ length: Random.integer(1, 3) }, () => Random.integer(1, 10)) : undefined,
    status
  });
}

// 获取促销列表
Mock.mock(/\/api\/promotions(\?.+)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = options.url;
  const queryString = url.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  
  const status = params.get('status');
  const type = params.get('type');
  const page = parseInt(params.get('page') || '1', 10);
  const pageSize = parseInt(params.get('pageSize') || '10', 10);
  
  // 过滤促销
  let filteredPromotions = [...promotions];
  
  if (status) {
    filteredPromotions = filteredPromotions.filter(promo => promo.status === status);
  }
  
  if (type) {
    filteredPromotions = filteredPromotions.filter(promo => promo.type === type);
  }
  
  // 分页
  const total = filteredPromotions.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedPromotions = filteredPromotions.slice(startIndex, endIndex);
  
  return {
    promotions: pagedPromotions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
});

// 获取单个促销详情
Mock.mock(/\/api\/promotions\/\d+$/, 'get', (options: any) => {
  const id = parseInt(options.url.match(/\/promotions\/(\d+)/)[1], 10);
  const promotion = promotions.find(p => p.id === id);
  
  if (!promotion) {
    return {
      success: false,
      message: 'Promotion not found'
    };
  }
  
  return {
    promotion,
    success: true
  };
});

// 根据优惠码获取促销
Mock.mock(/\/api\/promotions\/code\/[A-Z0-9]+$/, 'get', (options: any) => {
  const code = options.url.match(/\/code\/([A-Z0-9]+)/)[1];
  const promotion = promotions.find(p => p.code === code && p.status === 'active');
  
  if (!promotion) {
    return {
      success: false,
      message: 'Invalid or expired promotion code'
    };
  }
  
  return {
    promotion,
    success: true
  };
});