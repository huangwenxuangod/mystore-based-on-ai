import Mock from 'mockjs'

// 定义购物车相关接口
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  quantity: number;
  selected: boolean;
  stock?: number;
  specifications?: string[];
  limitPerOrder?: number;
  isGift?: boolean;
}

interface CartData {
  items: CartItem[];
  total: string;
  selectedTotal?: string;
  totalQuantity?: number;
  selectedCount?: number;
  discount?: string;
  deliveryFee?: string;
  finalTotal?: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 初始化购物车数据
let cartData: CartData = {
  items: [
    {
      id: 1,
      productId: 1,
      name: '无线蓝牙耳机',
      price: '¥299.00',
      originalPrice: '¥399.00',
      image: 'https://picsum.photos/id/1/300/300',
      quantity: 2,
      selected: true,
      stock: 100,
      specifications: ['白色', '标准版']
    },
    {
      id: 2,
      productId: 2,
      name: '智能手表',
      price: '¥599.00',
      originalPrice: '¥799.00',
      image: 'https://picsum.photos/id/2/300/300',
      quantity: 1,
      selected: true,
      stock: 50,
      specifications: ['黑色', '运动版']
    },
    {
      id: 3,
      productId: 9,
      name: '便携式蓝牙音箱',
      price: '¥299.00',
      originalPrice: '¥399.00',
      image: 'https://picsum.photos/id/29/300/300',
      quantity: 1,
      selected: false,
      stock: 60,
      specifications: ['蓝色', '标准版']
    }
  ],
  total: '¥1197.00',
  selectedTotal: '¥1197.00',
  totalQuantity: 4,
  selectedCount: 3,
  discount: '¥200.00',
  deliveryFee: '¥0.00',
  finalTotal: '¥997.00'
};

// 计算购物车总价和数量
const calculateCartTotal = () => {
  let total = 0;
  let selectedTotal = 0;
  let totalQuantity = 0;
  let selectedCount = 0;
  
  cartData.items.forEach(item => {
    const price = parseFloat(item.price.replace('¥', ''));
    const itemTotal = price * item.quantity;
    
    total += itemTotal;
    totalQuantity += item.quantity;
    
    if (item.selected) {
      selectedTotal += itemTotal;
      selectedCount += item.quantity;
    }
  });
  
  // 应用折扣逻辑 (示例: 满1000减200)
  let discount = 0;
  if (selectedTotal >= 1000) {
    discount = 200;
  }
  
  // 运费逻辑 (示例: 满999免运费，否则10元运费)
  let deliveryFee = 0;
  if (selectedTotal < 999 && selectedTotal > 0) {
    deliveryFee = 10;
  }
  
  // 更新购物车数据
  cartData.total = `¥${total.toFixed(2)}`;
  cartData.selectedTotal = `¥${selectedTotal.toFixed(2)}`;
  cartData.totalQuantity = totalQuantity;
  cartData.selectedCount = selectedCount;
  cartData.discount = `¥${discount.toFixed(2)}`;
  cartData.deliveryFee = `¥${deliveryFee.toFixed(2)}`;
  cartData.finalTotal = `¥${(selectedTotal - discount + deliveryFee).toFixed(2)}`;
}

// 获取购物车数据
Mock.mock('/api/cart', 'get', (): { data: CartData; success: boolean } => {
  calculateCartTotal();
  return {
    data: cartData,
    success: true
  };
});

// 添加商品到购物车
Mock.mock('/api/cart', 'post', (options: any) => {
  const { productId, quantity } = JSON.parse(options.body);
  
  // 检查商品是否已在购物车中
  const existingItem = cartData.items.find(item => item.productId === productId);
  
  if (existingItem) {
    // 更新数量
    existingItem.quantity += quantity;
    
    if (existingItem.stock !== undefined && existingItem.quantity > existingItem.stock) {
      existingItem.quantity = existingItem.stock;
    }
  } else {
    // 添加新商品
    const newId = Math.max(...cartData.items.map(item => item.id), 0) + 1;
    const price = Random.float(99, 9999, 2, 2).toFixed(2);
    const originalPrice = Random.float(parseFloat(price), parseFloat(price) * 1.5, 2, 2).toFixed(2);
    
    const productName = Random.ctitle(2, 5) + Random.pick(['智能手机', '智能手表', '蓝牙耳机', '机械键盘', '电子书', '平板电脑']);
    const stock = Random.integer(20, 200);
    
    cartData.items.push({
      id: newId,
      productId,
      name: productName,
      price: `¥${price}`,
      originalPrice: `¥${originalPrice}`,
      image: `https://picsum.photos/id/${(productId % 100) + 1}/300/300`,
      quantity: Math.min(quantity, stock),
      selected: true,
      stock,
      specifications: [
        Random.pick(['黑色', '白色', '银色', '金色', '蓝色']), 
        Random.pick(['标准版', '豪华版', '专业版', '入门版'])
      ]
    });
  }
  
  calculateCartTotal();
  
  return {
    success: true,
    message: '添加购物车成功',
    data: cartData
  };
});

// 更新购物车商品数量
Mock.mock(/\/api\/cart\/\d+$/, 'put', (options: any) => {
  const id = parseInt(options.url.split('/').pop(), 10);
  const { quantity } = JSON.parse(options.body);
  const item = cartData.items.find(item => item.id === id);
  
  if (item) {
    item.quantity = quantity;
    
    if (item.stock !== undefined && item.quantity > item.stock) {
      item.quantity = item.stock;
    }
    
    calculateCartTotal();
    
    return {
      success: true,
      message: '更新购物车成功',
      item,
      data: cartData
    };
  }
  
  return {
    success: false,
    message: '购物车中不存在该商品',
    code: 'ITEM_NOT_FOUND'
  };
});

// 删除购物车商品
Mock.mock(/\/api\/cart\/\d+$/, 'delete', (options: any) => {
  const id = parseInt(options.url.split('/').pop(), 10);
  const index = cartData.items.findIndex(item => item.id === id);
  
  if (index >= 0) {
    cartData.items.splice(index, 1);
    calculateCartTotal();
    
    return {
      success: true,
      message: '删除成功',
      data: cartData
    };
  }
  
  return {
    success: false,
    message: '购物车中不存在该商品',
    code: 'ITEM_NOT_FOUND'
  };
});

// 更新商品选中状态
Mock.mock('/api/cart/select', 'put', (options: any) => {
  const { ids, selected } = JSON.parse(options.body);
  
  if (Array.isArray(ids)) {
    cartData.items.forEach(item => {
      if (ids.includes(item.id)) {
        item.selected = selected;
      }
    });
  } else {
    cartData.items.forEach(item => {
      item.selected = selected;
    });
  }
  
  calculateCartTotal();
  
  return {
    success: true,
    message: '更新成功',
    data: cartData
  };
});

// 清空购物车
Mock.mock('/api/cart/clear', 'post', () => {
  cartData.items = [];
  calculateCartTotal();
  
  return {
    success: true,
    message: '购物车已清空',
    data: cartData
  };
});