const pool = require("./db");

//get userdetails
const getUsers = async (request, response) => {
  try {
    const results = await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM contact_details ORDER BY id ASC", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    console.log(results);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

//get users by specific ID
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);

  if (isNaN(id)) {
    console.error("Invalid ID:", request.params.id);
    response.status(400).send("Invalid ID");
    return;
  }

  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM contact_details WHERE id = $1",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.rows.length === 0) {
      console.log("No user found for ID:", id);
      response.status(404).send("User not found");
    } else {
      response.status(200).json(results.rows);
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    response.status(500).send("Error fetching user by ID");
  }
};


// create contact-details
const createUser = async (request, response) => {
  const { name, email, contact } = request.body;

  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO contact_details (name, email, contact) VALUES ($1, $2, $3) RETURNING id",
        [name, email, contact],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    response.status(201).send(`Contact added with ID: ${results.rows[0].id}`);
  } catch (error) {
    console.error("Error creating contact:", error);
    response.status(500).send("Error creating contact");
  }
};


// update user contact-details
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "UPDATE contact_details SET name = $1, email = $2 WHERE id = $3",
        [name, email, id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.rowCount === 0) {
      response.status(404).send(`User with ID ${id} not found`);
    } else {
      response.status(200).send(`User modified with ID: ${id}`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    response.status(500).send("Error updating user");
  }
};

//delete the specific users

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM contact_details WHERE id = $1",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.rowCount === 0) {
      response.status(404).send(`User with ID ${id} not found`);
    } else {
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    response.status(500).send("Error deleting user");
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
