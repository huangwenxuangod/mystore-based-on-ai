import { defineStore } from 'pinia'
import apiService from '@/services/apiService'

// 简化的用户接口定义
interface User {
  id: number
  email: string
  isAdmin?: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin: false, // 默认不是管理员，根据实际用户信息设置
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    // 获取用户邮箱
    userEmail: (state) => state.user?.email || '未登录',
    
    // 验证token
    validateToken: (state) => {
      return async () => {
        if (!state.token) return false;
        try {
          const user = await apiService.getCurrentUser();
          if (user) {
            state.user = user;
            state.isAdmin = user.isAdmin || false; // 使用服务器返回的实际权限
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
    }
  },
  
  actions: {
    // 简化的用户注册
    async register(credentials: {
      email: string,
      password: string
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

    // 简化的用户登录
    async login(credentials: { email: string; password: string }) {
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

    // 更改密码
    async changePassword(passwordData: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.changePassword(passwordData)
        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || '修改密码失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 设置当前用户
    setUser(user: User | null) {
      this.user = user
      if (user) {
        this.isAdmin = user.isAdmin || false // 根据用户实际权限设置管理员状态
      }
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
      this.isAdmin = false // 登出后重置管理员状态
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