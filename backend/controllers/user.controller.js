import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";

const User = db.users;
const Product = db.products;
const Address = db.addresses;

// 存储验证码的内存缓存（生产环境中应该使用Redis等缓存服务）
const verificationCodes = new Map();

// 注册
const register = async (req, res) => {
  try {
    console.log('接收到注册请求:', JSON.stringify(req.body, null, 2));
    
    // 验证请求
    if (!req.body.email || !req.body.password) {
      console.log('注册失败: 邮箱或密码为空');
      return res.status(400).send({
        message: "邮箱和密码不能为空!"
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      console.log('注册失败: 邮箱格式不正确', req.body.email);
      return res.status(400).send({
        message: "邮箱格式不正确!"
      });
    }
    
    // 检查密码长度
    if (req.body.password.length < 6) {
      console.log('注册失败: 密码长度不足');
      return res.status(400).send({
        message: "密码长度至少为6位!"
      });
    }
    
    // 检查邮箱是否已被注册
    const existingUser = await User.findOne({
      where: { email: req.body.email }
    });
    
    if (existingUser) {
      console.log('注册失败: 邮箱已被注册', req.body.email);
      return res.status(400).send({
        message: "邮箱已被注册!"
      });
    }

    // 创建用户
    const user = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    };

    console.log('正在创建用户:', req.body.email);
    
    // 保存用户到数据库
    const data = await User.create(user);
    console.log('用户创建成功, ID:', data.id);
    
    // 生成JWT令牌
    const token = jwt.sign({ id: data.id }, authConfig.secret, {
      expiresIn: 86400 // 24小时
    });
    
    // 返回包含token和用户信息的响应
    res.status(201).send({
      message: "用户注册成功！",
      token,
      user: {
        id: data.id,
        email: data.email,
        isAdmin: data.isAdmin || false
      }
    });
  } catch (err) {
    console.error('注册错误:', err);
    
    // 处理唯一键约束冲突
    if (err.name === 'SequelizeUniqueConstraintError') {
      if (err.fields.email) {
        return res.status(400).send({ message: "邮箱已被注册" });
      }
    }
    
    // 捕获并记录详细错误信息
    console.error('详细错误信息:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name
    });
    
    res.status(500).send({
      message: err.message || "注册用户时出现错误。"
    });
  }
};

// 登录
const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "邮箱和密码不能为空!"
      });
    }
    
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "密码错误！"
      });
    }

    // 生成JWT令牌
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24小时
    });

    // 返回响应
    res.status(200).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false
      },
      message: "登录成功",
      success: true
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 发送手机验证码
const sendVerificationCode = async (req, res) => {
  try {
    const { phone, type } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).send({ message: "手机号格式不正确" });
    }
    
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 设置15分钟过期时间
    const expireAt = Date.now() + 15 * 60 * 1000;
    
    // 存储验证码信息
    verificationCodes.set(phone, { 
      code, 
      type: type || 'login', 
      expireAt 
    });
    
    // 在实际生产环境中，这里需要调用短信发送服务API发送验证码
    console.log(`为手机号 ${phone} 生成验证码: ${code}, 类型: ${type || 'login'}`);
    
    res.status(200).send({ 
      message: "验证码发送成功", 
      success: true
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "发送验证码时出错" });
  }
};

// 手机号验证码登录
const phoneLogin = async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).send({ message: "手机号格式不正确" });
    }
    
    // 验证验证码
    const storedCode = verificationCodes.get(phone);
    if (!storedCode || storedCode.code !== code) {
      return res.status(400).send({ message: "验证码错误" });
    }
    
    if (Date.now() > storedCode.expireAt) {
      // 验证码过期，删除过期的验证码
      verificationCodes.delete(phone);
      return res.status(400).send({ message: "验证码已过期" });
    }
    
    // 清除已使用的验证码
    verificationCodes.delete(phone);
    
    // 为简化模型，我们使用phone作为email字段查找用户
    // 尝试查找使用手机号作为邮箱的用户
    let user = await User.findOne({ 
      where: { 
        email: phone + '@phone.user' // 使用特殊格式标记手机号用户
      } 
    });
    
    // 如果用户不存在，则自动注册
    if (!user) {
      // 生成随机密码
      const password = Math.random().toString(36).slice(-8);
      
      // 创建新用户，仅使用我们简化后的字段
      user = await User.create({
        email: phone + '@phone.user', // 使用手机号作为邮箱前缀，添加特殊域名标记手机用户
        password: bcrypt.hashSync(password, 8)
      });
    }
    
    // 使用配置文件中的密钥生成JWT令牌
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400 // 24小时
    });
    
    // 返回用户信息和令牌
    res.status(200).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false
      },
      message: "登录成功",
      success: true
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "手机号登录时出错" });
  }
};

// 重置密码
const resetPassword = async (req, res) => {
  try {
    const { phone, code, newPassword, confirmPassword } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).send({ message: "手机号格式不正确" });
    }
    
    // 验证两次密码是否一致
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: "两次输入的密码不一致" });
    }
    
    // 验证验证码
    const storedCode = verificationCodes.get(phone);
    if (!storedCode || storedCode.code !== code || storedCode.type !== 'reset') {
      return res.status(400).send({ message: "验证码错误" });
    }
    
    if (Date.now() > storedCode.expireAt) {
      // 验证码过期，删除过期的验证码
      verificationCodes.delete(phone);
      return res.status(400).send({ message: "验证码已过期" });
    }
    
    // 清除已使用的验证码
    verificationCodes.delete(phone);
    
    // 查找用户
    const user = await User.findOne({ 
      where: { 
        email: phone + '@phone.user' // 使用特殊格式标记手机号用户
      } 
    });
    if (!user) {
      return res.status(404).send({ message: "该手机号未注册" });
    }
    
    // 更新密码
    await user.update({
      password: bcrypt.hashSync(newPassword, 8)
    });
    
    res.status(200).send({ 
      message: "密码重置成功", 
      success: true 
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "重置密码时出错。" });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 更新用户信息
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    // 仅允许更新email字段
    const updateData = {};
    if (req.body.email) {
      updateData.email = req.body.email;
    }

    await user.update(updateData);

    res.status(200).send({ 
      message: "用户信息更新成功！",
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 更新密码
const updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "原密码错误！" });
    }

    await user.update({
      password: bcrypt.hashSync(req.body.newPassword, 8)
    });

    res.status(200).send({ message: "密码更新成功！" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 获取所有用户
const findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 获取单个用户
const findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 更新用户
const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    await user.update(req.body);
    res.status(200).send({ message: "用户更新成功！" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 删除用户
const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    await user.destroy();
    res.status(200).send({ message: "用户删除成功！" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 获取用户收藏列表
const getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: Product,
        as: 'favorites',
        through: { attributes: [] } // 不包含中间表的字段
      }]
    });

    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    res.status(200).send(user.favorites || []);
  } catch (err) {
    res.status(500).send({ message: err.message || "获取收藏列表时出错。" });
  }
};

// 添加商品到收藏
const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }
    
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({ message: "商品不存在。" });
    }
    
    // 使用关联添加收藏
    await user.addFavorite(product);
    
    res.status(200).send({ message: "已将商品添加到收藏。" });
  } catch (err) {
    res.status(500).send({ message: err.message || "添加收藏时出错。" });
  }
};

// 从收藏中移除商品
const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }
    
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({ message: "商品不存在。" });
    }
    
    // 使用关联移除收藏
    await user.removeFavorite(product);
    
    res.status(200).send({ message: "已将商品从收藏中移除。" });
  } catch (err) {
    res.status(500).send({ message: err.message || "移除收藏时出错。" });
  }
};

// 获取用户个人资料
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || "获取用户资料时出错。" });
  }
};

// 更新用户个人资料
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "用户不存在。" });
    }

    // 只允许更新email (如果提供)
    let updateData = {};
    if (req.body.email) {
      updateData.email = req.body.email;
    }

    await user.update(updateData);

    res.status(200).send({
      message: "用户资料更新成功！",
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "更新用户资料时出错。" });
  }
};

// 获取用户地址列表
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.userId }
    });
    res.status(200).send(addresses);
  } catch (err) {
    res.status(500).send({ message: err.message || "获取地址列表时出错。" });
  }
};

// 添加新地址
const addAddress = async (req, res) => {
  try {
    const address = {
      userId: req.userId,
      receiverName: req.body.receiverName,
      phone: req.body.phone,
      province: req.body.province,
      city: req.body.city,
      district: req.body.district,
      detailAddress: req.body.detailAddress,
      isDefault: req.body.isDefault || false
    };

    // 如果设为默认地址，需要将其他地址的默认状态取消
    if (address.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.userId } }
      );
    }

    const newAddress = await Address.create(address);
    res.status(201).send(newAddress);
  } catch (err) {
    res.status(500).send({ message: err.message || "添加地址时出错。" });
  }
};

// 更新地址
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!address) {
      return res.status(404).send({ message: "地址不存在。" });
    }

    // 如果设为默认地址，需要将其他地址的默认状态取消
    if (req.body.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: req.userId } }
      );
    }

    await address.update({
      receiverName: req.body.receiverName,
      phone: req.body.phone,
      province: req.body.province,
      city: req.body.city,
      district: req.body.district,
      detailAddress: req.body.detailAddress,
      isDefault: req.body.isDefault
    });

    res.status(200).send(address);
  } catch (err) {
    res.status(500).send({ message: err.message || "更新地址时出错。" });
  }
};

// 删除地址
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!address) {
      return res.status(404).send({ message: "地址不存在。" });
    }

    await address.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ message: err.message || "删除地址时出错。" });
  }
};

export default {
  register,
  login,
  getCurrentUser,
  updateUser,
  updatePassword,
  findAll,
  findOne,
  update,
  remove,
  getFavorites,
  addFavorite,
  removeFavorite,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  sendVerificationCode,
  phoneLogin,
  resetPassword
};