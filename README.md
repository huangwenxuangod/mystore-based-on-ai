# MyStore 电商系统

MyStore 是一个现代化的电商系统，采用前后端分离架构，提供完整的购物体验。

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
- MySQL 数据库
- Sequelize ORM
- JWT 认证
- Swagger API 文档
- CORS 跨域支持

## 功能特性

### 用户功能
- [x] 用户注册/登录
- [x] 个人中心
- [x] 收货地址管理
- [x] 订单管理
- [x] 收藏夹

### 商品功能
- [x] 商品分类
- [x] 商品搜索
- [x] 商品详情
- [x] 相关商品推荐
- [x] 新品上市
- [x] 促销活动

### 购物车功能
- [x] 加入购物车
- [x] 购物车管理
- [x] 商品数量修改
- [x] 商品删除
- [x] 商品结算

### 订单功能
- [x] 订单创建
- [x] 订单支付
- [x] 订单跟踪
- [x] 订单历史

## 项目结构

```
mystore/
├── frontend/               # 前端项目目录
│   ├── src/               # 源代码
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── router/       # 路由配置
│   │   ├── services/     # API 服务
│   │   ├── stores/       # 状态管理
│   │   └── styles/       # 全局样式
│   └── public/           # 公共资源
│
└── backend/               # 后端项目目录
    ├── config/           # 配置文件
    ├── controllers/      # 控制器
    ├── models/          # 数据模型
    ├── routes/          # 路由
    ├── middleware/      # 中间件
    └── utils/           # 工具函数
```

## 开始使用

### 环境要求
- Node.js 16+
- MySQL 8.0+
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

## API 文档

启动后端服务器后，访问 http://localhost:5000/api-docs 查看 Swagger API 文档。

## 开发团队

- 前端开发：[huangwenxuan]
- 后端开发：[huangwenxuan]
- UI 设计：[huangwenxuan]

## 许可证

[MIT License](LICENSE) 