import express from "express";
import cart from "../controllers/cart.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: 获取用户购物车
 *     description: 获取当前登录用户的购物车信息
 *     tags: [购物车]
 *     security:
 *       - bearerAuth: []
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: string
 *                       originalPrice:
 *                         type: string
 *                       image:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       subtotal:
 *                         type: string
 *                 total:
 *                   type: string
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器内部错误
 */
router.get("/", [authJwt.verifyToken], cart.getCartItems);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: 添加商品到购物车
 *     description: 将商品添加到当前登录用户的购物车
 *     tags: [购物车]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: 商品已添加到购物车
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *       400:
 *         description: 请求数据验证失败或商品库存不足
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 商品不存在
 *       500:
 *         description: 服务器内部错误
 */
router.post("/", [authJwt.verifyToken], cart.addToCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: 更新购物车项
 *     description: 更新购物车中特定商品的数量
 *     tags: [购物车]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 购物车项ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: 购物车项已更新
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *       400:
 *         description: 请求数据验证失败或商品库存不足
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 购物车项不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put("/:id", [authJwt.verifyToken], cart.updateCartItem);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: 删除购物车项
 *     description: 从购物车中移除特定商品
 *     tags: [购物车]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 购物车项ID
 *     responses:
 *       200:
 *         description: 购物车项已删除
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 购物车项不存在
 *       500:
 *         description: 服务器内部错误
 */
router.delete("/:id", [authJwt.verifyToken], cart.deleteCartItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: 清空购物车
 *     description: 清空用户的购物车
 *     tags: [购物车]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 购物车已清空
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器内部错误
 */
router.delete("/clear", [authJwt.verifyToken], cart.clearCart);

export default router;