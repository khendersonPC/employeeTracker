const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require("console-table-printer");
//I need to make an array of managers so that I can populate the choices in the Update Employee Manager.

const managers= [];

function mainMenu() {
    const mainMenu = [
        {
            type: 'list',
            name: 'main',
            message: 'Main Menu: ',
            choices: ["View All Employees", "View Employees by Department", "View Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"],
        },
    ]

    inquirer.prompt(mainMenu).then((data) => {

        if (data.main === "Add Employee") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'First Name? ',

                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Last Name? ',

                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role? ',
                    choices: ["Superintendent", "Principal", "Vice Principal", "General Office Admin", "Teacher", "Teachers Aide"],
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employees manager? ',
                    choices: ["Hooker", "Arlington"],
                },
            ]


            inquirer.prompt(secMenu).then((data) => {
                create(data.firstName, data.lastName, data.role, data.manager);
            });
        }

        if (data.main === "View All Employees") {
            displayAll("workforceDB.employee");
        }

        if (data.main === "View Employees By Department") {
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
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee to update? ',
                },]
            inquirer.prompt(secMenu).then((data) => {
                const terMenu = [
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select the new role: ',
                        choices: ["Superintendent", "Principal", "Vice Pricipal", "Program Director", "Teacher", "Classified Staff"],
                    },]
                inquirer.prompt(terMenu).then((data) => {
                    updateEmployRole(data.lastName, data.newRole);
                });
            });
        }
        if (data.main == "Update Employee Manager") {
            const secMenu = [
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee to update? ',
                },]
            inquirer.prompt(secMenu).then((data) => {
                const terMenu = [
                    {
                        type: 'list',
                        name: 'newMan',
                        message: 'Select the new manager: ',
                        choices: ["Hooker", "Arlington"],
                    },]
                inquirer.prompt(terMenu).then((data) => {
                    updateEmployMan(data.lastName, data.newMan);
                });
            });
        }
    });
}



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

const updateEmployRole = (lastName, newRole) => {
    const query = connection.query(`UPDATE workforceDB.employee
    SET workforceDB.employee.role_id = (SELECT workforceDB.role.id FROM workforceDB.role WHERE workforceDB.role.title="${newRole}")
    WHERE workforceDB.employee.last_name="${lastName}"`, (err, res) => {
            if (err) throw err;
            console.log("Employee Role Updated");
            mainMenu();
        });

};

const updateEmployMan = (lastName, newDepart) => {
    const query = connection.query(`UPDATE workforceDB.employee
    SET workforceDB.employee.role_id = (SELECT workforceDB.role.id FROM workforceDB.role WHERE workforceDB.role.title="${newRole}")
    WHERE workforceDB.employee.last_name="${lastName}"`, (err, res) => {
            if (err) throw err;
            console.log("Employee Role Updated");
            mainMenu();
        });

};
// const updateWorkforce = () => {
//     const query = connection.query(
//       'UPDATE employee SET ? WHERE ?',
//       [
//         {
//           quantity: 100,
//         },
//         {
//           flavor: 'Rocky Road',
//         },
//       ],
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} products updated!\n`);
//         // Call deleteProduct AFTER the UPDATE completes
//         deleteProduct();
//       }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
//   };

//turns function into async function
const create = async (first, last, roleChoice, managerChoice) => {
    console.log(roleChoice);
    const { id } = await connection.query(`SELECT id FROM workforceDB.role WHERE title= "${roleChoice}"`);
    console.log("id " + id);
    //console.log(roleChoice);
    const { manId } = await connection.query(`SELECT id from workforceDB.employee WHERE last_name="${managerChoice}"`);
    console.log("manId: " + id);
    connection.query(
        `INSERT INTO employee SET ?`,
        {
            first_name: first,
            last_name: last,
            role_id: id,
            manager_id: manId,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee inserted!\n`);
            // Call updateProduct AFTER the INSERT completes
            //updateWorkforce();
        }

    )
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    //display("employee");
    // create("employee", "Chris", "Humbert");
    // display("employee");
    mainMenu();


});
