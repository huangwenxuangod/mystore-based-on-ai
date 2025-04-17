import { defineStore } from 'pinia'
import apiService from '../services/apiService'

// 用户接口定义
interface User {
  id: number
  username: string
  email: string
  realName?: string
  phone?: string
  gender?: string
  birthday?: string
  avatar?: string
  isAdmin?: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '', // 从localStorage获取token
    isAuthenticated: !!localStorage.getItem('token'), // 根据是否有token判断是否已认证
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 获取用户名
    username: (state) => {
      return state.user?.username || '游客'
    },

    // 是否是管理员
    isAdmin: (state) => {
      return state.user?.isAdmin || false
    }
  },

  actions: {
    // 用户注册
    async register(credentials: {
      username: string
      email: string
      password: string
      confirmPassword?: string
      realName?: string
      phone?: string
      gender?: string
      birthday?: string
    }) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.register(credentials)
        this.setUser(response.user)
        this.setToken(response.token)
        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || '注册失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 用户登录
    async login(credentials: { username: string; password: string }) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.login(credentials)
        this.setUser(response.user)
        this.setToken(response.token)
        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取当前用户信息
    async fetchCurrentUser() {
      if (!this.token) return null
      
      this.loading = true
      this.error = null
      
      try {
        const user = await apiService.getCurrentUser()
        this.setUser(user)
        return user
      } catch (error: any) {
        this.error = error.response?.data?.message || '获取用户信息失败'
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新用户信息
    async updateUserProfile(userData: Partial<User>) {
      this.loading = true
      this.error = null
      
      try {
        const updatedUser = await apiService.updateUserProfile(userData)
        this.setUser(updatedUser)
        return updatedUser
      } catch (error: any) {
        this.error = error.response?.data?.message || '更新用户信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更改密码
    async changePassword(passwordData: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) {
      this.loading = true
      this.error = null
      
      try {
        return await apiService.changePassword(passwordData)
      } catch (error: any) {
        this.error = error.response?.data?.message || '密码更新失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 设置当前用户
    setUser(user: User | null) {
      this.user = user
    },

    // 设置令牌
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('token', token)
    },

    // 登出
    logout() {
      this.user = null
      this.token = ''
      this.isAuthenticated = false
      localStorage.removeItem('token')
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['token', 'isAuthenticated']
      }
    ]
  }
})