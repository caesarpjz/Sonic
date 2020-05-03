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
    var isUser = results.rows[0].authuser
    
    if (isUser) {
      response.status(200).send(`Successfully logged in ${username}!`)
    } else {
      response.status(400).send(`Cannot Login for user ${username}. No such username.`)
    }
  })
}

// /riders/:rid/orders
const viewOrdersNotAcceptedToDeliver = (request, response) => {
  
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
const acceptOrder = (request, response) => {
  const { rid, oid } = request.params
  var fee = 5.00

  pool.query('SELECT addDelivery($1, $2)', [rid, fee], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add delivery`)
      throw error
    }
    const did = results.rows[0].adddelivery
    const status = 'ORDER ACCEPTED'
    pool.query('UPDATE Orders SET did = $1, status = $2 WHERE oid = $3', [did, status, oid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to add delivery`)
        throw error
      }
      response.status(200).send(`Order Assigned`)
    })
  })
}


module.exports = {

}