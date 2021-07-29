const inquirer = require('inquirer');
const db = require('./db/database');

const startDirectory = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a role', 'add an employee', 'update an employee role']
        })
        .then(data => {
            const { menu } = data;
            switch (menu) {
                case 'view all departments':
                    viewAllDepartments();
                    break;
                case 'view all roles':
                    viewAllRoles();
                    break;
                case 'view all employees':
                    viewAllEmployees();
                    break;
                case 'add a role':
                    addRole();
                    break;
                case 'add an employee':
                    addEmployee();
                    break;
                case 'update an employee role':
                    updateEmployeeRole();
                    break
            }
        })
}

const viewAllDepartments = () => {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        console.table(result);
        startDirectory();
    })
}

const viewAllRoles = () => {
    const sql = 'SELECT * FROM role';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startDirectory();
    })
}
// THEN I am presented with a formatted table showing employee data,  job titles, departments, salaries, and managers that the employees report to
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name," ",manager.last_name) AS manager, role.salary, role.title, department.name AS department
                FROM employee
                LEFT JOIN role
                ON employee.role_id = role.id
                LEFT JOIN department
                ON role.department_id = department.id
                LEFT JOIN employee manager
                ON employee.manager_id = manager.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startDirectory();
    })
}
// id, title, salary, department_id

const addRole = () => {
    const sql = 'SELECT * FROM department';
    let roleNameArray = [];
    let allDeptArray = [];
    db.query(sql, (err, result) => {
        if (err) throw err;
        for (let dept of result) {
            roleNameArray.push(dept.name)
            allDeptArray.push(dept)
        }
    })
    inquirer
        .prompt([
            {
                type: 'text',
                name: 'title',
                message: 'What is the title of the role?',
                validate: function (input) {
                    return input ? true : false;
                }
            },
            {
                type: 'text',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: function (input) {
                    return (!isNaN(input) && input) ? true : false;
                }
            },
            {
                type: 'list',
                name: 'department',
                message: "What is the department of the role?",
                choices: roleNameArray
            }
        ]).then(data => {
            let paramsDeptID = 0
            for (let i = 0; i < allDeptArray.length; i++) {
                if (allDeptArray[i].name === data.department) {
                    paramsDeptID = allDeptArray[i].id;
                }
            }
            const params = [data.title, data.salary, paramsDeptID]
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            db.query(sql, params, function (err, result) {
                if (err) {
                    ressult.status(400).json({ error: err.message });
                    return;
                }
                console.log(data.title + " has been added.")
                startDirectory();
            })
        })
}

const addEmployee = () => { }

const updateEmployeeRole = () => { }

const findDepartmentID = (department) => {
    const sql = 'SELECT name FROM department WHERE ';
}
startDirectory();
