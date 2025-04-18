<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1>欢迎登录</h1>
          <p>享受购物乐趣，从登录开始</p>
        </div>
        
        <!-- 登录/注册切换卡片 -->
        <el-card class="login-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login">
              <!-- 邮箱密码登录表单 -->
              <el-form ref="accountLoginForm" :model="accountForm" :rules="accountRules" label-position="top">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="accountForm.email" placeholder="请输入邮箱" prefix-icon="Message" />
                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                  <el-input 
                    v-model="accountForm.password" 
                    placeholder="请输入密码" 
                    show-password 
                    prefix-icon="Lock"
                  />
                </el-form-item>
                
                <div class="form-actions">
                  <div class="remember-me">
                    <el-checkbox v-model="accountForm.rememberMe">记住我</el-checkbox>
                  </div>
                </div>
                
                <div class="form-submit">
                  <el-button 
                    type="primary" 
                    :loading="loading" 
                    @click="handleAccountLogin" 
                    class="submit-button"
                  >
                    登录
                  </el-button>
                </div>
              </el-form>
              
              <div class="register-link">
                <p>
                  还没有账号? 
                  <a href="javascript:void(0)" @click="activeTab = 'register'">立即注册</a>
                </p>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="注册" name="register">
              <!-- 注册表单 -->
              <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-position="top">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="Message" />
                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                  <el-input 
                    v-model="registerForm.password" 
                    placeholder="请输入密码" 
                    show-password 
                    prefix-icon="Lock"
                  />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input 
                    v-model="registerForm.confirmPassword" 
                    placeholder="请再次输入密码" 
                    show-password 
                    prefix-icon="Lock"
                  />
                </el-form-item>
                
                <div class="form-submit">
                  <el-button 
                    type="primary" 
                    :loading="loading" 
                    @click="handleRegister" 
                    class="submit-button"
                  >
                    注册
                  </el-button>
                </div>
                
                <div class="register-link">
                  <p>
                    已有账号? 
                    <a href="javascript:void(0)" @click="activeTab = 'login'">去登录</a>
                  </p>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        
        <!-- 协议提示 -->
        <div class="terms-notice">
          登录/注册即表示您同意 
          <el-link type="primary" href="javascript:void(0)">用户协议</el-link> 和 
          <el-link type="primary" href="javascript:void(0)">隐私政策</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FormInstance, FormRules, ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';
import { Lock, Message } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 活动页签
const activeTab = ref('login');

// 邮箱密码登录表单
const accountLoginForm = ref<FormInstance>();
const accountForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

// 注册表单
const registerFormRef = ref<FormInstance>();
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

// 加载状态
const loading = ref(false);

// 重定向URL
const redirect = computed(() => route.query.redirect as string || '/');

// 表单验证规则
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'));
  } else {
    callback();
  }
};

const validateConfirmPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const accountRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ]
});

const registerRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPass, trigger: 'blur' }
  ]
});

// 邮箱密码登录
const handleAccountLogin = async () => {
  if (!accountLoginForm.value) return;
  
  await accountLoginForm.value.validate(async (valid) => {
    if (!valid) return;
    
    try {
      loading.value = true;
      await userStore.login({
        email: accountForm.email,
        password: accountForm.password
      });
      
      ElMessage.success('登录成功');
      
      // 直接跳转到用户页面
      router.push('/user');
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败');
    } finally {
      loading.value = false;
    }
  });
};

// 注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    try {
      loading.value = true;
      await userStore.register({
        email: registerForm.email,
        password: registerForm.password
      });
      
      ElMessage.success('注册成功，已自动登录');
      
      // 直接跳转到用户页面
      router.push('/user');
    } catch (error: any) {
      ElMessage.error(error.message || '注册失败');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 40px 20px;
  background-color: var(--el-bg-color-page);
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
  }
  
  p {
    color: var(--el-text-color-secondary);
    font-size: 16px;
  }
}

.login-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-submit {
  margin-top: 20px;
  
  .submit-button {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
  }
}

.register-link {
  text-align: center;
  margin-top: 20px;
  
  p {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    
    a {
      color: var(--el-color-primary);
      text-decoration: none;
    }
  }
}

.terms-notice {
  text-align: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 20px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
}
</style>