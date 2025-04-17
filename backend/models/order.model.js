export default (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    orderNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    totalAmount: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: Sequelize.ENUM('wechat', 'alipay', 'creditcard'),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    note: {
      type: Sequelize.TEXT
    }
  }, {
    timestamps: true
  });

  return Order;
};