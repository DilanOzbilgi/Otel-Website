'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class siteDetay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  siteDetay.init({
    visitor: DataTypes.INTEGER,
    online: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'siteDetay',
  });
  return siteDetay;
};