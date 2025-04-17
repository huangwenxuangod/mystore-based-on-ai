import Mock from 'mockjs'

// 定义轮播图接口
export interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'left' | 'center' | 'right';
  tag?: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟轮播图数据
const carouselData: CarouselItem[] = [
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
  },
  {
    id: 4,
    image: 'https://picsum.photos/id/6/1200/400',
    title: '会员专享',
    description: '会员专享折扣，最高5折',
    link: '/user/membership',
    buttonText: '了解会员',
    position: 'center',
    tag: '会员专享'
  }
];

// 获取轮播图数据
Mock.mock('/api/carousel', 'get', (): { data: CarouselItem[]; success: boolean } => {
  return {
    data: carouselData,
    success: true
  };
});

// 根据ID获取轮播图
Mock.mock(/\/api\/carousel\/\d+$/, 'get', (options: any): { data: CarouselItem | null; success: boolean } => {
  const id = parseInt(options.url.split('/').pop(), 10);
  const item = carouselData.find(item => item.id === id);
  
  if (item) {
    return {
      data: item,
      success: true
    };
  }
  
  return {
    data: null,
    success: false
  };
});

// 动态生成轮播图
Mock.mock('/api/carousel/random', 'get', (): { data: CarouselItem[]; success: boolean } => {
  const count = Random.integer(3, 6);
  const randomCarousel: CarouselItem[] = [];
  
  for (let i = 0; i < count; i++) {
    randomCarousel.push({
      id: i + 1,
      image: `https://picsum.photos/id/${Random.integer(10, 100)}/1200/400`,
      title: Random.ctitle(2, 6),
      description: Random.ctitle(10, 20),
      link: `/promotions/${Random.word(5, 10)}`,
      buttonText: Random.pick(['立即查看', '了解详情', '抢购', '查看系列']),
      position: Random.pick(['left', 'center', 'right']) as 'left' | 'center' | 'right',
      tag: Random.boolean() ? Random.pick(['新品', '热卖', '限时', '特惠', '会员专享']) : undefined
    });
  }
  
  return {
    data: randomCarousel,
    success: true
  };
});

// 获取热门商品数据
Mock.mock('/api/products/popular', 'get', (): { data: any[]; success: boolean } => {
  const popularProducts = [];
  
  for (let i = 0; i < 6; i++) {
    popularProducts.push({
      id: 100 + i,
      name: `热门商品 ${i + 1}`,
      price: Random.float(99, 9999, 2, 2).toFixed(2),
      originalPrice: Random.float(9999, 19999, 2, 2).toFixed(2),
      discount: Random.integer(10, 90),
      image: `https://picsum.photos/id/${Random.integer(30, 100)}/300/300`,
      description: Random.cparagraph(1, 3),
      shortDescription: Random.csentence(5, 15),
      rating: Random.float(3, 5, 1, 1),
      reviewCount: Random.integer(10, 500),
      salesCount: Random.integer(100, 9999),
      isNew: Random.boolean(),
      stock: Random.integer(0, 999)
    });
  }
  
  return {
    data: popularProducts,
    success: true
  };
});

export default { carouselData };