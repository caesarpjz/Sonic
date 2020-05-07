-- SELECT addShift(1, '01/05/20 12:00:00', '01/05/20 16:00:00');
-- SELECT addShift(1, '01/05/20 20:00:00', '01/05/20 22:00:00');

CREATE OR REPLACE FUNCTION create_dummy_ft_shifts() 
RETURNS VOID AS $$
declare
    curs CURSOR FOR 
        SELECT R.rid
        FROM Riders R
        WHERE R.is_full_time = true;
    count INTEGER;
    my_date TIMESTAMP;
    time_to_insert TIMESTAMP;
begin
    count := 0;
    my_date := CAST(date_trunc('day', now()) AS TIMESTAMP);
    FOR day IN 1..5 LOOP
        FOR rec IN curs LOOP
            time_to_insert := my_date + interval '10 hours' + count * interval '1 hour';

            INSERT INTO SHIFTS
            VALUES 
            (DEFAULT, rec.rid, time_to_insert, time_to_insert + interval '4 hours'),
            (DEFAULT, rec.rid, time_to_insert + interval '5 hours', time_to_insert + interval '9 hours');

            count := (count + 1) % 4;
        END LOOP;
        my_date := my_date + interval '1 day';
    END LOOP;
end
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION create_dummy_pt_shifts() 
RETURNS VOID AS $$
declare
    curs CURSOR FOR 
        SELECT R.rid
        FROM Riders R
        WHERE R.is_full_time = false;
    my_date TIMESTAMP;
    a INTEGER;
    b INTEGER;
    time_to_insert TIMESTAMP;
begin
    my_date := CAST(date_trunc('day', now()) AS TIMESTAMP);
    a := 10;
    b := 18;

    FOR day IN 1..5 LOOP
        FOR rec IN curs LOOP
            time_to_insert := my_date + interval '1 hour' * (floor(random()*(b - a + 1)) + a);

            INSERT INTO SHIFTS
            VALUES
            (DEFAULT, rec.rid, time_to_insert, time_to_insert + interval '4 hours');
        END LOOP;   
        my_date := my_date + interval '1 day';
    END LOOP;
end
$$ LANGUAGE PLPGSQL;

SELECT create_dummy_ft_shifts();
SELECT create_dummy_pt_shifts();
