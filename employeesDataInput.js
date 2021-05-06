
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
let deptArray = [];
let employee_IDArray = [];
let employeeFirstNameArray = [];
let manager_IDArray = [];
let role_IDArray = [];

let deptObj = new Department(null, null);
let empObj = new Employee(null, null, null, null);
let roleObj = new Role(null, null,null);

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
                    departmentMaintenance()
                    break;
                case 'Role Maintenance':
                    roleMaintenance();
                    break;
                case 'Employee Maintenance':
                    employeeMaintenance()
                    break;
                case 'Reports Menu':
                    reportsMenu()
                    break;
                default:
                    connectionEnd()
                    break;
            }
        });
};

// function which provides a menu of options to the user

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
                    departmentList()
                    break;
                case 'Role List':
                    roleList();
                    break;
                case 'Employee List':
                    employeeList()
                    break;
                case 'Return to Employees Menu':
                    employeesMenu()
                    break;
                default:
                    connectionEnd()
                    break;
            }
        });
};

// department maintenance
const departmentMaintenance = () => {

    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
        deptArray.length = 0;
        resultSet.forEach(({ id, name }) => {
            deptArray.push(name);
        });
        deptArray.push('** Add **');
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
                message: 'What department do you want to Change or ** Add **?',
                choices: deptArray,
            },
        ])
        .then((answer) => {
            let status = (answer === '** Add **' ? addDepartment() : updateDepartment(answer));
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
                message: 'What is the department name?',
                validate(value) {
                    const deptName = value.trim; 
                    if (deptName.length > 0) {
                      const isDeptInArray = (element) => element.toLowerCase() == deptName.toLowerCase(); 
                      if (deptArray.findIndex(isDeptInArray) < 0) 
                        return true;
                    }
                    return false;
                },
            },
        ])
        .then((answer) => {
            deptArray.pop();
            deptObj.add(answer.trim);
            deptArray.push(answer.trim);
            console.log(`** Department ${answer.trim} added. **`)
            pressAnyKey()
            .then(() => {
                employeesMenu();
            });
        });
};

// update department 
const updateDepartment = (id) => {
    // prompt for info for a new department
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is changed department name (BLANK to Delete)?',
            },
        ])
        .then((answer) => {
            // when finished prompting, insert a new department record
            // TODO: create department object
            // if (answer.trim.length === 0)
            //     department.delete(department);
            // else 
            //     department.update(department);
            console.log('Working on dept recorrd');
        });
};

// role maintenance
const roleMaintenance = () => {
    console.log('In role maintenance');
};


// employee maintenance
const employeeMaintenance = () => {
    console.log('In employee maintenance');
};


// department List
const departmentList = () => {
    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
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

// department budget utilization List
const departmentBudgetList = () => {
    resultSet = deptObj.getAllRecordsWithBudget(connection, (err, resultSet) => {
        console.clear();
        console.log(
            chalk.yellow(`    
    -----------------------------------------------------------------------------------------
            D E P A R T M E N T    B U D G E T    U T I L I Z A T I O N   
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