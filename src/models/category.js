"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, Datatypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
    }
  }

  Category.init(
    {
      code: Datatypes.STRING,
      value: {
        type: Datatypes.STRING,
        set(value){
          this.setDataValue('value', value.charAt(0).toUpperCase() + value.slice(1))
        }
      }
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
