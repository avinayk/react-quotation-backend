'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      merchantId: {
        type: Sequelize.STRING,
      },
      publicArea: {
        type: Sequelize.STRING,
      },
      discription: {
        type: Sequelize.STRING,
      },
      catId: {
        type: Sequelize.STRING,
      },
      images: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      delFlag: {
        type: Sequelize.STRING,
      },
      publicFlag: {
        type: Sequelize.STRING,
      },
      areaId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Services');
  }
};
