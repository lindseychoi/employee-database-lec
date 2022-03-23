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
  choices: ["Classroom Teacher", "Paraprofessional", "Secretary", "Principal", "Assistant Principal", "Librarian", "Custodian", "IT Specialist","Nurse"]
  },
  {
  type: 'list',
  message: 'Please select the manager of the new employee',
  name: 'newEmployeeManager',
  choices: []
  } 
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
  updateManagerList();
  return
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
    let addEmployeeAnswer = await inquirer.prompt(deptAddition);
    let deptInfo = addEmployeeAnswer.newDept;
    addDept(deptInfo);
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
  db.query('SELECT * FROM employee', function (err, results) {
    renderConsoleTableResults(results);
  });
};

async function addDept(deptInfo) {
  db.query(`INSERT INTO department (title) VALUES ('${deptInfo}')`, function (err, results) {
    renderConsoleTableResults(results);
    viewDepts();
  });
};

// async function addEmployee(employeeInfo) {
//   db.query(`INSERT INTO employee (title) VALUES ('${employeeInfo}')`, function (err, results) {
//     renderConsoleTableResults(results);
//     viewEmployee();
//   });
// };

//upate roles list function is needed for the add new employee function
async function updateRolesList() {
  let rolesObject = [];
  let newRolesList = [];
  db.query(`SELECT * FROM roles`, function (err, results) {
    rolesObject = results;
    for (let index = 0; index < rolesObject.length; index++) {
      newRolesList.push(rolesObject[index].title);
    };
  console.log(newRolesList);
  });
}
//update managers list function is needed for the add new employee function
//managers are identified as NULL for manager_id in the employee table
async function updateManagerList() {
  let managerObject = [];
  let newManagerList = [];
  db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`, function (err, results) {
    // console.log(results);
    managerObject = results;
    for (let index = 0; index < managerObject.length; index++) {
      newManagerList.push(managerObject[index].first_name + " " + managerObject[index].last_name);
    }; 
  console.log(newManagerList);
  });
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
