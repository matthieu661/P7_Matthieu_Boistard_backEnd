'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Post)
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    mdp: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    BIO: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};