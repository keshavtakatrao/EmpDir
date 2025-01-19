const { sequelize, DataTypes } = require("../lib");

const roleModel = sequelize.define("role", {
    title: DataTypes.STRING
})

module.exports = { roleModel }