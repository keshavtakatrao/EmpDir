const express = require('express');
const { getEmployeeByIdController, getEmployeesController, getEmployeesByDepartmentController, getEmployeesByRoleController, getEmployeesSortedByNameController, addEmployeeController, editEmployeeController } = require('../controller/employee.controller');

const employeeRoutes = express.Router({ mergeParams: true }); // Merge params from parent route

employeeRoutes.route('/').get(getEmployeesController).post(addEmployeeController);
employeeRoutes.get('/details/:id', getEmployeeByIdController);
employeeRoutes.get('/department/:departmentId', getEmployeesByDepartmentController);
employeeRoutes.get('/role/:roleId', getEmployeesByRoleController);
employeeRoutes.get('/sort-by-name', getEmployeesSortedByNameController);
employeeRoutes.get('/new', addEmployeeController)
employeeRoutes.post('/:id', editEmployeeController);

module.exports = employeeRoutes