import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.users;
const Product = db.products;
const Address = db.addresses;

// 注册
const register = async (req, res) => {
  try {
    // 验证请求
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "用户名、邮箱和密码不能为空!"
      });
    }

    // 创建用户
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      realName: req.body.realName,
      phone: req.body.phone,
      gender: req.body.gender,
      birthday: req.body.birthday,
      avatar: req.body.avatar
    };

    // 保存用户到数据库
    const data = await User.create(user);
    res.send({ message: "用户注册成功！" });
  } catch (err) {
    res.status(500).send({
      message: err.message || "注册用户时出现错误。"
    });
  }
};

// 登录
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
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
        accessToken: null,
        message: "密码错误！"
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24小时
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
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

    await user.update({
      realName: req.body.realName,
      phone: req.body.phone,
      gender: req.body.gender,
      birthday: req.body.birthday,
      avatar: req.body.avatar
    });

    res.status(200).send({ message: "用户信息更新成功！" });
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

    await user.update({
      realName: req.body.realName,
      phone: req.body.phone,
      gender: req.body.gender,
      birthday: req.body.birthday,
      avatar: req.body.avatar
    });

    res.status(200).send({
      message: "用户资料更新成功！",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        realName: user.realName,
        phone: user.phone,
        gender: user.gender,
        birthday: user.birthday,
        avatar: user.avatar
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
  deleteAddress
};