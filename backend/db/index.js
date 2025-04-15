import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import sequelize from './init.js';

// 建立模型关系
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  users: User,
  products: Product,
  categories: Category
};

export default db; 