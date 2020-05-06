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
    VALUES (DEFAULT, userId, username, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addCustomer(username VARCHAR, password VARCHAR, name VARCHAR)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Customer') into userId;

    INSERT INTO Customers
    VALUES (DEFAULT, userId, null, null, DEFAULT, username, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addRider(username VARCHAR, password VARCHAR, name VARCHAR, is_full_time BOOLEAN, status RIDER_STATUSES DEFAULT 'NOT WORKING')
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Rider') into userId;

    INSERT INTO Riders
    VALUES (DEFAULT, userId, is_full_time, status, username, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION authUser(usernameCheck VARCHAR, passwordCheck VARCHAR)
RETURNS BOOLEAN as $$
    SELECT CASE
        WHEN EXISTS(
            SELECT * FROM Users
            where username = usernameCheck
            and password = passwordCheck
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
    VALUES (DEFAULT, rest_id, userId, username, name);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addPromotionForManagers(start_date DATE, end_date DATE, discount_desc TEXT, 
    discount_percentage FLOAT, name VARCHAR, mid INTEGER)
RETURNS void AS $$
declare
    promo_id integer;
begin
    INSERT INTO Promotions
    VALUES (DEFAULT, start_date, end_date, 'CUSTOMER', discount_desc, discount_percentage, DEFAULT, name)
    RETURNING pid INTO promo_id;

    -- SELECT pid FROM Promotions P WHERE P.start_time = start_time AND P.end_time = end_time AND P.discount_description = discount_desc into promo_id;

    INSERT INTO Managers_has_Promotions
    VALUES (mid, promo_id);
end
$$ LANGUAGE PLPGSQL;

-- FUNCTIONS FOR REPORTS
CREATE OR REPLACE FUNCTION getOverviewReport(
    OUT total_new_customers INTEGER,
    OUT total_orders INTEGER,
    OUT total_cost INTEGER
) AS $$
declare 
    start_date DATE;
    end_date DATE;
begin
    SELECT CAST(date_trunc('month', NOW()) as DATE) INTO start_date;
    SELECT CAST((start_date + interval '1 month') as DATE) INTO end_date;

    SELECT count(*)
    FROM Users U join Customers C on U.id = C.id
    WHERE U.created_at >= start_date
    AND U.created_at < end_date
    INTO total_new_customers;

    SELECT count(*)
    FROM Deliveries 
    WHERE time_order_placed >= start_date
    AND time_order_placed < end_date
    INTO total_orders;

    SELECT sum(OCF.quantity * FI.price)
    FROM Deliveries D join Orders O on D.did = O.did
    join Order_Contains_Food OCF on O.oid = OCF.oid
    join Food_Items FI on OCF.fid = FI.fid
    WHERE D.time_order_placed >= start_date
    AND D.time_order_placed < end_date
    INTO total_cost;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getMonthlyCustomerReport(month DATE)
RETURNS TABLE(cid INTEGER, total_orders INTEGER, total_cost FLOAT) AS $$
declare
    start_date DATE;
    end_date DATE;
begin
    SELECT CAST(date_trunc('month', $1) as DATE) INTO start_date;
    SELECT CAST((start_date + interval '1 month') as DATE) INTO end_date;

    RETURN QUERY 
        SELECT O.cid, CAST(count(*) AS INTEGER), CAST(sum(OCF.quantity * FI.price) AS FLOAT)
        FROM Orders O join Deliveries D on O.did = D.did
        join Order_Contains_Food OCF on O.oid = OCF.oid
        join Food_Items FI on OCF.fid = FI.fid
        WHERE D.time_order_placed >= start_date
        AND D.time_order_placed < end_date
        group by O.cid;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getAllMonthCustomerReport()
RETURNS TABLE (start_of_month DATE, cid INTEGER, total_orders INTEGER, total_cost FLOAT) AS $$
declare
    T2 CURSOR FOR 
        SELECT CAST(date_trunc('month', D.time_order_placed) AS DATE) as start_of_month
        FROM Orders O join Deliveries D on O.did = D.did
        group by CAST(date_trunc('month', D.time_order_placed) AS DATE);
begin
    DROP TABLE IF EXISTS T1;
    CREATE TEMP TABLE T1(
        start_of_month DATE,
        cid INTEGER,
        total_orders INTEGER,
        total_costs FLOAT
    );

    FOR rec IN T2 LOOP
        INSERT INTO T1
        SELECT rec.start_of_month, T3.cid, T3.total_orders, T3.total_cost
        FROM getMonthlyCustomerReport(rec.start_of_month) T3;
    END LOOP;

    RETURN QUERY TABLE T1;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getHourlyLocationReport(estimated_time TIMESTAMP)
RETURNS TABLE(location VARCHAR, total_number INTEGER) AS $$
declare
    start_time TIMESTAMP;
    end_time TIMESTAMP;
begin
    SELECT CAST(date_trunc('hour', $1) AS TIMESTAMP) INTO start_time;
    SELECT CAST((start_time + interval '1 hour') as TIMESTAMP) INTO end_time;

    RETURN QUERY 
        SELECT O.location, CAST(count(*) AS INTEGER)
        FROM Orders O join Deliveries D on O.did = D.did
        WHERE D.time_order_placed >= start_time
        AND D.time_order_placed < end_time
        GROUP BY O.location;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getLocationReportOverview()
RETURNS TABLE(start_of_hour TIMESTAMP, location VARCHAR, total_number INTEGER) AS $$
    SELECT date_trunc('hour', D.time_order_placed), O.location, CAST(count(*) AS INTEGER)
    FROM Orders O join Deliveries D on O.did = D.did
    GROUP BY date_trunc('hour', D.time_order_placed), O.location;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getIndivMonthlyRiderReport(
    IN rid INTEGER,
    IN estimated_start_month DATE,
    OUT rider_id INTEGER,
    OUT start_of_month DATE,
    OUT total_orders INTEGER,
    OUT total_salary FLOAT,
    OUT avg_delivery_time_in_min FLOAT,
    OUT ratings_received BIGINT,
    OUT avg_ratings FLOAT
)
AS $$
declare 
    end_date DATE;
begin
    SELECT $1 INTO rider_id;
    SELECT CAST(date_trunc('month', $2) AS DATE) INTO start_of_month;

    SELECT CAST((start_of_month + interval '1 month') AS DATE) INTO end_date;

    SELECT getTotalOrders($1, start_of_month, end_date) INTO total_orders;
    SELECT getTotalSalary($1, start_of_month, end_date) INTO total_salary;
    SELECT getAvgDeliveryTime($1, start_of_month, end_date) INTO avg_delivery_time_in_min;
    SELECT getTotalRatings($1, start_of_month, end_date) INTO ratings_received;
    SELECT getAvgRatings($1, start_of_month, end_date) INTO avg_ratings;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getRiderReport()
RETURNS TABLE(
    rider_id INTEGER, 
    start_of_month DATE,
    total_orders INTEGER,
    total_salary FLOAT,
    avg_delivery_time_in_min FLOAT,
    ratings_received BIGINT,
    avg_ratings FLOAT
 ) AS $$
declare 
    T2 CURSOR FOR
        SELECT R.rid, CAST(date_trunc('month', S.start_time) AS DATE) as start_of_month
        FROM Riders R join Shifts S on R.rid = S.rid
        group by R.rid, CAST(date_trunc('month', S.start_time) AS DATE);
begin
    DROP TABLE IF EXISTS T1;
    CREATE TEMP TABLE T1 (
        rider_id INTEGER, 
        start_of_month DATE,
        total_orders INTEGER,
        total_salary FLOAT,
        avg_delivery_time_in_min FLOAT,
        ratings_received BIGINT,
        avg_ratings FLOAT
    );

    FOR rec in T2 LOOP
        INSERT INTO T1 
        SELECT * 
        FROM getIndivMonthlyRiderReport(rec.rid, rec.start_of_month);
    END LOOP;

    RETURN QUERY TABLE T1;
end
$$ LANGUAGE PLPGSQL;

-----------------------------
------ STAFF FUNCTIONS ------
-----------------------------

CREATE OR REPLACE FUNCTION getRestOrders(rest_id INTEGER)
RETURNS table(oid INTEGER, fid INTEGER, name VARCHAR, quantity INTEGER, status ORDER_STATUSES) AS $$
    SELECT of.oid, f.fid, f.name, of.quantity, o.status
    FROM Menus m, Food_Items f, Order_Contains_Food of, Orders o
    WHERE m.rest_id = $1 
    AND m.menu_id = f.menu_id
    AND f.fid = of.fid
    AND o.status <> 'DELIVERED'
$$ LANGUAGE SQL;

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

CREATE OR REPLACE FUNCTION getRestaurantById(rid INTEGER) 
RETURNS TABLE(name VARCHAR, info text, category VARCHAR) AS $$
    SELECT name, info, category
    FROM Restaurants R
    where R.rest_id = $1
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getMenus(rest_name VARCHAR) 
RETURNS table(name VARCHAR) AS $$
    SELECT M.name
    FROM restaurants R JOIN menus M ON R.rest_id = M.rest_id
    WHERE R.name = rest_name
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getFoodItems(rest_name VARCHAR, menu_name VARCHAR) 
RETURNS table(name VARCHAR, price FLOAT, quantity INTEGER, daily_limit INTEGER) AS $$
    SELECT F.name, F.price, F.quantity, F.daily_limit
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

CREATE OR REPLACE FUNCTION addFoodItem(
    quantity INTEGER, 
    daily_limit INTEGER, 
    name VARCHAR, 
    price FLOAT, 
    menu_id INTEGER,
    category VARCHAR)
RETURNS void AS $$
begin
    IF EXISTS(SELECT 1 FROM Food_Item_Categories FIC WHERE FIC.category = $6) THEN 
        INSERT INTO Food_Item_Categories
        VALUES (category);
    END IF;
    
    INSERT INTO Food_Items
    VALUES (DEFAULT, quantity, daily_limit, name, price, menu_id, category);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addRestaurantPromotion(start_date DATE, end_date DATE, discount_desc TEXT, 
    discount_percentage FLOAT, name VARCHAR, rest_id INTEGER)
RETURNS void AS $$
declare
    promo_id integer;
begin
    INSERT INTO Promotions
    VALUES (DEFAULT, start_date, end_date, 'RESTAURANT', discount_desc, discount_percentage, DEFAULT, name)
    RETURNING pid INTO promo_id;

    -- SELECT pid FROM Promotions P WHERE P.start_time = start_time AND P.end_time = end_time AND P.discount_description = discount_desc into promo_id;

    INSERT INTO Restaurants_has_Promotions
    VALUES (rest_id, promo_id);
end
$$ LANGUAGE PLPGSQL;

-- FUNCTIONS FOR REPORTS
CREATE OR REPLACE FUNCTION getOrderSummary(
    IN rest_id INTEGER, 
    IN month DATE,
    OUT total_orders BIGINT,
    OUT total_costs FLOAT)
AS $$
declare
    start_month DATE;
    end_month DATE;
begin
    SELECT CAST(date_trunc('month', $2) AS DATE) INTO start_month;
    SELECT CAST((start_month + interval '1 month') AS DATE) INTO end_month;

    SELECT count(*) as total_orders, sum(OCF.quantity * FI.price) as total_costs
    FROM Order_Contains_Food OCF join Food_Items FI on OCF.fid = FI.fid
    join Menus M on M.menu_id = FI.menu_id
    join Orders O on OCF.oid = O.oid
    join Deliveries D on O.did = D.did
    WHERE M.rest_id = $1
    AND D.time_order_placed >= start_month
    AND D.time_order_placed < end_month
    INTO $3, $4;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getCurrMonthOrderSummary(rest_id INTEGER)
RETURNS record AS $$
    SELECT getOrderSummary($1, CAST(NOW() AS DATE));
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getAllMonthOrderSummary(rest_id INTEGER)
RETURNS TABLE(restaurant_id INTEGER, month DATE, total_orders BIGINT, total_cost FLOAT) AS $$
declare
    T2 CURSOR FOR 
        SELECT M.rest_id, CAST(date_trunc('month', D.time_order_placed) AS DATE) as month
        FROM Orders O join Deliveries D on O.did = D.did
        join Order_Contains_Food OCF on O.oid = OCF.oid
        join Food_Items FI on OCF.fid = FI.fid
        join Menus M on M.menu_id = FI.menu_id
        WHERE M.rest_id = $1
        group by M.rest_id, CAST(date_trunc('month', D.time_order_placed) AS DATE);
begin
    DROP TABLE IF EXISTS T1;
    CREATE TEMP TABLE T1(
        rest_id INTEGER,
        month DATE,
        total_orders BIGINT,
        total_cost FLOAT
    );

    FOR rec IN T2 LOOP
        INSERT INTO T1
        SELECT rec.rest_id, rec.month, OS.total_orders, OS.total_costs
        FROM getOrderSummary(rec.rest_id, rec.month) OS;
    END LOOP;

    RETURN QUERY TABLE T1;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getTopFive(rest_id INTEGER, month INTEGER)
RETURNS TABLE(fid INTEGER, name VARCHAR) AS $$
    SELECT fid, name
    FROM (
        SELECT FI.fid, FI.name, sum(OCF.quantity) as total_quantity
        FROM Order_Contains_Food OCF join Food_Items FI on OCF.fid = FI.fid
        join Menus M on M.menu_id = FI.menu_id
        join Orders O on OCF.oid = O.oid
        join Deliveries D on O.did = D.did  
        WHERE M.rest_id = $1
        AND EXTRACT(MONTH FROM D.time_order_placed) = $2
        group by FI.fid
    ) as CollatedOrders
    order by total_quantity desc
    limit 5;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getCurrMonthTopFive(rest_id INTEGER)
RETURNS TABLE(fid INTEGER, name VARCHAR) AS $$
    SELECT getTopFive($1, CAST(EXTRACT(MONTH FROM NOW()) AS INTEGER));
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getPromoSummary(IN pid INTEGER, OUT total_days INTEGER, OUT avg_orders FLOAT)
AS $$
begin
    SELECT CAST(end_date - start_date AS FLOAT)
    FROM Promotions P
    WHERE P.pid = $1
    LIMIT 1
    INTO total_days;

    SELECT CAST(count AS FLOAT) / total_days
    FROM Promotions P
    WHERE P.pid = $1
    INTO avg_orders;
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

    UPDATE Food_Items
    SET daily_limit = daily_limit - $3
    WHERE Food_Items.fid = $2;

    UPDATE Food_Items FI
    SET quantity = FI.quantity - $3
    WHERE FI.fid = $2;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addDelivery(fee FLOAT)
RETURNS INTEGER AS $$
    INSERT INTO Deliveries
    VALUES (DEFAULT, NULL, fee, NOW())
    RETURNING did;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addOrder(
    fee FLOAT, 
    cid INTEGER, 
    payment_method METHODS, 
    restaurant_location VARCHAR, 
    location VARCHAR, 
    pid INTEGER DEFAULT NULL)
RETURNS INTEGER AS $$
declare 
    did integer;
    ret_oid integer;
begin
    select addDelivery(fee) into did;

    INSERT INTO Orders
    VALUES (DEFAULT, did, cid, fee, 'ORDERED', payment_method, restaurant_location, location, pid)
    RETURNING oid into ret_oid;

    IF ($6 IS NOT NULL) THEN
        UPDATE Promotions
        SET count = count + 1
        WHERE Promotions.pid = $6;
    END IF;

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

CREATE OR REPLACE FUNCTION updateCC(cid INTEGER, cc_name VARCHAR, cc_expiry VARCHAR) 
RETURNS void as $$
    UPDATE Customers
    SET cc_name = $2,
    cc_expiry = $3
    WHERE cid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getRecentLocations(cid INTEGER)
RETURNS TABLE(location VARCHAR) AS $$
    SELECT location
    FROM Orders O join Deliveries D on O.did = D.did
    WHERE O.cid = $1
    ORDER BY D.time_order_delivered desc
    LIMIT 5;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getTotalPayable(oid INTEGER) 
RETURNS FLOAT AS $$
    SELECT O.cost
    FROM Orders O
    WHERE O.oid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION postReviewFor(cid INTEGER, fid INTEGER, review TEXT) 
RETURNS void AS $$
    INSERT INTO Reviews
    VALUES (cid, fid, review);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION postRatingFor(cid INTEGER, did INTEGER, rating INTEGER) 
RETURNS void AS $$
    INSERT INTO Customer_Rates_Delivery
    VALUES (cid, did, rating);
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

CREATE OR REPLACE FUNCTION addShift(rid INTEGER, start_time TIMESTAMP, end_time TIMESTAMP)
RETURNS VOID AS $$
    INSERT INTO Shifts VALUES
    (DEFAULT, $1, $2, $3);
$$ LANGUAGE SQL;

-- FUNCTIONS FOR REPORTS
CREATE OR REPLACE FUNCTION getTotalOrders(rid INTEGER, start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
    SELECT CAST(count(*) AS INTEGER)
    FROM Deliveries D 
    WHERE D.rid = $1
    AND D.time_order_delivered >= start_date
    AND D.time_order_delivered < end_date;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getTotalHours(rid INTEGER, start_date DATE, end_date DATE)
RETURNS FLOAT AS $$
    SELECT sum(EXTRACT(EPOCH FROM (S.end_time - S.start_time))/3600)
    FROM Riders R join Shifts S on R.rid = S.rid
    WHERE R.rid = $1
    AND S.start_time >= $2
    AND S.start_time < $3
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getTotalSalary(rid INTEGER, start_date DATE, end_date DATE)
RETURNS FLOAT AS $$
declare
    total_hours FLOAT;
    total_delivery_fee FLOAT;
begin
    SELECT getTotalHours($1, $2, $3) INTO total_hours;

    SELECT sum(D.fee)
    FROM Deliveries D
    WHERE d.rid = $1
    INTO total_delivery_fee;

    RETURN total_hours * 8 + total_delivery_fee / 2;
end    
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getAvgDeliveryTime(rid INTEGER, start_date DATE, end_date DATE)
RETURNS FLOAT AS $$
    SELECT EXTRACT(EPOCH FROM (D.time_order_delivered - time_depart_from_rest) / 60)
    FROM Deliveries D
    WHERE D.rid = $1
    AND time_depart_from_rest >= start_date
    AND time_depart_from_rest < end_date
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getTotalRatings(rid INTEGER, start_date DATE, end_date DATE)
RETURNS BIGINT AS $$
    SELECT sum(CRD.rating)
    FROM Customer_Rates_Delivery CRD join Deliveries D on CRD.did = D.did
    WHERE D.rid = $1
    AND D.time_order_delivered >= start_date
    AND D.time_order_delivered < end_date;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getAvgRatings(rid INTEGER, start_date DATE, end_date DATE)
RETURNS FLOAT AS $$
    SELECT CAST(sum(CRD.rating) AS FLOAT) / CAST(count(*) AS FLOAT)
    FROM Customer_Rates_Delivery CRD join Deliveries D on CRD.did = D.did
    WHERE D.rid = $1
    AND D.time_order_delivered >= start_date
    AND D.time_order_delivered < end_date;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getRiderSummary(
    IN rid INTEGER, 
    IN start_date DATE,
    IN end_date DATE, -- end_date exclusive
    OUT total_orders INTEGER, 
    OUT total_hours FLOAT, 
    OUT total_salary FLOAT)
AS $$
begin
    SELECT getTotalOrders(rid, start_date, end_date) INTO total_orders;
    SELECT getTotalHours(rid, start_date, end_date) INTO total_hours;
    SELECT getTotalSalary(rid, start_date, end_date) INTO total_salary;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION getEarliestShift(rid INTEGER)
RETURNS TIMESTAMP AS $$
    SELECT min(S.start_time)
    FROM Shifts S
    WHERE S.rid = $1
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getLatestShift(rid INTEGER)
RETURNS TIMESTAMP AS $$
    SELECT max(S.start_time)
    FROM Shifts S
    WHERE S.rid = $1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getMonthlyRiderSummary(rid INTEGER)
RETURNS TABLE(rider_id INTEGER, month DATE, total_orders INTEGER, total_hours FLOAT, total_salary FLOAT) AS $$
declare
    T2 CURSOR FOR 
        SELECT DISTINCT S.rid, CAST(date_trunc('month', S.start_time) AS DATE) as month
        FROM Shifts S
        WHERE S.rid = $1;
begin
    DROP TABLE IF EXISTS T1;
    CREATE TEMP TABLE T1(
        rider_id INTEGER,
        month DATE,
        total_orders INTEGER,
        total_hours FLOAT,
        total_salary FLOAT
    );

    FOR rec IN T2 LOOP
        INSERT INTO T1
        SELECT rec.rid, rec.month, RS.total_orders, RS.total_hours, RS.total_salary
        FROM getRiderSummary(
            rec.rid,
            rec.month,
            CAST((rec.month + interval '1 month') as DATE)
        ) RS;
    END LOOP;

    RETURN QUERY TABLE T1;
end
$$ LANGUAGE PLPGSQL;
