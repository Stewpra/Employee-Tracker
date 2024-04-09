const pool = require('./server.js');

class queries {
  // function to execute queries
  static async executeQuery(sql, params = []) {
    const client = await pool.connect();
    try {
      const res = await client.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      return 8;
    } finally {
      client.release();
    }
  }

  // Get all departments
  static async getAllDepartments() {
    return this.executeQuery(`SELECT * FROM department;`);
  }

  // Get all roles
  static async getAllRoles() {
    return this.executeQuery(
      `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;`
    );
  }

  // Get all employees
  static async getAllEmployees() {
    return this.executeQuery(`
      SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        role.salary AS salary,
        department.name AS department,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM
        employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee as manager ON employee.manager_id = manager.id;`);
  }

  // Add department
  static async addDepartment(name) {
    return this.executeQuery(`INSERT INTO department (name) VALUES ($1);`, [
      name,
    ]);
  }

  // Add role
  static async addRole(title, salary, department) {
    let departmentId = await this.executeQuery(
      'SELECT id FROM department WHERE name = ($1);',
      [department]
    );
    return this.executeQuery(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);',
      [title, salary, departmentId]
    );
  }
  // Add employee
  static async addEmployee(firstName, lastName, role, manager) {
    const roleId = await this.executeQuery(
      `SELECT id FROM role WHERE title = ($1);`,
      [role]
    );
    let managerId = null;
    if (manager) {
      const [managerFirstName, managerLastName] = manager.split(' ');
      managerId = await this.executeQuery(
        `SELECT id FROM manager WHERE first_name = ($1) AND last_name = ($2);`,
        [managerFirstName, managerLastName]
      );
    }
    return this.executeQuery(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);',
      [firstName, lastName, roleId, managerId]
    );
  }

  // Update employee role
  static async updateEmployeeRole(employee, title) {
    const [firstName, lastName] = employee.split(' ');
    const id = await this.executeQuery(
      `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2;`,
      [firstName, lastName]
    );
    const roleId = await this.executeQuery(
      `SELECT id FROM role WHERE title = $1;`,
      [title]
    );
    return this.executeQuery(
      `
          UPDATE 
            employee 
          SET 
            role_id = $1 
          WHERE id = $2;`,
      [roleId, id]
    );
  }
}

module.exports = queries;
