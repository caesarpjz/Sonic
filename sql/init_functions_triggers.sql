CREATE OR REPLACE FUNCTION getRestaurants() 
RETURNS TABLE(name VARCHAR, info text, category VARCHAR) AS $$
    SELECT name, info, category
    FROM Restaurants
    ORDER BY name asc;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION getMenus(rest_name VARCHAR) 
returns table(name VARCHAR) AS $$
    SELECT M.name
    FROM restaurants R JOIN menus M ON R.rest_id = M.rest_id
    WHERE R.name = rest_name;
$$ LANGUAGE SQL;
