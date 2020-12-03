'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Merchants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      userName: {
        type: Sequelize.STRING,
      },
      loginId: {
        type: Sequelize.STRING,
      },
      password: {
        type:Sequelize.STRING,
      },
      discription: {
        type:Sequelize.STRING,
      },
      phone: {
        type:Sequelize.STRING,
      },
      postNumber: {
        type:Sequelize.STRING,
      },
      address1: {
        type:Sequelize.STRING,
      },
      address2: {
        type:Sequelize.STRING,
      },
      address3: {
        type:Sequelize.STRING,
      },
      images: {
        type:Sequelize.STRING,
      },
      delFlag: {
        type:Sequelize.STRING,
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
    return queryInterface.dropTable('Merchants');
  }
};
