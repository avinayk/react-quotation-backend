'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      requestId: DataTypes.STRING,
    },
    {
      userId: DataTypes.STRING,
    },
    {
      alreadyReady: DataTypes.STRING,
    },
    {
      status: DataTypes.STRING,
    },
  
    {}
  );

  return Order;
};
