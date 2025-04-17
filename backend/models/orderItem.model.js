export default (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("orderItem", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subtotal: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return OrderItem;
};