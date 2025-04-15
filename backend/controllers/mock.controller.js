/**
 * 模拟数据控制器
 * 提供各类前端所需的模拟数据
 */
const getHomeData = (req, res) => {
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
        rating: 4.6,
        salesCount: 1678
      },
      {
        id: 3,
        name: '便携式充电宝',
        price: '¥199.00',
        image: 'https://picsum.photos/id/3/300/300',
        rating: 4.9,
        salesCount: 3210
      },
      {
        id: 4,
        name: '无线充电器',
        price: '¥129.00',
        image: 'https://picsum.photos/id/4/300/300',
        rating: 4.7,
        salesCount: 1986
      }
    ],

    // 新品上市
    newProducts: [
      {
        id: 5,
        name: '智能门锁',
        price: '¥1299.00',
        image: 'https://picsum.photos/id/5/300/300',
        rating: 4.5,
        isNew: true
      },
      {
        id: 6,
        name: '智能音箱',
        price: '¥699.00',
        image: 'https://picsum.photos/id/6/300/300',
        rating: 4.7,
        isNew: true
      },
      {
        id: 7,
        name: '智能体重秤',
        price: '¥199.00',
        image: 'https://picsum.photos/id/7/300/300',
        rating: 4.6,
        isNew: true
      },
      {
        id: 8,
        name: '机械键盘',
        price: '¥499.00',
        image: 'https://picsum.photos/id/8/300/300',
        rating: 4.8,
        isNew: true
      }
    ],

    // 推荐商品列表
    recommendedProducts: [
      {
        id: 9,
        name: '便携式蓝牙音箱',
        price: '¥399.00',
        image: 'https://picsum.photos/id/9/300/300',
        rating: 4.7,
      },
      {
        id: 10,
        name: '超薄移动电源',
        price: '¥149.00',
        image: 'https://picsum.photos/id/10/300/300',
        rating: 4.7,
      },
      {
        id: 11,
        name: '游戏鼠标',
        price: '¥399.00',
        image: 'https://picsum.photos/id/11/300/300',
        rating: 4.9,
      },
      {
        id: 12,
        name: '机械硬盘',
        price: '¥499.00',
        image: 'https://picsum.photos/id/12/300/300',
        rating: 4.6,
      },
      {
        id: 13,
        name: '蓝牙音箱',
        price: '¥899.00',
        image: 'https://picsum.photos/id/13/300/300',
        rating: 4.7,
      },
      {
        id: 14,
        name: '无线鼠标',
        price: '¥199.00',
        image: 'https://picsum.photos/id/14/300/300',
        rating: 4.5,
      },
      {
        id: 15,
        name: '手机壳',
        price: '¥59.00',
        image: 'https://picsum.photos/id/15/300/300',
        rating: 4.8,
      },
      {
        id: 16,
        name: '数据线',
        price: '¥39.00',
        image: 'https://picsum.photos/id/16/300/300',
        rating: 4.6,
      }
    ]
  };

  res.send(homeData);
};

const getCarouselData = (req, res) => {
  // 模拟轮播图数据
  const carouselData = [
    {
      title: "新款夏季服装上市",
      description: "清凉透气，时尚有型",
      buttonText: "立即查看",
      imageUrl: "https://picsum.photos/id/237/1200/400"
    },
    {
      title: "电子产品大促销",
      description: "限时折扣，不容错过",
      buttonText: "查看详情",
      imageUrl: "https://picsum.photos/id/180/1200/400"
    },
    {
      title: "家居装饰新品",
      description: "为您的家增添温馨",
      buttonText: "去选购",
      imageUrl: "https://picsum.photos/id/160/1200/400"
    },
    {
      title: "运动健身装备",
      description: "健康生活，从这里开始",
      buttonText: "了解更多",
      imageUrl: "https://picsum.photos/id/106/1200/400"
    }
  ];

  res.send(carouselData);
};

const getCartData = (req, res) => {
  // 模拟购物车数据
  const cartData = {
    items: [
      {
        id: 1,
        name: '智能手表Pro',
        price: '¥999.00',
        originalPrice: '¥1599.00',
        quantity: 1,
        image: 'https://picsum.photos/id/26/300/300',
        attributes: {
          '颜色': '黑色',
          '尺寸': '42mm'
        },
        selected: true
      },
      {
        id: 2,
        name: '无线蓝牙耳机',
        price: '¥299.00',
        originalPrice: '¥399.00',
        quantity: 2,
        image: 'https://picsum.photos/id/28/300/300',
        attributes: {
          '颜色': '白色'
        },
        selected: true
      },
      {
        id: 3,
        name: '超薄移动电源',
        price: '¥149.00',
        quantity: 1,
        image: 'https://picsum.photos/id/12/300/300',
        selected: false
      }
    ]
  };

  res.send(cartData);
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
  // 模拟用户信息
  const userData = {
    username: '张小明',
    email: 'xiaoming@example.com',
    phone: '13812345678',
    realName: '张小明',
    gender: 'male',
    birthday: '1990-01-01',
    avatar: 'https://picsum.photos/id/1005/200/200'
  };

  res.send(userData);
};

const getOrdersData = (req, res) => {
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
  // 模拟所有商品数据
  const productsData = [
    {
      id: 1,
      name: '智能手表Pro',
      description: '多功能监测，长续航，防水设计，支持多种运动模式和健康追踪',
      price: '¥999',
      originalPrice: '¥1299',
      image: 'https://picsum.photos/id/20/300/300',
      rating: 4.8,
      reviewCount: 324,
      salesCount: 1254,
      categoryId: 'wearables',
      brandId: 'brand1',
      discount: 23
    },
    {
      id: 2,
      name: '无线蓝牙耳机',
      description: '高品质音效，降噪功能，超长续航时间，舒适佩戴',
      price: '¥299',
      image: 'https://picsum.photos/id/21/300/300',
      rating: 4.9,
      reviewCount: 612,
      salesCount: 4580,
      categoryId: 'audio',
      brandId: 'brand2'
    },
    {
      id: 3,
      name: '智能手表',
      description: '健康监测，长续航，多种运动模式，支持消息通知',
      price: '¥899',
      originalPrice: '¥1299',
      image: 'https://picsum.photos/id/22/300/300',
      rating: 4.6,
      reviewCount: 246,
      salesCount: 890,
      categoryId: 'wearables',
      brandId: 'brand1',
      discount: 30
    },
    {
      id: 4,
      name: '便携式空气净化器',
      description: '高效过滤，静音设计，智能控制，适合家庭办公室使用',
      price: '¥1299',
      image: 'https://picsum.photos/id/23/300/300',
      rating: 4.5,
      reviewCount: 158,
      salesCount: 456,
      categoryId: 'home-appliances',
      brandId: 'brand3'
    },
    {
      id: 5,
      name: '数码相机',
      description: '高像素，多功能，便携设计，适合摄影爱好者',
      price: '¥3999',
      originalPrice: '¥4599',
      image: 'https://picsum.photos/id/24/300/300',
      rating: 4.8,
      reviewCount: 89,
      salesCount: 245,
      categoryId: 'photography',
      brandId: 'brand4',
      discount: 13
    }
  ];

  // 如果有查询参数，可以根据参数进行过滤
  const { categoryId, brandId, priceRange, search } = req.query;
  let filteredProducts = [...productsData];

  // 根据分类进行筛选
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId);
  }

  // 根据品牌进行筛选
  if (brandId) {
    filteredProducts = filteredProducts.filter(product => product.brandId === brandId);
  }

  // 根据价格区间进行筛选
  if (priceRange) {
    const [min, max] = priceRange.split('-');
    if (min && max) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseInt(product.price.replace('¥', ''));
        return price >= parseInt(min) && price <= parseInt(max);
      });
    } else if (min) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseInt(product.price.replace('¥', ''));
        return price >= parseInt(min);
      });
    }
  }

  // 根据搜索关键词进行筛选
  if (search) {
    const keyword = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword)
    );
  }

  res.send(filteredProducts);
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
  const promotionsData = {
    // 促销Banner
    banners: [
      {
        id: 1,
        title: "年中大促",
        description: "全场低至5折，限时抢购！",
        imageUrl: "https://picsum.photos/id/1059/1200/300"
      },
      {
        id: 2,
        title: "夏季新品",
        description: "清凉夏日，畅享折扣",
        imageUrl: "https://picsum.photos/id/106/1200/300"
      },
      {
        id: 3,
        title: "会员专享",
        description: "会员专享95折，更多会员权益等你发现",
        imageUrl: "https://picsum.photos/id/119/1200/300"
      }
    ],

    // 限时抢购商品
    flashSales: [
      {
        id: 101,
        name: "智能手表",
        price: "¥399",
        originalPrice: "¥599",
        discount: 33,
        soldPercentage: 85,
        image: "https://picsum.photos/id/367/300/300"
      },
      {
        id: 102,
        name: "无线蓝牙音箱",
        price: "¥199",
        originalPrice: "¥329",
        discount: 40,
        soldPercentage: 65,
        image: "https://picsum.photos/id/403/300/300"
      },
      {
        id: 103,
        name: "真无线蓝牙耳机",
        price: "¥249",
        originalPrice: "¥399",
        discount: 38,
        soldPercentage: 75,
        image: "https://picsum.photos/id/304/300/300"
      },
      {
        id: 104,
        name: "便携式充电宝",
        price: "¥129",
        originalPrice: "¥199",
        discount: 35,
        soldPercentage: 90,
        image: "https://picsum.photos/id/201/300/300"
      }
    ],

    // 优惠券
    coupons: [
      {
        id: 1,
        name: "全场通用券",
        amount: 50,
        minSpend: 300,
        scope: "全场通用",
        validUntil: "2025-05-31",
        status: "available"
      },
      {
        id: 2,
        name: "数码专享券",
        amount: 100,
        minSpend: 500,
        scope: "数码产品专用",
        validUntil: "2025-05-15",
        status: "available"
      },
      {
        id: 3,
        name: "服装专享券",
        amount: 30,
        minSpend: 200,
        scope: "服装鞋帽专用",
        validUntil: "2025-05-20",
        status: "claimed"
      },
      {
        id: 4,
        name: "新人专享券",
        amount: 20,
        minSpend: 100,
        scope: "无使用门槛",
        validUntil: "2025-06-30",
        status: "available"
      }
    ]
  };

  res.json(promotionsData);
};

const getNewArrivalsData = (req, res) => {
  const newArrivalsData = {
    // 分类数据
    categories: [
      {
        id: "electronics",
        name: "电子产品"
      },
      {
        id: "clothing",
        name: "服装鞋帽"
      },
      {
        id: "home",
        name: "家居生活"
      },
      {
        id: "sports",
        name: "运动户外"
      }
    ],

    // 新品上市特色商品
    featuredProducts: [
      {
        id: 201,
        name: "智能手环",
        shortDescription: "24小时心率监测，睡眠分析，50米防水",
        price: "¥299",
        image: "https://picsum.photos/id/365/800/600"
      },
      {
        id: 202,
        name: "高清智能投影仪",
        shortDescription: "1080P高清画质，智能对焦，无线投屏",
        price: "¥2499",
        image: "https://picsum.photos/id/403/800/600"
      },
      {
        id: 203,
        name: "轻薄笔记本电脑",
        shortDescription: "最新处理器，全金属机身，长续航",
        price: "¥5999",
        image: "https://picsum.photos/id/119/800/600"
      }
    ],

    // 分类下的新品
    products: [
      // 电子产品
      {
        id: 301,
        name: "智能语音助手",
        price: "¥399",
        releaseDate: "2025-04-10 上市",
        image: "https://picsum.photos/id/175/300/300",
        categoryId: "electronics"
      },
      {
        id: 302,
        name: "无线充电器",
        price: "¥129",
        releaseDate: "2025-04-05 上市",
        image: "https://picsum.photos/id/201/300/300",
        categoryId: "electronics"
      },
      {
        id: 303,
        name: "智能手表",
        price: "¥599",
        releaseDate: "2025-04-12 上市",
        image: "https://picsum.photos/id/367/300/300",
        categoryId: "electronics"
      },
      {
        id: 304,
        name: "蓝牙耳机",
        price: "¥299",
        releaseDate: "2025-04-08 上市",
        image: "https://picsum.photos/id/334/300/300",
        categoryId: "electronics"
      },

      // 服装鞋帽
      {
        id: 305,
        name: "运动休闲鞋",
        price: "¥339",
        releaseDate: "2025-04-11 上市",
        image: "https://picsum.photos/id/103/300/300",
        categoryId: "clothing"
      },
      {
        id: 306,
        name: "纯棉T恤",
        price: "¥129",
        releaseDate: "2025-04-13 上市",
        image: "https://picsum.photos/id/786/300/300",
        categoryId: "clothing"
      },
      {
        id: 307,
        name: "牛仔外套",
        price: "¥299",
        releaseDate: "2025-04-09 上市",
        image: "https://picsum.photos/id/628/300/300",
        categoryId: "clothing"
      },
      {
        id: 308,
        name: "防晒帽",
        price: "¥89",
        releaseDate: "2025-04-15 上市",
        image: "https://picsum.photos/id/667/300/300",
        categoryId: "clothing"
      },

      // 家居生活
      {
        id: 309,
        name: "智能台灯",
        price: "¥199",
        releaseDate: "2025-04-07 上市",
        image: "https://picsum.photos/id/615/300/300",
        categoryId: "home"
      },
      {
        id: 310,
        name: "厨房刀具套装",
        price: "¥399",
        releaseDate: "2025-04-14 上市",
        image: "https://picsum.photos/id/425/300/300",
        categoryId: "home"
      },
      {
        id: 311,
        name: "智能扫地机器人",
        price: "¥1299",
        releaseDate: "2025-04-06 上市",
        image: "https://picsum.photos/id/870/300/300",
        categoryId: "home"
      },
      {
        id: 312,
        name: "床上四件套",
        price: "¥269",
        releaseDate: "2025-04-10 上市",
        image: "https://picsum.photos/id/380/300/300",
        categoryId: "home"
      },

      // 运动户外
      {
        id: 313,
        name: "瑜伽垫",
        price: "¥99",
        releaseDate: "2025-04-08 上市",
        image: "https://picsum.photos/id/58/300/300",
        categoryId: "sports"
      },
      {
        id: 314,
        name: "登山背包",
        price: "¥239",
        releaseDate: "2025-04-12 上市",
        image: "https://picsum.photos/id/116/300/300",
        categoryId: "sports"
      },
      {
        id: 315,
        name: "户外帐篷",
        price: "¥459",
        releaseDate: "2025-04-05 上市",
        image: "https://picsum.photos/id/274/300/300",
        categoryId: "sports"
      },
      {
        id: 316,
        name: "运动手环",
        price: "¥199",
        releaseDate: "2025-04-11 上市",
        image: "https://picsum.photos/id/325/300/300",
        categoryId: "sports"
      }
    ],

    // 即将发售产品
    upcomingProducts: [
      {
        id: 401,
        name: "可折叠智能手机",
        shortDescription: "突破性设计，全新交互体验",
        releaseDate: "2025-05-15",
        countdown: 30,
        importance: "high",
        image: "https://picsum.photos/id/160/300/300"
      },
      {
        id: 402,
        name: "智能健康手表",
        shortDescription: "全方位健康监测，多运动模式",
        releaseDate: "2025-04-25",
        countdown: 10,
        importance: "medium",
        image: "https://picsum.photos/id/367/300/300"
      },
      {
        id: 403,
        name: "无线降噪耳机",
        shortDescription: "主动降噪，高保真音质",
        releaseDate: "2025-05-05",
        countdown: 20,
        importance: "medium",
        image: "https://picsum.photos/id/334/300/300"
      },
      {
        id: 404,
        name: "超高清游戏显示器",
        shortDescription: "144Hz刷新率，1ms响应时间",
        releaseDate: "2025-05-20",
        countdown: 35,
        importance: "high",
        image: "https://picsum.photos/id/116/300/300"
      }
    ]
  };

  res.json(newArrivalsData);
};

export default {
  getHomeData,
  getCarouselData,
  getCartData,
  getRecommendedProducts,
  getUserData,
  getOrdersData,
  getFavoritesData,
  getAddressesData,
  getAllProducts,
  getProductDetail,
  getPromotionsData,
  getNewArrivalsData
};