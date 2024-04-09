const inquirer = require('inquirer');

const queries = require('./queries');

const questions = [
  {
    type: 'list',
    name: 'welcome',
    message: 'What would you like to do?',
    choices: [
      'View all employees', // GET
      'Add employee',
      'Update employee role',
      'View all roles', // GET
      'Add role',
      'View all departments', // GET
      'Add a department',
      'Quit',
    ],
  },

  // Add employee
  {
    type: 'input',
    name: 'firstName',
    when: (answers) => answers.welcome === 'Add an employee',
    message: "What is the employee's first name?",
  },
  {
    type: 'input',
    name: 'lastName',
    when: (answers) => answers.welcome === 'Add an employee',
    message: "What is the employee's last name?",
  },
  {
    type: 'input',
    name: 'roleTitle',
    when: (answers) => answers.welcome === 'Add an employee',
    message: "Enter the title of the employee's role:",
  },
  {
    //get list of all managers and select one. also have option for no manager
  },

  //Update employee role
  //get list of all employees and select one
  //get list of roles and select one

  //Add role
  {
    type: 'input',
    name: 'newRoleTitle',
    when: (answers) => answers.welcome === 'Add a role',
    message: 'What is the title of the new role?',
  },
  {
    type: 'input',
    name: 'newRoleSalary',
    when: (answers) => answers.welcome === 'Add a role',
    message: 'What is the salary for this role?',
    validate: (value) => {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number for the salary';
    },
  },
  {
    // get list of all departments and select one
  },

  //Add a department
  {
    type: 'input',
    name: 'adddepartment',
    when: (answers) => answers.welcome === 'Add a department',
    message: 'What is the name of the department?',
  },

  //quit
  {
    type: 'confirm',
    name: 'confirmQuit',
    when: (answers) => answers.welcome === 'Quit',
    message: 'Are you sure you want to quit?',
    default: false,
  },
];
