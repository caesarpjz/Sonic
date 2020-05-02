SELECT addOrder(0, 1, 'CASH', 'BUKIT TIMAH', 'WOODLANDS');
SELECT addOrder(0, 2, 'CASH', 'CITY HALL', 'ANG MO KIO');
SELECT addOrder(0, 3, 'CREDIT CARD',  'BUONA VISTA', 'TANJONG PAGAR');
SELECT allocateRider(1, 1);
SELECT allocateRider(2, 2);
SELECT allocateRider(4, 3);

SELECT timestamp_departForRest(1);
SELECT timestamp_arriveAtRest(1);
SELECT timestamp_departFromRest(1);
SELECT timestamp_orderDelivered(1);
