//NPM VARIABLES//////////////////////////////////////////////////////////////

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

//MIDDLEWARE////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//GLOBAL VARIABLES//////////////////////////////////////////////////////////

let firstQuestion = [
  {
  type: 'list',
  message: 'What would you like to do?',
  name: 'whatToDo',
  choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"]
  }
]

let deptAddition = [
  {
  type: 'input',
  message: 'Please add the new department name:',
  name: 'newDept',
  }
]

let rolesAddition = [
  {
  type: 'input',
  message: 'Please add the name of the new role:',
  name: 'newRolesTitle',
  },
  {
  type: 'input',
  message: 'What is the salary for this new role?',
  name: 'newRolesSalary',
  },
  {
  type: 'list',
  message: 'What department does this role belong to?',
  name: 'newRolesDept',
  }
]

let employeeAddition = [
  {
  type: 'input',
  message: 'Please type the first name of the new employee',
  name: 'newEmployeeFirstName'
  },
  {
  type: 'input',
  message: 'Please type the last name of the new employee',
  name: 'newEmployeeLastName'
  },
  {
  type: 'list',
  message: 'Choose this employees role:',
  name: 'newEmployeeRole',
  },
  {
  type: 'input',
  message: 'Does this employee have a manager? Type yes or no.',
  name: 'newEmployeeHasManagerOrNot',
},
  {
  type: 'list',
  message: 'Please select the manager of the new employee',
  name: 'newEmployeeManager',
  when: (input) => input.newEmployeeHasManagerOrNot === "yes",
  } 
]

let updateEmployeeRole = [
  {
  type: 'choices',
  message: 'Which employee would you like to update?',
  name: 'updateEmployeeName',
  },
  {
  type: 'choices',
  message: 'What is the employees new role?',
  name: 'updateEmployeeRole',
  },
]

//CONNECTOR INFORMATION/////////////////////////////////////////////////////

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '0214',
      database: 'department_db'
    },
  );

//QUERIES AND FUNCTIONS//////////////////////////////////////////////////////
async function main() {
  while (true) {
    await askQuestions();
  }
};

async function askQuestions() {
  
  let answer = await inquirer.prompt(firstQuestion); 
  let userAnswer = answer.whatToDo;
  if (userAnswer === "View all departments") {
    viewDepts();
  } 
  else if (userAnswer === "View all roles") {
    viewRoles();
  } 
  else if (userAnswer === "View all employees") {
    viewEmployee();
  } 
  else if (userAnswer === "Add a department") {
    let addDeptAnswer = await inquirer.prompt(deptAddition);
    let deptInfo = addDeptAnswer.newDept;
    addDept(deptInfo);
  }
  else if (userAnswer === "Add an employee") {
    updateLists();
    let addEmployeeAnswer = await inquirer.prompt(employeeAddition);
    let employeeInfo = addEmployeeAnswer;
    addEmployee(employeeInfo);
  }
  else if (userAnswer === "Add a role") {
    updateDeptList();
    let addRolesAnswer = await inquirer.prompt(rolesAddition);
    let rolesInfo = addRolesAnswer;
    addRoles(rolesInfo);
  }
  else if (userAnswer === "Update an employee role") {
    updateEmployeeList();
    updateRoleList();
    let addUpdatedEmployee = await inquirer.prompt(updateEmployeeRole);
    let updatedInfo = addUpdatedEmployee;
    addRoles(updatedInfo);
  }
  else if (userAnswer === "Exit") {
    process.exit(0);
  }
};

function renderConsoleTableResults(results) {
  console.clear();
  console.table(results);
  console.log("Press the up or down arrow to continue!");
  process.stdin.setRawMode(true);
  process.stdin.resume();
}

async function viewDepts() {
  db.query('SELECT * FROM department', function (err, results) {
    renderConsoleTableResults(results);
  });
};

async function viewRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    renderConsoleTableResults(results);
  });
};

async function viewEmployee() {
  //use RIGHT JOIN instead and you can do more than one at a time for one SELECT
  db.query('SELECT employee.first_name, employee.last_name, roles.title as role, roles.salary, department.title as department, manager.first_name as manager_firstname, manager.last_name as manager_lastname \
    FROM employee \
    JOIN roles ON employee.roles_id=roles.id \
    JOIN department ON department.id=roles.department_id \
    LEFT JOIN employee manager ON employee.manager_id=manager.id', function (err, results) {
    renderConsoleTableResults(results);
  });
};

async function addDept(deptInfo) {
  db.query(`INSERT INTO department (title) VALUES ('${deptInfo}')`, function (err, results) {
    renderConsoleTableResults(results);
    viewDepts();
  });
};

async function addRoles(rolesInfo) {
  console.log("you are at addRoles function");
  let deptsID = await db.promise().query(`SELECT id FROM department WHERE title='${rolesInfo.newRolesDept}'`);

  deptsID = deptsID[0][0].id;
  console.log(deptsID);

  db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${rolesInfo.newRolesTitle}', '${rolesInfo.newRolesSalary}', ${deptsID})`, function (err, results) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    renderConsoleTableResults(results);
    viewRoles();
  });
}

async function addEmployee(employeeInfo) {
  let rolesID = await db.promise().query(`SELECT id FROM roles WHERE title='${employeeInfo.newEmployeeRole}'`);
  rolesID = rolesID[0][0].id;
  
  let managerFirstName = employeeInfo.newEmployeeManager.split(" ")[0];
  let managerLastName = employeeInfo.newEmployeeManager.split(" ")[1];
  let managerID = await db.promise().query(`SELECT id FROM employee WHERE first_name='${managerFirstName}' AND last_name='${managerLastName}'`);
  managerID = managerID[0][0].id;

  db.query(`INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ('${employeeInfo.newEmployeeFirstName}', '${employeeInfo.newEmployeeLastName}', ${rolesID}, ${managerID})`, function (err, results) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    renderConsoleTableResults(results);
    viewEmployee();
  });
};

//gets the employee list function is needed to update that employee role 
async function getEmployeeList() {
  let newEmployeeList = [];
  let results = await db.promise().query(`SELECT * FROM employee`);
  let employeeObject = results[0];

  for (let index = 0; index < employeeObject.length; index++) {
    newEmployeeList.push(employeeObject[index].first_name + " " + employeeObject[index].last_name);
  };
  return newEmployeeList;
}

//gets roles list function is needed for the add new employee function
async function getRolesList() {
  let newRolesList = [];
  let results = await db.promise().query(`SELECT * FROM roles`);
  let rolesObject = results[0];

  for (let index = 0; index < rolesObject.length; index++) {
    newRolesList.push(rolesObject[index].title);
  };
  return newRolesList;
}

//gets managers list function is needed for the add new employee function
//managers are identified as NULL for manager_id in the employee table
async function getManagerList() {
  let newManagerList = [];
  let results = await db.promise().query(`SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`);
  let managerObject = results[0];

  for (let index = 0; index < managerObject.length; index++) {
    newManagerList.push(managerObject[index].first_name + " " + managerObject[index].last_name);
  }; 

  return newManagerList;  
}

//gets current departments list function is needed for the add new role function
async function getDeptsList() {
  let newDeptList = [];
  let results = await db.promise().query(`SELECT id, title FROM department`);
  let deptObject = results[0];

  for (let index = 0; index < deptObject.length; index++) {
    newDeptList.push(deptObject[index].title);   
  };

  return newDeptList;
}

//updates the list for departments for the add new role function
async function updateDeptList() {
  let updatedDeptList = await getDeptsList();
  let deptQuestion = rolesAddition[2];
  deptQuestion.choices = updatedDeptList;
}

//updates the list for only roles for the update employee function
async function updateRoleList() {
  let updatedRoleRoleList = await getRolesList();
  let rolesrolesQuestion = updateEmployeeRole[1];
  rolesrolesQuestion.choices = updatedRoleRoleList;
}

//updates the list for employee first and last name for the update employee function
async function updateEmployeeList() {
  let updatedEmployeeList = await getEmployeeList();
  let employeeQuestion = updatedEmployeeList[0];
  employeeQuestion.choices = updatedEmployeeList;
  // console.log(updatedEmployeeList);
}

//updates the list for roles and managers for the add new employee function
async function updateLists() {
  let updatedRolesList = await getRolesList();
  let updatedManagerList = await getManagerList();
  let rolesQuestion = employeeAddition[2];
  let managerQuestion = employeeAddition[4];
  rolesQuestion.choices = updatedRolesList;
  employeeAddition[2] = rolesQuestion;
  managerQuestion.choices = updatedManagerList;
  employeeAddition[4] = managerQuestion;
}

//LISTENING ON PORT INFO//////////////////////////////////////////////////////

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

//LOGIC//////////////////////////////////////////////////////////////////////
main();


//NOTES FOR LATER////////////////////////////////////////////////////////////
// inquirer
//   .prompt([
//     {
//       type: 'list',
//       message: 'What would you like to do?',
//       name: 'whatToDo',
//       choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
//     },
//     {
//       type: 'input',
//       message: 'Please add the new department name:',
//       name: 'new dept',
//       when: (answers) => answers.whatToDo === "Add a department"
//     },
//     {
//       type: 'input',
//       message: 'Please add the name of the new role:',
//       name: 'new dept',
//       when: (answers) => answers.whatToDo === "Add a role",
//     },
//     {
//       type: 'input',
//       message: 'Please the new employee name:',
//       name: 'new dept',
//       when: (answers) => answers.whatToDo === "Add an employee",
//     },
//     {
//       type: 'input',
//       message: 'What is the new role for the employee?',
//       name: 'new dept',
//       when: (answers) => answers.whatToDo === "Update an employee role",
//     },
    
    
//   ])
