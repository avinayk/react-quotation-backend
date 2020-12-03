'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      merchantId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      sendReceive: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
      },
      image:{
        type: Sequelize.STRING,
      },
      delFlag:{
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('Messages');
  }
};
