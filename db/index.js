const { Pool } = require('pg')
require('dotenv').config('../.env')

console.log(`dbtest is equal to ${process.env.DB_DATABASE}`)
const pool = new Pool({
  "host": process.env.DB_HOST,
  "user": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "port": process.env.DB_PORT,
  "database":process.env.DB_DATABASE,
});

module.exports = {
 query(text, params, callback){
    return pool.query(text, params, callback)
  },
}