import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";
const User = db.users;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  // 检查是否有令牌
  if (!token) {
    return res.status(403).send({
      message: "未提供令牌！"
    });
  }

  // 移除Bearer前缀(如果存在)
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  // 验证令牌
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "未授权！"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).send({
        message: "用户不存在。"
      });
    }

    if (user.isAdmin) {
      next();
      return;
    }

    res.status(403).send({
      message: "需要管理员权限！"
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "验证管理员权限时出错。"
    });
  }
};

export default {
  verifyToken,
  isAdmin
};
