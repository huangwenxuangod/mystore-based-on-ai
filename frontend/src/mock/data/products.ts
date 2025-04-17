import Mock from 'mockjs'

// 定义产品相关接口
interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: number;
  image: string;
  description: string;
  categoryId: string;
  brandId: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  releaseDate: string;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  reviews?: ProductReview[];
  images?: string[];
  status?: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface ProductReview {
  id: number;
  username: string;
  rating: number;
  content: string;
  date: string;
  avatar?: string;
  images?: string[];
  likes?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories?: Category[];
  brands?: Brand[];
  filters?: Filters;
}

interface Category {
  id: string;
  name: string;
  count?: number;
  icon?: string;
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  count?: number;
}

interface Filters {
  priceRange: {
    min: number;
    max: number;
  };
  ratings: number[];
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 生成随机产品数据
const generateProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= 30; i++) {
    const discount = Random.integer(10, 30);
    const originalPrice = Number(Random.float(1000, 6000, 2, 2));
    const price = (originalPrice * (1 - discount / 100)).toFixed(2);
    const stock = Random.integer(0, 200);
    const stockStatus: ('in-stock' | 'low-stock' | 'out-of-stock') = 
      stock === 0 ? 'out-of-stock' : 
      stock < 10 ? 'low-stock' : 
      'in-stock';
    
    products.push({
      id: i,
      name: `${Random.ctitle(3, 6)}${['智能手机', '平板电脑', '笔记本', '智能手表', '蓝牙耳机', '智能音箱', '电子书阅读器', '无线充电器'][i % 8]}`,
      price: `¥${price}`,
      originalPrice: `¥${originalPrice.toFixed(2)}`,
      discount: discount,
      image: `https://picsum.photos/id/${i + 20}/300/300`,
      description: Random.cparagraph(2),
      categoryId: ['electronics', 'audio', 'wearables', 'accessories', 'home-appliances'][i % 5],
      brandId: `brand${i % 6 + 1}`,
      rating: Number(Random.float(3.5, 5, 1, 1)),
      reviewCount: Random.integer(10, 500),
      salesCount: Random.integer(100, 5000),
      stock: stock,
      releaseDate: Random.date('yyyy-MM-dd'),
      status: stockStatus,
      tags: Random.shuffle(['新品', '热卖', '限时特惠', '爆款', '精选', '官方推荐']).slice(0, Random.integer(0, 3))
    });
  }
  return products;
};

// 所有产品列表
const allProducts = generateProducts();

// 品牌列表
const brands: Brand[] = [
  { id: 'brand1', name: 'TechMaster', logo: 'https://picsum.photos/id/201/100/100' },
  { id: 'brand2', name: 'SoundWave', logo: 'https://picsum.photos/id/202/100/100' },
  { id: 'brand3', name: 'SmartLife', logo: 'https://picsum.photos/id/203/100/100' },
  { id: 'brand4', name: 'GadgetPro', logo: 'https://picsum.photos/id/204/100/100' },
  { id: 'brand5', name: 'FutureTech', logo: 'https://picsum.photos/id/205/100/100' },
  { id: 'brand6', name: 'HomeGenius', logo: 'https://picsum.photos/id/206/100/100' },
];

// 分类列表
const categories: Category[] = [
  { id: 'electronics', name: '电子产品', icon: 'Cellphone' },
  { id: 'audio', name: '音频设备', icon: 'Headset' },
  { id: 'wearables', name: '可穿戴设备', icon: 'Watch' },
  { id: 'accessories', name: '配件', icon: 'Mouse' },
  { id: 'home-appliances', name: '家用电器', icon: 'HomeFilled' },
];

// 模拟产品列表数据
Mock.mock(/\/api\/products(\?.+)?$/, 'get', (options: any) => {
  // 解析请求参数
  const url = options.url;
  const pageMatch = url.match(/page=(\d+)/);
  const limitMatch = url.match(/limit=(\d+)/);
  const categoryMatch = url.match(/categoryId=([^&]+)/);
  const brandMatch = url.match(/brandId=([^&]+)/);
  const searchMatch = url.match(/search=([^&]+)/);
  const sortMatch = url.match(/sort=([^&]+)/);
  const minPriceMatch = url.match(/minPrice=(\d+)/);
  const maxPriceMatch = url.match(/maxPrice=(\d+)/);
  const ratingMatch = url.match(/rating=(\d+)/);
  
  const page = pageMatch ? parseInt(pageMatch[1]) : 1;
  const limit = limitMatch ? parseInt(limitMatch[1]) : 10;
  
  // 根据参数筛选产品
  let filteredProducts = [...allProducts];
  
  if (categoryMatch) {
    const categories = decodeURIComponent(categoryMatch[1]).split(',');
    filteredProducts = filteredProducts.filter(p => categories.includes(p.categoryId));
  }
  
  if (brandMatch) {
    const brands = decodeURIComponent(brandMatch[1]).split(',');
    filteredProducts = filteredProducts.filter(p => brands.includes(p.brandId));
  }
  
  if (searchMatch) {
    const keyword = decodeURIComponent(searchMatch[1]).toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(keyword) || 
      p.description.toLowerCase().includes(keyword)
    );
  }
  
  if (minPriceMatch) {
    const minPrice = parseInt(minPriceMatch[1]);
    filteredProducts = filteredProducts.filter(p => 
      parseFloat(p.price.replace('¥', '')) >= minPrice
    );
  }
  
  if (maxPriceMatch) {
    const maxPrice = parseInt(maxPriceMatch[1]);
    filteredProducts = filteredProducts.filter(p => 
      parseFloat(p.price.replace('¥', '')) <= maxPrice
    );
  }
  
  if (ratingMatch) {
    const minRating = parseInt(ratingMatch[1]);
    filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
  }
  
  // 排序处理
  if (sortMatch) {
    const sort = sortMatch[1];
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => 
          parseFloat(a.price.replace('¥', '')) - parseFloat(b.price.replace('¥', ''))
        );
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => 
          parseFloat(b.price.replace('¥', '')) - parseFloat(a.price.replace('¥', ''))
        );
        break;
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
        break;
      case 'popular':
      default:
        filteredProducts.sort((a, b) => b.salesCount - a.salesCount);
    }
  }
  
  // 分页处理
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // 计算每个分类的产品数量
  const categoryCount = categories.map(category => ({
    ...category,
    count: allProducts.filter(p => p.categoryId === category.id).length
  }));
  
  // 计算每个品牌的产品数量
  const brandCount = brands.map(brand => ({
    ...brand,
    count: allProducts.filter(p => p.brandId === brand.id).length
  }));
  
  // 计算价格范围
  const prices = allProducts.map(p => parseFloat(p.price.replace('¥', '')));
  const priceRange = {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };

  return {
    products: filteredProducts.slice(startIndex, endIndex),
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    categories: categoryCount,
    brands: brandCount,
    filters: {
      priceRange,
      ratings: [4, 3, 2, 1]
    }
  } as ProductsResponse;
});

// 产品详情
Mock.mock(/\/api\/products\/\d+$/, 'get', (options: any) => {
  const id = parseInt(options.url.match(/\/products\/(\d+)/)[1]);
  const product = allProducts.find(item => item.id === id);
  
  if (product) {
    // 返回更详细的产品信息
    const detailedProduct: Product = {
      ...product,
      images: [
        product.image.replace("https://picsum.photos", "https://source.unsplash.com/random"),
        `https://source.unsplash.com/random/800x800?product=${id+1}`,
        `https://source.unsplash.com/random/800x800?electronics=${id+2}`,
        `https://source.unsplash.com/random/800x800?tech=${id+3}`
      ],
      features: [
        "高质量材料",
        "创新科技",
        "精致设计",
        "舒适体验",
        "持久耐用",
        "智能互联"
      ],
      specifications: {
        "品牌": brands.find(b => b.id === product.brandId)?.name || '未知品牌',
        "型号": `M${id}${Random.character('upper')}`,
        "颜色": Random.pick(["黑色", "白色", "银色", "金色", "蓝色", "红色"]),
        "重量": `${Random.float(0.1, 3, 1, 2)}kg`,
        "尺寸": `${Random.integer(10, 30)}cm × ${Random.integer(5, 20)}cm × ${Random.integer(1, 5)}cm`,
        "生产日期": Random.date('yyyy年MM月'),
        "保修期": "12个月",
        "产地": Random.pick(["中国", "日本", "韩国", "美国", "德国"])
      },
      reviews: Array(Random.integer(5, 12)).fill(null).map((_, i) => ({
        id: i + 1,
        username: `用户${Random.character('lower')}${Random.integer(100, 999)}`,
        rating: Number(Random.float(3, 5, 1, 1)),
        content: Random.cparagraph(1, 3),
        date: Random.date('yyyy-MM-dd'),
        avatar: `https://i.pravatar.cc/50?img=${200 + i}`,
        images: i % 3 === 0 ? [
          `https://source.unsplash.com/random/100x100?review=${400 + i}`,
          `https://source.unsplash.com/random/100x100?feedback=${410 + i}`
        ] : undefined,
        likes: Random.integer(0, 50)
      }))
    };
    
    return {
      ...detailedProduct,
      success: true
    };
  } else {
    return {
      status: 404,
      message: `未找到ID为${id}的产品。`,
      success: false
    };
  }
});

// 推荐商品
Mock.mock('/api/recommend', 'get', () => {
  // 随机选取8个产品作为推荐
  return {
    products: Random.shuffle(allProducts).slice(0, 8),
    success: true
  };
});

// 相关商品
Mock.mock(/\/api\/products\/\d+\/related/, 'get', (options: any) => {
  const id = parseInt(options.url.match(/\/products\/(\d+)/)[1]);
  const currentProduct = allProducts.find(p => p.id === id);
  
  if (currentProduct) {
    // 获取同类别的产品作为相关商品
    return {
      products: allProducts
        .filter(p => p.id !== id && p.categoryId === currentProduct.categoryId)
        .slice(0, 4),
      success: true
    };
  }
  
  return {
    products: [],
    success: false
  };
});

// 获取推荐商品
Mock.mock('/api/products/recommended', 'get', (): { data: any[]; success: boolean } => {
  const recommendedProducts = [];
  
  for (let i = 0; i < 6; i++) {
    recommendedProducts.push({
      id: 300 + i,
      name: `推荐商品 ${i + 1}`,
      price: `¥${Random.float(99, 9999, 2, 2).toFixed(2)}`,
      originalPrice: `¥${Random.float(9999, 19999, 2, 2).toFixed(2)}`,
      discount: Random.integer(10, 90),
      image: `https://picsum.photos/id/${Random.integer(50, 120)}/300/300`,
      description: Random.cparagraph(1, 3),
      shortDescription: Random.csentence(5, 15),
      rating: Random.float(4, 5, 1, 1),
      reviewCount: Random.integer(10, 500),
      salesCount: Random.integer(100, 9999),
      isNew: Random.boolean(),
      stock: Random.integer(0, 999)
    });
  }
  
  return {
    data: recommendedProducts,
    success: true
  };
});