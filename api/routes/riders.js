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
      pool.query('SELECT access_right FROM Users WHERE username = $1', [username], (error, results) => {
        if (error) {
          response.status(400).send(`Cannot Login for user ${username}. Please try again.`)
          throw error
        }
        var access_right = results.rows[0].access_right
        if (access_right == 'Rider') {
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

// /riders/:username/deliveries/history
const viewDeliveriesHistory = (request, response) => {
  const { username } = request.params
  const status = 'DELIVERED'
  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to view orders`)
      throw error
    }
    const rid = results.rows[0].rid
    pool.query('SELECT d.did, d.fee, d.time_order_placed, d.time_depart_for_rest, d.time_arrive_at_rest, d.time_depart_from_rest, d.time_order_delivered, ' +
     'o.status, o.payment_method, o.restaurant_location, o.location FROM Deliveries d, Orders o WHERE o.status = $1 AND d.rid = $2 AND o.did = d.did', [status, rid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to view Orders`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /riders/:username/assign
const assignOrders = (request, response) => {
  const { username } = request.params
  const fee = 5.00
  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to assign orders`)
      throw error
    }
    const rid = results.rows[0].rid

    pool.query('SELECT did FROM Deliveries WHERE rid is null', (error, results) => {
      if (error) {
        response.status(400).send(`Unable to assign orders`)
        throw error
      }
      const didArray = results.rows
      pool.query('SELECT getAvailableRiders()', (error, results) => {
        if (error) {
          response.status(400).send(`Unable to assign orders`)
          throw error
        }
        const ridArray = results.rows
        
        var m
        for (m = 0; (m < ridArray.length || m < didArray.length); m++) {
          pool.query('SELECT allocateRiders($1, $2)', [didArray[m].did, ridArray[m].rid], (error, results) => {
            if (error) {
              response.status(400).send(`Unable to assign orders`)
              throw error
            }
          })
        }
        response.status(200).send(`Deliveries have been assigned`)
      })

    })
  })
}

// /riders/:username/deliveries/assigned
const viewAssignedDeliveries = (request, response) => {
  const { username } = request.params


  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to view orders`)
      throw error
    }
    const rid = results.rows[0].rid
    const status = 'ORDER ACCEPTED'
    pool.query('SELECT d.did, o.status, o.payment_method, o.restaurant_location, o.location FROM Deliveries d, Orders o WHERE o.status = $1 AND d.rid = $2 AND o.did = d.did', [status, rid], (error, results) => {
      if (error) {
        response.status(400).send(`Unable to view Orders`)
        throw error
      }
      response.status(200).json(results.rows)
    })
  })

}

// /riders/:username/delivery/:did/arriveRest
const timeArriveAtResturant = (request, response) => {
  const { did } = request.params

  pool.query = ('SELECT timestamp_arriveAtRest($1)', [did], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to update arrive at restaurant time`)
      throw error
    }
    response.status(200).send(`Arrive time at restaurant successfully updated`)
  })
}

// /riders/:username/delivery/:did/departRest
const timeDepartFromResturant = (request, response) => {
  const { did } = request.params

  pool.query = ('SELECT timestamp_departFromRest($1)', [did], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to update departure time from restaurant`)
      throw error
    }
    response.status(200).send(`Departure time from restaurant successfully updated`)
  })
}

// /riders/:username/delivery/:did/delivered
const timeOrderDelivered = (request, response) => {
  const { did } = request.params

  pool.query = ('SELECT timestamp_orderDelivered($1)', [did], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to order delivered time`)
      throw error
    }
    response.status(200).send(`Order delivered time successfully updated`)
  })
}

// /riders/:username/check
const checkIfFullTime = (request, response) => {
  const { username } = request.params

  pool.query('SELECT is_full_time FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to check`)
      throw error
    }

    response.status(200).json(results.rows)
  })
}

// /riders/:username/schedule
const viewPastSchedule = (request, response) => {
  const { username } = request.params

  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status.send('Unable to see past schedule')
      throw error
    }
    const rid = results.rows[0].rid
    pool.query('SELECT * FROM Shifts WHERE rid = $1', [rid], (error, results) => {
      if (error) {
        response.status.send('Unable to see past schedule')
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

// /riders/:username/schedule/submit
// const submitSchedule = (request, response) => {
//   const { username } = request.params
//   const {  }
//   pool
// }

// /riders/:username/summary
// const getSummaryInfo = (request, response) => {
  
// }

module.exports = {
  login,
  viewDeliveriesHistory,
  assignOrders,
  viewAssignedDeliveries,
  timeArriveAtResturant,
  timeDepartFromResturant,
  timeOrderDelivered,
  checkIfFullTime,
  viewPastSchedule
}