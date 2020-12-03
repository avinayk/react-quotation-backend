'use strict';
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      userId: DataTypes.STRING,
    },
    {
      serviceId: DataTypes.STRING,
    },
    {
      alreadyReady: DataTypes.BOOLEAN,
    },
   
    {}
  );

  return Request;
};
