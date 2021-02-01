'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Todo.init({
    title: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "title cannot be empty!"
        }
      }
    },
    description: { 
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "description cannot be empty!"
        }
      }
    },
    status: { 
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          msg: "status cannot be empty!"
        }
      }
    },
    due_date: 
    {
      type: DataTypes.DATE,
      validate: {
        isAfter: new Date().toISOString()
      }
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};