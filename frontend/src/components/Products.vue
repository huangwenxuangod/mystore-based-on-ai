<template>
  <div class="products-container">
    <div class="products-header">
      <h2 class="section-title">{{ title || '热门商品' }}</h2>
      <el-button type="text" class="view-more" @click="$emit('view-more')" v-if="showViewMore">
        查看更多 <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="productList.length === 0" class="empty-container">
      <el-empty description="暂无产品" />
    </div>
    
    <div v-else class="products">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in productList" :key="product.id">
          <div class="product-wrapper">
            <Product :product="product" />
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 管理员操作区域 -->
    <div class="admin-actions" v-if="isAdmin && editable">
      <el-button type="primary" @click="openProductForm()">
        <el-icon><Plus /></el-icon> 添加产品
      </el-button>
    </div>
    
    <!-- 新增/编辑产品表单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑产品' : '添加产品'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
        class="product-form"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        
        <el-form-item label="价格" prop="price">
          <el-input-number 
            v-model="productForm.price" 
            :min="0" 
            :precision="2" 
            :step="10" 
            placeholder="请输入产品价格"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="原价" prop="originalPrice">
          <el-input-number 
            v-model="productForm.originalPrice" 
            :min="0" 
            :precision="2" 
            :step="10" 
            placeholder="请输入产品原价"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="请选择分类" style="width: 100%;">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input
            v-model="productForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        
        <el-form-item label="图片链接">
          <el-input v-model="productForm.image" placeholder="请输入图片URL" />
        </el-form-item>
        
        <el-form-item label="库存" prop="stock">
          <el-input-number 
            v-model="productForm.stock" 
            :min="0" 
            :step="1" 
            placeholder="请输入库存数量"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="折扣">
          <el-input-number 
            v-model="productForm.discount" 
            :min="0" 
            :max="100" 
            :step="5" 
            placeholder="折扣百分比"
            style="width: 100%;"
          />
        </el-form-item>
        
        <el-form-item label="标签">
          <el-input v-model="productForm.tag" placeholder="如：新品、热卖等" />
        </el-form-item>
        
        <el-form-item label="新品">
          <el-switch v-model="productForm.isNew" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="productForm.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProductForm" :loading="loading">
            {{ isEditing ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import { useProductStore } from '../stores/product';
import { useUserStore } from '../stores/user';
import Product from './Product.vue';
import { ArrowRight, Plus } from '@element-plus/icons-vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showViewMore: {
    type: Boolean,
    default: true
  },
  products: {
    type: Array,
    default: () => []
  },
  productType: {
    type: String,
    default: 'popular' // popular, new, promotion, all
  },
  categoryId: {
    type: Number,
    default: null
  },
  editable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['view-more', 'product-added', 'product-updated']);

const productStore = useProductStore();
const userStore = useUserStore();
const loading = computed(() => productStore.loading);
const isAdmin = computed(() => userStore.isAdmin);

// 根据不同类型获取对应的产品列表
const productList = computed(() => {
  // 如果直接传入了products，则使用传入的产品列表
  if (props.products && props.products.length > 0) {
    return props.products;
  }
  
  // 否则根据productType获取产品列表
  switch (props.productType) {
    case 'new':
      return productStore.newArrivals;
    case 'promotion':
      return productStore.promotions;
    case 'popular':
      return productStore.popularProducts;
    case 'category':
      if (props.categoryId) {
        return productStore.products.filter(p => p.categoryId === props.categoryId);
      }
      return [];
    case 'all':
      return productStore.products;
    default:
      return [];
  }
});

const categories = computed(() => productStore.categories);

// 加载数据
onMounted(async () => {
  try {
    switch (props.productType) {
      case 'new':
        await productStore.fetchNewArrivals();
        break;
      case 'promotion':
        await productStore.fetchPromotions();
        break;
      case 'popular':
        await productStore.fetchPopularProducts();
        break;
      case 'category':
        if (props.categoryId) {
          await productStore.filterByCategory(props.categoryId);
        }
        break;
      case 'all':
      default:
        await productStore.fetchProducts();
    }
    
    // 获取分类列表（用于表单选择）
    await productStore.fetchCategories();
  } catch (error) {
    console.error('获取产品数据失败', error);
  }
});

// 产品表单
const dialogVisible = ref(false);
const isEditing = ref(false);
const productFormRef = ref<FormInstance>();

// 产品表单数据
const productForm = ref({
  id: null as number | null,
  name: '',
  price: 0,
  originalPrice: 0,
  description: '',
  image: '',
  stock: 0,
  discount: 0,
  tag: '',
  isNew: false,
  status: 'active' as 'active' | 'inactive',
  categoryId: null as number | null
});

// 表单验证规则
const productRules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }]
};

// 打开产品表单（新增或编辑）
const openProductForm = (product?: any) => {
  if (product) {
    // 编辑现有产品
    isEditing.value = true;
    productForm.value = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : 0,
      description: product.description || '',
      image: product.image || '',
      stock: product.stock || 0,
      discount: product.discount || 0,
      tag: product.tag || '',
      isNew: product.isNew || false,
      status: product.status || 'active',
      categoryId: product.categoryId || null
    };
  } else {
    // 新增产品
    isEditing.value = false;
    productForm.value = {
      id: null,
      name: '',
      price: 0,
      originalPrice: 0,
      description: '',
      image: '',
      stock: 0,
      discount: 0,
      tag: '',
      isNew: false,
      status: 'active',
      categoryId: null
    };
  }
  dialogVisible.value = true;
};

// 提交产品表单
const submitProductForm = async () => {
  if (!productFormRef.value) return;
  
  await productFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    try {
      if (isEditing.value && productForm.value.id) {
        // 更新产品
        await productStore.updateProduct(
          productForm.value.id,
          productForm.value,
          userStore.token as string
        );
        ElMessage.success('产品更新成功');
        emit('product-updated', productForm.value);
      } else {
        // 创建产品
        const result = await productStore.createProduct(
          productForm.value,
          userStore.token as string
        );
        ElMessage.success('产品创建成功');
        emit('product-added', result);
      }
      
      dialogVisible.value = false;
      
      // 重新加载产品数据
      if (props.productType === 'all') {
        productStore.fetchProducts();
      }
    } catch (error) {
      console.error('提交产品表单失败', error);
      ElMessage.error('操作失败，请重试');
    }
  });
};
</script>

<style scoped lang="scss">
.products-container {
  padding: 20px 0;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-title {
  font-size: 24px;
  margin: 0;
  position: relative;
  padding-left: 15px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    width: 4px;
    background-color: #ff6b6b;
    border-radius: 2px;
  }
}

.view-more {
  font-size: 14px;
  display: flex;
  align-items: center;
  
  .el-icon {
    margin-left: 4px;
    transition: transform 0.3s;
  }
  
  &:hover .el-icon {
    transform: translateX(4px);
  }
}

.product-wrapper {
  margin-bottom: 25px;
}

.loading-container,
.empty-container {
  padding: 40px 0;
  text-align: center;
}

.admin-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.product-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

@media (max-width: 768px) {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>