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
EXECUTE FUNCTIon check_promo_time();