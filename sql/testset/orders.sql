SELECT addOrder(0, 1, 'CASH', 'BUKIT TIMAH', 'WOODLANDS', 2);
SELECT addOrder(0, 2, 'CASH', 'CITY HALL', 'ANG MO KIO', NULL);
SELECT addOrder(0, 3, 'CREDIT CARD',  'BUONA VISTA', 'TANJONG PAGAR', NULL);
SELECT allocateRider(1, 1);
SELECT allocateRider(2, 2);
SELECT allocateRider(4, 3);

SELECT timestamp_departForRest(1);
SELECT timestamp_arriveAtRest(1);
SELECT timestamp_departFromRest(1);
SELECT timestamp_orderDelivered(1);
