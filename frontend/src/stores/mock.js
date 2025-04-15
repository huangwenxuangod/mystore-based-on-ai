import axios from 'axios'
import { defineStore } from 'pinia'

export const useMockStore = defineStore('mock', {
  state: () => ({
    homeData: null,
    userData: null,
    cartData: null,
    ordersData: null,
    favoritesData: null,
    addressesData: null,
    productsData: null,
    promotionsData: null,
    newArrivalsData: null,
    carouselData: null
  }),

  actions: {
    async getHomeData() {
      try {
        const response = await axios.get('/api/mock/home')
        this.homeData = response.data
        return response.data
      } catch (error) {
        console.error('获取首页数据失败:', error)
        throw error
      }
    },

    async getUserData() {
      try {
        const response = await axios.get('/api/mock/user')
        this.userData = response.data
        return response.data
      } catch (error) {
        console.error('获取用户数据失败:', error)
        throw error
      }
    },

    async getCartData() {
      try {
        const response = await axios.get('/api/mock/cart')
        this.cartData = response.data
        return response.data
      } catch (error) {
        console.error('获取购物车数据失败:', error)
        throw error
      }
    },

    async getOrdersData() {
      try {
        const response = await axios.get('/api/mock/orders')
        this.ordersData = response.data
        return response.data
      } catch (error) {
        console.error('获取订单数据失败:', error)
        throw error
      }
    },

    async getFavoritesData() {
      try {
        const response = await axios.get('/api/mock/favorites')
        this.favoritesData = response.data
        return response.data
      } catch (error) {
        console.error('获取收藏数据失败:', error)
        throw error
      }
    },

    async getAddressesData() {
      try {
        const response = await axios.get('/api/mock/addresses')
        this.addressesData = response.data
        return response.data
      } catch (error) {
        console.error('获取地址数据失败:', error)
        throw error
      }
    },

    async getAllProducts() {
      try {
        const response = await axios.get('/api/mock/products')
        this.productsData = response.data
        return response.data
      } catch (error) {
        console.error('获取商品数据失败:', error)
        throw error
      }
    },

    async getProductDetail(id) {
      try {
        const response = await axios.get(`/api/mock/products/${id}`)
        return response.data
      } catch (error) {
        console.error('获取商品详情失败:', error)
        throw error
      }
    },

    async getPromotionsData() {
      try {
        const response = await axios.get('/api/mock/promotions')
        this.promotionsData = response.data
        return response.data
      } catch (error) {
        console.error('获取促销数据失败:', error)
        throw error
      }
    },

    async getNewArrivalsData() {
      try {
        const response = await axios.get('/api/mock/new-arrivals')
        this.newArrivalsData = response.data
        return response.data
      } catch (error) {
        console.error('获取新品上市数据失败:', error)
        throw error
      }
    },

    async getCarouselData() {
      try {
        const response = await axios.get('/api/mock/carousel')
        this.carouselData = response.data
        return response.data
      } catch (error) {
        console.error('获取轮播图数据失败:', error)
        throw error
      }
    },

    async updateUserInfo(userInfo) {
      try {
        const response = await axios.put('/api/mock/user', userInfo)
        this.userData = response.data
        return response.data
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    },

    async updatePassword(passwordInfo) {
      try {
        const response = await axios.put('/api/mock/user/password', passwordInfo)
        return response.data
      } catch (error) {
        console.error('更新密码失败:', error)
        throw error
      }
    }
  }
}) 