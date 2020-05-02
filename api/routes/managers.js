const { pool } = require('../config')
// const bcrypt = require('bcrypt')

// /managers/:mid/login
const managerLogin = (request, response) => {
  const username = request.body.username
  // const hashedPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password

  pool.query('SELECT authUser($1, $2)', [username, password], (error, results) => {
    if (error) {
      response.status(400).send('Cannot Login. Please try again.')
      throw error
    }
    response.status(200).send('Successfully logged in!')
  })
}

// /managers/:mid/reports
const getReportsByMid = (request, response) => {
  const { mid } = request.params
  
  pool.query('SELECT * FROM Reports WHERE mid = $1', [mid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get reports')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /managers/:mid/createpromotions
const createPromotionsByMid = (request, response) => {
  const { mid } = request.params
  const { start_time, end_time, discount_desc, in_effect } = request.body

  pool.query('SELECT addPromotionForManagers($1, $2, $3, $4, $5)', [start_time, end_time, discount_desc, mid, in_effect], (error, results) => {
    if (error) {
      response.status(400).send('Unable to create Promotion. Please try again.')
      throw error
    }
    response.status(200).send('Promotion created successfullly')

  })
}

// /managers/:mid/promotions
const getPromotionsByMid = (request, response) => {
  const { mid } = request.params

  pool.query('SELECT * FROM Managers_Has_Promotions WHERE mid = $1', [mid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get Promotions')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /managers/:mid/promotions/:pid/ineffect
const updateInEffectPromotionsByMid = (request, response) => {
  const { mid } = request.params
  const { in_effect } = request.body

  pool.query('UPDATE Managers_Has_Promotions SET in_effect = $1 WHERE mid = $2', [in_effect, mid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to update promotion')
      throw error 
    }
    response.status(201).send(`Promotion is in effect!`)
  })
}

// /managers/:mid/promotions/:pid
const updatePromotionByPid = (request, response) => {
  const { pid } = request.params
  const { start_time, end_time, discount_desc } = request.body

  if (start_time !== undefined) {
    pool.query('UPDATE Promotions SET start_time = $1 WHERE pid = $2', [start_time, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion')
        throw error

      }
      // response.status(201).send(`Promotion start time updated to ${start_time}`)
    })
  }

  if (end_time !== undefined) {
    pool.query('UPDATE Promotions SET end_time = $1 WHERE pid = $2', [end_time, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion')
        throw error
  
      }
      // response.status(201).send(`Promotion end time updated to ${end_time}`)
    })
  }

  if (discount_desc !== undefined) {
    pool.query('UPDATE Promotions SET discount_description = $1 WHERE pid = $2', [discount_desc, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion')
        throw error
      }
      // response.status(201).send(`Promotion discount description updated to ${discount_desc}`)
    })
  }

  response.status(200).send(`Promotion ${pid} has been updated`)
}

// /managers/:mid/promotions/delete/:pid
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

// /managers/:mid/createRestaurant
const createRestaurant = (request, response) => {
  const { name, info, min_spending, category, restaurant_location } = request.body

  pool.query('SELECT addRestaurant($1, $2, $3, $4, $5)', [name, info, min_spending, category, restaurant_location], (error, results) => {
    if (error) {
      response.status(400).send('Unable to create restaurant')
      throw error
    }
    response.status(200).send(`Restaurant ${name} created`)
  })
}

// /managers/:mid/restaurant
const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurants', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /managers/:mid/restaurant/:rest_id/update
const updateRestaurantInfoByRestId = (request, response) => {
  const { rest_id } = request.params
  const { name, info, min_spending, category, restaurant_location } = request.body

  if (name !== undefined) {
    pool.query('UPDATE Restaurants SET name = $1 WHERE rest_id = $2', [name, rest_id], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update restaurant name')
        throw error
      }
      
    })
  }

  if (info !== undefined) {
    pool.query('UPDATE Restaurants SET info = $1 WHERE rest_id = $2', [info, rest_id], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update restaurant info')
        throw error
      }
      
    })
  }

  if (min_spending !== undefined) {
    pool.query('UPDATE Restaurants SET min_spending = $1 WHERE rest_id = $2', [min_spending, rest_id], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update restaurant min_spending')
        throw error
      }
      
    })
  }

  if (category !== undefined) {
    pool.query('UPDATE Restaurants SET category = $1 WHERE rest_id = $2', [category, rest_id], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update restaurant category')
        throw error
      }
      
    })
  }

  if (restaurant_location !== undefined) {
    pool.query('UPDATE Restaurants SET restaurant_location = $1 WHERE rest_id = $2', [restaurant_location, rest_id], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update restaurant restaurant_location')
        throw error
      }
      
    })
  }

  response.status(200).send('Restaurant Updated')
}

// /managers/:mid/restaurant/:rest_id/delete
const deleteRestaurantByRestId = (request, response) => {
  const { rest_id } = request.params

  pool.query('DELETE FROM Restaurants WHERE rest_id = $1', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to delete restaurant')
      throw error

    }
    response.status(201).send(`Restaurant deleted`)
  })
}

// /managers/:mid/restaurant/:rest_id/staff
const createRestaurantStaff = (request, response) => {
  const { rest_id } = request.params
  const { username, password, name } = request.body

  pool.query('SELECT addRestaurantStaff($1, $2, $3, $4)', [username, password, name, rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to add staff')
      throw error

    }
    response.status(201).send(`Restaurant Staff ${name} added to Restaurant ${rest_id}`)
  })
}

// /managers/:mid/restaurant/:rest_id/restaurant_staff
const getRestaurantStaff = (request, response) => {
  const { rest_id } = request.params

  pool.query('SELECT * FROM Restaurant_Staff WHERE rest_id = $1', [rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get staff')
      throw error

    }
    response.status(201).json(results.rows)
  })
}

// /managers/:mid/restaurant/:rest_id/restaurant_staff/:rsid/delete
const deleteRestaurantStaff = (request, response) => {
  const { rest_id, rsid } = request.params
  
  pool.query('DELETE FROM Restaurant_Staff WHERE rsid = $1 AND rest_id = $2', [rsid, rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to delete staff')
      throw error

    }
    response.status(201).send(`Restaurant Staff deleted`)
  })
}

// /managers/:mid/riders
const getRiders = (request, response) => {
  pool.query('SELECT * FROM Riders', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get riders')
      throw error

    }
    response.status(201).json(results.rows)
  })
}

// /managers/:mid/riders/:rid/shifts
const getRiderShifts = (request, response) => {
  const { rid } = request.params

  pool.query('SELECT * FROM Shifts WHERE rid = $1', [rid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get rider shifts')
      throw error

    }
    response.status(201).json(results.rows)
  })
}

// /managers/:mid/riders/:rid/shifts/approval
const updateShiftApproval = (request, response) => {
  const { rid } = request.params
  const { is_approved } = request.body

  pool.query('UPDATE Shift SET is_approved = $1 WHERE rid = $2', [is_approved, rid], (error, results) => {
    if (error) {
      response.status(400).send('Unable to approve riders shift. Please try again')
      throw error

    }
    response.status(201).send('Rider Shift has been updated')
  })
}

// FOR APPROVING RIDERS SIGNUP HAVENT FINISH........
// /managers/:mid/

module.exports = {
  managerLogin,
  getReportsByMid,
  createPromotionsByMid,
  getPromotionsByMid,
  updateInEffectPromotionsByMid,
  updatePromotionByPid,
  deletePromotionByPid,
  createRestaurant,
  getRestaurants,
  updateRestaurantInfoByRestId,
  deleteRestaurantByRestId,
  createRestaurantStaff,
  getRestaurantStaff,
  deleteRestaurantStaff,
  getRiders,
  getRiderShifts,
  updateShiftApproval
}