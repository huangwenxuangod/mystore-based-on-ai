import { defineStore } from 'pinia'
import axios from 'axios'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  rating?: number
  reviewCount?: number
  salesCount?: number
  isNew?: boolean
  discount?: number
  tag?: string
  status?: 'active' | 'inactive'
  stock?: number
  categoryId?: number
  category?: Category
}

interface Category {
  id: number
  name: string
  icon?: string
  description?: string
}

interface ProductState {
  products: Product[]
  product: Product | null
  loading: boolean
  error: string | null
  newArrivals: Product[]
  promotions: Product[]
  popularProducts: Product[]
  categories: Category[]
}

const API_URL = 'http://localhost:3000/api'

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    newArrivals: [],
    promotions: [],
    popularProducts: [],
    categories: []
  }),
  
  getters: {
    getProductById: (state) => (id: number) => {
      return state.products.find(product => product.id === id) || null
    },
    getProductsByCategory: (state) => (categoryId: number) => {
      return state.products.filter(product => product.categoryId === categoryId)
    }
  },
  
  actions: {
    // 获取所有产品
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/products`)
        this.products = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '获取产品列表失败'
        console.error('获取产品列表失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取单个产品详情
    async fetchProductById(id: number) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/products/${id}`)
        this.product = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '获取产品详情失败'
        console.error('获取产品详情失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 创建新产品
    async createProduct(product: Omit<Product, 'id'>, token: string) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/products`, product, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        // 添加新产品到列表
        this.products.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '创建产品失败'
        console.error('创建产品失败', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新产品
    async updateProduct(id: number, product: Partial<Product>, token: string) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`${API_URL}/products/${id}`, product, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        // 更新本地产品数据
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...product }
        }
        if (this.product && this.product.id === id) {
          this.product = { ...this.product, ...product }
        }
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '更新产品失败'
        console.error('更新产品失败', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除产品
    async deleteProduct(id: number, token: string) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        // 从本地列表中移除
        this.products = this.products.filter(p => p.id !== id)
        if (this.product && this.product.id === id) {
          this.product = null
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || '删除产品失败'
        console.error('删除产品失败', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取新品
    async fetchNewArrivals() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/products/new`)
        this.newArrivals = response.data
      } catch (error: any) {
        console.error('获取新品失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取促销产品
    async fetchPromotions() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/products/promotions`)
        this.promotions = response.data
      } catch (error: any) {
        console.error('获取促销产品失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取热门产品
    async fetchPopularProducts() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/products/popular`)
        this.popularProducts = response.data
      } catch (error: any) {
        console.error('获取热门产品失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有分类
    async fetchCategories() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/categories`)
        this.categories = response.data
      } catch (error: any) {
        console.error('获取分类失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 搜索产品
    async searchProducts(query: string) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/products`, {
          params: { name: query }
        })
        this.products = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '搜索产品失败'
        console.error('搜索产品失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 按分类过滤产品
    async filterByCategory(categoryId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/products`, {
          params: { categoryId }
        })
        this.products = response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || '过滤产品失败'
        console.error('过滤产品失败', error)
      } finally {
        this.loading = false
      }
    }
  }
})