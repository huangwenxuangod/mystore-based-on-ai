import express from "express";
import users from "../controllers/user.controller.js";
import { authJwt } from "../middleware/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取所有用户列表
 *     description: 获取系统中所有用户的信息（需要管理员权限）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       403:
 *         description: 禁止访问，权限不足（需要管理员权限）
 *       500:
 *         description: 服务器内部错误
 */
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], users.findAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 获取指定用户信息
 *     description: 通过用户ID获取特定用户的详细信息
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
router.get("/:id", [authJwt.verifyToken], users.findOne);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: 更新用户信息
 *     description: 更新指定用户的信息
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               realName:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: 用户信息更新成功
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
 *         description: 禁止访问，权限不足
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put("/:id", [authJwt.verifyToken], users.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     description: 删除指定的用户（需要管理员权限）
 *     tags: [用户管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户删除成功
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
 *         description: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], users.remove);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: 用户注册
 *     tags: [用户]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       400:
 *         description: 注册失败，用户名或邮箱已存在
 *       500:
 *         description: 服务器错误
 */
router.post("/register", users.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 用户登录
 *     tags: [用户]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: 登录失败，用户名或密码不正确
 *       500:
 *         description: 服务器错误
 */
router.post("/login", users.login);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 获取当前用户信息
 *     description: 获取当前登录用户的详细信息
 *     tags: [用户账户]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取当前用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       500:
 *         description: 服务器内部错误
 */
router.get("/me", [authJwt.verifyToken], users.getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: 更新当前用户信息
 *     description: 更新当前登录用户的个人信息
 *     tags: [用户账户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               realName:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权，缺少有效的认证凭证
 *       500:
 *         description: 服务器内部错误
 */
router.put("/me", [authJwt.verifyToken], users.updateUser);

/**
 * @swagger
 * /api/users/me/password:
 *   put:
 *     summary: 修改密码
 *     description: 更新当前登录用户的密码
 *     tags: [用户账户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: 密码更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 新密码与确认密码不匹配
 *       401:
 *         description: 未授权或当前密码错误
 *       500:
 *         description: 服务器内部错误
 */
router.put("/me/password", [authJwt.verifyToken], users.updatePassword);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 获取用户个人资料
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户不存在
 *   put:
 *     summary: 更新用户个人资料
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               realName:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthday:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功更新用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 用户不存在
 */
router.get("/profile", [authJwt.verifyToken], users.getProfile);
router.put("/profile", [authJwt.verifyToken], users.updateProfile);

/**
 * @swagger
 * /api/users/address:
 *   get:
 *     summary: 获取用户地址列表
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取地址列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: 未授权
 *   post:
 *     summary: 添加新地址
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: 成功添加地址
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       401:
 *         description: 未授权
 */
router.get("/address", [authJwt.verifyToken], users.getAddresses);
router.post("/address", [authJwt.verifyToken], users.addAddress);

/**
 * @swagger
 * /api/users/address/{id}:
 *   put:
 *     summary: 更新地址
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 地址ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: 成功更新地址
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 地址不存在
 *   delete:
 *     summary: 删除地址
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 地址ID
 *     responses:
 *       204:
 *         description: 成功删除地址
 *       401:
 *         description: 未授权
 *       404:
 *         description: 地址不存在
 */
router.put("/address/:id", [authJwt.verifyToken], users.updateAddress);
router.delete("/address/:id", [authJwt.verifyToken], users.deleteAddress);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: 获取用户收藏列表
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取收藏列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: 未授权
 */
router.get("/favorites", [authJwt.verifyToken], users.getFavorites);

/**
 * @swagger
 * /api/users/favorites/{productId}:
 *   post:
 *     summary: 添加商品到收藏
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       201:
 *         description: 成功添加到收藏
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 productId:
 *                   type: integer
 *       401:
 *         description: 未授权
 *       409:
 *         description: 商品已在收藏列表中
 *   delete:
 *     summary: 从收藏中删除商品
 *     tags: [用户]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 商品ID
 *     responses:
 *       204:
 *         description: 成功从收藏中删除
 *       401:
 *         description: 未授权
 *       404:
 *         description: 收藏中不存在该商品
 */
router.post("/favorites/:productId", [authJwt.verifyToken], users.addFavorite);
router.delete("/favorites/:productId", [authJwt.verifyToken], users.removeFavorite);

export default router;