const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

const restaurantsDb = require('./routes/restaurantStaffs')
const usersDb = require('./routes/users')
const customersDb = require('./routes/customers')
const managersDb = require('./routes/managers')



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
    .route('restaurant_categories')
    .get(customersDb.getRestaurantCategories)

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

    // Points offset Cost

/***** Riders *****/


/***** FDS Managers *****/

    // Manager Login
    app
    .route('/managers/login')
    .post(managersDb.managerLogin)

    // Get Reports
    app
    .route('/managers/:mid/reports')
    .get(managersDb.getReportsByMid)

    // Create Promotions
    app
    .route('/managers/:mid/createpromotions')
    .post(managersDb.createPromotionsByMid)

    // Get Promotions By Mid
    app
    .route('/managers/:mid/promotions')
    .get(managersDb.getPromotionsByMid)

    // Update in effect Promotions By Mid
    app
    .route('/managers/:mid/promotions/:pid/ineffect')
    .post(managersDb.updateInEffectPromotionsByMid)

    // Update Promotion by Pid
    app
    .route('/managers/:mid/promotions/:pid')
    .post(managersDb.updatePromotionByPid)

    // Delete Promotions By Pid
    app
    .route('/managers/:mid/promotions/delete/:pid')
    .delete(managersDb.deletePromotionByPid)

    // Create Restaurant
    app
    .route('/managers/:mid/createRestaurant')
    .post(managersDb.createRestaurant)

    // Get Restaurants
    app
    .route('/managers/:mid/restaurant')
    .get(managersDb.getRestaurants)

    // Update Restaurant Info
    app
    .route('/managers/:mid/restaurant/:rest_id/update')
    .post(managersDb.updateRestaurantInfoByRestId)

    // Delete Restaurant By Rest Id
    app
    .route('/managers/:mid/restaurant/:rest_id/delete')
    .delete(managersDb.deleteRestaurantByRestId)

    // Create Restaurant Staff
    app
    .route('/managers/:mid/restaurant/:rest_id/staff')
    .post(managersDb.createRestaurantStaff)

    // Get Restaurant Staff
    app
    .route('/managers/:mid/restaurant/:rest_id/restaurant_staff')
    .get(managersDb.getRestaurantStaff)

    // Delete Restaurant Staff
    app
    .route('/managers/:mid/restaurant/:rest_id/restaurant_staff/:rsid/delete')
    .delete(managersDb.deleteRestaurantStaff)

    // Get Riders
    app
    .route('/managers/:mid/riders')
    .get(managersDb.getRiders)

    // Get Riders Shifts
    app
    .route('/managers/:mid/riders/:rid/shifts')
    .get(managersDb.getRiderShifts)

    // Update Riders Shift Approval
    app
    .route('/managers/:mid/riders/:rid/shifts/approval')
    .post(managersDb.updateShiftApproval)

    // Approve Riders Signup



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
    .route('/restaurant_staff/:rsid/restaurant')
    .get(restaurantsDb.getRestaurantInfoById)

    // Update Name, Min_spending, Info, Category of Restaurant
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id')
    .post(restaurantsDb.updateRestaurantById)

    // Get Menu By Restauarant Id
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/menus')
    .get(restaurantsDb.getMenuNameById)

    // Get Food Item by Menu Id
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/foods')
    .get(restaurantsDb.getFoodItemByMenuId)

    // Update Menu Name by Menu Id
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/:menu_id')
    .post(restaurantsDb.updateMenuNameByMenuId)

    // Add Menu
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/addMenu')
    .post(restaurantsDb.addMenu)

    // Add Food Item into Menu
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/addfood')
    .post(restaurantsDb.addFoodItemIntoMenu)

    // Remove Menu by name
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/delete/:menu_name')
    .post(restaurantsDb.removeMenuByName)

    // Remove Menu by Menu Id
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/delete/:menu_id')
    .delete(restaurantsDb.removeMenuByMenuId)

    // Update Food Item by Menu Id and Fid
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/:fid')
    .post(restaurantsDb.updateFoodItemByMenuIdAndFid)

    // Create Promotions
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/promotions')
    .post(restaurantsDb.createPromotionsByRestId)

    // Get Promos
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/promotionslist')
    .get(restaurantsDb.getPromotionsByRestId)

    // Update Promotions
    app
    .route('restaurant_staff/:rsid/restaurant/:rest_id/promotions/:pid')
    .post(restaurantsDb.updatePromotionByPid)

    // Delete Promos
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/promotions/delete/:pid')
    .delete(restaurantsDb.deletePromotionByPid)

    // Change In Effect Boolean
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/promotionslist/:pid')
    .post(restaurantsDb.updateInEffectPromotionsByRestId)

    // Retrieve Reviews
    app
    .route('/restaurant_staff/:rsid/restaurant/:rest_id/menus/:menu_id/foods/:fid/reviews')
    .get(restaurantsDb.retrieveReviews)

    // Generate Summary Info


    

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})


module.exports = pool;