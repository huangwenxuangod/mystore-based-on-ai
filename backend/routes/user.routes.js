import express from "express";
import users from "../controllers/user.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

// 获取所有用户 (仅管理员)
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], users.findAll);

// 获取单个用户
router.get("/:id", [authJwt.verifyToken], users.findOne);

// 更新用户信息
router.put("/:id", [authJwt.verifyToken], users.update);

// 删除用户 (仅管理员)
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.remove);

// 用户注册
router.post("/register", users.register);

// 用户登录
router.post("/login", users.login);

// 获取当前用户信息
router.get("/me", [authJwt.verifyToken], users.getCurrentUser);

// 更新用户信息
router.put("/me", [authJwt.verifyToken], users.updateUser);

// 更新密码
router.put("/me/password", [authJwt.verifyToken], users.updatePassword);

export default router;