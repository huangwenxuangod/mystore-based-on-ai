# MyStore 电商系统

MyStore 是一个现代化的电商系统，采用前后端分离架构，提供完整的购物体验。系统包含商品浏览、购物车、订单管理、用户中心等核心电商功能。

## 技术栈

### 前端
- Vue 3 + TypeScript
- Element Plus UI 框架
- Vite 构建工具
- Vue Router 路由管理
- Pinia 状态管理
- Axios HTTP 客户端
- SCSS 样式预处理器

### 后端
- Node.js + Express
- PostgreSQL 数据库
- Sequelize ORM
- JWT 认证
- Swagger API 文档
- CORS 跨域支持

## 功能特性

### 用户功能
- [x] 用户注册/登录
- [x] 个人中心管理
- [x] 收货地址管理
- [x] 订单管理
- [x] 收藏夹

### 商品功能
- [x] 商品分类浏览
- [x] 商品搜索与筛选
- [x] 商品详情展示
- [x] 相关商品推荐
- [x] 新品上市专区
- [x] 促销活动专区

### 购物车功能
- [x] 快速加入购物车
- [x] 购物车管理
- [x] 商品数量修改
- [x] 商品选择与移除
- [x] 结算下单

### 订单功能
- [x] 订单创建与确认
- [x] 在线支付流程
- [x] 订单状态跟踪
- [x] 订单历史查询

## 项目结构

```
mystore/
├── frontend/                # 前端项目目录
│   ├── src/                # 源代码
│   │   ├── assets/        # 静态资源
│   │   ├── components/    # 组件
│   │   │   ├── carousel.vue   # 轮播图组件
│   │   │   ├── Header.vue     # 页头组件
│   │   │   ├── Product.vue    # 产品组件
│   │   │   └── ...
│   │   ├── mock/          # 模拟数据
│   │   │   └── data/      # 分类模拟数据
│   │   ├── pages/         # 页面组件
│   │   │   ├── HomePage.vue           # 首页
│   │   │   ├── ProductsPage.vue       # 产品列表页
│   │   │   ├── ProductDetailPage.vue  # 产品详情页
│   │   │   └── ...
│   │   ├── router/        # 路由配置
│   │   ├── services/      # API 服务
│   │   │   ├── api.ts     # API基础配置
│   │   │   └── apiService.ts  # API服务实现
│   │   ├── stores/        # 状态管理
│   │   │   ├── cart.ts    # 购物车状态
│   │   │   ├── user.ts    # 用户状态
│   │   │   └── ...
│   │   └── types/         # TypeScript类型定义
│   └── public/            # 公共资源
│
└── backend/                # 后端项目目录
    ├── config/            # 配置文件
    │   ├── db.config.js   # 数据库配置
    │   └── swagger.js     # API文档配置
    ├── controllers/       # 控制器
    │   ├── cart.controller.js     # 购物车控制器
    │   ├── product.controller.js  # 产品控制器
    │   └── ...
    ├── models/            # 数据模型
    │   ├── product.model.js   # 产品模型
    │   ├── user.model.js      # 用户模型
    │   └── ...
    ├── routes/            # API路由
    │   ├── cart.routes.js     # 购物车路由
    │   ├── product.routes.js  # 产品路由
    │   └── ...
    ├── middleware/        # 中间件
    └── utils/             # 工具函数
```

## 开始使用

### 环境要求
- Node.js 16+
- PostgreSQL 数据库
- pnpm 包管理器

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/mystore.git
cd mystore
```

2. 安装前端依赖
```bash
cd frontend
pnpm install
```

3. 安装后端依赖
```bash
cd ../backend
pnpm install
```

4. 配置环境变量
```bash
# 在 backend 目录下创建 .env 文件
cp .env.example .env
# 编辑 .env 文件，配置数据库等信息
```

5. 启动开发服务器

前端开发服务器：
```bash
cd frontend
pnpm dev
```

后端开发服务器：
```bash
cd backend
pnpm dev
```

## 访问应用

- 前端: http://localhost:5173
- 后端API: http://localhost:5000
- API文档: http://localhost:5000/api-docs

## API 文档

启动后端服务器后，访问 http://localhost:5000/api-docs 查看 Swagger API 文档。
API 文档提供了所有接口的详细说明，包括：

- 用户认证接口
- 商品管理接口
- 购物车操作接口
- 订单处理接口
- 分类管理接口

## 开发团队

- 开发者：黄文轩

## 许可证

[MIT License](LICENSE)