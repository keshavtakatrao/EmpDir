const { sequelize, DataTypes } = require("../lib");
const { departmentModel } = require("./department.model");
const { employeeModel } = require("./employee.model");

const employeeDepartmentModel = sequelize.define("employeeDepartmentModel", {
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: employeeModel,
      key: "id",
    },
  },
  departmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: departmentModel,
      key: "id",
    },
  },
});

// Correct belongsToMany associations
employeeModel.belongsToMany(departmentModel, { through: employeeDepartmentModel });
departmentModel.belongsToMany(employeeModel, { through: employeeDepartmentModel });

module.exports = { employeeDepartmentModel };
