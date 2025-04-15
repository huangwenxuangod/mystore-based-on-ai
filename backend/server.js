import cors from "cors";
import { config } from 'dotenv';
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import db from "./models/index.js";

// 初始化环境变量
config();

// 获取当前文件的目录路径（替代__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 跨域配置
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"]
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

// 数据库连接
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("数据库已连接。");
  })
  .catch(err => {
    console.log("数据库连接失败: " + err.message);
  });

// 导入路由
import categoryRoutes from "./routes/category.routes.js";
import mockRoutes from "./routes/mock.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

// 应用路由
productRoutes(app);
categoryRoutes(app);
userRoutes(app);
mockRoutes(app);  // 添加mock路由

// 设置端口并监听请求
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}.`);
});