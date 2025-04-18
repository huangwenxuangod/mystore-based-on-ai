import express from "express";
import payment from "../controllers/payment.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/payments/{paymentId}/status:
 *   get:
 *     summary: 获取支付状态
 *     description: 查询特定支付的当前状态
 *     tags: [支付]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 支付ID
 *     responses:
 *       200:
 *         description: 成功获取支付状态
 *       404:
 *         description: 支付记录不存在
 *       500:
 *         description: 服务器错误
 */
router.get("/:paymentId/status", payment.getPaymentStatus);

/**
 * @swagger
 * /api/payments/{paymentId}/complete:
 *   post:
 *     summary: 完成支付
 *     description: 将支付标记为已完成状态
 *     tags: [支付]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 支付ID
 *     responses:
 *       200:
 *         description: 支付已成功完成
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 支付记录不存在
 *       500:
 *         description: 服务器错误
 */
router.post("/:paymentId/complete", payment.completePayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: 发起支付
 *     description: 为订单发起新的支付
 *     tags: [支付]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: number
 *                 description: 订单ID
 *               paymentMethod:
 *                 type: string
 *                 description: 支付方式
 *     responses:
 *       200:
 *         description: 支付已发起
 *       400:
 *         description: 无效的请求参数
 *       404:
 *         description: 订单不存在
 *       500:
 *         description: 服务器错误
 */
router.post("/", [authJwt.verifyToken], payment.initiatePayment);

export default router;