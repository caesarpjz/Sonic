CREATE OR REPLACE FUNCTION check_food_limit() RETURNS TRIGGER AS $$
declare
    my_quantity INTEGER;
    my_limit INTEGER;
begin
    SELECT FI.daily_limit
    FROM Food_Items FI
    WHERE FI.fid = NEW.fid
    INTO my_limit;

    SELECT NEW.quantity INTO my_quantity;

    IF (my_quantity > my_limit) THEN
        RETURN NULL;
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER food_limit_trigger
BEFORE INSERT
ON Order_Contains_Food
FOR EACH ROW
EXECUTE FUNCTION check_food_limit();

CREATE OR REPLACE FUNCTION check_promo_time() RETURNS TRIGGER AS $$
declare
    promo_id INTEGER;
begin
    SELECT NEW.pid INTO promo_id;
    IF (promo_id IS NULL) THEN
        RETURN NEW;
    END IF;

    IF EXISTS(
        SELECT 1
        FROM Promotions P
        WHERE P.pid = promo_id
        AND NOW() < P.end_date
        AND NOW() > P.start_date
    ) THEN
        RETURN NEW;
    END IF;

    RETURN NULL;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER promo_time_trigger
BEFORE INSERT
ON Orders
FOR EACH ROW
EXECUTE FUNCTION check_promo_time();

CREATE OR REPLACE FUNCTION check_order_restaurant() RETURNS TRIGGER AS $$
declare
    restaurant INTEGER;
begin
    SELECT M.rest_id
    FROM Food_Items FI join Menus M on FI.menu_id = M.menu_id
    WHERE FI.fid = NEW.fid
    INTO restaurant;

    -- RAISE NOTICE 'NEW: % | % | %', NEW.oid, NEW.fid, NEW.quantity;
    -- RAISE NOTICE 'restaurant: %', restaurant;

    IF EXISTS(
        SELECT 1
        FROM Order_Contains_Food OCF join Food_Items FI on OCF.fid = FI.fid
        join Menus M on FI.menu_id = M.menu_id
        WHERE OCF.oid = NEW.oid
        AND M.rest_id <> restaurant
    ) THEN
        RETURN NULL;
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER order_restaurant_trigger
BEFORE INSERT
ON Order_Contains_Food
FOR EACH ROW
EXECUTE FUNCTION check_order_restaurant();