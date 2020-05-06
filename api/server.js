const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

const restaurantsDb = require('./routes/restaurantStaffs')
const usersDb = require('./routes/users')
const customersDb = require('./routes/customers')
const managersDb = require('./routes/managers')
const ridersDb = require('./routes/riders')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.json({ info: 'Hello There!' })
})

/* Users */

  //Create Customer Account
  app
  .route('/customers')
  .post(usersDb.createCustomerAccount)

  app
  .route('/restaurant_staff')
  .post(usersDb.createRestaurantStaffAccount)

  app
  .route('/FdsManagers')
  .post(usersDb.createFDSManagerAccount)

  app
  .route('/riders')
  .post(usersDb.createRiderAccount)


/* Customers */

    // Create Account
    app
    .route('/customer/signup/')
    .post(usersDb.createCustomerAccount)

    // Order Food
    app
    .route('/customer/:username/restaurant/:rest_id/order')
    .post(customersDb.orderFood)

    // Login
    app
    .route('/customer/login')
    .post(customersDb.login)

    // List Restaurants
    app
    .route('/restaurant')
    .get(customersDb.getRestaurants)
    
    // List Restaurants By Id
    app
    .route('/restaurant/:rest_id')
    .get(customersDb.getRestaurantsById)

    // List Restaurant Categories
    app
    .route('/restaurant_categories')
    .get(customersDb.getRestaurantCategories)

    // Get Restaurants By category
    app
    .route('/restaurant/rest_category/:category')
    .get(customersDb.getRestaurantByCategory)

    // View Menus By Rest Id
    app
    .route('/restaurant/:rest_id/menus')
    .get(customersDb.getMenusByRestId)

    // View Food Items
    app
    .route('/restaurant/:rest_id/menus/:menu_id')
    .get(customersDb.getFoodItemsByMenuId)

    // Get Food Avail By Fid
    app
    .route('/customer/:username/restaurant/:rest_id/menus/:menu_id/:fid')
    .get(customersDb.getFoodAvailabilityByFid)

    // Get Food Avail By Name
    app
    .route('/customer/:username/restaurant/:rest_id/menus/:menu_id/:name')
    .get(customersDb.getFoodAvailabilityByName)

    // View Profile
    app
    .route('/customer/:username/profile')
    .get(customersDb.viewProfile)

    // Retrives Points
    app
    .route('/customer/:username/points')
    .get(customersDb.getPointsById)

    // Get Orders By Cid
    app
    .route('/customer/:username/orders')
    .get(customersDb.getOrdersByCid)

    // Rates Deliveries by Did
    app
    .route('/customer/:username/orders/:did/review')
    .post(customersDb.rateDeliveriesByDid)

    // Get Food Items by Order Id
    app
    .route('/customer/:username/orders/food_items/:oid')
    .get(customersDb.getFoodItemsBySpecifiedOrderId)

    // Reviews Food Items
    app
    .route('/customer/:username/orders/food_item/:oid/:fid/review')
    .post(customersDb.reviewsFoodItems)

    // Insert CC Info
    app
    .route('/customer/:username/profile/insertCC')
    .post(customersDb.insertCCInfo)

    // View Restaurant Food Item Reviews For EVERYONE to see
    app
    .route('/restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews')
    .get(customersDb.viewReviews)

    // Get 5 recent locations
    app
    .route('/customer/:username/locations')
    .get(customersDb.getRecentLocations)

    // Get Reviews posted by self
    app
    .route('/customer/:username/reviews')
    .get(customersDb.getReviews)

    // Delete Own Review
    app
    .route('/customer/:username/reviews/:fid/delete')
    .delete(customersDb.deleteReviewByFid)

    // Update Own Review
    app
    .route('/customer/:username/reviews/:fid/update')
    .post(customersDb.updateReviewByFid)

    // Filter Restaurant By Category
    app
    .route('/restaurant/filter/category')
    .get(customersDb.filterRestaurantByCategory)
    
    // Filter Restaurant By Location
    app
    .route('/restaurant/filter/location')
    .get(customersDb.filterRestaurantByLocation)

    // Get Total Payable
    app
    .route('/customer/:username/orders/:oid/cost')
    .get(customersDb.getTotalPayable)

    // Points offset Cost
    app
    .route('/customer/:username/usepoints')
    .post(customersDb.offsetRewardPoints)

/***** Riders *****/
    // Riders Login
    app
    .route('/riders/login')
    .post(ridersDb.login)

    // View Delivery History
    app
    .route('/riders/:username/deliveries/history')
    .get(ridersDb.viewDeliveriesHistory)

    // Auto Assign of deliveries/orders
    app
    .route('/riders/:username/assign')
    .get(ridersDb.assignOrders)

    // View Assigned Deliveries
    app
    .route('/riders/:username/deliveries/assigned')
    .get(ridersDb.viewAssignedDeliveries)

    // Button function for time arrive at restaurant
    app
    .route('/delivery/:did/arriveRest')
    .get(ridersDb.timeArriveAtResturant)

    // Button function for time depart from restaurant
    app
    .route('/delivery/:did/departRest')
    .get(ridersDb.timeDepartFromResturant)

    // Button function for time order has been delivered
    app
    .route('/delivery/:did/delivered')
    .get(ridersDb.timeOrderDelivered)

    // Check if rider is Full time
    app
    .route('/riders/:username/check')
    .get(ridersDb.checkIfFullTime)

    // View Past Schedule
    app
    .route('/riders/:username/schedule')
    .get(ridersDb.viewPastSchedule)

    // Submit Schedule

    // Check Salary for range period

/***** FDS Managers *****/

    // Manager Login
    app
    .route('/managers/login')
    .post(managersDb.managerLogin)

    // Get Reports
    app
    .route('/managers/:username/reports')
    .get(managersDb.getReportsByMid)

    // Create Promotions
    app
    .route('/managers/:username/createpromotions')
    .post(managersDb.createPromotionsByMid)

    // Get Promotions By Mid
    app
    .route('/managers/:username/promotions')
    .get(managersDb.getPromotionsByMid)

    // Check if manager Promotion is valid by pid
    app
    .route('/managers/promotions/:pid/validity')
    .get(managersDb.checkIfManagerPromotionIsValidByPid)

    // Check if manager promotion is valid by name
    app
    .route('/managers/:username/promotions/name/:name/validity')
    .get(managersDb.checkIfPromotionIsValidByName)

    // Update Promotion by Pid
    app
    .route('/managers/promotions/:pid/update')
    .post(managersDb.updatePromotionByPid)

    // Delete Promotions By Pid
    app
    .route('/managers/promotions/delete/:pid')
    .delete(managersDb.deletePromotionByPid)

    // Create Restaurant
    app
    .route('/managers/admin/createRestaurant')
    .post(managersDb.createRestaurant)

    // Get Restaurants
    app
    .route('/managers/restaurant')
    .get(managersDb.getRestaurants)

    // Update Restaurant Info
    app
    .route('/managers/restaurant/:rest_id/update')
    .post(managersDb.updateRestaurantInfoByRestId)

    // Delete Restaurant By Rest Id
    app
    .route('/managers/restaurant/:rest_id/delete')
    .delete(managersDb.deleteRestaurantByRestId)

    // Create Restaurant Staff
    app
    .route('/managers/restaurant/:rest_id/staff')
    .post(managersDb.createRestaurantStaff)

    // Get Restaurant Staff
    app
    .route('/managers/restaurant/:rest_id/restaurant_staff')
    .get(managersDb.getRestaurantStaff)

    // Delete Restaurant Staff
    app
    .route('/managers/restaurant/:rest_id/restaurant_staff/:rsid/delete')
    .delete(managersDb.deleteRestaurantStaffByRsid)

    // Delete Restaurant Staff by username
    app
    .route('/managers/restaurant/:rest_id/restaurant_staff/:username/delete')
    .delete(managersDb.deleteRestaurantStaffByUsername)

    // Get Riders
    app
    .route('/managers/admin/riders')
    .get(managersDb.getRiders)

    // Get Riders Shifts
    app
    .route('/managers/admin/riders/:rid/shifts')
    .get(managersDb.getRiderShifts)

    // Update Riders Shift Approval
    // app
    // .route('/managers/:username/riders/:rid/shifts/approval')
    // .post(managersDb.updateShiftApproval)

    // Get Overview of Total New Customers and orders for current month
    app
    .route('/managers/monthCustomerReport')
    .get(managersDb.getOverviewOfNewCustomersAndOrdersForCurrMonth)

    // Get Customer Report
    app
    .route('/managers/eachCustomerReport')
    .get(managersDb.getEachCustomerReport)

    // Get Hourly Location report
    app
    .route('/managers/hourlylocationreport')
    .get(managersDb.getHourlyLocationReport)

    // Get Location Report overview
    app
    .route('/managers/locationreportoverview')
    .get(managersDb.getLocationReportOverview)

    // Get Rider report overview
    app
    .route('/managers/riderreportoverview')
    .get(managersDb.getRiderReportOverview)


/***** Restaurant Staffs *****/

    // Staff Login
    app
    .route('/restaurant_staff/login')
    .post(restaurantsDb.restaurantStaffLogin)

    // Staff Change Password
    app
    .route('/restaurant_staff/changePassword')
    .post(restaurantsDb.changePassword)

    // Get Restaurants that the Staff works at
    app
    .route('/restaurant_staff/:username/restaurant')
    .get(restaurantsDb.getRestaurantInfoById)

    // Update Name, Min_spending, Info, Category of Restaurant
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id')
    .post(restaurantsDb.updateRestaurantById)

    // Get Menu By Restauarant Id
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/menus')
    .get(restaurantsDb.getMenuNameById)

    // Get Food Item by Menu Id
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/foods')
    .get(restaurantsDb.getFoodItemByMenuId)

    // Update Menu Name by Menu Id
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/:menu_id')
    .post(restaurantsDb.updateMenuNameByMenuId)

    // Add Menu
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/add/menu')
    .post(restaurantsDb.addMenu)

    // Add Food Item into Menu
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/addfood')
    .post(restaurantsDb.addFoodItemIntoMenu)

    // Remove Food by fid
    app
    .route('/restaurant_staff/restaurant/:rest_id/:menu_id/food/:fid/deletefood')
    .delete(restaurantsDb.removeFoodByFid)
    
    // Remove Menu by Menu Id
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/deleteid/:menu_id')
    .delete(restaurantsDb.removeMenuByMenuId)

    // Update Food Item by Menu Id and Fid
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/:fid')
    .post(restaurantsDb.updateFoodItemByMenuIdAndFid)

    // Create Promotions
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/promotions')
    .post(restaurantsDb.createPromotionsByRestId)

    // Get Promos
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/promotionslist')
    .get(restaurantsDb.getPromotionsByRestId)

    // Check if restaurant Promotion is valid by pid
    app
    .route('/restaurant_staff/promotions/:pid/validity')
    .get(restaurantsDb.checkIfRestaurantPromotionIsValidByPid)

    // Check if restaurant promotion is valid by name
    app
    .route('/restaurant_staff/promotions/name/:name/validity')
    .get(restaurantsDb.checkIfRestaurantPromotionIsValidByName)

    // Update Promotions
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/promotions/:pid')
    .post(restaurantsDb.updatePromotionByPid)

    // Delete Promos
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/promotions/delete/:pid')
    .delete(restaurantsDb.deletePromotionByPid)

    // Retrieve Reviews
    app
    .route('/restaurant_staff/:username/restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews')
    .get(restaurantsDb.retrieveReviews)

    // Get Order For a specified restaurant
    app
    .route('restaurant_staff/:username/restaurant/:rest_id/orders')
    .get(restaurantsDb.getRestaurantOrders)

    // Get Order Summary for all months
    app
    .route('/restaurant_staff/:username/allsummary')
    .get(restaurantsDb.getAllOrderSummary)

    // Get Order Summary Based on Current Month
    app
    .route('/restaurant_staff/:username/summary')
    .get(restaurantsDb.getOrderSummaryBasedOnCurrentMonthNumber)

    // Get Top Five Fav Food Based On current month
    app
    .route('/restaurant_staff/:username/currentmonthtopfive')
    .get(restaurantsDb.getTopFiveFoodSummaryBasedOnCurrentMonthNumber)

    // Get Promo Summary 
    app
    .route('/restaurant_staff/:pid/promosummary')
    .get(restaurantsDb.getPromoSummaryBasedOnPid)
       

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})


module.exports = pool;