
const { pool } = require('../config')
const bcrypt = require('bcrypt')

async function readAll(req, res) {
  try {
    const readAllQuery = 'SELECT * FROM users';
    const { rows } = await pool.query(readAllQuery);
    return res.send({ rows });
  } catch (error) {
    return res.send(error);
  }
};

const read = readAll;

const createCustomerAccount = (request, response) => {
  const username = request.body.username
  // const hashedPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password
  const name = request.body.name

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return response.status(400).send(`Username taken. Try again`)
  }

  pool.query('SELECT addCustomer($1, $2, $3)', [username, password, name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create customer account for ${username}`)
      throw error
    }

    response.status(201).send('Customer added')
  })
}

const createRestaurantStaffAccount = (request, response) => {
  const username = request.body.username
  const password = request.body.password
  const name = request.body.name
  const rest_id = request.body.restId

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return response.status(400).send(`Username taken. Try again`)
  }

  pool.query('SELECT addRestaurantStaff($1, $2, $3, $4)', [username, hashedPassword, name, rest_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create restaurant staff account for ${username}`)
      throw error
    }

    response.status(201).send('Restaurant Staff added')
  })
}

const createRiderAccount = (request, response) => {
  const username = request.body.username
  const password = request.body.password
  const name = request.body.name
  const fullTimeBoolean = request.body.fullTimer

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return response.status(400).send(`Username taken. Try again`)
  }


  pool.query('SELECT addRider($1, $2, $3, $4)', [username, password, name, fullTimeBoolean], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create rider account for ${username}`)
      throw error
    }

    response.status(201).send('Rider added')
  })
}

const createFDSManagerAccount = (request, response) => {
  const username = request.body.username
  const password = request.body.password
  const name = request.body.name

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return response.status(400).send(`Username taken. Try again`)
  }

  pool.query('SELECT addFdsManager($1, $2, $3)', [username, password, name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create FDS Manager account for ${username}`)
      throw error
    }

    response.status(201).send('FDS Manager added')
  })
}

module.exports = {
  read,
  createCustomerAccount,
  createFDSManagerAccount,
  createRestaurantStaffAccount,
  createRiderAccount
}