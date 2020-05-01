const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

const restaurantsDb = require('./routes/restaurantStaffs')
const usersDb = require('./routes/users')
const customersDb = require('./routes/customers')
const managersDb = require('./routes/managers')



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.json({ info: 'Hello There!' })
})

app
  .route('/users')
  // .get(usersDb.read);

// Users


// Customers

  // Create Account
  app
    .route('/customers/signup/:name')

  // Order Food
  app
    .route('/customers')
    .post((req, res) => {
      res.send(201, req.body)
    });

  // List Restaurants
  app
  .route('/restaurants')
  // .get(restaurantsDb)

  
  // List Restaurant Categories
  app
  .route('/restaurant_categories')
  .get(customersDb.getRestaurantCategories)

// Riders


// FDS Managers


// Restaurant Staffs

  // Add Restaurant Categories
  app
  .route('/restaurant_categories')
  .post(restaurantsDb.addRestaurantCategories)

















// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})


module.exports = pool;