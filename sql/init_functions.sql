-----------------------------
----- GENERIC FUNCTIONS -----
-----------------------------

CREATE OR REPLACE FUNCTION addUser(username VARCHAR, password VARCHAR, name VARCHAR, access_right RIGHTS)
RETURNS INTEGER AS $$
    INSERT INTO Users
    VALUES (DEFAULT, username, password, name, NOW(), access_right)
    RETURNING id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addFdsManager(username VARCHAR, password VARCHAR, name VARCHAR)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'FDS_Manager') into userId;

    INSERT INTO FDS_Managers
    VALUES (DEFAULT, userId, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addCustomer(username VARCHAR, password VARCHAR, name VARCHAR)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Customer') into userId;

    INSERT INTO Customers
    VALUES (DEFAULT, userId, DEFAULT, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addRider(username VARCHAR, password VARCHAR, name VARCHAR, is_full_time BOOLEAN, status RIDER_STATUSES DEFAULT 'NOT WORKING')
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Rider') into userId;

    INSERT INTO Riders
    VALUES (DEFAULT, userId, is_full_time, status, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION authUser(username VARCHAR, password VARCHAR)
RETURNS BOOLEAN as $$
    SELECT CASE
        WHEN EXISTS(
            SELECT * FROM Users
            where username = $1
            and password = $2
        ) THEN TRUE
        ELSE FALSE
    END
$$ LANGUAGE SQL;

-----------------------------
------- FDS FUNCTIONS -------
-----------------------------

CREATE OR REPLACE FUNCTION addRestaurant(name VARCHAR, info TEXT, min_spending INTEGER, category VARCHAR, restaurant_location VARCHAR)
RETURNS void AS $$
    INSERT INTO Restaurants 
    VALUES (DEFAULT, name, info, min_spending, category, restaurant_location);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addRestaurantStaff(username VARCHAR, password VARCHAR, name VARCHAR, rest_id INTEGER)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Restaurant_Staff') into userId;

    INSERT INTO Restaurant_Staff
    VALUES (DEFAULT, rest_id, userId, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addPromotionForManagers(start_time DATE, end_time DATE, discount_desc VARCHAR, mid INTEGER, in_effect BOOLEAN)
RETURNS void AS $$
declare
    promo_id integer;
begin
    INSERT INTO Promotions
    VALUES (DEFAULT, start_time, end_time, discount_desc);

    SELECT pid FROM Promotions P WHERE P.start_time = start_time AND P.end_time = end_time AND P.discount_description = discount_desc into promo_id;

    INSERT INTO Managers_has_Promotions
    VALUES (mid, promo_id, in_effect);
end
$$ LANGUAGE PLPGSQL;

-----------------------------
------ STAFF FUNCTIONS ------
-----------------------------

CREATE OR REPLACE FUNCTION updatePassword(username VARCHAR, newpassword VARCHAR)
RETURNS void AS $$
begin
    UPDATE Users 
    SET password = newpassword 
    WHERE username = username;

    UPDATE Restaurant_Staff 
    SET password = newpassword 
    WHERE username = username;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getRestaurants() 
RETURNS TABLE(name VARCHAR, info text, category VARCHAR) AS $$
    SELECT name, info, category
    FROM Restaurants
    ORDER BY name asc;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getMenus(VARCHAR) 
RETURNS table(name VARCHAR) AS $$
    SELECT M.name
    FROM restaurants R JOIN menus M ON R.rest_id = M.rest_id
    WHERE R.name = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getFoodItems(rest_name VARCHAR, menu_name VARCHAR) 
RETURNS table(name VARCHAR, availability BOOLEAN, price FLOAT, quantity INTEGER, daily_limit INTEGER) AS $$
    SELECT F.name, F.availability, F.price, F.quantity, F.daily_limit
    FROM restaurants R join menus M on R.rest_id = M.rest_id 
    join food_items F on M.menu_id = F.menu_id
    where R.name = rest_name
    and M.name = menu_name
    order by F.name asc;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addMenu(rest_id INTEGER, name VARCHAR)
RETURNS void AS $$
    INSERT INTO Menus
    VALUES (DEFAULT, rest_id, name);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addFoodItem(quantity INTEGER, daily_limit INTEGER, name VARCHAR, price FLOAT, menu_id INTEGER)
RETURNS void AS $$
    INSERT INTO Food_Items
    VALUES (DEFAULT, quantity, daily_limit, name, price, menu_id, TRUE);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addPromotion(start_time DATE, end_time DATE, discount_desc VARCHAR, rest_id INTEGER, in_effect BOOLEAN)
RETURNS void AS $$
declare
    promo_id integer;
begin
    INSERT INTO Promotions
    VALUES (DEFAULT, start_time, end_time, discount_desc);

    SELECT pid FROM Promotions P WHERE P.start_time = start_time AND P.end_time = end_time AND P.discount_description = discount_desc into promo_id;

    INSERT INTO Restaurants_has_Promotions
    VALUES (rest_id, promo_id, in_effect);
end
$$ LANGUAGE PLPGSQL;
-----------------------------
----- CUSTOMER FUNCTIONS ----
-----------------------------

CREATE OR REPLACE FUNCTION addFoodToOrder(oid INTEGER, fid INTEGER, quantity INTEGER)
RETURNS void  AS $$
declare 
    price FLOAT;
    total_price FLOAT;
    cust_id integer;
begin
    INSERT INTO Order_Contains_Food
    VALUES (oid, fid, quantity);

    SELECT min(F.price) FROM food_items F where F.fid = $2 into price;
    total_price := price * quantity;

    UPDATE Orders
    SET cost = cost + total_price
    WHERE Orders.oid = $1;

    SELECT cid from Orders where Orders.oid = $1 INTO cust_id;
    UPDATE Customers
    SET points = points + FLOOR(total_price)
    WHERE Customers.cid = cust_id;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addDelivery(fee FLOAT)
RETURNS INTEGER AS $$
    INSERT INTO Deliveries
    VALUES (DEFAULT, NULL, fee, NOW())
    RETURNING did;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addOrder(fee FLOAT, cid INTEGER, payment_method METHODS,restaurant_location VARCHAR, location VARCHAR)
RETURNS INTEGER AS $$
declare 
    did integer;
    ret_oid integer;
begin
    select addDelivery(fee) into did;

    INSERT INTO Orders
    VALUES (DEFAULT, did, cid, 0, 'ORDERED', payment_method, restaurant_location, location)
    RETURNING oid into ret_oid;

    RETURN ret_oid;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getOrderStatus(oid INTEGER)
RETURNS ORDER_STATUSES AS $$
    SELECT status
    FROM Orders
    WHERE Orders.oid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getCustomerProfile(cid INTEGER)
RETURNS record AS $$
    SELECT * 
    FROM Customers
    WHERE Customers.cid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION updateCC(cid INTEGER, cc_name VARCHAR, cc_expiry VARCHAR, cc_num VARCHAR) 
RETURNS void as $$
    UPDATE Customers
    SET cc_name = $2,
    cc_expiry = $3,
    cc_num = $4
    WHERE cid = $1;
$$ LANGUAGE SQL;

-----------------------------
------ RIDER FUNCTIONS ------
-----------------------------

CREATE OR REPLACE FUNCTION getDeliveringOrder(rid INTEGER)
RETURNS TABLE(oid INTEGER, did INTEGER, payment_method METHODS, location VARCHAR, food_name VARCHAR, quantity INTEGER) AS $$
    SELECT O.oid, D.did, O.payment_method, O.location, FI.name, OCF.quantity
    FROM Orders O NATURAL JOIN Deliveries D
    NATURAL JOIN Order_Contains_Food OCF
    JOIN Food_Items FI ON OCF.fid = FI.fid
    WHERE D.rid = $1
    AND status <> 'DELIVERED';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getOrders(rid INTEGER)
RETURNS setof record AS $$
    SELECT did, fee
    FROM Deliveries
    WHERE rid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION allocateRider(rid INTEGER, did INTEGER)
RETURNS void AS $$
    UPDATE Deliveries
    SET rid = $1
    WHERE did = $2;

    UPDATE RIDERS
    SET status = 'DELIVERING'
    WHERE rid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getAvailableRiders() 
RETURNS TABLE(rid INTEGER) AS $$
    SELECT rid
    FROM Riders
    WHERE status = 'AVAILABLE';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION timestamp_departForRest(did INTEGER)
RETURNS void AS $$
    UPDATE Deliveries
    SET time_depart_for_rest = NOW()
    WHERE did = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION timestamp_arriveAtRest(did INTEGER)
RETURNS void AS $$
    UPDATE Deliveries
    SET time_arrive_at_rest = NOW()
    WHERE did = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION timestamp_departFromRest(did INTEGER)
RETURNS void AS $$
    UPDATE Deliveries
    SET time_depart_from_rest = NOW()
    WHERE did = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION timestamp_orderDelivered(did INTEGER)
RETURNS void AS $$
declare 
    rider_id INTEGER;
begin
    UPDATE Deliveries
    SET time_order_delivered = NOW()
    WHERE Deliveries.did = $1
    RETURNING rid into rider_id;

    UPDATE Riders
    SET status = 'AVAILABLE'
    WHERE rid = rider_id;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getRatings(rid INTEGER)
RETURNS TABLE(did INTEGER, rating INTEGER) AS $$
    SELECT D.did, CRD.rating
    FROM Customer_Rates_Delivery CRD NATURAL JOIN Deliveries D
    NATURAL JOIN Riders R
    WHERE R.rid = $1
    ORDER BY time_order_delivered desc;
$$ LANGUAGE SQL;
