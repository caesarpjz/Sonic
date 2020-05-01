const { pool } = require('../config')

// // Gets the restuarant that they want to search for from the application.
// router.get('restaurants/', (req, res, next) => {
//     const rest_name = req.params.name;
//     pool.query('SELECT name FROM restaurants WHERE rest_id = $1', [rest_name], (err, res) => {
//         if (err) {
//             return next(err);
//         }
//         res.send(res.rows[0]);
//     });
// });

// // Gets the points that the current customer has as of right now.
// router.get('customer/:id', (req, res, next) => {
//     pool.query('SELECT points FROM customers WHERE cid = $1', [req.params.id], (err, res) => {
//         if (err) {
//             return next(err);
//         }
//         res.send(res.rows[0]);
//     });
// });

// Inserts the order placed by the customer to the orders and order_contains_food table.
// router.put('orders/:id', (req, res, next) => {
//     const order_length = db.query('SELECT max(oid) FROM orders');
//     const delivery_length = db.query('SELECT max(did) FROM deliveries');
//     const foodArray = req.params.food;
//     const food_cost = 0.00
//     var i;
//     for (i = 0; i < foodArray.length; i++) {
//         food_cost += db.query('SELECT ')
//     }
//     const food_cost = db.query('SELECT ');

    
//     db.query(
//         'INSERT INTO ORDERS values ()',[order_length + 1, delivery_length + 1, ], (req, res, next) => {

//         }
//         );
// })

// module.exports = router;

const getRestaurantCategories = (request, response) => {
  pool.query('SELECT * FROM restaurant_categories', (error, results) => {
    if (error) {
      throw error
    }

    response.status(200).json(results.rows)
  })
}

const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurants', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getFoodItems = (request, response) => {
  pool.query('SELECT * FROM food_items', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getPointsById = (request, response) => {
  const userId = request.params.id

  pool.query('SELECT * FROM Customers WHERE id = $1', [userId], (error, results) => {
    if (error) {
      throw error
    }

    response.status(200).send(results.rows)
  })
}

const rateDeliveries = (request, response) => {
  const userId = request.params.id
  const deliveryId = request.params.deliveryId
  const { rating } = request.body

  pool.query('INSERT INTO customer_rates_delivery (cid, did, rating) VALUES ($1, $2, $3)', [userId, deliveryId, rating], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Delivery Rating added`)

  })
}
module.exports = {
  getRestaurantCategories,
  getRestaurants,
  getFoodItems,
  getPointsById,
  rateDeliveries
}
