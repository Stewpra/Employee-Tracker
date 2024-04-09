const inquirer = require('inquirer');

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
      'Update employee role',
      'Quit',
    ],
  },

  // Add employee

  // Update employee role

  // Add role

  //Add a department

  //update employee role

  //quit
];
