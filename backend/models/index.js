import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import initProductModel from "./product.model.js";
import initUserModel from "./user.model.js";
import initCategoryModel from "./category.model.js";

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 引入模型
db.products = initProductModel(sequelize, Sequelize);
db.users = initUserModel(sequelize, Sequelize);
db.categories = initCategoryModel(sequelize, Sequelize);

// 定义关系
db.categories.hasMany(db.products, { as: "products" });
db.products.belongsTo(db.categories, {
  foreignKey: "categoryId",
  as: "category",
});

export default db;