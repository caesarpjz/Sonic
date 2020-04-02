CREATE OR REPLACE FUNCTION getRestaurants() 
RETURNS TABLE(name VARCHAR, info text, category VARCHAR) AS $$
    SELECT name, info, category
    FROM Restaurants
    ORDER BY name asc;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getMenus(VARCHAR) 
returns table(name VARCHAR) AS $$
    SELECT M.name
    FROM restaurants R JOIN menus M ON R.rest_id = M.rest_id
    WHERE R.name = $1;
$$ LANGUAGE SQL;

-- $1 var as rest name, $2 var as menu name
CREATE OR REPLACE FUNCTION getFoodItems(VARCHAR, VARCHAR) 
returns table(name VARCHAR, availability BOOLEAN, price FLOAT, quantity INTEGER, daily_limit INTEGER) AS $$
    SELECT F.name, F.availability, F.price, F.quantity, F.daily_limit
    FROM restaurants R join menus M on R.rest_id = M.rest_id 
    join food_items F on M.menu_id = F.menu_id
    where R.name = $1
    and M.name = $2
    order by F.name asc;
$$ LANGUAGE SQL;


