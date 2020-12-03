'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      merchantId: DataTypes.STRING,
    },
    {
      userId: DataTypes.STRING,
    },
    {
      sendReceive: DataTypes.STRING,
    },
    {
      message: DataTypes.STRING,
    },
    {
      image: DataTypes.STRING,
    },
    {
      delFlag: DataTypes.BOOLEAN,
    },
    {}
  );

  return Message;
};
