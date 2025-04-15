export default (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    icon: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    }
  });

  return Category;
};