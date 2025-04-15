import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false')
  }

  function applyTheme() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      document.body.setAttribute('data-theme', 'dark')
      document.body.style.colorScheme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      document.body.removeAttribute('data-theme')
      document.body.style.colorScheme = 'light'
    }
  }

  function initTheme() {
    // 检查用户保存的偏好设置
    const darkMode = localStorage.getItem('darkMode')
    
    // 先检查本地存储，如果没有则检查系统首选项
    if (darkMode === 'true' || 
       (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode.value = true
    } else {
      isDarkMode.value = false
    }
    
    applyTheme()
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('darkMode')) { // 只在用户未手动设置主题时响应系统变化
        isDarkMode.value = e.matches
        applyTheme()
      }
    })
  }

  return {
    isDarkMode,
    toggleTheme,
    initTheme
  }
})
