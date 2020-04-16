SELECT addOrder(0, 1, 'CASH', 'WOODLANDS');
SELECT addOrder(0, 2, 'CASH', 'ANG MO KIO');
SELECT addOrder(0, 3, 'CREDIT CARD', 'TANJONG PAGAR');
SELECT allocateRider(1, 1);
SELECT allocateRider(2, 2);
SELECT allocateRider(4, 3);

SELECT timestamp_departForRest(1);
SELECT timestamp_arriveAtRest(1);
SELECT timestamp_departFromRest(1);
SELECT timestamp_orderDelivered(1);
