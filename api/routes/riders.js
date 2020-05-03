const { pool } = require('../config')

// /riders/login
const login = (request, response) => {
  const username = request.body.username
  const password = request.body.password

  pool.query('SELECT authUser($1, $2)', [username, password], (error, results) => {
    if (error) {
      response.status(400).send(`Cannot Login for user ${username}. Please try again.`)
      throw error
    }
    response.status(200).send(`Successfully logged in ${username}!`)
  })
}

// /riders/:rid/orders
const viewOrdersToDeliver = (request, response) => {
  
  const status = 'ORDERED'

  pool.query('SELECT * FROM Orders WHERE status = $1', [status], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to view Orders`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /riders/:rid/orders/:oid
// const acceptOrder

module.exports = {

}