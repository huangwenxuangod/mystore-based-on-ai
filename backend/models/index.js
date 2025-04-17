import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import initProductModel from "./product.model.js";
import initUserModel from "./user.model.js";
import initCategoryModel from "./category.model.js";
import initCartModel from "./cart.model.js";
import initOrderModel from "./order.model.js";
import initOrderItemModel from "./orderItem.model.js";
import initAddressModel from "./address.model.js";

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
db.carts = initCartModel(sequelize, Sequelize);
db.orders = initOrderModel(sequelize, Sequelize);
db.orderItems = initOrderItemModel(sequelize, Sequelize);
db.addresses = initAddressModel(sequelize, Sequelize);

// 定义关系
db.categories.hasMany(db.products, { as: "products" });
db.products.belongsTo(db.categories, {
  foreignKey: "categoryId",
  as: "category",
});

// 用户与购物车的关系
db.users.hasMany(db.carts, { foreignKey: "userId", as: "cartItems" });
db.carts.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// 产品与购物车的关系
db.products.hasMany(db.carts, { foreignKey: "productId", as: "cartItems" });
db.carts.belongsTo(db.products, { foreignKey: "productId", as: "product" });

// 用户与订单的关系
db.users.hasMany(db.orders, { foreignKey: "userId", as: "orders" });
db.orders.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// 订单与订单项的关系
db.orders.hasMany(db.orderItems, { foreignKey: "orderId", as: "items" });
db.orderItems.belongsTo(db.orders, { foreignKey: "orderId", as: "order" });

// 产品与订单项的关系
db.products.hasMany(db.orderItems, { foreignKey: "productId", as: "orderItems" });
db.orderItems.belongsTo(db.products, { foreignKey: "productId", as: "product" });

// 用户与地址的关系
db.users.hasMany(db.addresses, { foreignKey: "userId", as: "addresses" });
db.addresses.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// 用户与收藏商品的多对多关系
db.users.belongsToMany(db.products, { through: 'user_favorites', as: 'favorites' });
db.products.belongsToMany(db.users, { through: 'user_favorites', as: 'favoriteByUsers' });

export default db;