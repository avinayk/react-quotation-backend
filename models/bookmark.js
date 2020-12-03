'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      userId: DataTypes.STRING,
    },
    {
      serviceId: DataTypes.STRING,
    },
   
    {}
  );

  return Bookmark;
};
