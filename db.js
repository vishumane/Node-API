const { Pool } = require("pg");

// Create a pool for contact-details.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "contact-detail",
  password: "root",
  port: 5432,
});

module.exports = pool;
