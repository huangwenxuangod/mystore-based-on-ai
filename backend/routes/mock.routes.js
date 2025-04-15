import express from "express";
import mock from "../controllers/mock.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/mock/home:
 *   get:
 *     summary: 获取首页数据
 *     tags: [首页]
 *     responses:
 *       200:
 *         description: 成功获取首页数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 features:
 *                   type: array
 *                   items:
 *                     type: object
 *                 hotProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 carousel:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/home", mock.getHomeData);

/**
 * @swagger
 * /api/mock/products:
 *   get:
 *     summary: 获取商品列表
 *     tags: [商品]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功获取商品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get("/products", mock.getAllProducts);

/**
 * @swagger
 * /api/mock/products/{id}:
 *   get:
 *     summary: 获取商品详情
 *     tags: [商品]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 成功获取商品详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/products/:id", mock.getProductDetail);

// 获取相关商品
router.get("/products/:id/related", mock.getRelatedProducts);

// 获取推荐商品
router.get("/recommend", mock.getRecommendedProducts);

/**
 * @swagger
 * /api/mock/cart:
 *   get:
 *     summary: 获取购物车数据
 *     tags: [购物车]
 *     responses:
 *       200:
 *         description: 成功获取购物车数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *                 total:
 *                   type: string
 *   post:
 *     summary: 添加商品到购物车
 *     tags: [购物车]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 成功添加商品到购物车
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 */
router.get("/cart", mock.getCartData);
router.post("/cart", mock.addToCart);

/**
 * @swagger
 * /api/mock/cart/{id}:
 *   put:
 *     summary: 更新购物车商品数量
 *     tags: [购物车]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 成功更新购物车商品
 *   delete:
 *     summary: 删除购物车商品
 *     tags: [购物车]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 购物车商品ID
 *     responses:
 *       204:
 *         description: 成功删除购物车商品
 */
router.put("/cart/:id", mock.updateCartItem);
router.delete("/cart/:id", mock.deleteCartItem);

/**
 * @swagger
 * /api/mock/user:
 *   get:
 *     summary: 获取用户信息
 *     tags: [用户]
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/user", mock.getUserData);

// 获取订单数据
router.get("/orders", mock.getOrderData);

// 获取促销商品
router.get("/promotions", mock.getPromotionsData);

// 获取新品上架
router.get("/new-arrivals", mock.getNewArrivalsData);

// 获取轮播图数据
router.get("/carousel", mock.getCarouselData);

// 获取收藏夹数据
router.get("/favorites", mock.getFavoritesData);

// 获取地址数据
router.get("/addresses", mock.getAddressesData);

export default router;