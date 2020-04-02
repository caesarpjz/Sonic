-- USER
DROP TABLE IF EXISTS Users CASCADE;

-- RESTAURANTS
DROP TABLE IF EXISTS Restaurant_Categories CASCADE;

DROP TABLE IF EXISTS Restaurants CASCADE;

DROP TABLE IF EXISTS Menus CASCADE;

DROP TABLE IF EXISTS Food_Items CASCADE;

DROP TABLE IF EXISTS Promotions CASCADE;

DROP TABLE IF EXISTS Managers_Has_Promotions CASCADE;

DROP TABLE IF EXISTS Restaurants_Has_Promotions CASCADE;

-- CUSTOMERS
DROP TABLE IF EXISTS Customers CASCADE;

DROP TABLE IF EXISTS Reviews CASCADE;

-- ORDERS
DROP TABLE IF EXISTS Orders CASCADE;

DROP TABLE IF EXISTS Order_Contains_Food CASCADE;

DROP TABLE IF EXISTS Customer_Rates_Delivery CASCADE;

-- RIDERS 
DROP TABLE IF EXISTS Riders CASCADE;

DROP TABLE IF EXISTS Deliveries CASCADE;

DROP TABLE IF EXISTS Full_Time CASCADE;

DROP TABLE IF EXISTS Part_Time CASCADE;

DROP TABLE IF EXISTS MWS CASCADE;

DROP TABLE IF EXISTS WWS CASCADE;

DROP TABLE IF EXISTS Shifts CASCADE;

-- FDS MANAGER
DROP TABLE IF EXISTS FDS_Managers CASCADE;

DROP TABLE IF EXISTS Reports CASCADE;

DROP TABLE IF EXISTS Restaurant_Staff CASCADE;