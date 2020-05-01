const { pool } = require('../config')



const addRestaurantCategories = (request, response) => {
  const { category } = request.body

  pool.query('INSERT INTO restaurant_categories (category) VALUES ($1)', [category], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Categories added.' })

  })
}

module.exports = {
    addRestaurantCategories
}
