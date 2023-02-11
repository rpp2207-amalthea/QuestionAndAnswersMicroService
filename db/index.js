const { Pool } = require('pg')
require('dotenv').config('../.env')

console.log(`dbtest is equal to ${process.env.DB_DATABASE}`)
const pool = new Pool({
  "host": 'sdc-db_c',
  "user": 'postgres',
  "password": 'password',
  "port": 5432,
  "database":process.env.DB_DATABASE,
});

module.exports = {
 query(text, params, callback){
    return pool.query(text, params, callback)
  },
}