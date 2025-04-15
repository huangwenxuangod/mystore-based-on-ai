import axios from 'axios'
import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  realName?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  avatar?: string
  isAdmin: boolean
}

interface UserState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const API_URL = 'http://localhost:5000/api'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    getUsername: (state) => state.user?.username || '',
    getUserAvatar: (state) => state.user?.avatar || ''
  },
  
  actions: {
    // 用户注册
    async register(userData: { username: string; email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        await axios.post(`${API_URL}/users/register`, userData)
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || '注册失败'
        console.error('注册失败', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 用户登录
    async login(credentials: { username: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/users/login`, credentials)
        this.token = response.data.accessToken
        localStorage.setItem('token', response.data.accessToken)
        this.isAuthenticated = true
        
        // 获取用户详细信息
        await this.fetchUserInfo()
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || '登录失败'
        console.error('登录失败', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 获取当前用户信息
    async fetchUserInfo() {
      if (!this.token) return null
      
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        this.user = response.data
        return response.data
      } catch (error: any) {
        if (error.response?.status === 401) {
          this.logout() // Token无效，注销用户
        }
        this.error = error.response?.data?.message || '获取用户信息失败'
        console.error('获取用户信息失败', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 更新用户信息
    async updateUserInfo(userData: Partial<Omit<User, 'id' | 'username' | 'email' | 'isAdmin'>>) {
      if (!this.token) return false
      
      this.loading = true
      this.error = null
      try {
        await axios.put(`${API_URL}/users/me`, userData, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        // 更新本地用户数据
        if (this.user) {
          this.user = { ...this.user, ...userData }
        }
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || '更新用户信息失败'
        console.error('更新用户信息失败', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 更新密码
    async updatePassword(passwordData: { oldPassword: string; newPassword: string }) {
      if (!this.token) return false
      
      this.loading = true
      this.error = null
      try {
        await axios.put(`${API_URL}/users/me/password`, passwordData, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || '更新密码失败'
        console.error('更新密码失败', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 用户登出
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },
    
    // 验证Token是否有效
    async validateToken() {
      if (!this.token) {
        this.isAuthenticated = false
        return false
      }
      
      try {
        await this.fetchUserInfo()
        this.isAuthenticated = !!this.user
        return this.isAuthenticated
      } catch (error) {
        this.isAuthenticated = false
        return false
      }
    }
  }
})