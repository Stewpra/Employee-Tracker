const inquirer = require('inquirer');
const queries = require('./queries');

async function getQueries() {
  const departments = await queries.getAllDepartments();
  const roles = await queries.getAllRoles();
  const employees = await queries.getAllEmployees();
  return {
    departmentList: departments.map((department) => department.name),
    roleList: roles.map((role) => role.title),
    employeeList: employees.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    ),
  };
}

async function promptQuestions() {
  choices = await getQueries();

  const questions = [
    {
      type: 'list',
      name: 'question',
      message: 'What would you like to do?',
      choices: [
        'View all employees', // GET
        'Add employee',
        'Update employee role',
        'View all roles', // GET
        'Add role',
        'View all departments', // GET
        'Add department',
        'Quit',
      ],
    },

    // Add employee
    {
      type: 'input',
      name: 'firstName',
      when: (answers) => answers.question === 'Add an employee',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'lastName',
      when: (answers) => answers.question === 'Add an employee',
      message: "What is the employee's last name?",
    },
    {
      type: 'input',
      name: 'roleTitle',
      when: (answers) => answers.question === 'Add an employee',
      message: "Enter the title of the employee's role:",
    },
    {
      when: (answers) => answers.question === 'Add an employee',
      type: 'list',
      name: 'employeeManager',
      message: 'Select the manager of this employee',
      choices: choices.employeeList,
    },

    // Update an employee's role
    {
      when: (answers) => answers.question === "Update an employee's role",
      type: 'list',
      name: 'employee',
      message: 'Select the employee to update the role',
      choices: choices.employeeList,
    },
    {
      when: (answers) => answers.question === "Update an employee's role",
      type: 'list',
      name: 'title',
      message: 'Select the new role',
      choices: choices.roleList,
    },

    //Add role
    {
      type: 'input',
      name: 'newRoleTitle',
      when: (answers) => answers.question === 'Add a role',
      message: 'What is the title of the new role?',
    },
    {
      type: 'input',
      name: 'newRoleSalary',
      when: (answers) => answers.question === 'Add a role',
      message: 'What is the salary for this role?',
      validate: (value) => {
        const valid = !isNaN(parseFloat(value));
        return valid || 'Please enter a number for the salary';
      },
    },
    {
      when: (answers) => answers.question === 'Add a role',
      type: 'list',
      name: 'roleDepartment',
      message: 'Select the department that this role belongs to',
      choices: choices.departmentList,
    },

    //Add a department
    {
      type: 'input',
      name: 'addDepartment',
      when: (answers) => answers.question === 'Add a department',
      message: 'What is the name of the department?',
    },

    //quit
    {
      type: 'confirm',
      name: 'confirmQuit',
      when: (answers) => answers.question === 'Quit',
      message: 'Are you sure you want to quit?',
      default: false,
    },
  ];

  const answer = await inquirer.prompt(questions);

  switch (answer.question) {
    case 'View all employees':
      const allEmployees = await queries.getAllEmployees();
      console.table(allEmployees);
      break;

    case 'View all roles':
      const allRoles = await queries.getAllRoles();
      console.table(allRoles);
      break;

    case 'View all departments':
      const allDepartments = await queries.getAllDepartments();
      console.table(allDepartments);
      break;

    case 'Add department':
      await queries.addDepartment(answer.addDepartment);
      console.log(`${answer.addDepartment} added successfully.\n`);
      break;

    case 'Add role':
      await queries.addRole(
        answer.newRoleTitle,
        answer.newRoleSalary,
        answer.roleDepartment
      );
      console.log(`${answer.newRoleTitle} added successfully.\n`);
      break;

    case 'Add employee':
      await queries.addEmployee(
        answer.firstName,
        answer.lastName,
        answer.roleTitle,
        answer.employeeManager
      );
      console.log(
        `${answer.firstName} ${answer.lastName} added successfully.\n`
      );
      break;

    case 'Update employee role':
      await queries.updateEmployeeRole(answer.employee, answer.title);
      console.log(`${answer.employee}'s role updated successfully.\n`);
      break;

    case 'Quit':
      if (answer.confirmQuit) {
        process.exit(7);
      }
      break;

    default:
      console.log('Invalid choice. Please select a valid option.');
      break;
  }
  promptQuestions();
}

function init() {
  promptQuestions();
}

init();
