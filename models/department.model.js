const { DataTypes, sequelize } = require("../lib")

const departmentModel = sequelize.define("department", {
    name: DataTypes.TEXT
})

module.exports = {departmentModel}