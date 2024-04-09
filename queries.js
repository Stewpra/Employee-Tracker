const pool = require('./connection.js');

class queries {
  static async executeQuery(sql, params = []) {
    const client = await pool.connect();
    try {
      const res = await client.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err; // Throw the error for better error handling
    } finally {
      client.release();
    }
  }

  static async getAllDepartments() {
    return this.executeQuery('SELECT * FROM department;');
  }

  static async getAllRoles() {
    return this.executeQuery(`
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      JOIN department ON role.department_id = department.id;
    `);
  }

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
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
    `);
  }

  static async addDepartment(name) {
    return this.executeQuery('INSERT INTO department (name) VALUES ($1);', [
      name,
    ]);
  }

  static async addRole(title, salary, department) {
    const departmentId = await this.executeQuery(
      'SELECT id FROM department WHERE name = ($1);',
      [department]
    );
    return this.executeQuery(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);',
      [title, salary, departmentId[0].id]
    );
  }

  static async addEmployee(firstName, lastName, role, manager) {
    const roleId = await this.executeQuery(
      'SELECT id FROM role WHERE title = ($1);',
      [role]
    );
    let managerId = null;

    if (roleId.length > 0) {
      // Check if roleId array is not empty
      if (manager) {
        const [managerFirstName, managerLastName] = manager.split(' ');
        const managerResult = await this.executeQuery(
          'SELECT id FROM employee WHERE first_name = ($1) AND last_name = ($2);',
          [managerFirstName, managerLastName]
        );
        managerId = managerResult.length > 0 ? managerResult[0].id : null;
      }

      return this.executeQuery(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);',
        [firstName, lastName, roleId[0].id, managerId]
      );
    } else {
      console.error('Role not found for title:', role);
      return null; // Return null or handle the error accordingly
    }
  }

  static async updateEmployeeRole(employee, title) {
    const [firstName, lastName] = employee.split(' ');
    const employeeResult = await this.executeQuery(
      'SELECT id FROM employee WHERE first_name = $1 AND last_name = $2;',
      [firstName, lastName]
    );
    const roleId = await this.executeQuery(
      'SELECT id FROM role WHERE title = $1;',
      [title]
    );
    return this.executeQuery(
      'UPDATE employee SET role_id = $1 WHERE id = $2;',
      [roleId[0].id, employeeResult[0].id]
    );
  }
}

module.exports = queries;
