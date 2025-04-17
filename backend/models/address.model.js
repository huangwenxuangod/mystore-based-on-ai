export default (sequelize, DataTypes) => {
  const Address = sequelize.define("address", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detailAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Address;
};