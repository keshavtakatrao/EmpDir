let { DataTypes, sequelize } = require('../lib');

let employeeModel = sequelize.define('employee', {
    name: DataTypes.TEXT,
    email: {
        type: DataTypes.STRING,
    }
})

module.exports = { employeeModel }