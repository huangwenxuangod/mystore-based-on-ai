import api from './api';

const apiService = {
  // 首页相关接口
  getHomeData: async () => {
    try {
      // 从统一的home API获取数据，避免多次请求
      const homeData = await api.get('/home');
      
      // 返回处理后的数据结构，匹配之前的接口
      return {
        banners: homeData.data?.carousels || [], // 从home API中获取轮播图数据
        popularProducts: homeData.data?.featuredProducts || [], // 从home API中获取热门商品数据
        newArrivals: homeData.data?.recommendSections?.find(s => s.type === 'new')?.products || [], // 获取新品上市
        features: homeData.data?.gridMenus?.filter(m => !m.type || m.type !== 'activity')?.slice(0, 4) || [] // 获取特色服务
      };
    } catch (error) {
      console.error('获取首页数据失败:', error);
      throw error;
    }
  },

  // 轮播图接口
  getCarouselData: async () => {
    try {
      const response = await api.get('/carousel');
      // 正确处理返回的数据结构，适配 mock 数据中的 { data: [...], success: boolean } 格式
      return response.data || [];
    } catch (error) {
      console.error('获取轮播图数据失败:', error);
      throw error;
    }
  },

  // 商品相关接口
  getAllProducts: async (params?: any) => {
    try {
      const response = await api.get('/products', { params });
      return response;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    }
  },

  // 商品详情接口
  getProductById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      throw error;
    }
  },

  // 推荐商品接口
  getRecommendedProducts: async () => {
    try {
      const response = await api.get('/products/recommended');
      return response || [];
    } catch (error) {
      console.error('获取推荐商品失败:', error);
      throw error; // 不再提供硬编码的兜底数据，让mock服务处理
    }
  },

  // 购物车相关接口
  getCartData: async () => {
    try {
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      console.error('获取购物车数据失败:', error);
      throw error;
    }
  },

  // 获取购物车商品列表
  getCartItems: async () => {
    try {
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      console.error('获取购物车商品列表失败:', error);
      throw error;
    }
  },

  // 添加到购物车
  addToCart: async (productId: number, quantity: number) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      return response;
    } catch (error) {
      console.error('添加购物车失败:', error);
      throw error;
    }
  },

  // 更新购物车
  updateCartItem: async (itemId: number, quantity: number) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response;
    } catch (error) {
      console.error('更新购物车失败:', error);
      throw error;
    }
  },

  // 删除购物车项
  deleteCartItem: async (itemId: number) => {
    try {
      await api.delete(`/cart/${itemId}`);
      return true;
    } catch (error) {
      console.error('删除购物车商品失败:', error);
      throw error;
    }
  },

  // 用户相关接口
  getUserData: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.error('获取用户数据失败:', error);
      throw error;
    }
  },

  // 用户登录
  login: async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post('/users/signin', credentials);
      // 保存token到localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  register: async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await api.post('/users/signup', userData);
      return response;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 用户登出
  logout: async () => {
    localStorage.removeItem('token');
    return { success: true };
  },

  // 订单相关接口
  getOrderData: async () => {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      console.error('获取订单数据失败:', error);
      throw error;
    }
  },

  // 创建订单
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('创建订单失败:', error);
      throw error;
    }
  },

  // 获取订单详情
  getOrderById: async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  },

  // 取消订单
  cancelOrder: async (orderId: string) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      console.error('取消订单失败:', error);
      throw error;
    }
  },

  // 发起支付
  initiatePayment: async (orderId: string) => {
    try {
      const response = await api.post(`/orders/${orderId}/pay`);
      return response;
    } catch (error) {
      console.error('发起支付失败:', error);
      throw error;
    }
  },

  // 完成支付
  completePayment: async (orderId: string) => {
    try {
      const response = await api.post(`/orders/${orderId}/payment-complete`);
      return response;
    } catch (error) {
      console.error('完成支付失败:', error);
      throw error;
    }
  },

  // 地址相关接口
  getAddressesData: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response;
    } catch (error) {
      console.error('获取地址数据失败:', error);
      throw error;
    }
  },

  // 添加地址
  addAddress: async (addressData: any) => {
    try {
      const response = await api.post('/users/addresses', addressData);
      return response;
    } catch (error) {
      console.error('添加地址失败:', error);
      throw error;
    }
  },

  // 更新地址
  updateAddress: async (addressId: number, addressData: any) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}`, addressData);
      return response;
    } catch (error) {
      console.error('更新地址失败:', error);
      throw error;
    }
  },

  // 删除地址
  deleteAddress: async (addressId: number) => {
    try {
      await api.delete(`/users/addresses/${addressId}`);
      return true;
    } catch (error) {
      console.error('删除地址失败:', error);
      throw error;
    }
  },

  // 促销活动相关接口
  getPromotionsData: async () => {
    try {
      const response = await api.get('/products/promotions');
      return response;
    } catch (error) {
      console.error('获取促销活动数据失败:', error);
      throw error;
    }
  },

  // 新品上市相关接口
  getNewArrivalsData: async () => {
    try {
      const response = await api.get('/products/new');
      return response;
    } catch (error) {
      console.error('获取新品上市数据失败:', error);
      throw error;
    }
  },

  // 用户信息更新
  updateUserInfo: async (userData: any) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  // 密码更新
  updatePassword: async (passwordData: { oldPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response;
    } catch (error) {
      console.error('密码更新失败:', error);
      throw error;
    }
  }
};

export default apiService;