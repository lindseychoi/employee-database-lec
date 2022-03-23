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

//upate roles list function is needed for the add new employee function
async function getRolesList() {
  let newRolesList = [];
  let results = await db.promise().query(`SELECT * FROM roles`);
  let rolesObject = results[0];

  for (let index = 0; index < rolesObject.length; index++) {
    newRolesList.push(rolesObject[index].title);
  };

  return newRolesList;

}

//update managers list function is needed for the add new employee function
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

async function updateLists() {
  let updatedRolesList = await getRolesList();
  let updatedManagerList = await getManagerList();
  let rolesQuestion = employeeAddition[2];
  let managerQuestion = employeeAddition[4];
  // console.log("Original employeeAddition");
  // console.log(employeeAddition);
  rolesQuestion.choices = updatedRolesList;
  employeeAddition[2] = rolesQuestion;
  managerQuestion.choices = updatedManagerList;
  employeeAddition[4] = managerQuestion;
  // console.log("UPDATED employeeAddition");
  // console.log(employeeAddition);
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
