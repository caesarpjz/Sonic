const { pool } = require('../config')
// const bcrypt = require('bcrypt')


const restaurantStaffLogin = (request, response) => {
  const username = request.body.username
  // const hashedPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password

  pool.query('SELECT authUser($1, $2)', [username, password], (error, results) => {
    if (error) {
      response.status(400).send(`Cannot login for ${username}. Please try again.`)
      throw error
    }
    var isUser = results.rows[0].authuser
   
    if (isUser) {
      pool.query('SELECT access_right FROM Users WHERE username = $1', [username], (error, results) => {
        if (error) {
          response.status(400).send(`Cannot Login for user ${username}. Please try again.`)
          throw error
        }
        var access_right = results.rows[0].access_right
        if (access_right == 'Restaurant_Staff') {
          response.status(200).send(`${username}`)
        } else {
          response.status(400).send(`Cannot Login for user ${username}. Wrong username or password.`)
        }
        
      })
      
    } else {
      response.status(400).send(`Cannot Login for user ${username}. Wrong username or password.`)
    }
  })
  
}

const changePassword = (request, response) => {
  const username = request.body.username
  // const newPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password

  pool.query('SELECT updatePassword($1, $2)', [username, password], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to change password for user ${username}`)
      throw error
    }
    response.status(200).send(`Password changed successfully. Hello ${username}`)
  })
}

const getRestaurantInfoById = (request, response) => {
  const { username } = request.params
  pool.query('SELECT rs.rest_id, r.name, r.info, r.min_spending, r.category from Restaurants r, Restaurant_Staff rs WHERE rs.username = $1 AND rs.rest_id = r.rest_id',
    [username], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get restaurants`)
        throw error
      }
      response.status(200).json(results.rows[0])
    })
}

const updateRestaurantById = (request, response) => {
  const { rest_id } = request.params
  const { name, min_spending, category, info } = request.body

  if (name !== undefined) {
    pool.query('UPDATE Restaurants SET name = $1 WHERE rest_id = $2', [name, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant name`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s name has been updated to ${name}`)
    })
  }
  

  if (min_spending !== undefined) {
    pool.query('UPDATE Restaurants SET min_spending = $1 WHERE rest_id = $2', [min_spending, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restuarant minimum spending`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s minimum spending has been updated to ${min_spending}`)
    })
  }

  if (info !== undefined) {
    pool.query('UPDATE Restaurants SET info = $1 WHERE rest_id = $2', [info, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant info`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s name has been updated to ${info}`)
    })
  }

  if (category !== undefined) {
    pool.query('UPDATE Restaurants SET category = $1 WHERE rest_id = $2', [category, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant category`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s category has been updated to ${category}`)
    })
  }

  response.status(201).send(`Restaurant has been updated`)
}

// /restaurant_staff/:username/restauarant/:rest_id/menus
const getMenuNameById = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT r.name, m.menu_id, m.name from Restaurants r, Menus m WHERE r.rest_id = $1 AND r.rest_id = m.rest_id',
    [rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get menu names`)
        throw error
      }
      response.status(200).json(results.rows)
    })
}

// /restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/foods
const getFoodItemByMenuId = (request, response) => {
  const { menu_id } = request.params

  pool.query('SELECT m.name, f.fid, f.quantity, f.daily_limit, f.name, f.price, f.category FROM Food_Items f, Menus m WHERE m.menu_id = $1 AND f.menu_id = m.menu_id', [menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get food items`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /resturant
// /restaurant_staff/:username/restaurant/:rest_id/:menu_id
const updateMenuNameByMenuId = (request, response) => {
  const { menu_id } = request.params
  const { new_name } = request.body
  console.log(new_name)

  pool.query('UPDATE Menus SET name = $1 WHERE menu_id = $2', [new_name, menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to update menu name`)
      throw error
    }
    response.status(200).send("Menu name changed successfully")
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/addMenu
const addMenu = (request, response) => {
  const { rest_id } = request.params
  const { menu_name } = request.body
  pool.query('SELECT addMenu($1, $2)', [rest_id, menu_name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add menu`)
      throw error
    }
    response.status(200).send(`Menu added!`)
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id
const addFoodItemIntoMenu = (request, response) => {
  const { menu_id } = request.params
  const { quantity, daily_limit, name, price, category } = request.body

  pool.query('SELECT addFoodItem($1, $2, $3, $4, $5, $6)', [quantity, daily_limit, name, price, menu_id, category], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add food item into menu`)
      throw error
    }
    response.status(201).send(`Food Item  added`)
  })
}

// /restuarant_staff/:username/restaurant/:rest_id/delete/:menu_id
const removeMenuByMenuId = (request, response) => {
  const { rest_id, menu_id } = request.params

  pool.query('DELETE From Food_Items WHERE menu_id = $1', [menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to delete menu`)
      throw error
    }
    pool.query('DELETE FROM Menus WHERE rest_id = $1 AND menu_id = $2', [rest_id, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to delete menu`)
        throw error
      }
      response.status(200).send(`Menu successfully deleted`)
    })
  })
  
}

// /restaurant_staff/restaurant/:rest_id/:menu_id/food/:fid/deletefood
const removeFoodByFid = (request, response) => {
  const { menu_id, fid } = request.params

  pool.query('DELETE FROM Food_Items WHERE menu_id = $1 AND fid = $2', [menu_id, fid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to delete food item`)
      throw error
    }
    response.status(200).send(`Food Item deleted!`)
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/:fid
const updateFoodItemByMenuIdAndFid = (request, response) => {
  const { menu_id, fid } = request.params
  const { quantity, daily_limit, name, price, category } = request.body

  pool.query('SELECT name FROM Food_Items WHERE fid = $1', [fid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to Food Item. Please try again`)
      throw error
    }

    const food_name = results.rows[0].name
    if (name !== undefined) {
      pool.query('UPDATE Food_Items SET name = $1 WHERE fid = $2 AND menu_id = $3', [name, fid, menu_id], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to update name. Please try again`)
          throw error
        }
        // response.status(201).send(`Food ${fid} successfully updated`)
      })
    }
  
  
    if (quantity !== undefined) {
      pool.query('UPDATE Food_Items SET quantity = $1 WHERE fid = $2 AND menu_id = $3', [quantity, fid, menu_id], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to update quantity. Please try again`)
          throw error
        }
        // response.status(201).send(`Food ${fid} successfully updated`)
      })
    }
  
    if (daily_limit !== undefined) {
      pool.query('UPDATE Food_Items SET daily_limit = $1 WHERE fid = $2 AND menu_id = $3', [daily_limit, fid, menu_id], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to update daily limit. Please try again`)
          throw error
        }
        // response.status(201).send(`Food ${fid} successfully updated`)
      })
    }
  
   
  
    if (price !== undefined) {
      pool.query('UPDATE Food_Items SET price = $1 WHERE fid = $2 AND menu_id = $3', [price, fid, menu_id], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to update price. Please try again.`)
          throw error
        }
        // response.status(201).send(`Food ${fid} successfully updated`)
      })
    }
  
    if (category !== undefined) {
      pool.query('UPDATE Food_Items SET category = $1 WHERE fid = $2 AND menu_id = $3', [category, fid, menu_id], (error, results) => {
        if (error) {
          response.status(400).send(`Unable to update category. Please try again.`)
          throw error
        }
        // response.status(201).send(`Food ${fid} successfully updated`)
      })
    }
    console.log("Test")
    response.status(200).send(`Food Item has been updated`)
  })
  
}

// /restaurant_staff/:username/restaurant/:rest_id/promotions
const createPromotionsByRestId = (request, response) => {
  const { rest_id } = request.params
  const { start_time, end_time, discount_desc, discount_percentage, name } = request.body

  pool.query('SELECT addRestaurantPromotion($1, $2, $3, $4, $5)', [start_time, end_time, discount_desc, discount_percentage, name, rest_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create Promotion. Please try again.`)
      throw error
    }
    response.status(200).send('Promotion created successfullly')

  })
}


// /restaurant_staff/:username/restaurant/:rest_id/promotionslist
const getPromotionsByRestId = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT p.name, p.pid, p.start_date, p.end_date, p.type, p.discount_percentage FROM Restaurants_Has_Promotions rp, Promotions p WHERE rest_id = $1 AND rp.pid = p.pid', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get Promotions')
      throw error
    }
    const array_length = 
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/promotions/:pid/validity
const checkIfRestaurantPromotionIsValidByPid = (request, response) => {
  const { username, pid } = request.params

  pool.query('SELECT start_date, end_date FROM Promotions WHERE pid = $1', [pid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get validity`)
      throw error
    }
    const start_date = results.rows[0].start_date
    const end_date = results.rows[0].end_date
    if (start_date >= (new Date()) && end_date <= (new Date())) {
      response.status(200).send(`Valid`)
    } else {
      response.status(400).send('Not Valid')
    }
  })

}

// /restaurant_staff/promotions/name/:name/validity
// const checkIfRestaurantPromotionIsValidByName = (request, response) => {
//   const { name } = request.params

//   pool.query('SELECT start_date, end_date FROM Promotions WHERE name = $1', [name], (error, results) => {
//     if (error) {
//       response.status(400).send(`Unable to get validity`)
//       throw error
//     }
//     const start_date = results.rows[0].start_date
//     const end_date = results.rows[0].end_date
//     if (start_date >= (new Date()) && end_date <= (new Date())) {
//       response.status(200).send(`Valid`)
//     } else {
//       response.status(400).send('Not Valid')
//     }
//   })
// }

// /restaurant_staff/:username/restaurant/:rest_id/promotions/:pid
const updatePromotionByPid = (request, response) => {
  const { pid } = request.params
  const { start_date, end_date, discount_percentage, promo_code } = request.body

  if (start_date !== undefined) {
    pool.query('UPDATE Promotions SET start_date = $1 WHERE pid = $2', [start_date, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion start time`)
        throw error

      }
      // response.status(201).send(`Promotion start time updated to ${start_time}`)
    })
  }

  if (end_date !== undefined) {
    pool.query('UPDATE Promotions SET end_date = $1 WHERE pid = $2', [end_date, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion end time`)
        throw error
  
      }
      // response.status(201).send(`Promotion end time updated to ${end_time}`)
    })
  }

  if (discount_percentage !== undefined) {
    pool.query('UPDATE Promotions SET discount_percentage = $1 WHERE pid = $2', [discount_percentage, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion discount description`)
        throw error
      }
      // response.status(201).send(`Promotion discount description updated to ${discount_desc}`)
    })
  }

  if (promo_code !== undefined) {
    pool.query('UPDATE Promotions SET name = $1 WHERE pid = $2', [promo_code, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion name`)
        throw error
      }
    })
  }
  response.status(200).send(`Promotion has been updated`)
}

// /restaurant_staff/:username/restaurant/:rest_id/promotions/delete/:pid
const deletePromotionByPid = (request, response) => {
  const { pid } = request.params

  pool.query('DELETE FROM Restaurants_Has_Promotions WHERE pid = $1', [pid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to delete promotion')
      throw error

    }
    response.status(201).send(`Promotion deleted`)
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews
const retrieveReviews = (request, response) => {
  const { fid } = request.params

  pool.query('SELECT * from Reviews WHERE fid = $1', [fid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get reviews')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/:username/restaurant/:rest_id/orders
const getRestaurantOrders = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT getRestOrders($1)', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get orders')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/currentmonthsummary
const getOrderSummaryBasedOnCurrentMonthNumber = (request, response) => {
  const { username } = request.params

  pool.query('SELECT rest_id FROM Restaurant_Staff WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get current month order summary')
      throw error

    }
    const rest_id = results.rows[0].rest_id

    pool.query('SELECT getCurrMonthOrderSummary($1)', [rest_id], (error, results) => {
      
      if (error) {
        response.status(400).send('Unable to get  current month order summary')
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /restaurant_staff/allsummary
const getAllOrderSummary = (request, response) => {
  const { username } = request.params

  pool.query('SELECT rest_id FROM Restaurant_Staff WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get order summary for all months')
      throw error

    }
    const rest_id = results.rows[0].rest_id

    pool.query('SELECT getAllMonthOrderSummary($1)', [rest_id], (error, results) => {
      
      if (error) {
        response.status(400).send('Unable to get order summary for all months')
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /restaurant_staff//currentmonthtopfive
const getTopFiveFoodSummaryBasedOnCurrentMonthNumber = (request, response) => {
  const { username } = request.params

  pool.query('SELECT rest_id FROM Restaurant_Staff WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get top five favourite food summary')
      throw error

    }
    const rest_id = results.rows[0].rest_id

    pool.query('SELECT getCurrMonthTopFive($1)', [rest_id], (error, results) => {
      
      if (error) {
        response.status(400).send('Unable to get top five favourite food summary')
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /restaurant_staff/:pid/promosummary
const getPromoSummaryBasedOnPid = (request, response) => {
  const { pid } = request.params

  pool.query('SELECT getPromoSummary($1)', [pid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get top five favourite food summary')
      throw error

    }
    response.status(200).json(results.rows)

  })
}

module.exports = {
    restaurantStaffLogin,
    changePassword,
    getRestaurantInfoById,
    updateRestaurantById,
    getMenuNameById,
    getFoodItemByMenuId,
    updateMenuNameByMenuId,
    addMenu,
    addFoodItemIntoMenu,
    removeFoodByFid,
    removeMenuByMenuId,
    updateFoodItemByMenuIdAndFid,
    createPromotionsByRestId,
    getPromotionsByRestId,
    updatePromotionByPid,
    deletePromotionByPid,
    retrieveReviews,
    checkIfRestaurantPromotionIsValidByPid,
    // checkIfRestaurantPromotionIsValidByName,
    getRestaurantOrders,
    getOrderSummaryBasedOnCurrentMonthNumber,
    getAllOrderSummary,
    getTopFiveFoodSummaryBasedOnCurrentMonthNumber,
    getPromoSummaryBasedOnPid
}
