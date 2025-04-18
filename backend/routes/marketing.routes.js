import express from "express";
import marketing from "../controllers/marketing.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: 获取首页数据
 *     description: 获取首页所需的分类、推荐商品、轮播图等数据
 *     tags: [营销]
 *     responses:
 *       200:
 *         description: 成功获取首页数据
 *       500:
 *         description: 服务器错误
 */
router.get("/home", marketing.getHomeData);

/**
 * @swagger
 * /api/carousel:
 *   get:
 *     summary: 获取轮播图数据
 *     description: 获取首页和其他页面使用的轮播图数据
 *     tags: [营销]
 *     responses:
 *       200:
 *         description: 成功获取轮播图数据
 *       500:
 *         description: 服务器错误
 */
router.get("/carousel", marketing.getCarouselData);

/**
 * @swagger
 * /api/new-arrivals:
 *   get:
 *     summary: 获取新品上市数据
 *     description: 获取新品上市专区的商品和介绍
 *     tags: [营销]
 *     responses:
 *       200:
 *         description: 成功获取新品上市数据
 *       500:
 *         description: 服务器错误
 */
router.get("/new-arrivals", marketing.getNewArrivalsData);

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: 获取促销活动数据
 *     description: 获取促销活动专区的商品和介绍
 *     tags: [营销]
 *     responses:
 *       200:
 *         description: 成功获取促销活动数据
 *       500:
 *         description: 服务器错误
 */
router.get("/promotions", marketing.getPromotionsData);

export default router;