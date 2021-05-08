// -----------------------------------------------------------------------------
// Program:  employeeManager.js
// Purpose:  This is an employee management application
//           The application will present two menus:
//           1) Maintenance Menu - allow the user to perform CRUD on tables. 
//              Business rules will enforce no duplicates, can't delete records
//              with child dependencies
//              a) departments
//              b) roles
//              c) employees
//           2) Reports Menu
//              a) departments - list all departments alphabetically
//              b) roles - list all job roles alphabetically
//              c) employees - allow user to filter fo a specific manager or all
//                             managers and list alphabetically.
// Input:    <none>   
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 7, 2021
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
const chalk         = require('chalk');             // Used to display colorful console.log msgs
const conTable      = require('console.table');     // Used for formatted output of resultset
const dotEnv        = require('dotenv').config();   // Used to secure config info
const inquirer      = require('inquirer');          // Used for console prompting
const mysql         = require('mysql');             // Used to access MySQL database
const pressAnyKey   = require('press-any-key');     // Used to prompt user to press any key


// -----------------------------------------------------------------------------
// Data Access Classes - contain methods to act upon tables
// -----------------------------------------------------------------------------
const Department    = require('./DataAccessObjects/Department');
const Employee      = require('./DataAccessObjects/Employee');
const Role          = require('./DataAccessObjects/Role');
const { EmptyError } = require('rxjs');


// -----------------------------------------------------------------------------
// Global Variables
// -----------------------------------------------------------------------------
const CENTER        = 'C';              // Align Text in Center
const LEFT          = 'L';              // Align Text to the Left
let addToListArray  = [];               // Elements to add to data arrays
let empArray        = [];               // Holds employees for inquirer
let deptArray       = [];               // Holds departments for inquirer
let deptNameArray   = [];               // Department names for dup check
let managerArray    = [];               // Holds managers for inquirer
let roleArray       = [];               // Holds roles for inquirer
let roleTitleArray  = [];               // Role Titles for dup check

let deptObj         = new Department(null, null);
let empObj          = new Employee(null, null, null, null, null);
let roleObj         = new Role(null, null, null);


// -----------------------------------------------------------------------------
// Function: connection
// Purpose:  connect to database
// Input:    <none> 
// Returns:  <none>  
// -----------------------------------------------------------------------------
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});


// -----------------------------------------------------------------------------
// Function: connectionEnd
// Purpose:  terminate connect to database and exit program
// Input:    <none> 
// Returns:  <none>  
// -----------------------------------------------------------------------------
connectionEnd = () => {
    connection.end;
    console.clear();
    console.log('bye...');
    process.exit(0);
};

// -----------------------------------------------------------------------------
// Function: buildHeadings
// Purpose:  build headings to display on console
// Input:    <string> align - Alignment of text - LEFT or CENTER
//           <string> text - text for heading
// Returns:  <string> heading - formatted text 
// -----------------------------------------------------------------------------
buildHeadings = (align, text) => {
    const width = 90;
    let heading = '\n';
    for (let i = 0; i < width; i++) heading += '-';
    heading += '\n';
    if (text.length >= 90 || align === LEFT) heading += text;
    else {
        let start = width / 2 - text.length;
        for (let i = 0; i < start; i++) heading += ' ';
        for (let i = 0; i < text.length; i++) heading += text.substr(i, 1) + ' ';
    }
    heading += '\n';
    for (let i = 0; i < width; i++) heading += '-';
    heading += '\n';
    return heading;
};


// -----------------------------------------------------------------------------
// Function: createDeptArrays
// Purpose:  build arrays from current data in department table. Arrays are used
//           for display and validation
// Input:    <function> callback - function to call upon completion 
// Returns:  <none>  
// -----------------------------------------------------------------------------
createDeptArrays = (callback) => {
    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
        deptArray.length = 0;
        deptNameArray.length = 0;
        resultSet.forEach(({ id, name, budget_used }) => {
            let id_name = id + '    ';
            id_name = id_name.substr(0, 4) + '- ' + name;
            deptArray.push(id_name);
            deptNameArray.push(name);
        });
        addToListArray.forEach((element) => {
            deptArray.push(element);
        })
        callback();
    });
};


// -----------------------------------------------------------------------------
// Function: createEmpArrays
// Purpose:  build arrays from current data in employee table. Arrays are used
//           for display and validation
// Input:    <function> callback - function to call upon completion 
// Returns:  <none>  
// -----------------------------------------------------------------------------
createEmpArrays = (callback) => {
    resultSet = empObj.getAllRecords(connection, (err, resultSet) => {
        empArray.length = 0;
        resultSet.forEach(({ id, first_name, last_name, title, salary, department_name, manager_name }) => {
            let id_name = id + '    ';
            id_name = id_name.substr(0, 4) + '- ' + last_name.trim() + ', ' + first_name.trim();
            empArray.push(id_name);
        });
        addToListArray.forEach((element) => {
            empArray.push(element);
        })
        callback();
    });
};


// -----------------------------------------------------------------------------
// Function: createManagerArray
// Purpose:  build array from current data in employee table of managers. Array is used
//           for display and selection in Employee listing
// Input:    <function> callback - function to call upon completion 
// Returns:  <none>  
// -----------------------------------------------------------------------------
createManagerArray = (callback) => {
    resultSet = empObj.getAllManagers(connection, (err, resultSet) => {
        if (err) throw err;
        managerArray.length = 0;
        resultSet.forEach(({ manager_id, manager_name }) => {
            let id_name = manager_id + '    ';
            id_name = id_name.substr(0, 4) + '- ' + manager_name;
            managerArray.push(id_name);
        });
        addToListArray.forEach((element) => {
            managerArray.push(element);
        })
        callback();
    });
};


// -----------------------------------------------------------------------------
// Function: createRoleArrays
// Purpose:  build arrays from current data in role table. Arrays are used
//           for display and validation
// Input:    <function> callback - function to call upon completion 
// Returns:  <none>  
// -----------------------------------------------------------------------------
createRoleArrays = (callback) => {
    resultSet = roleObj.getAllRecords(connection, (err, resultSet) => {
        roleArray.length = 0;
        roleTitleArray.length = 0;
        resultSet.forEach(({ id, title, salary, department_id }) => {
            let id_title = id + '    ';
            id_title = id_title.substr(0, 4) + '- ' + title;
            roleArray.push(id_title);
            roleTitleArray.push(title);
        });
        addToListArray.forEach((element) => {
            roleArray.push(element);
        })
        callback();
    });
};


// -----------------------------------------------------------------------------
// Function: displayAppName
// Purpose:  Display a Logo for this application
// Input:    <none>  
// Returns:  <none>  
// -----------------------------------------------------------------------------
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
            displayMaintenanceMenu();
        });
};


// -----------------------------------------------------------------------------
// Function: displayMaintenanceMenu
// Purpose:  display the Maintenance Menu and process menu requests. 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const displayMaintenanceMenu = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'MAINTENANCE MENU'))
    );
    inquirer
        .prompt({
            name: 'empMenuOpt',
            type: 'list',
            message: 'Select Menu Option',
            choices: [
                'Department Maintenance',
                'Role Maintenance',
                'Employee Maintenance',
                'Reports Menu',
                'Quit']
        })
        .then((answer) => {
            // perform the menu option selected
            switch (answer.empMenuOpt) {
                case 'Department Maintenance':
                    maintainDepartments();
                    break;
                case 'Role Maintenance':
                    maintainRoles();
                    break;
                case 'Employee Maintenance':
                    maintainEmployees();
                    break;
                case 'Reports Menu':
                    displayReportsMenu();
                    break;
                default:
                    connectionEnd();
                    break;
            }
        });
};


// -----------------------------------------------------------------------------
// Function: displayReportsMenu
// Purpose:  display the Reports Menu and process menu requests. 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const displayReportsMenu = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'REPORTS MENU'))
    );
    inquirer
        .prompt({
            name: 'repMenuOpt',
            type: 'list',
            message: 'Select Menu Option',
            choices: [
                'Department List',
                'Role List',
                'Employee List',
                'Maintenance Menu',
                'Quit']
        })
        .then((answer) => {
            // perform the menu option selected
            switch (answer.repMenuOpt) {
                case 'Department List':
                    displayDepartmentList();
                    break;
                case 'Role List':
                    displayRoleList();
                    break;
                case 'Employee List':
                    selectManager();
                    break;
                case 'Maintenance Menu':
                    displayMaintenanceMenu();
                    break;
                default:
                    connectionEnd();
                    break;
            }
        });
};


// -----------------------------------------------------------------------------
// Function: maintainDepartments
// Purpose:  create arrays need for display/validation for department maintenance 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const maintainDepartments = () => {
    addToListArray.length = 0;   // clear out array
    addToListArray.push('** Add **');
    addToListArray.push('** Cancel **');
    createDeptArrays(getDepartmentInput);
};


// -----------------------------------------------------------------------------
// Function: getDepartmentInput
// Purpose:  Select Department for Mainenance or select Add or Cancel (return to menu) 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const getDepartmentInput = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'DEPARTMENT MAINTENANCE'))
    );
    // prompt for record to change
    inquirer
        .prompt([
            {
                name: 'dept',
                type: 'list',
                pageSize: 12,
                message: 'Select department you want to Maintain or ** Add **, ** Cancel **',
                choices: deptArray
            }
        ])
        .then((answer) => {
            // process the user request
            switch (answer.dept) {
                case '** Add **':
                    addDepartment();
                    break;
                case '** Cancel **':
                    displayMaintenanceMenu();
                    break;
                default:
                    let id = answer.dept.substr(0, 4).trim();
                    let name = answer.dept.substr(6);
                    updateDepartment(id, name);
                    break;
            }
        });
};


// -----------------------------------------------------------------------------
// Function: addDepartment
// Purpose:  User selected ** Add **, get data input and add record 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const addDepartment = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'ADD DEPARTMENT'))
    );
    // prompt for info for a new department
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is the department name (BLANK to Return) ?',
                validate(value) {
                    const deptName = value.trim();
                    // Prevent duplicates from being entered
                    const isDeptInArray = (element) => element.toLowerCase() == deptName.toLowerCase();
                    if (deptNameArray.findIndex(isDeptInArray) < 0) return true;
                    else {
                        console.log(chalk.red('\nThat Department Name is already used.'));
                        return false;
                    }
                }
            }
        ])
        .then((answer) => {
            const deptName = answer.name.trim();
            if (deptName.length > 0) {
                deptObj.setName(deptName);
                result = deptObj.add(connection, (err, result) => {
                    if (err) throw err;
                    console.clear();
                    console.log(
                        chalk.green(buildHeadings(LEFT, `Added Department ${deptName}.`))
                    );
                    pressAnyKey()
                        .then(() => {
                            maintainDepartments();
                        });
                })
            } else maintainDepartments();
        })
};


// -----------------------------------------------------------------------------
// Function: updateDepartment
// Purpose:  User selected a department, so get input for update or delete 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const updateDepartment = (id, name) => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'UPDATE DEPARTMENT'))
    );
    console.log(`Department: ${id.trim()} - ${name.trim()}\n`);
    // prompt for info for department
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'What is changed department name (BLANK to Return, DELETE to Delete) ?',
                validate(value) {
                    const deptName = value.trim();
                    // Prevent duplicates from being entered
                    const isDeptInArray = (element) => element.toLowerCase() == deptName.toLowerCase();
                    if (deptNameArray.findIndex(isDeptInArray) < 0) return true;
                    else {
                        console.log(chalk.red('\nThat Department Name is already used.'));
                        return false;
                    }
                }
            }
        ])
        .then((answer) => {
            const deptName = answer.name.trim();
            switch (deptName.toUpperCase()) {
                case '':
                    maintainDepartments();
                    break;
                case 'DELETE':
                    deptObj.setId(id);
                    resultSet = deptObj.getDependentRecords(connection, (err, resultSet) => {
                        if (err) throw err;
                        if (resultSet.length > 0) {
                            console.clear();
                            console.log(
                                chalk.red(buildHeadings(LEFT, `Department ${name} cannot be deleted because it is used by roles:`))
                            );
                            chalk.red(console.table(resultSet));
                            pressAnyKey()
                                .then(() => {
                                    maintainDepartments();
                                });
                        } else {
                            result = deptObj.delete(connection, (err, result) => {
                                if (err) throw err;
                                console.clear();
                                console.log(
                                    chalk.red(buildHeadings(LEFT, `Deleted Department ${name}.`))
                                );
                                pressAnyKey()
                                    .then(() => {
                                        maintainDepartments();
                                    });
                            })
                        }
                    })
                    break;
                default:
                    deptObj.setId(id);
                    deptObj.setName(deptName);
                    result = deptObj.update(connection, (err, result) => {
                        if (err) throw err;
                        console.clear();
                        console.log(
                            chalk.green(buildHeadings(LEFT, `Updated Department ${deptName}.`))
                        );
                        pressAnyKey()
                            .then(() => {
                                maintainDepartments();
                            });
                    }
                    )
                    break;
            }
        })
};


// -----------------------------------------------------------------------------
// Function: maintainRoles
// Purpose:  create arrays need for display/validation for role maintenance 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const maintainRoles = () => {
    addToListArray.length = 0;
    addToListArray.push('** Add **');
    addToListArray.push('** Cancel **');
    createRoleArrays(getRoleInput);
};


// -----------------------------------------------------------------------------
// Function: getRoleInput
// Purpose:  Select Role for Mainenance or select Add or Cancel (return to menu) 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const getRoleInput = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'ROLE MAINTENANCE'))
    );
    // prompt for record to change
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'list',
                pageSize: 20,
                message: 'Select role you want to Maintain or ** Add **, ** Cancel **',
                choices: roleArray
            }
        ])
        .then((answer) => {
            // process the user request
            switch (answer.role) {
                case '** Add **':
                    addToListArray.length = 0;
                    createDeptArrays(addRole);
                    break;
                case '** Cancel **':
                    displayMaintenanceMenu();
                    break;
                default:
                    let id = answer.role.substr(0, 4).trim();
                    let title = answer.role.substr(6);
                    addToListArray.length = 0;
                    addToListArray.push('** Same **');
                    createDeptArrays(() => { updateRole(id, title); });
                    break;
            }
        });
};


// -----------------------------------------------------------------------------
// Function: addRole
// Purpose:  User selected ** Add **, get data input and add record 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const addRole = () => {
    deptArray.pop();  // Remove **Same** which isn't valid for an add
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'ADD ROLE'))
    );
    // prompt for info for a new role
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the job title (BLANK to Return) ?',
                validate(value) {
                    title = value.trim();
                    // Prevent duplicates from being entered
                    const isTitleInArray = (element) => element.toLowerCase() == title.toLowerCase();
                    if (roleTitleArray.findIndex(isTitleInArray) < 0) return true;
                    else {
                        console.log(chalk.red('\nThat Title is already used.'));
                        return false;
                    }
                },
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is salary ?'
            },
            {
                name: 'department',
                type: 'list',
                pageSize: 12,
                message: 'Select department',
                choices: deptArray
            }
        ])
        .then((answer) => {
            const title = answer.title.trim();
            if (title.length > 0) {
                roleObj.setTitle(title);
                roleObj.setSalary(answer.salary);
                roleObj.setDepartment_Id(answer.department.substr(0, 4).trim());
                result = roleObj.add(connection, (err, result) => {
                    if (err) throw err;
                    console.clear();
                    console.log(
                        chalk.green(buildHeadings(LEFT, `Added Role ${title}.`))
                    );
                    pressAnyKey()
                        .then(() => {
                            maintainRoles();
                        });
                }
                )
            } else maintainRoles();
        })
};


// -----------------------------------------------------------------------------
// Function: updateRole
// Purpose:  User selected a role, so get input for update or delete 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const updateRole = (id, name) => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'UPDATE ROLE'))
    );
    console.log(`Role: ${id.trim()} - ${name.trim()}\n`);
    // prompt for info department
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is changed job title (BLANK for no change, DELETE to Delete) ?',
                validate(value) {
                    title = value.trim();
                    // Prevent duplicates from being entered
                    const isTitleInArray = (element) => element.toLowerCase() == title.toLowerCase();
                    if (roleTitleArray.findIndex(isTitleInArray) < 0) return true;
                    else {
                        console.log(chalk.red('\nThat Title is already used.'));
                        return false;
                    }
                },
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is new salary (BLANK for no change) ?',
                when: (answers) => answers.title.toLowerCase() !== 'delete'
            },
            {
                name: 'department',
                type: 'list',
                pageSize: 20,
                message: 'Select new department or ** Same **',
                choices: deptArray,
                when: (answers) => answers.title.toLowerCase() !== 'delete'
            }
        ])
        .then((answer) => {
            const title = answer.title.trim();
            switch (title.toUpperCase()) {
                case 'DELETE':
                    roleObj.setId(id);
                    resultSet = roleObj.getDependentRecords(connection, (err, resultSet) => {
                        if (err) throw err;
                        if (resultSet.length > 0) {
                            console.clear();
                            console.log(
                                chalk.red(buildHeadings(LEFT, `Role ${name} cannot be deleted because it is used by employees:`))
                            );
                            chalk.red(console.table(resultSet));
                            pressAnyKey()
                                .then(() => {
                                    maintainRoles();
                                });
                        } else {
                            result = roleObj.delete(connection, (err, result) => {
                                if (err) throw err;
                                console.clear();
                                console.log(
                                    chalk.red(buildHeadings(LEFT, `Deleted Role ${name}.`))
                                );
                                pressAnyKey()
                                    .then(() => {
                                        maintainRoles();
                                    });
                            })
                        }
                    })
                    break;
                default:
                    let title = answer.title.trim();
                    if (title == '') title = name;
                    const salary = answer.salary.trim();
                    const department = answer.department.trim();
                    roleObj.setId(id);
                    roleObj.getRecord(connection, () => {
                        if (title !== '') roleObj.setTitle(title);
                        if (salary !== '') roleObj.setSalary(salary);
                        if (department !== '** Same **') {
                            const department_id = department.substr(0, 4).trim();
                            roleObj.setDepartment_Id(department_id);
                        }
                        result = roleObj.update(connection, (err, result) => {
                            if (err) throw err;
                            console.clear();
                            console.log(
                                chalk.green(buildHeadings(LEFT, `Updated Role ${title}.`))
                            );
                            pressAnyKey()
                                .then(() => {
                                    maintainRoles();
                                });
                        });
                    });
                    break;
            }
        })
};


// -----------------------------------------------------------------------------
// Function: maintainEmployees
// Purpose:  create arrays need for display/validation for employee maintenance 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const maintainEmployees = () => {
    empObj.setMgr_Id(null);
    addToListArray.length = 0;
    addToListArray.push('** Add **');
    addToListArray.push('** Cancel **');
    createEmpArrays(getEmployeeInput);
};


// -----------------------------------------------------------------------------
// Function: getEmployeeInput
// Purpose:  Select Employee for Mainenance or select Add or Cancel (return to menu) 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const getEmployeeInput = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'EMPLOYEE MAINTENANCE'))
    );
    // prompt for record to change
    inquirer
        .prompt([
            {
                name: 'employee',
                type: 'list',
                pageSize: 25,
                message: 'Which employee do you want to Change or ** Add **, ** Cancel ** ?',
                choices: empArray
            }
        ])
        .then((answer) => {
            // process the user request
            switch (answer.employee) {
                case '** Add **':
                    addToListArray.length = 0;
                    empObj.setMgr_Id(null);
                    // createManagerArray(createRoleArrays(addEmployee));
                    createRoleArrays(() => {
                        addToListArray.push('** None **');
                        createManagerArray(() => {
                            addEmployee();
                        })
                    });
                    break;
                case '** Cancel **':
                    displayMaintenanceMenu();
                    break;
                default:
                    let id = answer.employee.substr(0, 4).trim();
                    let name = answer.employee.substr(6);
                    addToListArray.length = 0;
                    addToListArray.push('** Same **');
                    createRoleArrays(() => {
                        addToListArray.push('** None **');
                        createManagerArray(() => {
                            updateEmployee(id, name);
                        })
                    });
                    break;
            }
        });
};


// -----------------------------------------------------------------------------
// Function: addEmployee
// Purpose:  User selected ** Add **, get data input and add record 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const addEmployee = () => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'ADD EMPLOYEE'))
    );
    // prompt for info for a new employee
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is first name ?',
                validate(value) {
                    firstName = value.trim();
                    // Prevent duplicates from being entered
                    if (firstName.length > 0) return true;
                    else {
                        console.log(chalk.red('\nFirst Name is required.'));
                        return false;
                    }
                }
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is last name ?',
                validate(value) {
                    lastName = value.trim();
                    // Prevent duplicates from being entered
                    if (lastName.length > 0) return true;
                    else {
                        console.log(chalk.red('\nLast Name is required.'));
                        return false;
                    }
                }
            },
            {
                name: 'role',
                type: 'list',
                pageSize: 20,
                message: 'Select job role',
                choices: roleArray
            },
            {
                name: 'manager',
                type: 'list',
                pageSize: 10,
                message: 'Select manager or ** None **',
                choices: managerArray
            },
        ])
        .then((answer) => {
            const name = answer.first_name.trim() + ' ' + answer.last_name.trim();
            empObj.setLast_Name(answer.last_name);
            empObj.setFirst_Name(answer.first_name);
            empObj.setRole_Id(answer.role.substr(0, 4).trim());
            switch (answer.manager) {
                case '** None **':
                    empObj.setMgr_Id(null);
                    break;
                default:
                    empObj.setMgr_Id(answer.manager.substr(0, 4).trim());
                    break;
            };
            result = empObj.add(connection, (err, result) => {
                if (err) throw err;
                console.clear();
                console.log(
                    chalk.green(buildHeadings(LEFT, `Added Employee ${name}.`))
                );
                pressAnyKey()
                    .then(() => {
                        maintainEmployees();
                    });
            });
        });
};


// -----------------------------------------------------------------------------
// Function: updateEmployee
// Purpose:  User selected an employee, so get input for update or delete 
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const updateEmployee = (id, name) => {
    console.clear();
    console.log(
        chalk.blue(buildHeadings(CENTER, 'UPDATE EMPLOYEE'))
    );
    console.log(`Employee: ${id.trim()} - ${name.trim()}\n`);
    empObj.setId(id.trim());
    // prompt for info for employee
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is first name (BLANK for no change, DELETE) ?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is last name (BLANK for no change) ?',
                when: (answers) => answers.first_name.toLowerCase() !== 'delete'
            },
            {
                name: 'role',
                type: 'list',
                pageSize: 20,
                message: 'What is job role ?',
                choices: roleArray,
                when: (answers) => answers.first_name.toLowerCase() !== 'delete'
            },
            {
                name: 'manager',
                type: 'list',
                pageSize: 10,
                message: 'Who is the manager ?',
                choices: managerArray,
                when: (answers) => answers.first_name.toLowerCase() !== 'delete'
            },
        ])
        .then((answer) => {
            const firstName = answer.first_name.trim();
            switch (firstName.toUpperCase()) {
                case 'DELETE':
                    resultSet = empObj.getDependentRecords(connection, (err, resultSet) => {
                        if (err) throw err;
                        if (resultSet.length > 0) {
                            console.clear();
                            console.log(
                                chalk.red(buildHeadings(LEFT, `Employee ${name} cannot be deleted because they are the manager for employees:`))
                            );
                            chalk.red(console.table(resultSet));
                            pressAnyKey()
                                .then(() => {
                                    maintainEmployees();
                                });
                        } else {
                            result = empObj.delete(connection, (err, result) => {
                                if (err) throw err;
                                console.clear();
                                console.log(
                                    chalk.red(buildHeadings(LEFT, `Deleted Employee ${name}.`))
                                );
                                pressAnyKey()
                                    .then(() => {
                                        maintainEmployees();
                                    });
                            })
                        }
                    })
                    break;
                default:
                    const lastName = answer.last_name.trim();
                    const role = answer.role.trim();
                    empObj.getRecord(connection, () => {
                        if (firstName !== '') empObj.setFirst_Name(firstName);
                        if (lastName !== '') empObj.setLast_Name(lastName);
                        if (role !== '** Same **') {
                            const role_id = role.substr(0, 4).trim();
                            empObj.setRole_Id(role_id);
                        }
                        switch (answer.manager) {
                            case '** None **':
                                empObj.setMgr_Id(null);
                                break;
                            case '** Same **':
                                break;
                            default:
                                empObj.setMgr_Id(answer.manager.substr(0, 4).trim());
                                break;
                        };
                        result = empObj.update(connection, (err, result) => {
                            if (err) throw err;
                            console.clear();
                            console.log(
                                chalk.green(buildHeadings(LEFT, `Updated Employee ${empObj.getFirst_Name()} ${empObj.getLast_Name()}.`))
                            );
                            pressAnyKey()
                                .then(() => {
                                    maintainEmployees();
                                });
                        }
                        );
                    });
                    break;
            }
        })
};


// -----------------------------------------------------------------------------
// Function: displayDepartmentList
// Purpose:  Display a formatted alphabetical list of all departments  
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const displayDepartmentList = () => {
    resultSet = deptObj.getAllRecords(connection, (err, resultSet) => {
        if (err) throw err;
        console.clear();
        console.log(
            chalk.yellow(buildHeadings(CENTER, 'DEPARTMENT LIST'))
        );
        console.table(resultSet);
        pressAnyKey()
            .then(() => {
                displayReportsMenu();
            });
    });
};


// -----------------------------------------------------------------------------
// Function: displayRoleList
// Purpose:  Display a formatted alphabetical list of all roles  
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const displayRoleList = () => {
    resultSet = roleObj.getAllRecords(connection, (err, resultSet) => {
        if (err) throw err;
        console.clear();
        console.log(
            chalk.yellow(buildHeadings(CENTER, 'ROLE LIST'))
        );
        console.table(resultSet);
        pressAnyKey()
            .then(() => {
                displayReportsMenu();
            });
    });
};


// -----------------------------------------------------------------------------
// Function: selectManager
// Purpose:  Allow user to select a manager to filter list or All managers  
// Input:    <none>
// Returns:  <none>  
// -----------------------------------------------------------------------------
const selectManager = () => {
    // Get a list of managers to let the user select from
    addToListArray.length = 0;
    addToListArray.push('** All **');
    addToListArray.push('** Cancel **');
    createManagerArray(() => {
        console.clear();
        console.log(
            chalk.yellow(buildHeadings(CENTER, 'MANAGER FILTER FOR EMPLOYEE LIST'))
        );
        // prompt for manager to list employees
        inquirer.prompt([
            {
                name: 'mgr',
                type: 'list',
                pageSize: 12,
                message: 'What manager do you want to filter list or ** All **, ** Cancel ** ?',
                choices: managerArray,
            },
        ])
            .then((answer) => {
                switch (answer.mgr) {
                    case '** All **':
                        displayEmployeeList(null);
                        break;
                    case '** Cancel **':
                        displayReportsMenu();
                        break;
                    default:
                        let managerId = answer.mgr.substr(0, 4).trim();
                        displayEmployeeList(managerId);
                        break;
                }
            });
    });
};


// -----------------------------------------------------------------------------
// Function: displayEmployeeList
// Purpose:  Display a formatted alphabetical list of all employees.  Can be 
//           filtered for a specific manager  
// Input:    <string> managerId - id of manager for filter or null for all
// Returns:  <none>  
// -----------------------------------------------------------------------------
const displayEmployeeList = (managerId) => {
    empObj.setMgr_Id(managerId);
    resultSet = empObj.getAllManagers(connection, (err, resultSet) => {
        if (err) throw err;
        managerArray.length = 0;
        resultSet.forEach(({ manager_id, manager_name }) => {
            let id_name = manager_id + '    ';
            id_name = id_name.substr(0, 4) + '- ' + manager_name;
            managerArray.push(id_name);
        });
        managerArray.push('** All **');
        managerArray.push('** Cancel **');
        resultSet = empObj.getAllRecords(connection, (err, resultSet) => {
            if (err) throw err;
            console.clear();
            console.log(
                chalk.yellow(buildHeadings(CENTER, 'EMPLOYEE LIST'))
            );
            console.table(resultSet);
            pressAnyKey()
                .then(() => {
                    displayReportsMenu();
                });
        });
    });
};

displayAppName();  // On Program load - display App Name and start app
