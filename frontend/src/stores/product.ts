import { defineStore } from 'pinia'
import apiService from '../services/apiService'

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
        const products = await apiService.getProducts()
        this.products = products
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
        const product = await apiService.getProductById(id)
        this.product = product
      } catch (error: any) {
        this.error = error.response?.data?.message || '获取产品详情失败'
        console.error('获取产品详情失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 创建新产品
    async createProduct(product: Omit<Product, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const newProduct = await apiService.createProduct(product)
        // 添加新产品到列表
        this.products.push(newProduct)
        return newProduct
      } catch (error: any) {
        this.error = error.response?.data?.message || '创建产品失败'
        console.error('创建产品失败', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新产品
    async updateProduct(id: number, product: Partial<Product>) {
      this.loading = true
      this.error = null
      try {
        const updatedProduct = await apiService.updateProduct(id, product)
        // 更新本地产品数据
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...product }
        }
        if (this.product && this.product.id === id) {
          this.product = { ...this.product, ...product }
        }
        return updatedProduct
      } catch (error: any) {
        this.error = error.response?.data?.message || '更新产品失败'
        console.error('更新产品失败', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除产品
    async deleteProduct(id: number) {
      this.loading = true
      this.error = null
      try {
        await apiService.deleteProduct(id)
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
        const newArrivals = await apiService.getNewArrivals()
        this.newArrivals = newArrivals
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
        const promotions = await apiService.getPromotions()
        this.promotions = promotions
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
        const popularProducts = await apiService.getPopularProducts()
        this.popularProducts = popularProducts
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
        const categories = await apiService.getCategories()
        this.categories = categories
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
        const products = await apiService.searchProducts(query)
        this.products = products
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
        const products = await apiService.getProductsByCategory(categoryId)
        this.products = products
      } catch (error: any) {
        this.error = error.response?.data?.message || '过滤产品失败'
        console.error('过滤产品失败', error)
      } finally {
        this.loading = false
      }
    }
  }
})