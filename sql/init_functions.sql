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
    VALUES (DEFAULT, userId);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addCustomer(username VARCHAR, password VARCHAR, name VARCHAR)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Customer') into userId;

    INSERT INTO Customers
    VALUES (DEFAULT, userId, DEFAULT);
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION addRider(username VARCHAR, password VARCHAR, name VARCHAR, is_full_time BOOLEAN)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Rider') into userId;

    INSERT INTO Riders
    VALUES (DEFAULT, userId, is_full_time, 'NOT WORKING');
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

CREATE OR REPLACE FUNCTION addRestaurant(name VARCHAR, info TEXT, min_spending INTEGER, category VARCHAR)
RETURNS void AS $$
    INSERT INTO Restaurants 
    VALUES (DEFAULT, name, info, min_spending, category);
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addRestaurantStaff(username VARCHAR, password VARCHAR, name VARCHAR, rest_id INTEGER)
RETURNS void AS $$
declare 
    userId integer;
begin
    select addUser(username, password, name, 'Restaurant_Staff') into userId;

    INSERT INTO Restaurant_Staff
    VALUES (DEFAULT, rest_id, userId);
end
$$ LANGUAGE PLPGSQL;

-----------------------------
------ STAFF FUNCTIONS ------
-----------------------------

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
    VALUES (DEFAULT, NULL, fee)
    RETURNING did;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION addOrder(fee FLOAT, cid INTEGER, payment_method METHODS, location VARCHAR)
RETURNS INTEGER AS $$
declare 
    did integer;
    ret_oid integer;
begin
    select addDelivery(fee) into did;

    INSERT INTO Orders
    VALUES (DEFAULT, did, cid, 0, 'ORDERED', payment_method, location)
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

CREATE OR REPLACE FUNCTION getOrder(rid INTEGER)
RETURNS TABLE(oid INTEGER, did INTEGER, payment_method METHODS, location VARCHAR, food_name VARCHAR, quantity INTEGER) AS $$
    SELECT O.oid, D.did, O.payment_method, O.location, FI.name, OCF.quantity
    FROM Orders O NATURAL JOIN Deliveries D 
    NATURAL JOIN Order_Contains_Food OCF
    JOIN Food_Items FI ON OCF.fid = FI.fid
    WHERE D.rid = $1
    AND status <> 'DELIVERED';
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION allocateRider(rid INTEGER, did INTEGER)
RETURNS void AS $$
    UPDATE Deliveries
    SET rid = $1
    WHERE did = $2;
$$ LANGUAGE SQL;
