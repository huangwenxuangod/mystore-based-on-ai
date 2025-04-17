import db from "../models/index.js";
const Order = db.orders;
const OrderItem = db.orderItems;
const Product = db.products;
const User = db.users;
const Cart = db.carts;

// 创建订单
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { address, paymentMethod, note } = req.body;
    
    // 获取用户购物车
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: "product"
      }]
    });
    
    if (cartItems.length === 0) {
      return res.status(400).send({ message: '购物车为空，无法创建订单' });
    }
    
    // 计算订单总金额
    let totalAmount = 0;
    for (const item of cartItems) {
      const productPrice = parseFloat(item.product.price.replace('¥', ''));
      totalAmount += productPrice * item.quantity;
    }
    
    // 创建订单
    const order = await Order.create({
      userId,
      orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      totalAmount: `¥${totalAmount.toFixed(2)}`,
      status: 'pending',
      paymentMethod,
      address,
      note
    });
    
    // 创建订单项
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: `¥${(parseFloat(item.product.price.replace('¥', '')) * item.quantity).toFixed(2)}`
      });
      
      // 更新库存
      const product = item.product;
      product.stock -= item.quantity;
      await product.save();
    }
    
    // 清空购物车
    await Cart.destroy({ where: { userId } });
    
    res.status(201).send({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      message: '订单创建成功'
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).send({ message: '创建订单失败' });
  }
};

// 获取用户订单列表
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).send(orders);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).send({ message: '获取订单列表失败' });
  }
};

// 获取订单详情
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const order = await Order.findOne({
      where: { 
        id,
        userId 
      },
      include: [{
        model: OrderItem,
        as: "items",
        include: [{
          model: Product,
          as: "product"
        }]
      }]
    });
    
    if (!order) {
      return res.status(404).send({ message: '订单不存在' });
    }
    
    // 格式化返回数据
    const orderData = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      address: order.address,
      note: order.note,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };
    
    res.status(200).send(orderData);
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).send({ message: '获取订单详情失败' });
  }
};

// 取消订单
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const order = await Order.findOne({
      where: { 
        id,
        userId 
      },
      include: [{
        model: OrderItem,
        as: "items"
      }]
    });
    
    if (!order) {
      return res.status(404).send({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).send({ message: '只有待支付的订单可以取消' });
    }
    
    // 恢复库存
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      product.stock += item.quantity;
      await product.save();
    }
    
    // 更新订单状态
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).send({ 
      message: '订单已取消',
      orderId: order.id,
      status: order.status
    });
  } catch (error) {
    console.error('取消订单失败:', error);
    res.status(500).send({ message: '取消订单失败' });
  }
};

// 支付订单
const payOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const order = await Order.findOne({
      where: { 
        id,
        userId 
      }
    });
    
    if (!order) {
      return res.status(404).send({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).send({ message: '订单状态不正确' });
    }
    
    // 生成支付信息
    const paymentInfo = {
      paymentId: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      status: 'processing',
      paymentMethod: order.paymentMethod,
      // 这里可以添加不同支付方式的模拟数据
      qrCode: order.paymentMethod === 'wechat' 
        ? 'https://picsum.photos/id/1/300/300' 
        : 'https://picsum.photos/id/2/300/300'
    };
    
    res.status(200).send(paymentInfo);
  } catch (error) {
    console.error('支付订单失败:', error);
    res.status(500).send({ message: '支付订单失败' });
  }
};

// 完成支付
const completePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const order = await Order.findOne({
      where: { 
        id,
        userId 
      }
    });
    
    if (!order) {
      return res.status(404).send({ message: '订单不存在' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).send({ message: '订单状态不正确' });
    }
    
    // 更新订单状态
    order.status = 'paid';
    await order.save();
    
    res.status(200).send({ 
      message: '支付成功',
      orderId: order.id,
      status: order.status,
      paymentId: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`
    });
  } catch (error) {
    console.error('完成支付失败:', error);
    res.status(500).send({ message: '完成支付失败' });
  }
};

// 管理员获取所有订单
const getAllOrders = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const condition = {};
    
    if (status) {
      condition.status = status;
    }
    
    if (userId) {
      condition.userId = userId;
    }
    
    const orders = await Order.findAll({
      where: condition,
      include: [{
        model: User,
        as: "user",
        attributes: ['id', 'username', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).send(orders);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).send({ message: '获取订单列表失败' });
  }
};

// 管理员更新订单状态
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).send({ message: '无效的订单状态' });
    }
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      return res.status(404).send({ message: '订单不存在' });
    }
    
    // 如果正在取消已支付或已发货的订单，需要恢复库存
    if (status === 'cancelled' && ['paid', 'shipped'].includes(order.status)) {
      const orderItems = await OrderItem.findAll({
        where: { orderId: id }
      });
      
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId);
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    // 更新订单状态
    order.status = status;
    await order.save();
    
    res.status(200).send({ 
      message: '订单状态已更新',
      orderId: order.id,
      status: order.status
    });
  } catch (error) {
    console.error('更新订单状态失败:', error);
    res.status(500).send({ message: '更新订单状态失败' });
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  payOrder,
  completePayment,
  getAllOrders,
  updateOrderStatus
};