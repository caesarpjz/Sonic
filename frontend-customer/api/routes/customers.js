var express = require('express');
var router = express.Router();
const db = require('../sql');

// Gets the restuarant that they want to search for from the application.
router.get('restaurants/', (req, res, next) => {
    const rest_name = req.params.name;
    db.query('SELECT name FROM restaurants WHERE rest_id = $1', [rest_name], (err, res) => {
        if (err) {
            return next(err);
        }
        res.send(res.rows[0]);
    });
});

// Gets the points that the current customer has as of right now.
router.get('customer/:id', (req, res, next) => {
    db.query('SELECT points FROM customers WHERE cid = $1', [req.params.id], (err, res) => {
        if (err) {
            return next(err);
        }
        res.send(res.rows[0]);
    });
});

// Inserts the order placed by the customer to the orders and order_contains_food table.
router.put('orders/:id' (req, res, next) => {
    const order_length = db.query('SELECT max(oid) FROM orders');
    const delivery_length = db.query('SELECT max(did) FROM deliveries');
    const foodArray = req.params.food;
    const food_cost = 0.00
    var i;
    for (i = 0; i < foodArray.length; i++) {
        food_cost += db.query('SELECT ')
    }
    const food_cost = db.query('SELECT ');

    
    db.query(
        'INSERT INTO ORDERS values ()',[order_length + 1, delivery_length + 1, ], (req, res, next) => {

        }
        );
})

module.exports = router;

