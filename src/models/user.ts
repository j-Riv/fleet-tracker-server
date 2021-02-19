import { Sequelize, DataTypes } from 'sequelize';

module.exports = function (sequelize: Sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
    },
    accessToken: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      // allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return User;
};
