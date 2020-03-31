var express = require('express');
var router = express.Router();
const db = require('../sql');

const app = express();

const users_size = db.query('SELECT max(id) FROM users');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('signUpPage/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, res) => {
    if (err) {
      return next(err);
    }
    res.send(res.rows[0]);
  });
});

router.post('signUpPage/:id', (req, res, next) => {
  db.query();
});

router.put('signUpPage/:id', (req, res, next) => {
  let ts = Date.now();
  let date_ob = new Date(ts);

  db.query('INSERT INTO users values ($1, $2, $3, $4)', [users_size + 1, req.params.username, req.params.password, date_ob], (err, res) => {
    if (err) {
      return next(err);
    }
    res.send('Welcome onboard amigo!');
  } );
});

router.delete('signUpPage/:id', (req, res, next) => {
  db.query('');
})


module.exports = router;
