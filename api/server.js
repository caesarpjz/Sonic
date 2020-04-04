const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const read = require('./routes/users')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getBooks = (request, response) => {
  pool.query('SELECT * FROM restaurant_categories', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addBook = (request, response) => {
  const { categories } = request.body

  pool.query('INSERT INTO restaurant_categories (category) VALUES ($1)', [categories], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Categories added.' })
  })
}

app
  .route('/restaurant_categories')
  // GET endpoint
  .get(getBooks)
  // POST endpoint
  .post(addBook)

app
  .route('/users')
  .get(read);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})


module.exports = pool;