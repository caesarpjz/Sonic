const { pool } = require('../config')
// const bcrypt = require('bcrypt')

// /customer/:username/restaurant/:rest_id/order
const orderFood = (request, response) => {
  const { username, rest_id } = request.params
  // this should be an array of array. there should be food name, fid, price, quantity ORDERED (NOT QUANTITY LEFT)
  var food_array = request.body.orderList
  const array_length = food_array.length
  const { payment_method, restaurant_location, location } = request.body
  var fee = 5.00
  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to order. Please try again')
      throw error
    }
    const cid = results.rows[0].cid
    pool.query('SELECT addOrder($1, $2, $3, $4, $5)', [fee, cid, payment_method, restaurant_location, location], (error, results) => {
      if (error) {
        response.status(400).send('Unable to order. Please try again')
        throw error
      }
      const order_id = results.rows[0].addorder
      var i = 0
      for (i = 0; i < array_length; i++) {
        pool.query('SELECT addFoodToOrder($1, $2, $3)', [order_id, food_array[i].fid, food_array[i].quantity], (error, results) => {
          if (error) {
            response.status(400).send('Unable to order. Please try again')
            throw error
          }
    
          // var isAvailable = pool.query('SELECT availability FROM Food_Items WHERE fid = $1', [food_array[i].fid])
    
        })
      }
      response.status(200).send('Your Order has been placed!')
    })
  })
  
  
  
}

// /customer/login
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
      response.status(400).send(`Cannot Login for user ${username}. Wrong username or password.`)
    }
  })
 
}

// /restaurant
const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurants', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get restaurants')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restuarant/:rest_id
const getRestaurantsById = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT * FROM Restaurants WHERE rest_id = $1', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get restaurant with id ${rest_id}`)
      throw error
    }
    response.status(200).json(results.rows)
  })

}

// /customer/:username/restaurant_categories
const getRestaurantCategories = (request, response) => {
  pool.query('SELECT * FROM restaurant_categories', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get restaurant categories')
      throw error
    }

    response.status(200).json(results.rows)
  })
}

// /restaurant/rest_category/:category
const getRestaurantByCategory = (request, response) => {
  const { category } = request.params

  pool.query('SELECT * FROM Restaurant WHERE category = $1', [category], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get restaurants with category ${category}`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant/:rest_id/menus
const getMenusByRestId = (request, response) => {
  const {rest_id} = request.params

  pool.query('SELECT * FROM Menus where rest_id = $1', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get restaurant menu`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant/:rest_id/menus/:menu_id
const getFoodItemsByMenuId = (request, response) => {
  const {menu_id} = request.params

  pool.query('SELECT * FROM food_items where menu_id = $1', [menu_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get food items')
      throw error
    }
    response.status(200).json(results.rows)
  })
}


// /customer/:username/restaurant/:rest_id/menus/:menu_id/:fid
const getFoodAvailabilityByFid = (request, response) => {
  const { menu_id, fid } = request.params

  pool.query('SELECT f.name, f.availability FROM Food_Items f WHERE f.menu_id = $1 AND f.fid = $2', [menu_id, fid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get food availability with fid ${fid}`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /customer/:username/restaurant/:rest_id/menus/:menu_id/:name
const getFoodAvailabilityByName = (request, response) => {
  const { menu_id, name } = request.params

  pool.query('SELECT f.name, f.availability FROM Food_Items f WHERE f.menu_id = $1 AND f.name = $2', [menu_id, name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get food availability with name ${name}`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}


// /customer/:username/profile
const viewProfile = (request, response) => {
  const { username } = request.params
  
  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('SELECT * FROM Customers where username = $1 AND cid = $2', [username, cid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to view profile`)
        throw error
      }
  
      response.status(200).json(results.rows)
    })
  })
  
  
}

// /customer/:username/points
const getPointsById = (request, response) => {
  const { username } = request.params
  
  pool.query('SELECT * FROM Customers WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get points`)
      throw error
    }

    response.status(200).json(results.rows)
  })
}

// /customer/:username/orders
const getOrdersByCid = (request, response) => {
  const { username } = request.params
  
  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('SELECT * FROM Orders WHERE cid = $1', [cid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get orders`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })

}

// /customer/:username/orders/:did/review
const rateDeliveriesByDid = (request, response) => {
  const { username, did } = request.params
  const { rating } = request.body
  
  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('INSERT INTO customer_rates_delivery (cid, did, rating) VALUES ($1, $2, $3)', [cid, did, rating], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to set rating: ${rating} for delivery: ${did}`)
        throw error
      }
      response.status(201).send(`Delivery Rating added`)
  
    })
  })
  
}

// /customer/:username/orders/food_items/:oid
const getFoodItemsBySpecifiedOrderId = (request, response) => {
  const { oid } = request.params

  pool.query('SELECT o.fid, f.name FROM Food_Items f, Order_Contains_Food o WHERE o.oid = $1 AND o.fid = f.fid', [oid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get food items')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /customer/:username/orders/food_item/:oid/:fid/review
const reviewsFoodItems = (request, response) => {
  const { username, fid } = request.params
  const { review } = request.body

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid
    pool.query('SELECT name FROM Food_Items WHERE fid = $1', [fid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get food item name`)
        throw error
      }
      const food_name = results.rows[0].name
      pool.query('INSERT INTO reviews (cid, fid, review_desc) VALUES ($1, $2, $3)', [cid, fid, review], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to add review ${review} for food item: ${food_name}`)
          throw error
        }
        response.status(201).send(`Review sent for food item: ${food_name}`)
      })
    })
    
  })  
}

// /customer/:username/profile/insertCC
const insertCCInfo = (request, response) => {
  const { username } = request.params
  const cc_name = request.body.cc_name
  const expiryDate = request.body.expiryDate
  const num = request.body.num

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('SELECT updateCC($1, $2, $3, $4)', [cid, cc_name, expiryDate, num], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to add credit card info`)
        throw error
      }
      response.status(201).send('Credit Card Updated')
    })
  })
}

// /restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews
const viewReviews = (request, response) => {
  const { fid } = request.params
  pool.query('SELECT name FROM Food_Items WHERE fid = $1', [fid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get food item name. Please try again`)
      throw error
    }
    const food_name = results.rows[0].name

    pool.query('SELECT review_desc FROM Reviews WHERE fid = $1', [fid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get review for ${food_name}`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /customer/:username/locations
const getRecentLocations = (request, response) => {
  const { username } = request.params

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('SELECT getRecentLocations($1)', [cid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get recent locations`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /customer/:username/reviews
const getReviews = (request, response) => {
  const { username } = request.params

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('SELECT f.fid, f.name, r.review_desc FROM Reviews r, Food_Items f WHERE r.cid = $1 AND f.fid = r.fid', [cid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get food reviews`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}
// /customer/:username/reviews/:fid/delete
const deleteReviewByFid = (request, response) => {
  const { username, fid } = request.params

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('DELETE FROM Reviews WHERE cid = $1 AND fid = $2', [cid, fid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to delete food review`)
        throw error
      }
      response.status(200).send(`Food Review deleted`)
    })
  })  
}

// /customer/:username/reviews/:fid/update
const updateReviewByFid = (request, response) => {
  const { username, fid } = request.params
  const { review_desc } = request.body

  pool.query('SELECT cid FROM Customers where username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get cid`)
      throw error
    }
    const cid = results.rows[0].cid

    pool.query('UPDATE Reviews SET review_desc = $1 WHERE cid = $2 AND fid = $3', [review_desc, cid, fid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update food review to ${review_desc}`)
        throw error
      }
      response.status(200).send(`Food Review updated!`)
    })
  })  
}

// /restuarant/filter/category
const filterRestaurantByCategory = (request, response) => {
  const { category } = request.query

  pool.query('SELECT * FROM Restaurants WHERE category = $1', [category], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get restaurants in ${category} category`)
      throw error

    }
    response.status(200).json(results.rows)
  })
}

// /restuarant/filter/location
const filterRestaurantByLocation = (request, response) => {
  const { location } = request.query

  pool.query('SELECT * FROM Restaurants WHERE restaurant_location = $1', [location], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get restaurants in ${location} location`)
      throw error

    }
    response.status(200).json(results.rows)
  })
}

// /restaurant

/** POINTS TO OFFEST COST */





module.exports = {
  orderFood,
  login,
  getRestaurants,
  getRestaurantsById,
  getRestaurantCategories,
  getRestaurantByCategory,
  getMenusByRestId,
  getFoodItemsByMenuId,
  getFoodAvailabilityByFid,
  getFoodAvailabilityByName,
  viewProfile,
  getPointsById,
  getOrdersByCid,
  rateDeliveriesByDid,
  getFoodItemsBySpecifiedOrderId,
  reviewsFoodItems,
  insertCCInfo,
  viewReviews,
  getRecentLocations,
  getReviews,
  deleteReviewByFid,
  updateReviewByFid,
  filterRestaurantByCategory,
  filterRestaurantByLocation
}
