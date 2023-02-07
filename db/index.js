const { Pool } = require('pg')

const pool = new Pool({
  "host": '127.0.0.1',
  "user": "andyma",
  "password": '',
  "port": 5432,
  "database": 'questionsandanswers',
  "max" : 1000,
  "connectionTimeoutMillis": 0,
  "idleTimeoutMillis": 0
});

module.exports = {
 query(text, params, callback){
    return pool.query(text, params, callback)
  },
}