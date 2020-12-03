'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    'Service',
    {
      merchantId: DataTypes.STRING,
    },
    {
      publicArea: DataTypes.STRING,
    },
    {
      discription: DataTypes.STRING,
    },
    {
      catId: DataTypes.STRING,
    },
    {
      images: DataTypes.STRING,
    },
    {
      price: DataTypes.STRING,
    },
    {
      delFlag: DataTypes.STRING,
    },
    {
      publicFlag: DataTypes.STRING,
    },
    {
      areaId: DataTypes.STRING,
    },
    {}
  );

  return Service;
};
