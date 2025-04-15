<template>
  <div class="admin-products-page">
    <el-card class="admin-card">
      <template #header>
        <div class="admin-header">
          <h2>产品管理</h2>
          <el-button type="primary" @click="openProductForm()">
            <el-icon><Plus /></el-icon> 添加产品
          </el-button>
        </div>
      </template>
      
      <!-- 搜索和筛选区 -->
      <div class="filter-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索产品名称"
          clearable
          style="width: 200px; margin-right: 10px;"
          @keyup.enter="handleSearch"
          @clear="resetSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="categoryFilter"
          placeholder="按分类筛选"
          clearable
          style="width: 180px; margin-right: 10px;"
          @change="handleCategoryChange"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
        
        <el-select
          v-model="statusFilter"
          placeholder="按状态筛选"
          clearable
          style="width: 120px;"
          @change="handleStatusChange"
        >
          <el-option label="上架" value="active" />
          <el-option label="下架" value="inactive" />
        </el-select>
      </div>
      
      <!-- 产品表格 -->
      <el-table
        v-loading="loading"
        :data="filteredProducts"
        border
        style="width: 100%"
        stripe
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="60" />
        
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-image
              :src="scope.row.image || defaultImage"
              :preview-src-list="[scope.row.image || defaultImage]"
              fit="cover"
              style="width: 40px; height: 40px; border-radius: 4px;"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="产品名称" min-width="180" />
        
        <el-table-column prop="category.name" label="分类" width="120">
          <template #default="scope">
            {{ scope.row.category?.name || '未分类' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="价格" width="100" sortable>
          <template #default="scope">
            ￥{{ formatPrice(scope.row.price) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="stock" label="库存" width="80" sortable />
        
        <el-table-column prop="discount" label="折扣" width="80">
          <template #default="scope">
            {{ scope.row.discount ? `${scope.row.discount}%` : '无' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="isNew" label="新品" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.isNew" type="success" size="small">是</el-tag>
            <span v-else>否</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'active' ? 'success' : 'info'"
              size="small"
            >
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="openProductForm(scope.row)"
              title="编辑"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              title="删除"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(scope.row)"
              :title="scope.row.status === 'active' ? '下架' : '上架'"
            >
              <el-icon>
                <component :is="scope.row.status === 'active' ? 'Hide' : 'View'" />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, total, sizes"
          :total="totalProducts"
          :page-size="pageSize"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 产品表单对话框 -->
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
    
    <!-- 删除确认对话框 -->
    <el-dialog v-model="deleteConfirmVisible" title="确认删除" width="300px" center>
      <span>确定要删除产品 "{{ selectedProduct?.name }}" 吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useProductStore } from '../stores/product';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Plus, Edit, Delete, Search, Hide, View } from '@element-plus/icons-vue';

// 路由
const router = useRouter();

// 状态管理
const productStore = useProductStore();
const userStore = useUserStore();
const loading = computed(() => productStore.loading);

// 检查用户是否管理员，否则重定向
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    try {
      const isValid = await userStore.validateToken();
      if (!isValid || !userStore.isAdmin) {
        ElMessage.error('无权限访问该页面');
        router.push('/');
        return;
      }
    } catch (error) {
      router.push('/');
      return;
    }
  } else if (!userStore.isAdmin) {
    ElMessage.error('无权限访问该页面');
    router.push('/');
    return;
  }
  
  // 加载产品和分类数据
  await loadData();
});

// 加载数据
const loadData = async () => {
  try {
    await productStore.fetchProducts();
    await productStore.fetchCategories();
  } catch (error) {
    console.error('加载数据失败', error);
    ElMessage.error('加载数据失败');
  }
};

// 产品相关数据
const products = computed(() => productStore.products);
const categories = computed(() => productStore.categories);
const defaultImage = 'https://picsum.photos/300/300?random=1';

// 分页和筛选
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');
const categoryFilter = ref<number | null>(null);
const statusFilter = ref<string | null>(null);

// 计算分页和筛选后的产品列表
const filteredProducts = computed(() => {
  let result = [...products.value];
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (categoryFilter.value) {
    result = result.filter(item => item.categoryId === categoryFilter.value);
  }
  
  if (statusFilter.value) {
    result = result.filter(item => item.status === statusFilter.value);
  }
  
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  
  return result.slice(startIndex, endIndex);
});

// 总产品数量
const totalProducts = computed(() => {
  let result = [...products.value];
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (categoryFilter.value) {
    result = result.filter(item => item.categoryId === categoryFilter.value);
  }
  
  if (statusFilter.value) {
    result = result.filter(item => item.status === statusFilter.value);
  }
  
  return result.length;
});

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

// 搜索和筛选处理
const handleSearch = () => {
  currentPage.value = 1;
};

const resetSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const handleCategoryChange = () => {
  currentPage.value = 1;
};

const handleStatusChange = () => {
  currentPage.value = 1;
};

// 格式化价格，保留两位小数
const formatPrice = (price: number) => {
  return Number(price).toFixed(2);
};

// 产品表单相关
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
      } else {
        // 创建产品
        await productStore.createProduct(
          productForm.value,
          userStore.token as string
        );
        ElMessage.success('产品创建成功');
      }
      
      dialogVisible.value = false;
      
      // 重新加载产品数据
      await productStore.fetchProducts();
    } catch (error) {
      console.error('提交产品表单失败', error);
      ElMessage.error('操作失败，请重试');
    }
  });
};

// 删除相关
const deleteConfirmVisible = ref(false);
const selectedProduct = ref<any>(null);

const handleDelete = (product: any) => {
  selectedProduct.value = product;
  deleteConfirmVisible.value = true;
};

const confirmDelete = async () => {
  if (!selectedProduct.value) return;
  
  try {
    await productStore.deleteProduct(
      selectedProduct.value.id,
      userStore.token as string
    );
    deleteConfirmVisible.value = false;
    ElMessage.success('产品删除成功');
    
    // 重新加载产品数据
    await productStore.fetchProducts();
  } catch (error) {
    console.error('删除产品失败', error);
    ElMessage.error('删除失败，请重试');
  }
};

// 切换产品状态（上架/下架）
const handleToggleStatus = async (product: any) => {
  try {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    await productStore.updateProduct(
      product.id,
      { status: newStatus },
      userStore.token as string
    );
    ElMessage.success(`产品已${newStatus === 'active' ? '上架' : '下架'}`);
    
    // 重新加载产品数据
    await productStore.fetchProducts();
  } catch (error) {
    console.error('切换产品状态失败', error);
    ElMessage.error('操作失败，请重试');
  }
};
</script>

<style scoped lang="scss">
.admin-products-page {
  padding: 20px;
}

.admin-card {
  margin-bottom: 20px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
  }
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .filter-container {
    flex-direction: column;
    
    .el-input,
    .el-select {
      width: 100% !important;
      margin-right: 0 !important;
      margin-bottom: 10px;
    }
  }
  
  .pagination-container {
    justify-content: center;
  }
}
</style>