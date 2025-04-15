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

    // 创建token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24小时
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "登录时出现错误。"
    });
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
    res.status(500).send({
      message: err.message || "获取用户信息时出现错误。"
    });
  }
};

// 更新用户信息
const updateUser = async (req, res) => {
  try {
    // 不允许更新用户名和邮箱
    const updateData = { ...req.body };
    delete updateData.username;
    delete updateData.email;
    delete updateData.password;
    delete updateData.isAdmin;

    const num = await User.update(updateData, {
      where: { id: req.userId }
    });

    if (num == 1) {
      res.send({
        message: "用户信息更新成功。"
      });
    } else {
      res.send({
        message: "无法更新用户信息。"
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "更新用户信息时出现错误。"
    });
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
      return res.status(401).send({ message: "当前密码错误！" });
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);

    const num = await User.update(
      { password: hashedPassword },
      { where: { id: req.userId } }
    );

    if (num == 1) {
      res.send({
        message: "密码更新成功。"
      });
    } else {
      res.send({
        message: "无法更新密码。"
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "更新密码时出现错误。"
    });
  }
};

export default {
  register,
  login,
  getCurrentUser,
  updateUser,
  updatePassword
};