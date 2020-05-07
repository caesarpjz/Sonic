const { pool } = require('../config')
// const bcrypt = require('bcrypt')


// /managers/login
const managerLogin = (request, response) => {
  const username = request.body.username
  // const hashedPassword = bcrypt.hash(request.body.password, 10)
  const password = request.body.password

  pool.query('SELECT authUser($1, $2)', [username, password], (error, results) => {
    if (error) {
      response.status(400).send(`Cannot Login for user ${username}. Please try again.`)
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
        if (access_right == 'FDS_Manager') {
          response.status(200).send(`Successfully logged in ${username}!`)
        } else {
          response.status(400).send(`Cannot Login for user ${username}. Wrong username or password.`)
        }
        
      })
      
    } else {
      response.status(400).send(`Cannot Login for user ${username}. Wrong username or password.`)
    }
  })

}

// /managers/:username/reports
const getReportsByMid = (request, response) => {
  const { username } = request.params

  pool.query('SELECT mid FROM FDS_Managers WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get reports for ${username} `)
      throw error
    }
    const mid = results.rows[0].mid
    pool.query('SELECT * FROM Reports WHERE mid = $1', [mid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get reports for ${username} `)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
  
}

// /managers/:username/createpromotions
const createPromotionsByMid = (request, response) => {
  const { username } = request.params
  const { start_time, end_time, discount_desc, discount_percentage } = request.body

  pool.query('SELECT mid from FDS_Managers WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create Promotion with start_time: ${start_time}, end_time: ${end_time} and discount_percentage: ${discount_percentage} for ${username}. Please try again.`)
      throw error
    }
    const mid = results.rows[0].mid
    pool.query('SELECT addPromotionForManagers($1, $2, $3, $4, $5)', [start_time, end_time, discount_desc, discount_percentage, mid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to create Promotion with start_time: ${start_time}, end_time: ${end_time}, discount_percentage: ${discount_percentage} for ${username}. Please try again.`)
        throw error
      }
      response.status(200).send('Promotion created successfullly')
  
    })
  })
}

// /managers/:username/promotions
const getPromotionsByMid = (request, response) => {
  const { username } = request.params

  pool.query('SELECT mid FROM FDS_Managers WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to get promotions for ${username} `)
      throw error
    }
    const mid = results.rows[0].mid
    pool.query('SELECT p.pid, p.start_date, p.end_date, p.type, p.discount_percentage FROM Managers_Has_Promotions mp, Promotions p WHERE mp.mid = $1 AND mp.pid = p.pid', [mid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to get promotions for ${username}`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
  
}

// /managers/promotions/:pid/validity
const checkIfManagerPromotionIsValidByPid = (request, response) => {
  const { username, pid } = request.params

  pool.query('SELECT p.start_date, p.end_date FROM Managers_Has_Promotions mp, Promotions p WHERE p.pid = $1 AND mp.pid = p.pid', [pid], (error, results) => {
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

// /managers/promotions/name/:name/validity
const checkIfPromotionIsValidByName = (request, response) => {
  const { name } = request.params

  pool.query('SELECT p.start_date, p.end_date FROM Promotions p, Managers_Has_Promotions mp WHERE p.name = $1 AND mp.pid = p.pid', [name], (error, results) => {
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


// /manager/promotions/:pid/update
const updatePromotionByPid = (request, response) => {
  const { pid } = request.params
  const { start_time, end_time, discount_desc } = request.body

  if (start_time !== undefined) {
    pool.query('UPDATE Promotions SET start_time = $1 WHERE pid = $2', [start_time, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion start time')
        throw error

      }
      // response.status(201).send(`Promotion start time updated to ${start_time}`)
    })
  }

  if (end_time !== undefined) {
    pool.query('UPDATE Promotions SET end_time = $1 WHERE pid = $2', [end_time, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion end time')
        throw error
  
      }
      // response.status(201).send(`Promotion end time updated to ${end_time}`)
    })
  }

  if (discount_desc !== undefined) {
    pool.query('UPDATE Promotions SET discount_description = $1 WHERE pid = $2', [discount_desc, pid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to update promotion discount description')
        throw error
      }
      // response.status(201).send(`Promotion discount description updated to ${discount_desc}`)
    })
  }

  response.status(200).send(`Promotion ${pid} has been updated`)
}

// /managers/promotions/delete/:pid
const deletePromotionByPid = (request, response) => {
  const { pid } = request.params

  pool.query('DELETE FROM Restaurants_Has_Promotions WHERE pid = $1', [pid], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to delete promotion ${pid}`)
      throw error

    }
    response.status(201).send(`Promotion deleted`)
  })
}

// /managers/admin/createRestaurant
const createRestaurant = (request, response) => {
  const { name, info, min_spending, category, restaurant_location } = request.body

  pool.query('SELECT addRestaurant($1, $2, $3, $4, $5)', [name, info, min_spending, category, restaurant_location], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to create restaurant ${name}`)
      throw error
    }
    response.status(200).send(`Restaurant ${name} created`)
  })
}

// /managers/restaurant
const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurants', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get restaurants')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /managers//restaurant/:rest_id/update
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

  response.status(200).send(`Restaurant ${rest_id} Updated`)
}

// /managers/restaurant/:rest_id/delete
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

// /managers/restaurant/:rest_id/staff
const createRestaurantStaff = (request, response) => {
  const { rest_id } = request.params
  const { username, password, name } = request.body

  pool.query('SELECT addRestaurantStaff($1, $2, $3, $4)', [username, password, name, rest_id], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to add staff ${username}`)
      throw error

    }
    response.status(201).send(`Restaurant Staff ${username} added to Restaurant ${rest_id}`)
  })
}

// /managers/restaurant/:rest_id/restaurant_staff
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

// /managers/restaurant/:rest_id/restaurant_staff/:rsid/delete
const deleteRestaurantStaffByRsid = (request, response) => {
  const { rest_id, rsid } = request.params
  
  pool.query('DELETE FROM Restaurant_Staff WHERE rsid = $1 AND rest_id = $2', [rsid, rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to delete staff')
      throw error

    }
    response.status(201).send(`Restaurant Staff deleted`)
  })
}

// /managers/restaurant/:rest_id/restaurant_staff/:username/delete
const deleteRestaurantStaffByUsername = (request, response) => {
  const { rest_id, username } = request.params
  
  pool.query('DELETE FROM Restaurant_Staff WHERE username = $1 AND rest_id = $2', [username, rest_id], (error, results) => {
    if (error) {
      response.status(400).send('Unable to delete staff')
      throw error

    }
    response.status(201).send(`Restaurant Staff deleted`)
  })
}

// /managers/admin/riders
const getRiders = (request, response) => {
  pool.query('SELECT * FROM Riders', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get riders')
      throw error

    }
    response.status(201).json(results.rows)
  })
}

// /managers/admin/riders/:rid/shifts
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
// const updateShiftApproval = (request, response) => {
//   const { rid } = request.params
//   const { is_approved } = request.body

//   pool.query('UPDATE Shift SET is_approved = $1 WHERE rid = $2', [is_approved, rid], (error, results) => {
//     if (error) {
//       response.status(400).send('Unable to approve riders shift. Please try again')
//       throw error

//     }
//     response.status(201).send('Rider Shift has been updated')
//   })
// }

// /managers/monthCustomerReport
const getOverviewOfNewCustomersAndOrdersForCurrMonth = (request, response) => {
  pool.query('SELECT * from getOverviewReport()', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get overview reports')
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// /managers/eachCustomerReport
const getEachCustomerReport = (request, response) => {
  pool.query('SELECT * from getAllMonthCustomerReport()', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get customer overview reports')
      throw error
    }
    
    response.status(200).json(results.rows)
  })
}

// /managers/hourlylocationreport
const getHourlyLocationReport = (request, response) => {
  const current_hour = new Date()

  pool.query('SELECT * from getHourlyLocationReport($1)', [current_hour], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get hourly location overview reports')
      throw error
    }
    
    response.status(200).json(results.rows)
  })
}

// /managers/locationreportoverview
const getLocationReportOverview = (request, response) => {
  pool.query('SELECT * from getLocationReportOverview()', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get location overview reports')
      throw error
    }
    
    response.status(200).json(results.rows)
  })
}

// /managers/riderreportoverview
const getRiderReportOverview = (request, response) => {
  pool.query('SELECT * from getRiderReport()', (error, results) => {
    if (error) {
      response.status(400).send('Unable to get location overview reports')
      throw error
    }
    
    response.status(200).json(results.rows)
  })
}

module.exports = {
  managerLogin,
  getReportsByMid,
  createPromotionsByMid,
  getPromotionsByMid,
  updatePromotionByPid,
  deletePromotionByPid,
  createRestaurant,
  getRestaurants,
  updateRestaurantInfoByRestId,
  deleteRestaurantByRestId,
  createRestaurantStaff,
  getRestaurantStaff,
  deleteRestaurantStaffByRsid,
  deleteRestaurantStaffByUsername,
  getRiders,
  getRiderShifts,
  checkIfManagerPromotionIsValidByPid,
  checkIfPromotionIsValidByName,
  getOverviewOfNewCustomersAndOrdersForCurrMonth,
  getEachCustomerReport,
  getHourlyLocationReport,
  getLocationReportOverview,
  getRiderReportOverview
}