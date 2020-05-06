-- CREATE OR REPLACE FUNCTION trim_spaces() RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.company = btrim(regexp_replace(NEW. company , '\s+' , ' ' , 'g'));
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- DROP TRIGGER IF EXISTS trim_spaces_trigger ON Registrations;
-- CREATE TRIGGER trim_spaces_trigger
-- BEFORE UPDATE OR INSERT
-- ON Registrations
-- FOR EACH ROW
-- EXECUTE FUNCTION trim_spaces();

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