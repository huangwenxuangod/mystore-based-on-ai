/**
 * 模拟数据控制器
 * 提供各类前端所需的模拟数据
 */
const getHomeData = (req, res) => {
  try {
    // 模拟首页数据
    const homeData = {
      // 特色服务
      features: [
        {
          id: 1,
          icon: 'TruckDelivery',
          title: '极速配送',
          description: '当天下单，次日送达'
        },
        {
          id: 2,
          icon: 'Service',
          title: '专业服务',
          description: '专业客服，7x24小时服务'
        },
        {
          id: 3,
          icon: 'GoodsFilled',
          title: '品质保证',
          description: '品牌直供，正品保证'
        },
        {
          id: 4,
          icon: 'Promotion',
          title: '超值优惠',
          description: '多种优惠活动，给您最实惠的价格'
        }
      ],

      // 热门商品
      hotProducts: [
        {
          id: 1,
          name: '无线蓝牙耳机',
          price: '¥299.00',
          image: 'https://picsum.photos/id/1/300/300',
          rating: 4.8,
          salesCount: 2341
        },
        {
          id: 2,
          name: '智能手表',
          price: '¥599.00',
          image: 'https://picsum.photos/id/2/300/300',
          rating: 4.9,
          salesCount: 1892
        }
      ],

      // 轮播图
      carousel: [
        {
          id: 1,
          image: 'https://picsum.photos/id/3/1200/400',
          title: '新品上市',
          description: '最新科技产品，限时优惠'
        },
        {
          id: 2,
          image: 'https://picsum.photos/id/4/1200/400',
          title: '限时特惠',
          description: '全场商品8折起'
        }
      ]
    };

    res.json(homeData);
  } catch (error) {
    console.error('获取首页数据失败:', error);
    res.status(500).json({ message: '获取首页数据失败' });
  }
};

const getCarouselData = (req, res) => {
  try {
    const carouselData = [
      {
        id: 1,
        image: 'https://picsum.photos/id/3/1200/400',
        title: '新品上市',
        description: '最新科技产品，限时优惠'
      },
      {
        id: 2,
        image: 'https://picsum.photos/id/4/1200/400',
        title: '限时特惠',
        description: '全场商品8折起'
      }
    ];

    res.json(carouselData);
  } catch (error) {
    console.error('获取轮播图数据失败:', error);
    res.status(500).json({ message: '获取轮播图数据失败' });
  }
};

const getCartData = (req, res) => {
  try {
    const cartData = {
      items: [
        {
          id: 1,
          productId: 1,
          name: '无线蓝牙耳机',
          price: '¥299.00',
          image: 'https://picsum.photos/id/1/300/300',
          quantity: 2,
          selected: true
        },
        {
          id: 2,
          productId: 2,
          name: '智能手表',
          price: '¥599.00',
          image: 'https://picsum.photos/id/2/300/300',
          quantity: 1,
          selected: true
        }
      ],
      total: '¥1197.00'
    };
    res.json(cartData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecommendedProducts = (req, res) => {
  // 模拟推荐商品数据
  const recommendedProducts = [
    {
      id: 101,
      name: '机械键盘',
      price: '¥499.00',
      image: 'https://picsum.photos/id/60/300/300'
    },
    {
      id: 102,
      name: '高清摄像头',
      price: '¥349.00',
      image: 'https://picsum.photos/id/61/300/300'
    },
    {
      id: 103,
      name: '降噪耳机',
      price: '¥799.00',
      image: 'https://picsum.photos/id/62/300/300'
    },
    {
      id: 104,
      name: '智能台灯',
      price: '¥239.00',
      image: 'https://picsum.photos/id/63/300/300'
    }
  ];

  res.send(recommendedProducts);
};

const getUserData = (req, res) => {
  try {
    const userData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      realName: '测试用户',
      phone: '13800138000',
      gender: '男',
      birthday: '1990-01-01',
      avatar: 'https://picsum.photos/id/105/200/200',
      address: [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园路1号',
          isDefault: true
        }
      ]
    };
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderData = (req, res) => {
  // 模拟订单数据
  const ordersData = [
    {
      id: 'ORD20250412001',
      date: '2025-04-12 14:30:25',
      status: '待收货',
      total: '1599.00',
      products: [
        {
          id: 1,
          name: '智能手表Pro',
          price: '¥999.00',
          quantity: 1,
          image: 'https://picsum.photos/id/26/100/100'
        },
        {
          id: 2,
          name: '便携式蓝牙音箱',
          price: '¥299.00',
          quantity: 2,
          image: 'https://picsum.photos/id/29/100/100'
        }
      ]
    },
    {
      id: 'ORD20250413002',
      date: '2025-04-13 09:15:33',
      status: '已完成',
      total: '299.00',
      products: [
        {
          id: 3,
          name: '无线蓝牙耳机',
          price: '¥299.00',
          quantity: 1,
          image: 'https://picsum.photos/id/28/100/100'
        }
      ]
    }
  ];

  res.send(ordersData);
};

const getFavoritesData = (req, res) => {
  // 模拟收藏商品数据
  const favoritesData = [
    {
      id: 1,
      name: '智能手表Pro',
      price: '¥999.00',
      image: 'https://picsum.photos/id/26/300/300'
    },
    {
      id: 2,
      name: '无线蓝牙耳机',
      price: '¥299.00',
      image: 'https://picsum.photos/id/28/300/300'
    },
    {
      id: 3,
      name: '机械键盘',
      price: '¥499.00',
      image: 'https://picsum.photos/id/8/300/300'
    },
    {
      id: 4,
      name: '4K高清投影仪',
      price: '¥3999.00',
      image: 'https://picsum.photos/id/30/300/300'
    }
  ];

  res.send(favoritesData);
};

const getAddressesData = (req, res) => {
  // 模拟收货地址数据
  const addressesData = [
    {
      id: 1,
      name: '张小明',
      phone: '13812345678',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南路88号智汇大厦3栋1001室',
      isDefault: true
    },
    {
      id: 2,
      name: '张小明',
      phone: '13812345678',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detail: '天河路385号太古汇1期北塔12楼',
      isDefault: false
    }
  ];

  res.send(addressesData);
};

const getAllProducts = (req, res) => {
  try {
    // 模拟商品列表数据
    const products = [
      {
        id: 1,
        name: '无线蓝牙耳机',
        price: '¥299.00',
        image: 'https://picsum.photos/id/1/300/300',
        description: '高品质无线蓝牙耳机，支持主动降噪',
        categoryId: 'electronics',
        rating: 4.8,
        salesCount: 2341,
        stock: 100,
        releaseDate: '2024-01-15'
      },
      {
        id: 2,
        name: '智能手表',
        price: '¥599.00',
        image: 'https://picsum.photos/id/2/300/300',
        description: '多功能智能手表，支持心率监测',
        categoryId: 'electronics',
        rating: 4.9,
        salesCount: 1892,
        stock: 50,
        releaseDate: '2024-01-20'
      },
      {
        id: 3,
        name: '机械键盘',
        price: '¥499.00',
        image: 'https://picsum.photos/id/60/300/300',
        description: '机械青轴键盘，RGB背光',
        categoryId: 'electronics',
        rating: 4.7,
        salesCount: 1234,
        stock: 75,
        releaseDate: '2024-02-01'
      },
      {
        id: 4,
        name: '高清摄像头',
        price: '¥349.00',
        image: 'https://picsum.photos/id/61/300/300',
        description: '1080P高清摄像头，自动对焦',
        categoryId: 'electronics',
        rating: 4.6,
        salesCount: 567,
        stock: 30,
        releaseDate: '2024-02-05'
      }
    ];

    // 处理分页
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // 返回分页数据
    const paginatedProducts = {
      products: products.slice(startIndex, endIndex),
      total: products.length,
      page,
      totalPages: Math.ceil(products.length / limit)
    };

    res.json(paginatedProducts);
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({ message: '获取商品列表失败' });
  }
};

const getProductDetail = (req, res) => {
  const id = parseInt(req.params.id);

  // 模拟产品详情数据
  const productsData = [
    {
      id: 1,
      name: "无线蓝牙耳机",
      description: "高品质音效，长久续航，舒适佩戴，兼容多种设备，操作简单方便，轻松畅享音乐世界。采用先进蓝牙5.0技术，连接稳定，音质清晰，内置高性能麦克风，通话更加清晰。",
      price: "¥299.00",
      originalPrice: "¥399.00",
      discount: 25,
      stock: 198,
      image: "https://picsum.photos/id/1/800/800",
      images: [
        "https://picsum.photos/id/1/800/800",
        "https://picsum.photos/id/2/800/800",
        "https://picsum.photos/id/3/800/800"
      ],
      rating: 4.9,
      reviewCount: 612,
      salesCount: 4580,
      categoryId: 'audio',
      brandId: 'brand2',
      features: [
        "蓝牙5.0技术",
        "主动降噪",
        "长达20小时续航",
        "IP67防水",
        "触控操作"
      ],
      specifications: {
        "品牌": "品牌2",
        "型号": "BT-001",
        "颜色": "黑色/白色/蓝色",
        "蓝牙版本": "5.0",
        "续航时间": "20小时",
        "充电时间": "1.5小时",
        "重量": "48g"
      }
    },
    {
      id: 2,
      name: "智能手表",
      description: "健康监测，运动记录，消息提醒，多功能于一体。24小时心率监测，血氧检测，睡眠质量分析，50+运动模式，5ATM防水，长达14天续航。",
      price: "¥599.00",
      originalPrice: "¥799.00",
      discount: 25,
      stock: 86,
      image: "https://picsum.photos/id/2/800/800",
      images: [
        "https://picsum.photos/id/2/800/800",
        "https://picsum.photos/id/4/800/800",
        "https://picsum.photos/id/6/800/800"
      ],
      rating: 4.7,
      reviewCount: 246,
      salesCount: 890,
      categoryId: 'wearables',
      brandId: 'brand1',
      features: [
        "血氧监测",
        "心率监测",
        "睡眠分析",
        "50+运动模式",
        "长达14天续航"
      ],
      specifications: {
        "品牌": "品牌1",
        "型号": "SW-02",
        "颜色": "黑色/银色/玫瑰金",
        "显示屏": "1.39英寸AMOLED",
        "防水等级": "5ATM",
        "续航时间": "14天",
        "重量": "32g"
      }
    }
  ];

  const product = productsData.find(item => item.id === id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({
      message: `未找到ID为${id}的产品。`
    });
  }
};

const getPromotionsData = (req, res) => {
  try {
    const promotions = [
      {
        id: 1,
        title: '春季大促',
        description: '全场商品5折起',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        image: 'https://picsum.photos/id/101/800/400'
      },
      {
        id: 2,
        title: '新品上市',
        description: '新品限时8折',
        startDate: '2024-03-15',
        endDate: '2024-03-31',
        image: 'https://picsum.photos/id/102/800/400'
      }
    ];
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNewArrivalsData = (req, res) => {
  try {
    const newArrivals = [
      {
        id: 1,
        name: '新款智能手机',
        price: '¥3999.00',
        image: 'https://picsum.photos/id/103/300/300',
        description: '最新款智能手机，搭载最新处理器',
        rating: 4.9,
        salesCount: 1234
      },
      {
        id: 2,
        name: '智能手表Pro',
        price: '¥1999.00',
        image: 'https://picsum.photos/id/104/300/300',
        description: '新一代智能手表，支持更多健康监测功能',
        rating: 4.8,
        salesCount: 987
      }
    ];
    res.json(newArrivals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrdersData = (req, res) => {
  try {
    // 模拟订单数据
    const ordersData = [
      {
        id: 'ORD20250412001',
        date: '2025-04-12 14:30:25',
        status: '待收货',
        total: '1599.00',
        products: [
          {
            id: 1,
            name: '智能手表Pro',
            price: '¥999.00',
            quantity: 1,
            image: 'https://picsum.photos/id/26/100/100'
          },
          {
            id: 2,
            name: '便携式蓝牙音箱',
            price: '¥299.00',
            quantity: 2,
            image: 'https://picsum.photos/id/29/100/100'
          }
        ]
      },
      {
        id: 'ORD20250413002',
        date: '2025-04-13 09:15:33',
        status: '已完成',
        total: '299.00',
        products: [
          {
            id: 3,
            name: '无线蓝牙耳机',
            price: '¥299.00',
            quantity: 1,
            image: 'https://picsum.photos/id/28/100/100'
          }
        ]
      }
    ];

    res.send(ordersData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 添加商品到购物车
const addToCart = (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // 模拟添加到购物车的响应
    const addedItem = {
      id: Date.now(),
      productId,
      name: '新添加的商品',
      price: '¥299.00',
      image: 'https://picsum.photos/id/1/300/300',
      quantity,
      selected: true
    };
    res.status(201).json(addedItem);
  } catch (error) {
    console.error('添加购物车失败:', error);
    res.status(500).json({ message: '添加购物车失败' });
  }
};

// 更新购物车商品数量
const updateCartItem = (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    // 模拟更新购物车商品的响应
    const updatedItem = {
      id: parseInt(id),
      productId: 1,
      name: '更新的商品',
      price: '¥299.00',
      image: 'https://picsum.photos/id/1/300/300',
      quantity,
      selected: true
    };
    res.json(updatedItem);
  } catch (error) {
    console.error('更新购物车失败:', error);
    res.status(500).json({ message: '更新购物车失败' });
  }
};

// 删除购物车商品
const deleteCartItem = (req, res) => {
  try {
    const { id } = req.params;
    // 模拟删除购物车商品的响应
    res.status(204).send();
  } catch (error) {
    console.error('删除购物车商品失败:', error);
    res.status(500).json({ message: '删除购物车商品失败' });
  }
};

// 获取相关商品
const getRelatedProducts = (req, res) => {
  try {
    const { id } = req.params;
    // 模拟相关商品数据
    const relatedProducts = [
      {
        id: 201,
        name: '相关商品1',
        price: '¥399.00',
        image: 'https://picsum.photos/id/71/300/300',
        description: '相关商品描述1',
        rating: 4.7,
        salesCount: 892
      },
      {
        id: 202,
        name: '相关商品2',
        price: '¥499.00',
        image: 'https://picsum.photos/id/72/300/300',
        description: '相关商品描述2',
        rating: 4.8,
        salesCount: 654
      },
      {
        id: 203,
        name: '相关商品3',
        price: '¥599.00',
        image: 'https://picsum.photos/id/73/300/300',
        description: '相关商品描述3',
        rating: 4.6,
        salesCount: 432
      }
    ];
    res.json(relatedProducts);
  } catch (error) {
    console.error('获取相关商品失败:', error);
    res.status(500).json({ message: '获取相关商品失败' });
  }
};

// 导出所有控制器函数
export default {
  getHomeData,
  getCarouselData,
  getCartData,
  getRecommendedProducts,
  getUserData,
  getOrderData,
  getProductDetail,
  getPromotionsData,
  getNewArrivalsData,
  getFavoritesData,
  getAddressesData,
  getAllProducts,
  getOrdersData,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getRelatedProducts
};

