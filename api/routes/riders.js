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
    // const rid = results.rows[0].rid

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
        // console.log(didArray[0].did)
        // console.log(ridArray)
        var m
        for (m = 0; (m < ridArray.length && m < didArray.length); m++) {
          // console.log('a')
          pool.query('SELECT allocateRiders($1, $2)', [didArray[m].did, ridArray[m].getavailableriders], (error, results) => {
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
  console.log(username)

  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to view orders`)
      throw error
    }
    console.log(results.rows)
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

// /delivery/:did/departfor/restaurant
const timeDepartForRest = (request, response) => {
  const { did } = request.params
  pool.query('SELECT timestamp_departForRest($1)', [did], (error, results) => {

    if (error) {
      response.status(400).send(`Unable to update depart for restaurant time`)
      throw error
    }
    response.status(200).json(`Depart time for restaurant successfully updated`)
  })
}

// /delivery/:did/arriveRest
const timeArriveAtResturant = (request, response) => {
  const { did } = request.params

  pool.query('SELECT timestamp_arriveAtRest($1)', [did], (error, results) => {

    if (error) {
      response.status(400).send(`Unable to update arrive at restaurant time`)
      throw error
    }
    response.status(200).json(`Arrive time at restaurant successfully updated`)
  })
}

// /delivery/:did/departRest
const timeDepartFromResturant = (request, response) => {
  const { did } = request.params

  pool.query('SELECT timestamp_departFromRest($1)', [did], (error, results) => {
    if (error) {
      response.status(400).send(`Unable to update departure time from restaurant`)
      throw error
    }
    response.status(200).send(`Departure time from restaurant successfully updated`)
  })
}

// /delivery/:did/delivered
const timeOrderDelivered = (request, response) => {
  const { did } = request.params

  pool.query('SELECT timestamp_orderDelivered($1)', [did], (error, results) => {
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
const submitSchedule = (request, response) => {
  const { username } = request.params
  const { shiftArray } = request.body

  const array_length = shiftArray.length
  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to sbumit schedule')
      throw error
    }
    const rid = results.rows[0].rid

    pool.query('SELECT start_time, end_time FROM Shifts WHERE rid = $1', [rid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to sbumit schedule')
        throw error
      }
      var arrayShift = results.rows
      // for (var m = 0; m < array_length; m++) {
      //   for (var k = 0; k < arrayShift.length; k++) {
      //     if (shiftArray[m].start_time > arrayShift[k].start_time && arrayShift[k].start_time.getDate() == shiftArray[m].start_time.getDate()) {

      //     }
      //   }
      // }
    })

    const rid = results.rows[0].rid
    var i = 0;
    for (i = 0; i < array_length; i++) {
      pool.query('SELECT addShift($1, $2, $3)', [rid, shiftArray[i].start_time, shiftArray[i].end_time], (error, results) => {
        if (error) {
          response.status(400).send('Unable to get schedule')
          throw error
        }
      })
    }
    
    response.status(200).send('Shifts added')
  })
  
}

// /riders/:username/monthlysummary
const getMonthlySummaryInfo = (request, response) => {
  const { username } = request.params

  pool.query('SELECT rid FROM Riders WHERE username = $1', [username], (error, results) => {
    if (error) {
      response.status(400).send('Unable to get monthly summary')
      throw error
    }
    const rid = results.rows[0].rid
    pool.query('SELECT getMonthlyRiderSummary($1)', [rid], (error, results) => {
      if (error) {
        response.status(400).send('Unable to get monthly summary')
        throw error
      }
      response.status(200).json(results.rows[0])
    })
  })
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = (a.getMinutes() < 10) ? ('0' + a.getMinutes()) : (a.getMinutes());
  var sec = (a.getSeconds() < 10) ? ('0' + a.getSeconds()) :( a.getSeconds());
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

// // /riders/:username/weeklysummary
// const getWeeklySummaryInfo = (request, response) => {
//   const { username } = request.params

//   pool.query('SELECT rid FROM riders WHERE username = $1', [username], (error, results) => {
//     if (error) {
//       response.status(400).send('ACannot get weekly summary')
//       throw error
//     } 
//     var rid = results.rows[0]
//     if (rid != null) {
//       rid = rid.rid
//       pool.query('SELECT * FROM getEarliestShift($1)', [rid], (error, results) => {
//         if (error) {
//           response.status(400).send('BUnable to get weekly summary')
//           throw error
//         }
//         // console.log(results.rows)
//         var earliest = results.rows[0]
//         console.log(results.rows[0].getearliestshift.getDay())
//         if (earliest != null) {
//           var tempArray = []
//           earliest = earliest.getearliestshift
//           tempArray.push(earliest)
//           console.log('earliest', earliest.getearliestshift)
//           var earliestDayNum = earliest.getDay()
//           console.log("earliestDayNum", earliestDayNum)
//           var howManyDaysLeft = 7 - earliestDayNum
//           console.log('howManydaysleft', howManyDaysLeft)
//           const earliestFirst = earliest
//           console.log('earliestFirst', earliestFirst)
//           var nextDate = earliest.setDate(earliest.getDate() + howManyDaysLeft)
//           console.log(typeof(nextDate))
//           nextDate = timeConverter((nextDate).toString().substring(0,10))
//           console.log('nextDate', nextDate)
//           tempArray.push(nextDate)
//           console.log('earliest first 2', earliestFirst)

//           var weekArray = []
//           weekArray.push(tempArray)
//           console.log('weeklyarray', weekArray)
//           var k = 0
//           pool.query('SELECT * FROM getLatestShift($1)', [rid], (error, results) => {
//             if (error) {
//               response.status(400).send('CUnable to get weekly summary')
//               throw error
//             }
//             var latest = results.rows[0]
//             console.log('latest', latest)
//             if (latest != null) {
//               latest = latest.getlatestshift
//               console.log('latest', latest)
//               var latestDay = latest.getDay()
//               console.log('latestDay', latestDay)
//               var howManyDaysBefore = latest - latestDay
//               console.log('howmanydaysbefore', howManyDaysBefore)
//               var latestHolder = latest
//               console.log('latestholder',latestHolder)
//               var lastWeekDate = latest.setDate(latest.getDate() - howManyDaysBefore)
//               console.log('lastweekdate', lastWeekDate)
//               var k = 0
//               var early;
//               while  (nextDate != lastWeekDate ) {
//                 var nextHolder = nextDate
//                 console.log('inside while loop: nexthodler', nextHolder)
//                 early = nextDate.setDate(nextDate.getDate() + 1)
//                 console.log('early', early)
//                 // console.log(nextDate)
//                 nextDate = nextHolder.setDate(nextHolder.getDate() + 7)
//                 console.log('iside while loop next one next date: ', nextdate)
//                 // console.log(nextDate)
//                 weekArray.push([early, nextDate])
//                 console.log('inside while loop ', weekArray)
//               }
//               lastWeekDate.setDate(lastWeekDate.getDate() + 1)
//               weekArray.push([lastWeekDate, latestHolder])
//               response.status(200).json(weekArray)
//               var lengthArray = weekArray.length
//               var resultsArray = []
//               for (var j = 0; j < lengthArray; j++) {
//                 pool.query('SELECT * FROM getridersummary($1, $2, $3)', [rid, weekArray[j][0], weekArray[j][1]], (error, results) => {
//                   if (error) {
//                     response.status(400).send('DUnable to get weekly summary')
//                     throw error
//                   }
//                   resultsArray.push(results.rows)
//                 })
//               }
//               response.status(200).json(resultsArray)
//             }
//           })
//         } else {
//           response.status(400).send('EUnable to get weekly summary')
//         }
//       })
//     } else {
//       response.status(400).send('FUnable to get weekly summary')
//     }
//   })
  
// }

module.exports = {
  login,
  viewDeliveriesHistory,
  assignOrders,
  viewAssignedDeliveries,
  timeDepartForRest,
  timeArriveAtResturant,
  timeDepartFromResturant,
  timeOrderDelivered,
  checkIfFullTime,
  viewPastSchedule,
  submitSchedule,
  getMonthlySummaryInfo
  // getWeeklySummaryInfo
}