'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      merchantId: {
        type: Sequelize.STRING,
      },
      serviceId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.STRING,
      },
      review: {
        type: Sequelize.STRING,
      },
      message:{
        type: Sequelize.STRING,
      },
      reply:{
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
    return queryInterface.dropTable('Ratings');
  }
};
