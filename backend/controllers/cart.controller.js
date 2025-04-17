import db from "../models/index.js";
const Cart = db.carts;
const Product = db.products;
const User = db.users;
const Op = db.Sequelize.Op;

// 获取用户的购物车
const getCartItems = async (req, res) => {
  try {
    const userId = req.userId; // 从JWT获取用户ID

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: "product"
      }]
    });

    let total = 0;
    const items = cartItems.map(item => {
      const productPrice = parseFloat(item.product.price.replace('¥', ''));
      const itemTotal = productPrice * item.quantity;
      total += itemTotal;
      
      return {
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image,
        quantity: item.quantity,
        subtotal: `¥${itemTotal.toFixed(2)}`
      };
    });

    res.status(200).send({
      items,
      total: `¥${total.toFixed(2)}`
    });
  } catch (error) {
    console.error('获取购物车失败:', error);
    res.status(500).send({ message: '获取购物车失败' });
  }
};

// 添加商品到购物车
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId; // 从JWT获取用户ID

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).send({ message: '无效的请求数据' });
    }

    // 检查产品是否存在
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({ message: '商品不存在' });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).send({ message: '商品库存不足' });
    }

    // 检查购物车中是否已存在该商品
    let cartItem = await Cart.findOne({
      where: {
        userId,
        productId
      }
    });

    if (cartItem) {
      // 更新数量
      const newQuantity = cartItem.quantity + parseInt(quantity);
      
      // 再次检查库存
      if (product.stock < newQuantity) {
        return res.status(400).send({ message: '商品库存不足' });
      }
      
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // 创建新的购物车项
      cartItem = await Cart.create({
        userId,
        productId,
        quantity: parseInt(quantity)
      });
    }

    res.status(200).send({
      message: '已添加到购物车',
      cartItem
    });
  } catch (error) {
    console.error('添加到购物车失败:', error);
    res.status(500).send({ message: '添加到购物车失败' });
  }
};

// 更新购物车中的商品数量
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;
    const userId = req.userId;

    if (!quantity || quantity <= 0) {
      return res.status(400).send({ message: '商品数量必须大于0' });
    }

    // 查找购物车项
    const cartItem = await Cart.findOne({
      where: {
        id: cartItemId,
        userId
      },
      include: [{
        model: Product,
        as: "product"
      }]
    });

    if (!cartItem) {
      return res.status(404).send({ message: '购物车项不存在' });
    }

    // 检查库存
    if (cartItem.product.stock < quantity) {
      return res.status(400).send({ message: '商品库存不足' });
    }

    // 更新数量
    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    res.status(200).send({
      message: '购物车已更新',
      cartItem
    });
  } catch (error) {
    console.error('更新购物车失败:', error);
    res.status(500).send({ message: '更新购物车失败' });
  }
};

// 从购物车中删除商品
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.userId;

    const result = await Cart.destroy({
      where: {
        id: cartItemId,
        userId
      }
    });

    if (result === 0) {
      return res.status(404).send({ message: '购物车项不存在' });
    }

    res.status(200).send({ message: '已从购物车中删除' });
  } catch (error) {
    console.error('从购物车中删除失败:', error);
    res.status(500).send({ message: '从购物车中删除失败' });
  }
};

// 清空购物车
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    await Cart.destroy({
      where: { userId }
    });

    res.status(200).send({ message: '购物车已清空' });
  } catch (error) {
    console.error('清空购物车失败:', error);
    res.status(500).send({ message: '清空购物车失败' });
  }
};

export default {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
};