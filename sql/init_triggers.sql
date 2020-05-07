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
        RAISE EXCEPTION 'Ordered quantity(%) exceeded limit(%) of food(id:%).',
         my_quantity, 
         my_limit, 
         NEW.fid;
        -- RETURN NULL;
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

    RAISE EXCEPTION 'Promotion is not valid now.';
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
        RAISE EXCEPTION 'Food ordered should come from the same restaurant.';
        -- RETURN NULL;
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER order_restaurant_trigger
BEFORE INSERT
ON Order_Contains_Food
FOR EACH ROW
EXECUTE FUNCTION check_order_restaurant();

CREATE OR REPLACE FUNCTION check_promo_startend_time() RETURNS TRIGGER AS $$
declare
begin
    IF (NEW.start_date > NEW.end_date) THEN
        RAISE EXCEPTION 'End date of promotion is before its start date.';
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER promo_startend_time_trigger
BEFORE INSERT 
ON Promotions
FOR EACH ROW
EXECUTE FUNCTION check_promo_startend_time();

CREATE OR REPLACE FUNCTION check_rider_shift() RETURNS TRIGGER AS $$
begin
    IF ((EXTRACT(EPOCH FROM 
            NEW.start_time - date_trunc('hour', NEW.start_time))) != 0) THEN
        RAISE EXCEPTION 'Shift should start on the hour (entered: %).', NEW.start_time;
    END IF;

    IF ((EXTRACT(EPOCH FROM 
            NEW.end_time - date_trunc('hour', NEW.end_time))) != 0) THEN
        RAISE EXCEPTION 'Shift should end on the hour (entered: %).', NEW.end_time;
    END IF;

    IF (EXTRACT('hour' 
            FROM NEW.end_time - NEW.start_time) > 4) THEN
        RAISE EXCEPTION 'Shift should not exceed 4 hours.';
    END IF;

    IF EXISTS(
        SELECT 1 
        FROM Shifts S
        WHERE S.rid = NEW.rid
        AND S.end_time >= NEW.start_time
        AND S.start_time <= NEW.start_time)
    OR EXISTS(
        SELECT 1
        FROM Shifts S
        WHERE S.rid = NEW.rid
        AND S.start_time <= NEW.end_time
        AND S.end_time >= NEW.end_time
    ) THEN
        RAISE EXCEPTION 'Shift should not cut into another shift and there should be at least 1 hour break between each shifts.';
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER rider_shift_trigger
BEFORE INSERT
ON Shifts
FOR EACH ROW
EXECUTE FUNCTION check_rider_shift(); 

CREATE OR REPLACE FUNCTION check_FT_rider_shift() RETURNS TRIGGER AS $$
begin
    IF EXISTS(
        SELECT 1
        FROM Riders R 
        WHERE R.rid = NEW.rid
        AND is_full_time = FALSE
    ) THEN
        RETURN NEW;
    END IF;

    IF (EXTRACT('hour' FROM NEW.start_time) = 10) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 14) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 11) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 15) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 12) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 16) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 13) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 17) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 15) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 19) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 16) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 20) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 17) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 21) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSIF (EXTRACT('hour' FROM NEW.start_time) = 18) THEN
        IF (EXTRACT('hour' FROM NEW.end_time) <> 22) THEN
            RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
        END IF;
    ELSE
        RAISE EXCEPTION 'Shift starts (%) and ends (%) not one of the fixed shifts.',
            NEW.start_time,
                NEW.end_time;
    END IF;

    RETURN NEW;
end
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER FT_rider_shift_trigger
BEFORE INSERT 
ON Shifts
FOR EACH ROW
EXECUTE FUNCTION check_FT_rider_shift();