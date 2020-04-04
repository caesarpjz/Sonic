
const { pool } = require('../config')

async function readAll(req, res) {
  try {
    const readAllQuery = 'SELECT * FROM users';
    const { rows } = await pool.query(readAllQuery);
    return res.send({ rows });
  } catch (error) {
    return res.send(error);
  }
};

const read = readAll;

module.exports = read;