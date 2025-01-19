const sq = require('sequelize');

// Use `new` to create an instance of Sequelize
const sequelize = new sq.Sequelize('sqlite:./database.sqlite');

module.exports = { DataTypes: sq.DataTypes, sequelize };
