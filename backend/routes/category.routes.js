import express from "express";
import categories from "../controllers/category.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: 创建新分类
 *     description: 添加新商品分类（需要管理员权限）
 *     tags: [分类管理]
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
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               parentId:
 *                 type: string
 *               level:
 *                 type: integer
 *               order:
 *                 type: integer
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: 分类创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       500:
 *         description: 服务器内部错误
 */
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], categories.create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: 获取所有分类
 *     description: 获取系统中所有商品分类列表
 *     tags: [分类查询]
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: 根据父分类ID筛选子分类
 *     responses:
 *       200:
 *         description: 成功获取分类列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: 服务器内部错误
 */
router.get("/", categories.findAll);

/**
 * @swagger
 * /api/categories/with-products:
 *   get:
 *     summary: 获取分类及其产品
 *     description: 获取所有分类以及每个分类下的产品列表
 *     tags: [分类查询]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: 每个分类下返回的产品数量
 *     responses:
 *       200:
 *         description: 成功获取带产品的分类列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   products:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *       500:
 *         description: 服务器内部错误
 */
router.get("/with-products", categories.findCategoryWithProducts);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: 获取单个分类详情
 *     description: 通过分类ID获取分类的详细信息
 *     tags: [分类查询]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 成功获取分类详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: 分类不存在
 *       500:
 *         description: 服务器内部错误
 */
router.get("/:id", categories.findOne);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: 更新分类信息
 *     description: 更新指定分类的详细信息（需要管理员权限）
 *     tags: [分类管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               parentId:
 *                 type: string
 *               level:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 分类信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       404:
 *         description: 分类不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: 删除分类
 *     description: 删除指定的分类（需要管理员权限）
 *     tags: [分类管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 分类删除成功
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
 *         description: 分类不存在
 *       500:
 *         description: 服务器内部错误
 */
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.remove);

export default router;