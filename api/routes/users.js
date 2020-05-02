
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
  const hashedPassword = bcrypt.hash(request.body.password, 10)
  const name = request.body.name
  const access_rights = 'Customer'

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return res.send(error)
  }

  // pool.query('INSERT INTO Users (username, password, name, created_at, access_rights) VALUES ($1, $2, $3, $4)', [username, password, name, access_rights], (error, results) => {
  //   if (error) {
  //     throw error
  //   }

  //   response.status(201)
  // })

  pool.query('SELECT addCustomer($1, $2, $3)', [username, hashedPassword, name], (error, results) => {
    if (error) {
      throw error
    }

    response.status(201).send('Customer added')
  })
}

const createRestaurantStaffAccount = (request, response) => {
  const username = request.body.username
  const hashedPassword = bcrypt.hash(request.body.password, 10)
  const name = request.body.name
  const access_rights = 'Restaurant_Staff'
  const rest_id = request.body.restId

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return res.send(error)
  }

  // pool.query('INSERT INTO Users (username, password, name, created_at, access_rights) VALUES ($1, $2, $3, $4)', [username, password, name, access_rights], (error, results) => {
  //   if (error) {
  //     throw error
  //   }

  //   response.status(201)
  // })

  pool.query('SELECT addRestaurantStaff($1, $2, $3, $4)', [username, hashedPassword, name, rest_id], (error, results) => {
    if (error) {
      throw error
    }

    response.status(201).send('Restaurant Staff added')
  })
}

const createRiderAccount = (request, response) => {
  const username = request.body.username
  const hashedPassword = bcrypt.hash(request.body.password, 10)
  const name = request.body.name
  const fullTimeBoolean = request.body.fullTimer
  const access_rights = 'Rider'

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return res.send(error)
  }

  // pool.query('INSERT INTO Users (username, password, name, created_at, access_rights) VALUES ($1, $2, $3, $4)', [username, password, name, access_rights], (error, results) => {
  //   if (error) {
  //     throw error
  //   }

  //   response.status(201)
  // })

  pool.query('SELECT addRider($1, $2, $3, $4)', [username, hashedPassword, name, fullTimeBoolean], (error, results) => {
    if (error) {
      throw error
    }

    response.status(201).send('Rider added')
  })
}

const createFDSManagerAccount = (request, response) => {
  const username = request.body.username
  const hashedPassword = bcrypt.hash(request.body.password, 10)
  const name = request.body.name
  const access_rights = 'FDS_Manager'

  const usernameCheck = pool.query('SELECT 1 FROM users WHERE username = $1', [username])

  if (usernameCheck == 1) {
    return res.send(error)
  }

  // pool.query('INSERT INTO Users (username, password, name, created_at, access_rights) VALUES ($1, $2, $3, $4)', [username, password, name, access_rights], (error, results) => {
  //   if (error) {
  //     throw error
  //   }

  //   response.status(201)
  // })

  pool.query('SELECT addFdsManager($1, $2, $3)', [username, hashedPassword, name], (error, results) => {
    if (error) {
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