'use strict';
module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define(
    'Merchant',
    {
      firstName: DataTypes.STRING,
    },
    {
      lastName: DataTypes.STRING,
    },
    {
      userName: DataTypes.STRING,
    },
    {
      loginId: DataTypes.STRING,
    },
    {
      password: DataTypes.STRING,
    },
    {
      discription: DataTypes.STRING,
    },
    {
      phone: DataTypes.STRING,
    },
    {
      postNumber: DataTypes.STRING,
    },
    {
      address1: DataTypes.STRING,
    },
    {
      address2: DataTypes.STRING,
    },
    {
      address3: DataTypes.STRING,
    },
    {
      images: DataTypes.STRING,
    },
    {
      delFlag: DataTypes.STRING,
    },
    {}
  );

  return Merchant;
};
