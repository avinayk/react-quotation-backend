'use strict';
// const Role = require('./role');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      userName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      postNumber: {
        type: DataTypes.STRING,
      },
      address1: {
        type: DataTypes.STRING,
      },
      address2: {
        type: DataTypes.STRING,
      },
      address3: {
        type: DataTypes.STRING,
      },
      delFlag: {
        type: DataTypes.BOOLEAN,
      },
      noticeFlag: {
        type: DataTypes.STRING,
      },
      findAreaId: {
        type: DataTypes.STRING,
      },
      loginId: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  // User.associate = function(models) {

  // };
  return User;
};
