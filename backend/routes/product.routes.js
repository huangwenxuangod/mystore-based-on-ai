import express from "express";
import products from "../controllers/product.controller.js";
import { authJwt } from "../middleware/index.js";

export default app => {
  const router = express.Router();

  // 创建新产品 (仅管理员)
  router.post("/", [authJwt.verifyToken, authJwt.isAdmin], products.create);

  // 获取所有产品
  router.get("/", products.findAll);

  // 获取新到货的产品
  router.get("/new", products.findNewArrivals);

  // 获取促销产品
  router.get("/promotions", products.findPromotions);

  // 获取热门产品
  router.get("/popular", products.findPopular);

  // 根据ID获取单个产品
  router.get("/:id", products.findOne);

  // 更新产品 (仅管理员)
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.update);

  // 删除产品 (仅管理员)
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.remove);

  app.use("/api/products", router);
};