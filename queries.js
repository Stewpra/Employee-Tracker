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
}
