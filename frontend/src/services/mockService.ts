import axios from 'axios';

const API_URL = 'http://localhost:5000/api/mock';

// 商品相关接口
const getAllProducts = async (params?: any) => {
  try {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  } catch (error) {
    console.error('获取商品数据失败:', error);
    throw error;
  }
};

const getProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`获取商品${id}详情失败:`, error);
    throw error;
  }
};

const getRelatedProducts = async (productId: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}/related`);
    return response.data;
  } catch (error) {
    console.error('获取相关商品失败:', error);
    throw error;
  }
};

// 购物车相关接口
const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data;
  } catch (error) {
    console.error('获取购物车数据失败:', error);
    throw error;
  }
};

const addToCart = async (productId: number, quantity: number) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('添加购物车失败:', error);
    throw error;
  }
};

const updateCartItem = async (itemId: number, quantity: number) => {
  try {
    const response = await axios.put(`${API_URL}/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('更新购物车失败:', error);
    throw error;
  }
};

const deleteCartItem = async (itemId: number) => {
  try {
    await axios.delete(`${API_URL}/cart/${itemId}`);
    return true;
  } catch (error) {
    console.error('删除购物车商品失败:', error);
    throw error;
  }
};

// 用户相关接口
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('获取订单数据失败:', error);
    throw error;
  }
};

const getUserAddresses = async () => {
  try {
    const response = await axios.get(`${API_URL}/addresses`);
    return response.data;
  } catch (error) {
    console.error('获取地址数据失败:', error);
    throw error;
  }
};

// 促销活动相关接口
const getPromotionsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/promotions`);
    return response.data;
  } catch (error) {
    console.error('获取促销活动数据失败:', error);
    throw error;
  }
};

// 新品上市相关接口
const getNewArrivalsData = async () => {
  try {
    const response = await axios.get(`${API_URL}/new-arrivals`);
    return response.data;
  } catch (error) {
    console.error('获取新品上市数据失败:', error);
    throw error;
  }
};

// 轮播图相关接口
const getCarouselData = async () => {
  try {
    const response = await axios.get(`${API_URL}/carousel`);
    return response.data;
  } catch (error) {
    console.error('获取轮播图数据失败:', error);
    throw error;
  }
};

// 首页数据相关接口
const getHomeData = async () => {
  try {
    const response = await axios.get(`${API_URL}/home`);
    return response.data;
  } catch (error) {
    console.error('获取首页数据失败:', error);
    throw error;
  }
};

export default {
  getAllProducts,
  getProductById,
  getRelatedProducts,
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getUserProfile,
  getUserOrders,
  getUserAddresses,
  getPromotionsData,
  getNewArrivalsData,
  getCarouselData,
  getHomeData
};