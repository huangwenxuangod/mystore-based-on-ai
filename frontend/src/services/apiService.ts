import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API服务对象
const apiService = {
  // 用户登录 - 使用邮箱和密码
  async login(credentials) {
    const response = await apiClient.post('/users/login', credentials);
    return response.data;
  },

  // 用户注册 - 只需要邮箱和密码
  async register(userData) {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },

  // 获取当前用户信息
  async getCurrentUser() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // 修改密码
  async changePassword(passwordData) {
    const response = await apiClient.put('/users/me/password', passwordData);
    return response.data;
  },

  // 获取商品列表
  async getProducts(params) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // 获取所有商品 (为ProductsPage.vue提供支持)
  async getAllProducts(params) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // 获取商品详情
  async getProductById(id) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // 创建新产品
  async createProduct(productData) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // 更新产品
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // 删除产品
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // 获取商品分类
  async getCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // 获取购物车数据
  async getCartItems() {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  // 添加商品到购物车
  async addToCart(productId, quantity = 1) {
    const response = await apiClient.post('/cart', { productId, quantity });
    return response.data;
  },

  // 更新购物车商品数量
  async updateCartItem(itemId, quantity) {
    const response = await apiClient.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  // 从购物车中删除商品
  async deleteCartItem(itemId) {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  },

  // 清空购物车
  async clearCart() {
    const response = await apiClient.delete('/cart/clear');
    return response.data;
  },

  // 创建订单
  async createOrder(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // 获取订单信息
  async getOrderById(orderId) {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // 获取用户订单列表
  async getUserOrders() {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  // 发起支付
  async initiatePayment(orderId, paymentMethod) {
    const response = await apiClient.post(`/orders/${orderId}/pay`, { paymentMethod });
    return response.data;
  },

  // 获取首页数据
  async getHomeData() {
    const response = await apiClient.get('/home');
    return response.data;
  },

  // 获取新品上市数据
  async getNewArrivalsData() {
    const response = await apiClient.get('/new-arrivals');
    return response.data;
  },

  // 获取促销活动数据
  async getPromotionsData() {
    const response = await apiClient.get('/promotions');
    return response.data;
  },

  // 获取推荐产品
  async getRecommendedProducts() {
    const response = await apiClient.get('/products/recommended');
    return response.data;
  },

  // 获取轮播图数据
  async getCarouselData() {
    const response = await apiClient.get('/carousel');
    return response.data;
  },

  // 搜索产品
  async searchProducts(query) {
    const response = await apiClient.get('/products/search', { params: { query } });
    return response.data;
  },

  // 按分类获取产品
  async getProductsByCategory(categoryId) {
    const response = await apiClient.get('/products', { params: { categoryId } });
    return response.data;
  },
  
  // 获取热门产品
  async getPopularProducts() {
    const response = await apiClient.get('/products/popular');
    return response.data;
  },
  
  // 获取新品上架
  async getNewArrivals() {
    const response = await apiClient.get('/products/new');
    return response.data;
  },
  
  // 获取促销产品
  async getPromotions() {
    const response = await apiClient.get('/products/promotions');
    return response.data;
  }
};

export default apiService;