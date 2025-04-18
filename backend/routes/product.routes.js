import express from "express";
import products from "../controllers/product.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 创建新产品
 *     description: 添加新商品到系统中（需要管理员权限）
 *     tags: [产品管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               originalPrice:
 *                 type: string
 *               discount:
 *                 type: integer
 *               image:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               rating:
 *                 type: number
 *               reviewCount:
 *                 type: integer
 *               stock:
 *                 type: integer
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *                 additionalProperties: 
 *                   type: string
 *             required:
 *               - name
 *               - price
 *               - image
 *               - categoryId
 *     responses:
 *       201:
 *         description: 产品创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       500:
 *         description: 服务器内部错误
 */
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], products.create);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 获取所有产品
 *     description: 获取系统中所有产品的列表，支持分页、排序和过滤
 *     tags: [产品查询]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 按分类过滤
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: 按品牌过滤
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, popular]
 *         description: 排序方式
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: 最低价格
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: 最高价格
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: 服务器内部错误
 */
router.get("/", products.findAll);

/**
 * @swagger
 * /api/products/new:
 *   get:
 *     summary: 获取新到货的产品
 *     description: 获取最近上架的新产品列表
 *     tags: [产品查询]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: 返回产品数量
 *     responses:
 *       200:
 *         description: 成功获取新产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 服务器内部错误
 */
router.get("/new", products.findNewArrivals);

/**
 * @swagger
 * /api/products/promotions:
 *   get:
 *     summary: 获取促销产品
 *     description: 获取当前促销活动中的产品列表
 *     tags: [产品查询]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: 返回产品数量
 *     responses:
 *       200:
 *         description: 成功获取促销产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 服务器内部错误
 */
router.get("/promotions", products.findPromotions);

/**
 * @swagger
 * /api/products/popular:
 *   get:
 *     summary: 获取热门产品
 *     description: 获取销量最高的热门产品列表
 *     tags: [产品查询]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: 返回产品数量
 *     responses:
 *       200:
 *         description: 成功获取热门产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: 服务器内部错误
 */
router.get("/popular", products.findPopular);

/**
 * @swagger
 * /api/products/recommended:
 *   get:
 *     summary: 获取推荐产品
 *     description: 获取基于用户偏好和热门度的推荐产品
 *     tags: [产品查询]
 *     responses:
 *       200:
 *         description: 成功获取推荐产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 success:
 *                   type: boolean
 *       500:
 *         description: 服务器内部错误
 */
router.get("/recommended", products.getRecommendedProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 获取单个产品详情
 *     description: 通过产品ID获取产品的详细信息
 *     tags: [产品查询]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 成功获取产品详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 产品不存在
 *       500:
 *         description: 服务器内部错误
 */
router.get("/:id", products.findOne);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: 更新产品信息
 *     description: 更新指定产品的详细信息（需要管理员权限）
 *     tags: [产品管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 产品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               originalPrice:
 *                 type: string
 *               discount:
 *                 type: integer
 *               image:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               brandId:
 *                 type: string
 *               stock:
 *                 type: integer
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *                 additionalProperties: 
 *                   type: string
 *     responses:
 *       200:
 *         description: 产品信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       404:
 *         description: 产品不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: 删除产品
 *     description: 删除指定的产品（需要管理员权限）
 *     tags: [产品管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 产品删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       404:
 *         description: 产品不存在
 *       500:
 *         description: 服务器内部错误
 */
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.remove);

export default router;