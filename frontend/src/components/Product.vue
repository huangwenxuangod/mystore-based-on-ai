<template>
  <el-card class="product-card" shadow="hover">
    <div class="product-image-container">
      <router-link :to="`/product/${product.id}`" class="product-link">
        <img :src="product.image || defaultImage" :alt="product.name" class="product-image" />
        <div class="product-tag" v-if="product.tag">{{ product.tag }}</div>
        <div class="product-discount" v-if="product.discount && product.discount > 0">-{{ product.discount }}%</div>
      </router-link>
    </div>
    <div class="product-info">
      <router-link :to="`/product/${product.id}`" class="product-link">
        <h3 class="product-title">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
      </router-link>
      <div class="product-details">
        <div class="product-rating" v-if="product.rating">
          <el-rate
            v-model="product.rating"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            :allow-half="true"
            :size="'small'"
          />
          <span v-if="product.reviewCount" class="review-count">({{ product.reviewCount }})</span>
        </div>
        <p class="product-category" v-if="product.category">{{ product.category.name }}</p>
      </div>
      <div class="product-footer">
        <div class="product-price-container">
          <p class="product-price">￥{{ formatPrice(product.price) }}</p>
          <p class="product-original-price" v-if="product.originalPrice && product.originalPrice > product.price">
            ￥{{ formatPrice(product.originalPrice) }}
          </p>
        </div>
        <div class="product-actions">
          <el-button type="primary" size="small" class="buy-now-btn" @click.stop="addToCart">
            <el-icon><ShoppingCart /></el-icon>
          </el-button>
          
          <!-- 管理员操作按钮 -->
          <template v-if="isAdmin && editable">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="info" size="small" style="margin-left: 5px;">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon> 编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <el-icon color="#F56C6C"><Delete /></el-icon> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </div>
  </el-card>
  
  <!-- 删除确认对话框 -->
  <el-dialog v-model="deleteConfirmVisible" title="确认删除" width="300px" center>
    <span>确定要删除产品 "{{ product.name }}" 吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete" :loading="loading">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useUserStore } from '../stores/user';
import { useProductStore } from '../stores/product';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ShoppingCart, Edit, Delete, MoreFilled } from '@element-plus/icons-vue';

// 定义产品类型接口
interface ProductItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  tag?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  stock?: number;
  status?: 'active' | 'inactive';
  isNew?: boolean;
}

const props = defineProps<{
  product: ProductItem;
  editable?: boolean;
}>();

const emit = defineEmits(['edit', 'delete']);

const defaultImage = 'https://picsum.photos/300/300?random=1';
const deleteConfirmVisible = ref(false);
const userStore = useUserStore();
const productStore = useProductStore();
const loading = computed(() => productStore.loading);
const isAdmin = computed(() => userStore.isAdmin);

// 格式化价格，保留两位小数
const formatPrice = (price: number) => {
  return Number(price).toFixed(2);
};

// 添加到购物车
const addToCart = () => {
  ElMessage.success('添加到购物车成功');
  // 这里可以调用购物车的状态管理方法
};

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'edit') {
    emit('edit', props.product);
  } else if (command === 'delete') {
    deleteConfirmVisible.value = true;
  }
};

// 确认删除产品
const confirmDelete = async () => {
  try {
    await productStore.deleteProduct(props.product.id, userStore.token as string);
    deleteConfirmVisible.value = false;
    ElMessage.success('产品删除成功');
    emit('delete', props.product.id);
  } catch (error) {
    console.error('删除产品失败', error);
    ElMessage.error('删除失败，请重试');
  }
};
</script>

<style scoped lang="scss">
.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
  
  .product-card:hover & {
    transform: scale(1.05);
  }
}

.product-tag {
  position: absolute;
  top: 10px;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px 0 0 4px;
  z-index: 1;
}

.product-discount {
  position: absolute;
  top: 10px;
  left: 0;
  background-color: #ff9900;
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 0 4px 4px 0;
  z-index: 1;
}

.product-info {
  padding: 15px 10px 10px;
}

.product-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 38px;
}

.product-details {
  margin-bottom: 10px;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  
  .review-count {
    font-size: 12px;
    color: #777;
    margin-left: 5px;
  }
}

.product-category {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price-container {
  display: flex;
  align-items: center;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  margin: 0;
}

.product-original-price {
  margin: 0 0 0 5px;
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-actions {
  display: flex;
  align-items: center;
}

.buy-now-btn {
  opacity: 1;
  padding: 6px;
}
</style>
