import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.users;

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

export default {
  register,
  login,
  getCurrentUser,
  updateUser,
  updatePassword,
  findAll,
  findOne,
  update,
  remove
};