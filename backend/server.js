import cors from "cors";
import { config } from 'dotenv';
import express from "express";
import path, { dirname } from "path";
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import swaggerSpecs from './config/swagger.js';
import db from "./models/index.js";

// 初始化环境变量
config();

// 获取当前文件的目录路径（替代__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 跨域配置
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5000"]
}));

// 解析 application/json
app.use(express.json());

// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 简单路由测试
app.get("/", (req, res) => {
  res.json({ message: "欢迎访问MyStore API。" });
});

// 导入路由
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import marketingRoutes from "./routes/marketing.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// 应用路由
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", marketingRoutes); // 营销路由，路径前缀已在路由文件中包含
app.use("/api/payments", paymentRoutes);

// API 文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 设置端口
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}。`);
  console.log(`API 文档地址：http://localhost:${PORT}/api-docs`);
});

// 在数据库连接成功后，初始化一些基础数据
db.sequelize.sync({ force: true })
  .then(async () => {
    console.log("数据库已连接并重新创建表结构。");
    
    // 初始化分类数据
    try {
      const categories = await db.categories.bulkCreate([
        { name: "电子产品", description: "电脑、手机等电子设备" },
        { name: "家居用品", description: "家具、装饰品等" },
        { name: "服装服饰", description: "衣服、鞋帽等" },
        { name: "食品饮料", description: "零食、饮料等" }
      ]);
      console.log("初始分类数据创建成功");
    } catch (err) {
      console.log("初始化分类数据失败:", err.message);
    }
  })
  .catch(err => {
    console.log("数据库连接失败: " + err.message);
  });