import express from "express";
import orders from "../controllers/order.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: 创建订单
 *     description: 根据用户购物车创建新订单
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: 收货地址
 *               paymentMethod:
 *                 type: string
 *                 enum: [wechat, alipay, creditcard]
 *                 description: 支付方式
 *               note:
 *                 type: string
 *                 description: 订单备注
 *             required:
 *               - address
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: 订单创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                 orderNumber:
 *                   type: string
 *                 totalAmount:
 *                   type: string
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 请求数据验证失败或购物车为空
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器内部错误
 */
router.post("/", [authJwt.verifyToken], orders.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: 获取用户订单列表
 *     description: 获取当前登录用户的所有订单
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取订单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器内部错误
 */
router.get("/", [authJwt.verifyToken], orders.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: 获取订单详情
 *     description: 获取指定订单的详细信息
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 成功获取订单详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器内部错误
 */
router.get("/:id", [authJwt.verifyToken], orders.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   post:
 *     summary: 取消订单
 *     description: 取消指定的未支付订单
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 订单取消成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                 status:
 *                   type: string
 *       400:
 *         description: 只有待支付的订单可以取消
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器内部错误
 */
router.post("/:id/cancel", [authJwt.verifyToken], orders.cancelOrder);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   post:
 *     summary: 支付订单
 *     description: 获取订单支付信息
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 成功获取支付信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                 orderNumber:
 *                   type: string
 *                 amount:
 *                   type: string
 *                 status:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                 qrCode:
 *                   type: string
 *       400:
 *         description: 订单状态不正确
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器内部错误
 */
router.post("/:id/pay", [authJwt.verifyToken], orders.payOrder);

/**
 * @swagger
 * /api/orders/{id}/payment-complete:
 *   post:
 *     summary: 完成支付
 *     description: 标记订单为已支付状态
 *     tags: [订单]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 支付成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 paymentId:
 *                   type: string
 *       400:
 *         description: 订单状态不正确
 *       401:
 *         description: 未授权，需要登录
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器内部错误
 */
router.post("/:id/payment-complete", [authJwt.verifyToken], orders.completePayment);

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: 管理员获取所有订单
 *     description: 管理员获取系统中的所有订单（需要管理员权限）
 *     tags: [订单管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, shipped, delivered, cancelled]
 *         description: 按订单状态过滤
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: 按用户ID过滤
 *     responses:
 *       200:
 *         description: 成功获取订单列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       500:
 *         description: 服务器内部错误
 */
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], orders.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     summary: 管理员更新订单状态
 *     description: 管理员更新指定订单的状态（需要管理员权限）
 *     tags: [订单管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 订单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: 订单状态更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orderId:
 *                   type: integer
 *                 status:
 *                   type: string
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put("/admin/:id/status", [authJwt.verifyToken, authJwt.isAdmin], orders.updateOrderStatus);

export default router;