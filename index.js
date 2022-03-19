//NPM VARIABLES//////////////////////////////////////////////////////////////

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

//GLOBAL VARIABLES//////////////////////////////////////////////////////////

let firstQuestion = [
  {
  type: 'list',
  message: 'What would you like to do?',
  name: 'whatToDo',
  choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
  }
]

let deptAddition = [
  {
  type: 'input',
  message: 'Please add the new department name:',
  name: 'newDept',
  }
]


//MIDDLEWARE////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CONNECTOR INFORMATION/////////////////////////////////////////////////////

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '0214',
      database: 'department_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

//QUERIES AND FUNCTIONS//////////////////////////////////////////////////////
async function mainFunction() {
  askQuestions();
};

async function askQuestions() {

  let answer = await inquirer.prompt(firstQuestion); 
  let userAnswer = answer.whatToDo;
    if (userAnswer === "View all departments") {
      viewDepts();
      } else if (userAnswer === "View all roles") {
        viewRoles();
        } else if (userAnswer === "View all employees") {
          viewEmployee();

          } else if (userAnswer === "Add a department") {
            let addDeptAnswer = await inquirer.prompt(deptAddition);
            let deptInfo = addDeptAnswer.newDept;
            addDept(deptInfo);
          } 
};

// async function addNewDepartment() {
//   let answer = await inquirer.prompt(deptAddition);
//   let userAnswer = await answer.newDept;
//   if (userAnswer === "Add a department") {
//     let deptInfo = deptAddition.newDept;
//     addDept(deptInfo);
//   } 
// }

async function viewDepts() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
  });
};

async function viewRoles() {
  db.query('SELECT * FROM roles', function (err, results) {
    console.table(results);
  });
};

async function viewEmployee() {
  db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
  });
};

async function addDept(deptInfo) {
  db.query(`INSERT ${deptInfo} FROM employee`, function (err, results) {
    console.table(results);
  });
};






//LISTENING ON PORT INFO//////////////////////////////////////////////////////

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

//LOGIC//////////////////////////////////////////////////////////////////////
mainFunction();


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
