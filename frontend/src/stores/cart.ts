import { defineStore } from 'pinia';
import apiService from '../services/apiService';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    loading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.items.length,
    cartTotal: (state) => state.total
  },

  actions: {
    // 从API加载购物车
    async fetchCart() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.getCartItems();
        this.items = response;
        this.calculateTotal();
      } catch (error) {
        this.error = error.message || '获取购物车失败';
        console.error('获取购物车失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 添加商品到购物车
    async addToCart(product, quantity = 1) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.addToCart(product.id, quantity);
        
        // 更新本地购物车
        const existingItem = this.items.find(item => item.productId === product.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.items.push({
            id: Date.now(), // 临时ID，将被服务器返回的ID替换
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
          });
        }
        
        // 重新获取最新购物车
        await this.fetchCart();
      } catch (error) {
        this.error = error.message || '添加商品到购物车失败';
        console.error('添加商品到购物车失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 从购物车中移除商品
    async removeFromCart(itemId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.deleteCartItem(itemId);
        this.items = this.items.filter(item => item.id !== itemId);
        this.calculateTotal();
      } catch (error) {
        this.error = error.message || '从购物车移除商品失败';
        console.error('从购物车移除商品失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 更新商品数量
    async updateQuantity(itemId, quantity) {
      if (quantity < 1) return;
      
      this.loading = true;
      this.error = null;
      try {
        await apiService.updateCartItem(itemId, quantity);
        
        // 更新本地购物车项
        const item = this.items.find(item => item.id === itemId);
        if (item) {
          item.quantity = quantity;
          this.calculateTotal();
        }
      } catch (error) {
        this.error = error.message || '更新商品数量失败';
        console.error('更新商品数量失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 清空购物车
    async clearCart() {
      this.loading = true;
      this.error = null;
      try {
        // 删除所有项
        for (const item of this.items) {
          await apiService.deleteCartItem(item.id);
        }
        this.items = [];
        this.total = 0;
      } catch (error) {
        this.error = error.message || '清空购物车失败';
        console.error('清空购物车失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 计算总价
    calculateTotal() {
      this.total = this.items.reduce((sum, item) => {
        // 处理字符串价格（如"¥2999"）
        const price = typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^\d.]/g, ''))
          : item.price;
          
        return sum + (price * item.quantity);
      }, 0);
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'cart',
        storage: localStorage
      }
    ]
  }
});