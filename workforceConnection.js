const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const { printTable } = require("console-table-printer");
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port, if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'Salami?1',
    database: 'workforceDB',
});

const query = util.promisify(connection.query).bind(connection);

async function mainMenu() {
    const menu = [
        {
            type: 'list',
            name: 'main',
            message: 'Main Menu: ',
            choices: ["View All Employees", "View Departments", "View Roles", "View Employees By Department", "View Employees by Manager", "Add Employee", "Add Department", "Add Role", "Remove Employee", "Update Employee Role", "Update Employee Manager", "END"],
        },
    ]
    //returns an array of objects with a row data package
    const roles = await query("SELECT * FROM role ORDER BY title");
    //convert into an array
    const newRoles = roles.map(role => {
        return {
            name: role.title,
            value: role.id
        }
    })

    const lastNames = await query("SELECT * FROM employee ORDER BY last_name");
    //convert into an array
    const newLastNames = lastNames.map(man => {
        return {
            name: man.last_name,
            value: man.id
        }
    })

    const departNames = await query("SELECT * FROM department ORDER BY name");
    //convert into an array
    const newDepartmenttNames = departNames.map(dep => {
        return {
            name: dep.name,
            value: dep.id
        }
    })

    inquirer.prompt(menu).then((data) => {

        if (data.main == "Add Employee") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'First Name? ',

                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Last Name? ',

                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employees role? ',
                    choices: newRoles
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is the employees manager? ',
                    choices: newLastNames
                },
            ]


            inquirer.prompt(secMenu).then(async (data) => {
                console.log(data);
                await query("INSERT into employee SET ?", data);
                console.log("New employee has been added!");
                mainMenu();
            });
        }

        if (data.main == "Add Role") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'title',
                    message: 'What role would you like to add? ',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Salary? ',
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Select the department: ',
                    choices: newDepartmenttNames,
                }]
            inquirer.prompt(secMenu).then(async (data) => {
                console.log("New role has been added.");
                await query("INSERT INTO role SET  ? ", data)
                mainMenu();
            });

        }

        if (data.main == "Add Department") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'name',
                    message: 'What department would you like to add? ',
                },
            ]
            inquirer.prompt(secMenu).then(async (data) => {
                console.log("New role has been added.");
                await query("INSERT INTO department SET  ? ", data)
                mainMenu();
            });

        }

        if (data.main == "View All Employees") {
            displayAll("workforceDB.employee");
        }

        if (data.main === "View Roles") {
            displayAll("workforceDB.role");
        }

        if (data.main === "View Departments") {
            displayAll("workforceDB.department");
        }

        if (data.main == "View Employees By Department") {
            displayByDepart();
        }

        if (data.main == "View Employees by Manager") {
            displayByMan();
        }

        if (data.main == "Remove Employee") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee to remove? ',
                },]
            inquirer.prompt(secMenu).then((data) => {
                removeEmployee(data.lastName);
            });

        }

        if (data.main == "Update Employee Role") {
            const secMenu = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'What is the last name of the employee to update? ',
                    choices: newLastNames,
                },
                {
                    type: 'list',
                    name: 'roleID',
                    message: 'Select the new role: ',
                    choices: newRoles,
                }]
            inquirer.prompt(secMenu).then(async (data) => {
                console.log("Employee role has been updated.");
                await query("UPDATE employee SET role_id = ? WHERE id=?", [data.roleID, data.id])
                mainMenu();
            });
        }
        if (data.main == "Update Employee Manager") {
            const secMenu = [
                {
                    type: 'list',
                    name: 'id',
                    message: 'What is the last name of the employee to update? ',
                    choices: newLastNames,
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the new manager: ',
                    choices: newLastNames,
                }]
            inquirer.prompt(secMenu).then(async (data) => {
                console.log("Employee manager has been updated.");
                await query("UPDATE employee SET manager_id = ? WHERE id=?", [data.manager_id, data.id])
                mainMenu();
            });
        }

        if (data.main == "END"){
            process.exit(1);
        }
    
    });
}


const displayByDepart = () => {

    connection.query(`SELECT workforceDB.department.name, workforceDB.employee.last_name
    FROM workforceDB.department
    JOIN workforceDB.role
    ON workforceDB.role.department_id = workforceDB.department.id
    JOIN workforceDB.employee
    ON workforceDB.employee.role_id=workforceDB.role.id
    `, (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            printTable(res);
            mainMenu();
            //connection.end();
        });
};

const displayByMan = () => {
    connection.query(`SELECT workforceDB.employee.manager_id, workforceDB.employee.last_name
    FROM workforceDB.employee
    ORDER BY workforceDB.employee.manager_id DESC
    `, (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            printTable(res);
            mainMenu();
            //connection.end();
        });
};
const displayAll = (what) => {

    connection.query(`SELECT * FROM ${what}`, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        printTable(res);
        mainMenu();
        //connection.end();
    });
};

const removeEmployee = (lastName) => {
    const query = connection.query(`DELETE FROM workforceDB.employee WHERE workforceDB.employee.last_name="${lastName}"`, (err, res) => {
        if (err) throw err;
        console.log("Employee removed");
        mainMenu();
    });

};



connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    console.log(`\n------- Welcome to the Employee Tracker -------\n`);
    mainMenu();


});
