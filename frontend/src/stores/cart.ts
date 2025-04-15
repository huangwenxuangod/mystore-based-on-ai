import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),

  getters: {
    itemCount: (state) => state.items.length,
    cartTotal: (state) => state.total
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({
          ...product,
          quantity: 1
        });
      }

      this.calculateTotal();
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.calculateTotal();
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        this.calculateTotal();
      }
    },

    clearCart() {
      this.items = [];
      this.total = 0;
    },

    calculateTotal() {
      this.total = this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
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