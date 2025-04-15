export default (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    originalPrice: {
      type: Sequelize.DECIMAL(10, 2)
    },
    image: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.DECIMAL(2, 1),
      defaultValue: 0
    },
    reviewCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    salesCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    isNew: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    discount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    tag: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    categoryId: {
      type: Sequelize.INTEGER
    }
  });

  return Product;
};