
const inquirer = require('inquirer');
const conTable = require('console.table');
const mysql = require('mysql');
const pressAnyKey = require('press-any-key');

// Prints colorful console.log messages
const chalk = require('chalk');

// Constructor Classes
const Department = require('./DataAccessObjects/Department');
const employee = require('./DataAccessObjects/Employee');
const Role = require('./DataAccessObjects/Role');
const { EmptyError } = require('rxjs');
const Employee = require('./DataAccessObjects/Employee');

// Global Variables
let managerArray = [];
let roleArray = [];
let roleTitleArray = [];
let deptArray = [];
let deptNameArray = [];
let employee_IDArray = [];
let employeeFirstNameArray = [];
let manager_IDArray = [];

let deptObj = new Department(null, null);
let empObj = new Employee(null, null, null, null);
let roleObj = new Role(null, null, null);

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '',
    database: 'employeesDB',
});

// function which provides a menu of options to the user
const displayAppName = () => {
    console.clear();
    console.log(
        chalk.blue(`
---------------------------------------------------------------------------------------
     ________                          __                                              
    /        |                        /  |                                             
    $$$$$$$$/  _____  ____    ______  $$ |  ______   __    __   ______    ______       
    $$ |__    /     \/    \  /      \ $$ | /      \ /  |  /  | /      \  /      \      
    $$    |   $$$$$$ $$$$  |/$$$$$$  |$$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |/$$$$$$  |     
    $$$$$/    $$ | $$ | $$ |$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$    $$ |     
    $$ |_____ $$ | $$ | $$ |$$ |__$$ |$$ |$$ \__$$ |$$ \__$$ |$$$$$$$$/ $$$$$$$$/      
    $$       |$$ | $$ | $$ |$$    $$/ $$ |$$    $$/ $$    $$ |$$       |$$       |     
    $$$$$$$$/ $$/  $$/  $$/ $$$$$$$/  $$/  $$$$$$/   $$$$$$$ | $$$$$$$/  $$$$$$$/      
                            $$ |                    /  \__$$ |                         
                            $$ |                    $$    $$/                          
                            $$/                      $$$$$$/                           
     __       __                                                                       
    /  \     /  |                                                                      
    $$  \   /$$ |  ______   _______    ______    ______    ______    ______            
    $$$  \ /$$$ | /      \ /       \  /      \  /      \  /      \  /      \           
    $$$$  /$$$$ | $$$$$$  |$$$$$$$  | $$$$$$  |/$$$$$$  |/$$$$$$  |/$$$$$$  |          
    $$ $$ $$/$$ | /    $$ |$$ |  $$ | /    $$ |$$ |  $$ |$$    $$ |$$ |  $$/           
    $$ |$$$/ $$ |/$$$$$$$ |$$ |  $$ |/$$$$$$$ |$$ \__$$ |$$$$$$$$/ $$ |                
    $$ | $/  $$ |$$    $$ |$$ |  $$ |$$    $$ |$$    $$ |$$       |$$ |                
    $$/      $$/  $$$$$$$/ $$/   $$/  $$$$$$$/  $$$$$$$ | $$$$$$$/ $$/                 
                                               /  \__$$ |                              
                                               $$    $$/                               
                                                $$$$$$/                                 
-----------------------------------------------------------------------------------------
`)
    );
    pressAnyKey()
        .then(() => {
            employeesMenu();
        });
};

// function which provides a menu of options to the user
const employeesMenu = () => {
    console.clear();
    console.log(
        chalk.blue(`
-----------------------------------------------------------------------------------------
                      E M P L O Y E E S    M E N U  
-----------------------------------------------------------------------------------------
`)
    );
    inquirer
        .prompt({
            name: 'empMenuOpt',
            type: 'list',
            message: 'Select Menu Option?',
            choices: [
                'Department Maintenance',
                'Role Maintenance',
                'Employee Maintenance',
                'Reports Menu',
                'Quit'],
        })
        .then((answer) => {
            // perform the menu option selected
            switch (answer.empMenuOpt) {
                case 'Department Maintenance':
                    departmentMaintenance();
                    break;
                case 'Role Maintenance':
                    roleMaintenance();
                    break;
                case 'Employee Maintenance':
                    employeeMaintenance();
                    break;
                case 'Reports Menu':
                    reportsMenu();
                    break;
                default:
                    connectionEnd();
                    break;
            }
        });
};

// function provides a menu of report options to the user
const reportsMenu = () => {
    console.clear();
    console.log(
        chalk.blue(`    
-----------------------------------------------------------------------------------------
                       R E P O R T S    M E N U  
-----------------------------------------------------------------------------------------
`)
    );
    inquirer
        .prompt({
            name: 'repMenuOpt',
            type: 'list',
            message: 'Select Menu Option?',
            choices: [
                'Department List',
                'Role List',
                'Employee List',
                'Return to Employees Menu',
                'Quit'],
        })
        .then((answer) => {
            // perform the menu option selected
            switch (answer.repMenuOpt) {
                case 'Department List':
                    departmentList();
                    break;
                case 'Role List':
                    roleList();
                    break;
                case 'Employee List':
                    employeeList();
                    break;
                case 'Return to Employees Menu':
                    employeesMenu();
                    break;
                default:
                    connectionEnd();
                    break;
            }
        });
};

// department maintenance
const departmentMaintenance = () => {

    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
        deptArray.length = 0;
        deptNameArray.length = 0;
        resultSet.forEach(({ id, name, budget_used }) => {
            let id_name = id + '    ';
            id_name = id_name.substr(0, 4) + '- ' + name;
            deptArray.push(id_name);
            deptNameArray.push(name);
        });
        deptArray.push('** Add **');
        deptArray.push('** Cancel **');
        getDepartmentInput();
    });
};

const getDepartmentInput = () => {
    ;
    // prompt for record to change or 0 to add
    inquirer
        .prompt([
            {
                name: 'dept',
                type: 'list',
                pageSize: 12,
                message: 'What department do you want to Change or ** Add **, ** Cancel ** ?',
                choices: deptArray,
            },
        ])
        .then((answer) => {
            // let status = (answer.dept == '** Add **' ? addDepartment() : updateDepartment(answer));
            // perform the menu option selected
            switch (answer.dept) {
                case '** Add **':
                    addDepartment();
                    break;
                case '** Cancel **':
                    employeesMenu();
                    break;
                default:
                    let id = answer.dept.substr(0, 4).trim();
                    let name = answer.dept.substr(6);
                    updateDepartment(id, name);
                    break;
            }
        });
};

// add department 
const addDepartment = () => {
    // prompt for info for a new department
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is the department name (BLANK to Return) ?',
                validate(value) {
                    const deptName = value.trim();
                    // if (deptName.length > 0) {
                    // Prevent duplicates from being entered
                    const isDeptInArray = (element) => element.toLowerCase() == deptName.toLowerCase();
                    if (deptNameArray.findIndex(isDeptInArray) < 0)
                        return true;
                    // }
                    // return false;
                },
            },
        ])
        .then((answer) => {
            // deptArray.pop();  // Remove the ** Cancel ** entry
            // deptArray.pop();  // Remove the ** Add ** entry
            const deptName = answer.name.trim();
            if (deptName.length > 0) {
                deptObj.setName(deptName);
                result = deptObj.add(connection, (err, result) => {
                    if (err) throw err;
                    console.clear();
                    console.log(
                        chalk.green(`    
-----------------------------------------------------------------------------------------
 Added Department ${deptName}.  
-----------------------------------------------------------------------------------------
`)
                    );
                    deptArray.push(answer.name.trim());
                    pressAnyKey()
                        .then(() => {
                            employeesMenu();
                        });
                }
                )
            } else departmentMaintenance();
        })
};

// update department 
const updateDepartment = (id, name) => {
    // prompt for info for a new department
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is changed department name (BLANK to Return, DELETE to Delete) ?',
                validate(value) {
                    const deptName = value.trim();
                    // if (deptName.length > 0) {
                    // Prevent duplicates from being entered
                    const isDeptInArray = (element) => element.toLowerCase() == deptName.toLowerCase();
                    if (deptNameArray.findIndex(isDeptInArray) < 0)
                        return true;
                    // }
                    // return false;
                },
            },
        ])
        .then((answer) => {
            // deptArray.pop();  // Remove the ** Cancel ** entry
            // deptArray.pop();  // Remove the ** Add ** entry
            const deptName = answer.name.trim();
            switch (deptName.toUpperCase()) {
                case '':
                    departmentMaintenance();
                    break;
                case 'DELETE':
                    deptObj.setId(id);
                    result = deptObj.delete(connection, (err, result) => {
                        if (err) throw err;
                        console.clear();
                        console.log(
                            chalk.red(`    
-----------------------------------------------------------------------------------------
 Deleted Department ${name}.  
-----------------------------------------------------------------------------------------
                    `)
                        );
                        deptArray.push(answer.name.trim());
                        pressAnyKey()
                            .then(() => {
                                employeesMenu();
                            });
                    }
                    )
                    break;
                default:
                    deptObj.setId(id);
                    deptObj.setName(deptName);
                    result = deptObj.update(connection, (err, result) => {
                        if (err) throw err;
                        console.clear();
                        console.log(
                            chalk.green(`    
-----------------------------------------------------------------------------------------
Updated Department ${deptName}.  
-----------------------------------------------------------------------------------------
`)
                        );
                        deptArray.push(answer.name.trim());
                        pressAnyKey()
                            .then(() => {
                                employeesMenu();
                            });
                    }
                    )
                    break;
            }
        })
};

// role maintenance
const roleMaintenance = () => {
    resultSet = roleObj.getAllRecords(connection, (err, resultSet) => {
        roleArray.length = 0;
        roleNameArray.length = 0;
        resultSet.forEach(({ id, title, budget_used }) => {
            let id_title = id + '    ';
            id_title = id_title.substr(0, 4) + '- ' + title;
            roleArray.push(id_name);
            roleTitleArray.push(title);
        });
        roleArray.push('** Add **');
        roleArray.push('** Cancel **');
        //getRoleInput();
    });
};


// employee maintenance
const employeeMaintenance = () => {
    console.log('In employee maintenance');
};


// department List
const departmentList = () => {
    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
        if (err) throw err;
        console.clear();
        console.log(
            chalk.yellow(`    
-----------------------------------------------------------------------------------------
                    D E P A R T M E N T    L I S T   
-----------------------------------------------------------------------------------------
`)
        );
        console.table(resultSet);
        pressAnyKey()
            .then(() => {
                reportsMenu();
            });
    });
};

// role list
const roleList = () => {
    resultSet = roleObj.getAllRecords(connection, (err, resultSet) => {
        if (err) throw err;
        console.clear();
        console.log(
            chalk.yellow(`    
-----------------------------------------------------------------------------------------
                        R O L E    L I S T   
-----------------------------------------------------------------------------------------
`)
        );
        console.table(resultSet);
        pressAnyKey()
            .then(() => {
                reportsMenu();
            });
    });
};

// employee list
const employeeList = () => {
    resultSet = empObj.getAllRecords(connection, (err, resultSet) => {
        if (err) throw err;
        console.clear();
        console.log(
            chalk.yellow(`    
-----------------------------------------------------------------------------------------
                    E M P L O Y E E    L I S T   
-----------------------------------------------------------------------------------------
`)
        );
        console.table(resultSet);
        pressAnyKey()
            .then(() => {
                reportsMenu();
            });
    });
};

displayAppName();
//employeesMenu();