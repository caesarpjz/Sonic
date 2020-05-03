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
      response.status(200).send(`Successfully logged in ${username}!`)
    } else {
      response.status(400).send(`Cannot Login for user ${username}. No such username.`)
    }
  })
  
}

const changePassword = (request, response) => {
  const username = request.body.username
  // const newPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password

  pool.query('SELECT updatePassword($1, $2)', [username, password], (erro, results) => {
    if (error) {
      response.status(400).send(`Unable to change password for user ${username}`)
      throw error
    }
    response.status(200).send(`Password changed successfully. Hello ${username}`)
  })
}

const getRestaurantInfoById = (request, response) => {
  const { rsid } = request.params
  //console.log(request.query)
  pool.query('SELECT rs.rest_id, r.name, r.info, r.min_spending, r.category from Restaurants r, Restaurant_Staff rs WHERE rsid = $1 AND rs.rest_id = r.rest_id',
    [rsid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get restaurants`)
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const updateRestaurantById = (request, response) => {
  const { rest_id } = request.params
  const { name, min_spending, category, info } = request.body

  if (name !== undefined) {
    pool.query('UPDATE Restaurants SET name = $1 WHERE rest_id = $2', [name, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant name to ${name}`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s name has been updated to ${name}`)
    })
  }
  
  const current_name = pool.query('SELECT name FROM Restaurants WHERE rest_id = $1', [rest_id])

  if (min_spending !== undefined) {
    pool.query('UPDATE Restaurants SET min_spending = $1 WHERE rest_id = $2', [min_spending, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restuarant minimum spending to ${min_spending}`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s minimum spending has been updated to ${min_spending}`)
    })
  }

  if (info !== undefined) {
    pool.query('UPDATE Restaurants SET info = $1 WHERE rest_id = $2', [info, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant info to ${info}`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s name has been updated to ${info}`)
    })
  }

  if (category !== undefined) {
    pool.query('UPDATE Restaurants SET category = $1 WHERE rest_id = $2', [category, rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update restaurant category to ${category}`)
        throw error
      }
      // response.status(201).json(`Restaurant ${rest_id}'s category has been updated to ${category}`)
    })
  }

  response.status(201).send(`Restaurant ${current_name} has been updated`)
}

// /restaurant_staff/:rsid/restauarant/:rest_id/menus
const getMenuNameById = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT r.name, m.menu_id, m.name from Restaurants r, Menu m WHERE r.rest_id = $1 AND r.rest_id = m.rest_id',
    [rest_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get menu names`)
        throw error
      }
      response.status(200).json(results.rows)
    })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/foods
const getFoodItemByMenuId = (request, response) => {
  const { menu_id } = request.params

  pool.query('SELECT f.fid, f.name FROM Food_Items f, Menus m WHERE m.menu_id = $1 AND f.menu_id = m.menu_id', [menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get food items`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/:menu_id
const updateMenuNameByMenuId = (request, response) => {
  const { menu_id } = request.params
  const { new_name } = request.body

  pool.query('UPDATE Menus SET name = $1 WHERE menu_id = $2', [new_name, menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to update menu name to ${new_name}`)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/addMenu
const addMenu = (request, response) => {
  const { rest_id } = request.params
  const { menu_name } = request.body

  pool.query('SELECT addMenu($1, $2)', [rest_id, menu_name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add menu ${menu_name}`)
      throw error
    }
    response.status(200).send(`Menu ${menu_name} added!`)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id
const addFoodItemIntoMenu = (request, response) => {
  const { menu_id } = request.params
  const { quantity, daily_limit, name, price } = request.body

  pool.query('SELECT addFoodItem($1, $2, $3, $4, $5)', [quantity, daily_limit, name, price, menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add food item ${name} into menu`)
      throw error
    }
    response.status(201).send(`Food Item ${name} added`)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/delete/:menu_name
const removeMenuByName = (request, response) => {
  const { rest_id } = request.params
  const { menu_name } = request.body

  pool.query('DELETE FROM Menus WHERE rest_id = $1 AND name = $2', [rest_id, menu_name], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to delete menu ${menu_name}`)
      throw error
    }
    response.status(200).send(`Menu ${menu_name} successfully deleted`)
  })
}

// /restuarant_staff/:rsid/restaurant/:rest_id/delete/:menu_id
const removeMenuByMenuId = (request, response) => {
  const { rest_id, menu_id } = request.params

  pool.query('DELETE FROM Menus WHERE rest_id = $1 AND menu_id = $2', [rest_id, menu_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to delete menu with id ${menu_id}`)
      throw error
    }
    response.status(200).send(`Menu ${menu_name} successfully deleted`)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/:fid
const updateFoodItemByMenuIdAndFid = (request, response) => {
  const { menu_id, fid } = request.params
  const { quantity, daily_limit, name, price, availability } = request.body

  if (name !== undefined) {
    pool.query('UPDATE Food_Items SET name = $1 WHERE fid = $2 AND menu_id = $3', [name, fid, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update name to ${name}. Please try again`)
        throw error
      }
      // response.status(201).send(`Food ${fid} successfully updated`)
    })
  }

  const food_name = pool.query('SELECT name FROM Food_Items WHERE fid = $1', [fid])

  if (quantity !== undefined) {
    pool.query('UPDATE Food_Items SET quantity = $1 WHERE fid = $2 AND menu_id = $3', [quantity, fid, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update quantity for ${food_name}. Please try again`)
        throw error
      }
      // response.status(201).send(`Food ${fid} successfully updated`)
    })
  }

  if (daily_limit !== undefined) {
    pool.query('UPDATE Food_Items SET daily_limit = $1 WHERE fid = $2 AND menu_id = $3', [daily_limit, fid, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update daily limit for ${food_name}. Please try again`)
        throw error
      }
      // response.status(201).send(`Food ${fid} successfully updated`)
    })
  }

 

  if (price !== undefined) {
    pool.query('UPDATE Food_Items SET price = $1 WHERE fid = $2 AND menu_id = $3', [price, fid, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update price for ${food_name}. Please try again.`)
        throw error
      }
      // response.status(201).send(`Food ${fid} successfully updated`)
    })
  }

  if (availability !== undefined) {
    pool.query('UPDATE Food_Items SET availability = $1 WHERE fid = $2 AND menu_id = $3', [availability, fid, menu_id], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update availability ${food_name}. Please try again.`)
        throw error
      }
      // response.status(201).send(`Food ${fid} successfully updated`)
    })
  }

  response.status(200).send(`Food Item ${food_name} has been updated`)
}

// /restaurant_staff/:rsid/restaurant/:rest_id/promotions
const createPromotionsByRestId = (request, response) => {
  const { rest_id } = request.params
  const { start_time, end_time, discount_desc, in_effect } = request.body

  pool.query('SELECT addPromotion($1, $2, $3, $4, $5)', [start_time, end_time, discount_desc, rest_id, in_effect], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create Promotion with start_time: ${start_time}, end_time: ${end_time} and discount_description: ${discount_desc}. Please try again.`)
      throw error
    }
    response.status(200).send('Promotion created successfullly')

  })
}


// /restaurant_staff/:rsid/restaurant/:rest_id/promotionslist
const getPromotionsByRestId = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT * FROM Restaurants_Has_Promotions WHERE rest_id = $1', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get Promotions')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/promotionslist/:pid
const updateInEffectPromotionsByRestId = (request, response) => {
  const { rest_id, pid } = request.params
  const { in_effect } = request.body

  pool.query('UPDATE Restaurants_Has_Promotions SET in_effect = $1 WHERE rest_id = $2 AND pid = $3', [in_effect, rest_id, pid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to update promotion')
      throw error 
    }
    response.status(201).send(`Promotion is in effect!`)
  })
}

// /restaurant_staff/:rsid/restaurant/:rest_id/promotions/:pid
const updatePromotionByPid = (request, response) => {
  const { pid } = request.params
  const { start_time, end_time, discount_desc } = request.body

  if (start_time !== undefined) {
    pool.query('UPDATE Promotions SET start_time = $1 WHERE pid = $2', [start_time, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion start time to ${start_time}`)
        throw error

      }
      // response.status(201).send(`Promotion start time updated to ${start_time}`)
    })
  }

  if (end_time !== undefined) {
    pool.query('UPDATE Promotions SET end_time = $1 WHERE pid = $2', [end_time, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion end time to ${end_time}`)
        throw error
  
      }
      // response.status(201).send(`Promotion end time updated to ${end_time}`)
    })
  }

  if (discount_desc !== undefined) {
    pool.query('UPDATE Promotions SET discount_description = $1 WHERE pid = $2', [discount_desc, pid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to update promotion discount description to ${discount_desc}`)
        throw error
      }
      // response.status(201).send(`Promotion discount description updated to ${discount_desc}`)
    })
  }

  response.status(200).send(`Promotion ${pid} has been updated`)
}

// /restaurant_staff/:rsid/restaurant/:rest_id/promotions/delete/:pid
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

// /restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews
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

/** SPACE FOR DIFFERENT GENERATING SUMMARY INFOOOOOOOOOOOOOOOOOOOOOO  BUT HOWWWWWWWWWW*/


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
    removeMenuByMenuId,
    removeMenuByName,
    updateFoodItemByMenuIdAndFid,
    createPromotionsByRestId,
    getPromotionsByRestId,
    updateInEffectPromotionsByRestId,
    updatePromotionByPid,
    deletePromotionByPid,
    retrieveReviews
}
