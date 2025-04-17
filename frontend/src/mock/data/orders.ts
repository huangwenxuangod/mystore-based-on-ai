import Mock from 'mockjs'

// 定义订单相关接口
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: string;
  originalPrice?: string;
  quantity: number;
  image: string;
  sku?: string;
  attributes?: Record<string, string>;
  total?: string;
  status?: string;
}

export interface Order {
  id: string;
  orderTime: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
  address?: {
    name: string;
    phone: string;
    address: string;
  };
  payment?: {
    method: string;
    account?: string;
    paid: boolean;
    paidTime?: string;
  };
  delivery?: {
    method: string;
    trackingNumber?: string;
    status?: string;
    estimatedDelivery?: string;
  };
  invoice?: {
    type: string;
    title: string;
    content: string;
  };
  remark?: string;
  timeline?: OrderEvent[];
  couponAmount?: string;
  originalAmount?: string;
  shippingFee?: string;
}

export interface OrderEvent {
  time: string;
  status: string;
  description: string;
}

export interface OrderParams {
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderDetails extends Order {
  customer?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
  orderNumber?: string;
  paymentDeadline?: string;
  additionalServices?: Array<{
    name: string;
    price: string;
    selected: boolean;
  }>;
  refund?: {
    status: string;
    amount: string;
    reason: string;
    appliedTime: string;
    processedTime?: string;
  };
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
    sku?: string;
  }>;
  addressId: number;
  paymentMethod: string;
  deliveryMethod?: string;
  couponId?: number;
  invoice?: {
    type: string;
    title: string;
    content: string;
  };
  remark?: string;
}

// 使用Mock.Random增强数据随机性
const Random = Mock.Random;

// 模拟订单列表
const generateOrderList = (count: number): Order[] => {
  const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['支付宝', '微信支付', '银联', '货到付款'];
  const deliveryMethods = ['普通快递', '顺丰速运', '京东快递'];
  
  return Array.from({ length: count }).map((_, index) => {
    const itemCount = Random.integer(1, 5);
    const status = statuses[Random.integer(0, 4)];
    
    // 生成随机订单项
    const items: OrderItem[] = Array.from({ length: itemCount }).map((_, i) => {
      const productId = Random.integer(1, 20);
      const quantity = Random.integer(1, 5);
      const originalPrice = Random.integer(50, 9999);
      const discount = Random.float(0.5, 0.9, 1, 1);
      const price = Math.floor(originalPrice * discount);
      
      return {
        id: Random.integer(1000, 9999),
        productId,
        productName: `商品${productId}`,
        price: `¥${price}`,
        originalPrice: `¥${originalPrice}`,
        quantity,
        image: `https://picsum.photos/id/${20 + i}/100/100`,
        sku: `SKU${Random.string('upper', 8)}`,
        attributes: {
          color: ['黑色', '白色', '红色', '蓝色'][Random.integer(0, 3)],
          size: ['S', 'M', 'L', 'XL'][Random.integer(0, 3)]
        },
        total: `¥${price * quantity}`
      };
    });
    
    // 计算订单总金额
    const totalAmount = items.reduce((sum, item) => {
      return sum + parseInt(item.total!.replace('¥', ''));
    }, 0);
    
    // 生成订单对象
    return {
      id: `ORD${Date.now().toString().slice(-8)}${index}`,
      orderTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      totalAmount: `¥${totalAmount}`,
      status,
      items,
      address: {
        name: Random.cname(),
        phone: `1${Random.string('number', 10)}`,
        address: `${Random.province()}${Random.city()}${Random.county()}${Random.ctitle(10, 20)}号`
      },
      payment: {
        method: paymentMethods[Random.integer(0, 3)],
        paid: ['paid', 'shipped', 'delivered'].includes(status),
        paidTime: ['paid', 'shipped', 'delivered'].includes(status) ? Random.datetime('yyyy-MM-dd HH:mm:ss') : undefined
      },
      delivery: {
        method: deliveryMethods[Random.integer(0, 2)],
        trackingNumber: ['shipped', 'delivered'].includes(status) ? Random.string('number', 12) : undefined,
        status: ['shipped', 'delivered'].includes(status) ? 
                (status === 'delivered' ? '已送达' : '运输中') : undefined,
        estimatedDelivery: ['shipped'].includes(status) ? 
                          Random.datetime('yyyy-MM-dd') : undefined
      },
      remark: Random.boolean() ? Random.ctitle(5, 20) : undefined,
      originalAmount: `¥${Math.floor(totalAmount * 1.1)}`,
      couponAmount: `¥${Math.floor(totalAmount * 0.1)}`,
      shippingFee: `¥${Random.integer(10, 20)}`
    };
  });
};

// 生成订单详情
const generateOrderDetails = (orderId: string): OrderDetails => {
  // 首先找到基本订单信息
  const order = mockOrderList.find(o => o.id === orderId);
  
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // 根据订单状态生成订单事件时间轴
  const timeline: OrderEvent[] = [];
  const orderDate = new Date(order.orderTime);
  
  timeline.push({
    time: order.orderTime,
    status: 'created',
    description: '订单创建成功'
  });
  
  if (['paid', 'shipped', 'delivered'].includes(order.status)) {
    const paidTime = new Date(orderDate.getTime() + 30 * 60 * 1000); // 下单后30分钟支付
    timeline.push({
      time: paidTime.toISOString().replace('T', ' ').substring(0, 19),
      status: 'paid',
      description: `支付成功，支付方式: ${order.payment?.method}`
    });
  }
  
  if (['shipped', 'delivered'].includes(order.status)) {
    const shippedTime = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000); // 下单后1天发货
    timeline.push({
      time: shippedTime.toISOString().replace('T', ' ').substring(0, 19),
      status: 'shipped',
      description: `商品已发货，物流方式: ${order.delivery?.method}, 运单号: ${order.delivery?.trackingNumber}`
    });
  }
  
  if (order.status === 'delivered') {
    const deliveredTime = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 下单后3天送达
    timeline.push({
      time: deliveredTime.toISOString().replace('T', ' ').substring(0, 19),
      status: 'delivered',
      description: '商品已送达'
    });
  }
  
  if (order.status === 'cancelled') {
    const cancelledTime = new Date(orderDate.getTime() + 10 * 60 * 1000); // 下单后10分钟取消
    timeline.push({
      time: cancelledTime.toISOString().replace('T', ' ').substring(0, 19),
      status: 'cancelled',
      description: '订单已取消'
    });
  }
  
  // 生成详细订单信息
  const details: OrderDetails = {
    ...order,
    timeline,
    orderNumber: order.id,
    customer: {
      id: 1,
      name: order.address?.name || '未知',
      email: 'customer@example.com',
      phone: order.address?.phone
    },
    paymentDeadline: order.status === 'pending' ? 
      new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : 
      undefined,
    additionalServices: [
      {
        name: '延长保修1年',
        price: '¥50.00',
        selected: Random.boolean()
      },
      {
        name: '专业安装服务',
        price: '¥100.00',
        selected: Random.boolean()
      }
    ]
  };
  
  // 如果订单状态是取消并且已经支付，添加退款信息
  if (order.status === 'cancelled' && order.payment?.paid) {
    details.refund = {
      status: 'completed',
      amount: order.totalAmount,
      reason: '用户取消订单',
      appliedTime: timeline[timeline.length - 1].time,
      processedTime: new Date(new Date(timeline[timeline.length - 1].time).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19)
    };
  }
  
  return details;
};

// 初始化模拟订单列表
const mockOrderList = generateOrderList(20);

// 获取订单列表
Mock.mock(/\/api\/orders(\?.+)?$/, 'get', (options: any) => {
  // 解析查询参数
  const url = options.url;
  const queryString = url.split('?')[1] || '';
  const params = new URLSearchParams(queryString);
  
  const status = params.get('status') || null;
  const page = parseInt(params.get('page') || '1', 10);
  const pageSize = parseInt(params.get('pageSize') || '10', 10);
  const sortBy = params.get('sortBy') || 'orderTime';
  const sortOrder = params.get('sortOrder') || 'desc';
  
  // 过滤订单
  let filteredOrders = mockOrderList.slice();
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  // 排序订单
  filteredOrders.sort((a, b) => {
    if (sortBy === 'orderTime') {
      const dateA = new Date(a.orderTime).getTime();
      const dateB = new Date(b.orderTime).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'totalAmount') {
      const amountA = parseFloat(a.totalAmount.replace('¥', ''));
      const amountB = parseFloat(b.totalAmount.replace('¥', ''));
      return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    }
    return 0;
  });
  
  // 分页
  const total = filteredOrders.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedOrders = filteredOrders.slice(startIndex, endIndex);
  
  return {
    orders: pagedOrders,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    success: true
  };
});

// 获取订单详情
Mock.mock(/\/api\/orders\/[A-Za-z0-9]+$/, 'get', (options: any) => {
  const orderId = options.url.split('/').pop();
  
  try {
    const orderDetails = generateOrderDetails(orderId);
    
    return {
      order: orderDetails,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      message: 'Order not found'
    };
  }
});

// 创建订单
Mock.mock('/api/orders', 'post', (options: any): { order: Order; success: boolean; message: string } => {
  const orderData: CreateOrderRequest = JSON.parse(options.body);
  
  // 模拟生成一个新订单
  const items: OrderItem[] = orderData.items.map(item => {
    const productId = item.productId;
    const quantity = item.quantity;
    const originalPrice = Random.integer(50, 9999);
    const discount = Random.float(0.5, 0.9, 1, 1);
    const price = Math.floor(originalPrice * discount);
    
    return {
      id: Random.integer(1000, 9999),
      productId,
      productName: `商品${productId}`,
      price: `¥${price}`,
      originalPrice: `¥${originalPrice}`,
      quantity,
      image: `https://picsum.photos/id/${20 + productId}/100/100`,
      sku: item.sku || `SKU${Random.string('upper', 8)}`,
      attributes: {
        color: ['黑色', '白色', '红色', '蓝色'][Random.integer(0, 3)],
        size: ['S', 'M', 'L', 'XL'][Random.integer(0, 3)]
      },
      total: `¥${price * quantity}`
    };
  });
  
  // 计算订单总金额
  const totalAmount = items.reduce((sum, item) => {
    return sum + parseInt(item.total!.replace('¥', ''));
  }, 0);
  
  const mockAddresses = [
    {
      id: 1,
      name: '张小明',
      phone: '13812345678',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南路88号智汇大厦3栋1001室'
    },
    {
      id: 2,
      name: '张小明',
      phone: '13812345678',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detail: '天河路385号太古汇1期北塔12楼'
    }
  ];
  
  // 根据addressId查找地址信息
  const address = mockAddresses.find(addr => addr.id === orderData.addressId);
  
  if (!address) {
    return {
      order: {} as Order,
      success: false,
      message: '收货地址不存在'
    };
  }
  
  // 创建新订单
  const newOrder: Order = {
    id: `ORD${Date.now().toString().slice(-8)}`,
    orderTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    totalAmount: `¥${totalAmount}`,
    status: 'pending',
    items,
    address: {
      name: address.name,
      phone: address.phone,
      address: `${address.province}${address.city}${address.district}${address.detail}`
    },
    payment: {
      method: orderData.paymentMethod,
      paid: false
    },
    delivery: {
      method: orderData.deliveryMethod || '普通快递'
    },
    invoice: orderData.invoice,
    remark: orderData.remark,
    originalAmount: `¥${Math.floor(totalAmount * 1.1)}`,
    couponAmount: `¥${Math.floor(totalAmount * 0.1)}`,
    shippingFee: `¥${Random.integer(10, 20)}`
  };
  
  // 添加到订单列表
  mockOrderList.unshift(newOrder);
  
  return {
    order: newOrder,
    success: true,
    message: '订单创建成功'
  };
});

// 取消订单
Mock.mock(/\/api\/orders\/[A-Za-z0-9]+\/cancel$/, 'post', (options: any): { success: boolean; message: string } => {
  const orderId = options.url.match(/\/orders\/([A-Za-z0-9]+)\/cancel/)[1];
  const orderIndex = mockOrderList.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return {
      success: false,
      message: '订单不存在'
    };
  }
  
  const order = mockOrderList[orderIndex];
  
  // 只有待付款状态的订单可以取消
  if (order.status !== 'pending') {
    return {
      success: false,
      message: `订单状态为${order.status}，无法取消`
    };
  }
  
  // 更新订单状态
  mockOrderList[orderIndex].status = 'cancelled';
  
  return {
    success: true,
    message: '订单取消成功'
  };
});

// 支付订单
Mock.mock(/\/api\/orders\/[A-Za-z0-9]+\/pay$/, 'post', (options: any): { success: boolean; message: string; paymentResult?: any } => {
  const orderId = options.url.match(/\/orders\/([A-Za-z0-9]+)\/pay/)[1];
  const payData = JSON.parse(options.body);
  
  const orderIndex = mockOrderList.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return {
      success: false,
      message: '订单不存在'
    };
  }
  
  const order = mockOrderList[orderIndex];
  
  // 只有待付款状态的订单可以支付
  if (order.status !== 'pending') {
    return {
      success: false,
      message: `订单状态为${order.status}，无法支付`
    };
  }
  
  // 更新订单状态
  mockOrderList[orderIndex].status = 'paid';
  mockOrderList[orderIndex].payment = {
    ...order.payment!,
    paid: true,
    paidTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  return {
    success: true,
    message: '订单支付成功',
    paymentResult: {
      transactionId: `TRS${Date.now()}`,
      paidAmount: order.totalAmount,
      paymentMethod: payData.paymentMethod || order.payment?.method,
      paidTime: mockOrderList[orderIndex].payment?.paidTime
    }
  };
});

// 确认收货
Mock.mock(/\/api\/orders\/[A-Za-z0-9]+\/confirm$/, 'post', (options: any): { success: boolean; message: string } => {
  const orderId = options.url.match(/\/orders\/([A-Za-z0-9]+)\/confirm/)[1];
  
  const orderIndex = mockOrderList.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return {
      success: false,
      message: '订单不存在'
    };
  }
  
  const order = mockOrderList[orderIndex];
  
  // 只有已发货状态的订单可以确认收货
  if (order.status !== 'shipped') {
    return {
      success: false,
      message: `订单状态为${order.status}，无法确认收货`
    };
  }
  
  // 更新订单状态
  mockOrderList[orderIndex].status = 'delivered';
  mockOrderList[orderIndex].delivery = {
    ...order.delivery!,
    status: '已送达'
  };
  
  return {
    success: true,
    message: '确认收货成功'
  };
});