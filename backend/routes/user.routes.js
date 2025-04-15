import express from "express";
import users from "../controllers/user.controller.js";
import { authJwt } from "../middleware/index.js";

export default app => {
  const router = express.Router();

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

  app.use("/api/users", router);
};