import express from "express";
import users from "../controllers/user.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

// 注册和登录相关路由
router.post("/register", users.register);
router.post("/login", users.login);
router.post("/phone-login", users.phoneLogin);
router.post("/send-verification-code", users.sendVerificationCode);
router.post("/reset-password", users.resetPassword);

// 当前用户相关路由（必须放在/:id路由之前，避免被误认为是ID）
router.get("/me", [authJwt.verifyToken], users.getCurrentUser);
router.put("/me", [authJwt.verifyToken], users.updateUser);
router.put("/me/password", [authJwt.verifyToken], users.updatePassword);

// 用户个人资料
router.get("/profile", [authJwt.verifyToken], users.getProfile);
router.put("/profile", [authJwt.verifyToken], users.updateProfile);

// 用户地址相关
router.get("/address", [authJwt.verifyToken], users.getAddresses);
router.post("/address", [authJwt.verifyToken], users.addAddress);
router.put("/address/:id", [authJwt.verifyToken], users.updateAddress);
router.delete("/address/:id", [authJwt.verifyToken], users.deleteAddress);

// 用户收藏相关
router.get("/favorites", [authJwt.verifyToken], users.getFavorites);
router.post("/favorites/:productId", [authJwt.verifyToken], users.addFavorite);
router.delete("/favorites/:productId", [authJwt.verifyToken], users.removeFavorite);

// 管理员相关路由
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], users.findAll);

// ID参数路由必须放在最后，避免捕获上述特定路径
router.get("/:id", [authJwt.verifyToken], users.findOne);
router.put("/:id", [authJwt.verifyToken], users.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.remove);

export default router;