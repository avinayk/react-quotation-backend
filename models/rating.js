'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      merchantId: DataTypes.STRING,
    },
    {
      serviceId: DataTypes.STRING,
    },
    {
      userId: DataTypes.STRING,
    },
    {
      review: DataTypes.STRING,
    },
    {
      message: DataTypes.STRING,
    },
    {
      reply: DataTypes.STRING,
    },
    {
      delFlag: DataTypes.BOOLEAN,
    },
    {}
  );

  return Rating;
};
