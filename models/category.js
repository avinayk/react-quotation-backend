'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      inOut: DataTypes.STRING,
    },
    {
      catName: DataTypes.STRING,
    },
    {
      subcatName: DataTypes.STRING,
    },
    {}
  );

  return Category;
};
