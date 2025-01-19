const { departmentModel } = require("../models/department.model");
const { employeeModel } = require("../models/employee.model");
const { employeeDepartmentModel } = require("../models/employeeDepartment.model");
const { employeeRoleModel } = require("../models/employeeRole.model");
const { roleModel } = require("../models/role.model");

async function getEmployeeDepartments(employeeId) {
    const employeeDepartments = await employeeDepartmentModel.findAll({
        where: { employeeId },
    });

    const departmentData = [];
    for (let empDep of employeeDepartments) {
        const departmentRecord = await departmentModel.findOne({
            where: { id: empDep.departmentId },
        });
        if (departmentRecord) {
            departmentData.push(departmentRecord);
        }
    }

    return departmentData;
}

async function getEmployeeRoles(employeeId) {
    const employeeRoles = await employeeRoleModel.findAll({
        where: { employeeId },
    });

    const roleData = [];
    for (let empRole of employeeRoles) {
        const roleRecord = await roleModel.findOne({
            where: { id: empRole.roleId },
        });
        if (roleRecord) {
            roleData.push(roleRecord);
        }
    }

    return roleData;
}

async function getEmployeeDetails(employeeData) {
    const departments = await getEmployeeDepartments(employeeData.id);
    const roles = await getEmployeeRoles(employeeData.id);
    console.log("roles", roles);
    const role = roles.length ? roles[0].dataValues : null;
    const department = departments.length ? departments[0].dataValues : null;
    return {
        ...employeeData.dataValues,
        department,
        role,
    };
}

async function getEmployeeById(id) {
    const employee = await employeeModel.findOne({
        where: { id },
    });

    if (!employee) {
        return null;
    }

    return getEmployeeDetails(employee);
}

async function getEmployees({ order = "ASC", sort_by = "id", departmentId = null, roleId = null }) {

    const includeOptions = [];
    if (roleId) {
        includeOptions.push({
            model: roleModel,
            through: { attributes: [] },
            where: { id: roleId },
            attributes: ['id', 'title']
        });
    }

    if (departmentId) {
        includeOptions.push({
            model: departmentModel,
            through: { attributes: [] },
            where: { id: departmentId },
            attributes: ['id', 'name']
        });
    }


    const employees = await employeeModel.findAll({
        order: [[sort_by, order.toUpperCase()]],
        include: includeOptions
    });
    const employeesData = [];
    for (let emp of employees) {
        const employeeData = await getEmployeeDetails(emp);
        employeesData.push(employeeData);
    }

    return employeesData;
}

async function addEmployee(employeeData) {
    const employee = await employeeModel.create({
        name: employeeData.name,
        email: employeeData.email
    })
    await employeeDepartmentModel.create({
        employeeId: employee.id,
        departmentId: employeeData.departmentId
    })
    await employeeRoleModel.create({
        employeeId: employee.id,
        roleId: employeeData.roleId
    })

    return getEmployeeDetails(employee);
}

async function updateEmployee(employee, employeeData) {

    if (employeeData.name) {
        employee.name = employeeData.name;
    }
    if (employeeData.email) {
        employee.email = employeeData.email;
    }
    await employee.save();
    if (employeeData.departmentId) {
        await employeeDepartmentModel.update({
            departmentId: employeeData.departmentId
        }, {
            where: { employeeId }
        })
    }
    if (employeeData.roleId) {
        await employeeRoleModel.update({
            roleId: employeeData.roleId
        }, {
            where: { employeeId }
        })
    }
}

async function deleteEmployee(employeeId) {
    await employeeModel.destroy({
        where: { id: employeeId }
    });
    await employeeDepartmentModel.destroy({
        where: { employeeId }
    });
    await employeeRoleModel.destroy({
        where: { employeeId }
    });
}

module.exports = {
    getEmployeeById,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
};