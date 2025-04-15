import express from "express";
import mock from "../controllers/mock.controller.js";

export default app => {
  const router = express.Router();

  // 获取首页数据
  router.get("/home", mock.getHomeData);

  // 获取推荐商品
  router.get("/recommended", mock.getRecommendedProducts);

  // 获取购物车数据
  router.get("/cart", mock.getCartData);

  // 获取用户数据
  router.get("/user", mock.getUserData);

  // 获取订单数据
  router.get("/orders", mock.getOrdersData);

  // 获取收藏数据
  router.get("/favorites", mock.getFavoritesData);

  // 获取地址数据
  router.get("/addresses", mock.getAddressesData);

  // 获取所有商品数据
  router.get("/products", mock.getAllProducts);

  // 获取商品详情
  router.get("/products/:id", mock.getProductDetail);

  // 获取促销数据
  router.get("/promotions", mock.getPromotionsData);

  // 获取新品数据
  router.get("/new-arrivals", mock.getNewArrivalsData);

  // 获取轮播图数据
  router.get("/carousel", mock.getCarouselData);

  app.use("/api/mock", router);
};