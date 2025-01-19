const { sequelize, DataTypes } = require("../lib");
const { employeeModel } = require("./employee.model");
const { roleModel } = require("./role.model");

const employeeRoleModel = sequelize.define("employeeRoleModel", {
    employeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: employeeModel,
            key: "id"
        }
    }
})

employeeModel.belongsToMany(roleModel, { through: employeeRoleModel })
roleModel.belongsToMany(employeeModel, { through: employeeRoleModel })

module.exports = { employeeRoleModel }