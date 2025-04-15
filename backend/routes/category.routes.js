import express from "express";
import categories from "../controllers/category.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

// 创建新分类 (仅管理员)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], categories.create);

// 获取所有分类
router.get("/", categories.findAll);

// 获取分类及其产品
router.get("/with-products", categories.findCategoryWithProducts);

// 根据ID获取单个分类
router.get("/:id", categories.findOne);

// 更新分类 (仅管理员)
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.update);

// 删除分类 (仅管理员)
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.remove);

export default router;