const { getEmployeeById, getEmployees, addEmployee, updateEmployee, deleteEmployee } = require("../helpers/employee.helper");
const yup = require('yup');

const addEmployeeSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    departmentId: yup.number().required(),
    roleId: yup.number().required()
});

const editEmloyeeSchema = yup.object().shape({
    name: yup.string().required(false),
    email: yup.string().email().required(false),
    departmentId: yup.number().required(false),
    roleId: yup.number().required(false)
});
const getEmployeeByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await getEmployeeById(id)
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);

    } catch (error) {
        console.error("Error in getEmployeeByIdController: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getEmployeesController = async (req, res) => {
    try {
        const employees = await getEmployees({})
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "Employees not found" });
        }
        res.status(200).json({ employees });
    } catch (error) {
        console.error("Error in getEmployeesController: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const getEmployeesByDepartmentController = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const employees = await getEmployees({ departmentId })
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "Employees not found" });
        }
        res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const getEmployeesByRoleController = async (req, res) => {
    try {
        const { roleId } = req.params;
        const employees = await getEmployees({ roleId })
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "Employees not found" });
        }
        res.status(200).json({ employees });
    } catch (error) {
        console.log("Error in getEmployeesByRoleController: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const getEmployeesSortedByNameController = async (req, res) => {
    try {
        let { order } = req.query;
        if (order == "")
            order = "ASC";

        if (["ASC", "DESC"].indexOf(order?.toUpperCase()) == -1) {
            return res.status(400).json({ message: "Invalid parameter value for order" });
        }
        console.log("order: ", order);
        const employees = await getEmployees({ order: order, sort_by: 'name' })
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "Employees not found" });
        }
        res.status(200).json({ employees });
    } catch (error) {
        console.log("Error in getEmployeesSortedByNameController: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const addEmployeeController = async (req, res) => {
    try {
        await addEmployeeSchema.validate(req.body, { abortEarly: false });
        const employee = await addEmployee(req.body);
        res.status(201).json(employee);
    }
    catch (error) {

        console.log("Error in addEmployeeController: ", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Valdation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const editEmployeeController = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await getEmployeeById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        await editEmloyeeSchema.validate(req.body, { abortEarly: false });
        const employeeEdit = await updateEmployee(req.body);
        res.status(201).json(employee);
    }
    catch (error) {

        console.log("Error in editEmployeeController: ", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Valdation error", error: error.errors });
        }
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

const deleteEmployeeController = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Employee id is required" });
        }
        await deleteEmployee(id);
        res.status(200).json({ message: `Employee with ID ${id} has been deleted.` });
    }
    catch (error) {
        console.log("Error in deleteEmployeeController: ", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    getEmployeeByIdController,
    getEmployeesController,
    getEmployeesByDepartmentController,
    getEmployeesByRoleController,
    getEmployeesSortedByNameController,
    addEmployeeController,
    editEmployeeController,
    deleteEmployeeController
}