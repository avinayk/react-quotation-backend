'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      message: DataTypes.STRING,
    },
    {}
  );

  return Notification;
};
