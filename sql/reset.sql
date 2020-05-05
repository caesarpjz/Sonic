-- TYPES
DROP TYPE rights CASCADE;
DROP TYPE order_statuses CASCADE;
DROP TYPE methods CASCADE;
DROP TYPE rider_statuses CASCADE;
DROP TYPE promotion_types CASCADE;

-- SCHEMA
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Restaurant_Categories CASCADE;
DROP TABLE IF EXISTS FDS_Managers CASCADE;
DROP TABLE IF EXISTS Promotions CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS Riders CASCADE;
DROP TABLE IF EXISTS Deliveries CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Menus CASCADE;
DROP TABLE IF EXISTS Restaurant_Staff CASCADE;
DROP TABLE IF EXISTS Food_Item_Categories CASCADE;
DROP TABLE IF EXISTS Food_Items CASCADE;
DROP TABLE IF EXISTS Reports CASCADE;
DROP TABLE IF EXISTS Managers_Has_Promotions CASCADE;
DROP TABLE IF EXISTS Restaurants_Has_Promotions CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Order_Contains_Food CASCADE;
DROP TABLE IF EXISTS Customer_Rates_Delivery CASCADE;
DROP TABLE IF EXISTS Shifts CASCADE;
DROP TABLE IF EXISTS T1 CASCADE;

-- GENERAL FUNCTIONS
DROP FUNCTION IF EXISTS addUser(VARCHAR, VARCHAR, VARCHAR, RIGHTS) CASCADE;
DROP FUNCTION IF EXISTS addFdsManager(VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS addCustomer(VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS addRider(VARCHAR, VARCHAR, VARCHAR, BOOLEAN, RIDER_STATUSES) CASCADE;
DROP FUNCTION IF EXISTS authUser(VARCHAR, VARCHAR) CASCADE;

-- FDS FUNCTIONS
DROP FUNCTION IF EXISTS addRestaurant(VARCHAR, TEXT, INTEGER, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS addRestaurantStaff(VARCHAR, VARCHAR, VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS addPromotionForManagers(DATE, DATE, TEXT, FLOAT, VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getOverViewReport() CASCADE;
DROP FUNCTION IF EXISTS getMonthlyCustomerReport(DATE) CASCADE;
DROP FUNCTION IF EXISTS getAllMonthCustomerReport() CASCADE;
DROP FUNCTION IF EXISTS getHourlyLocationReport(TIMESTAMP) CASCADE;
DROP FUNCTION IF EXISTS getLocationReportOverview() CASCADE;
DROP FUNCTION IF EXISTS getIndivMonthlyRiderReport(INTEGER, DATE) CASCADE;
DROP FUNCTION IF EXISTS getRiderReport() CASCADE;

-- STAFF FUNCTIONS
DROP FUNCTION IF EXISTS getRestOrders(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS updatePassword(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS getRestaurants() CASCADE;
DROP FUNCTION IF EXISTS getRestaurantById(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getMenus(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS getFoodItems(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS addMenu(INTEGER, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS addFoodItem(INTEGER, INTEGER, VARCHAR, FLOAT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS addRestaurantPromotion(DATE, DATE, TEXT, FLOAT, VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getOrderSummary(INTEGER, DATE) CASCADE;
DROP FUNCTION IF EXISTS getCurrMonthOrderSummary(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getAllMonthOrderSummary(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getTopFive(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getCurrMonthTopFive(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getPromoSummary(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getRestOrders(INTEGER) CASCADE;

-- CUSTOMER FUNCTIONS
DROP FUNCTION IF EXISTS addFoodToOrder(INTEGER, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS addDelivery(FLOAT) CASCADE;
DROP FUNCTION IF EXISTS addOrder(FLOAT, INTEGER, VARCHAR, VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getOrderStatus(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getCustomerProfile(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS updateCC(INTEGER, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS getRecentLocations(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getTotalPayable(INTEGER) CASCADE;

-- RIDER FUNCTIONS
DROP FUNCTION IF EXISTS getDeliveringOrder(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getOrders(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS allocateRider(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getAvailableRiders() CASCADE;
DROP FUNCTION IF EXISTS timestamp_departForRest(did INTEGER) CASCADE;
DROP FUNCTION IF EXISTS timestamp_arriveAtRest(did INTEGER) CASCADE;
DROP FUNCTION IF EXISTS timestamp_departFromRest(did INTEGER) CASCADE;
DROP FUNCTION IF EXISTS timestamp_orderDelivered(did INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getRatings(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS addShift(INTEGER, TIMESTAMP, TIMESTAMP) CASCADE;
DROP FUNCTION IF EXISTS getTotalOrders(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getTotalHours(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getTotalSalary(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getAvgDeliveryTime(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getTotalRatings(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getAvgRatings(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getRiderSummary(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS getEarliestShift(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getLatestShift(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS getMonthlyRiderSummary(INTEGER) CASCADE;
