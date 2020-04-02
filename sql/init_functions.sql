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
    order by F.name ASc;
$$ LANGUAGE SQL;

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
    VALUES (DEFAULT, userId, is_full_time);
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

