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

  // Update employee role
}
