const pool = require("./db");

//basic query for return all employee
// pool.query('SELECT * FROM Employees', (err, res) => {
//   if (err) {
//     console.error('Error executing query', err);
//   } else {
//     console.log('Query result:', res.rows);
//   }
// });
// console.log("hello Vishal")
//get userdetails
const getUsers = (request, response) => {
  pool.query(
    "SELECT * FROM contact_details ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
//get users by specific ID
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  if (isNaN(id)) {
    console.error("Invalid ID:", request.params.id);
    response.status(400).send("Invalid ID");
    return;
  }

  pool.query(
    "SELECT * FROM contact_details WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error fetching user by ID:", error);
        response.status(500).send("Error fetching user by ID");
      } else {
        if (results.rows.length === 0) {
          console.log("No user found for ID:", id);
          response.status(404).send("User not found");
        } else {
          response.status(200).json(results.rows);
        }
      }
    }
  );
};

// create contact-details
const createUser = (request, response) => {
  const { name, email, contact } = request.body;
  pool.query(
    "INSERT INTO contact_details (name, email, contact) VALUES ($1, $2, $3) RETURNING id",
    [name, email, contact],
    (error, results) => {
      if (error) {
        console.error("Error creating contact:", error);
        response.status(500).send("Error creating contact");
        return;
      }
      response.status(201).send(`Contact added with ID: ${results.rows[0].id}`);
    }
  );
};

// update user contact-details
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE contact_details SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        console.error("Error updating user:", error);
        response.status(500).send("Error updating user");
      } else {
        if (results.rowCount === 0) {
          response.status(404).send(`User with ID ${id} not found`);
        } else {
          response.status(200).send(`User modified with ID: ${id}`);
        }
      }
    }
  );
};
//delete the specific users

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM contact_details WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error deleting user:", error);
        response.status(500).send("Error deleting user");
      } else {
        if (results.rowCount === 0) {
          response.status(404).send(`User with ID ${id} not found`);
        } else {
          response.status(200).send(`User deleted with ID: ${id}`);
        }
      }
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
