const table = "test";
const key_column = "id"

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_database',
  password: 'Riceball12!',
  port: 5432,
});

const addUniqueColumn = () => {

  return new Promise(function(resolve, reject) {
    q2 = `ALTER TABLE ${table} ADD COLUMN ID SERIAL PRIMARY KEY`
    console.log(q2)
    pool.query(q2, (error, results) => {
      if (error) {
        console.log("error")
        reject(error)
      }
      resolve(`attempted`);
    })
  }) 
}

const getMerchants = (page, rows) => {

    return new Promise(function(resolve, reject) {
      q2 = `SELECT * FROM ${table} ORDER BY "${key_column}" ASC LIMIT ${rows} OFFSET ${page}*${rows}`
      console.log(q2)
      pool.query(q2, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const searchMerchants = (value) => {
    return new Promise(function(resolve, reject) {
      q2 = `SELECT * FROM ${table} WHERE "${key_column}" = '${value}'`
      console.log(q2)
      pool.query(q2, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const createMerchant = (body) => {
    console.log(body)
    return new Promise(function(resolve, reject) {
      const { fields, values } = body
      
      let q = `INSERT INTO ${table} (${fields}) VALUES (${values}) RETURNING *`
      console.log(q)
      pool.query(q, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Added`)
      })
    })
  }
  const updateMerchant = (body) => {
    console.log(body)
    return new Promise(function(resolve, reject) {
      const { id, field, newval } = body
      let q = (`UPDATE ${table} SET "${field}" = '${newval}' WHERE "${key_column}" = '${id}' RETURNING *`)
      console.log(q)
      pool.query(q, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(`Merchant has been updated: ${results}`)
      })
    })
  }
  const deleteMerchant = (id) => {
    return new Promise(function(resolve, reject) {
      let q = `DELETE FROM ${table} WHERE "${key_column}" = '${id}'`
      console.log(q)
      pool.query(q, (error, results) => {
        console.log(results)
        if (error) {
        console.log("bruh")
          reject(error)
        }
        resolve(`Merchant deleted with ID: ${id}`)
      })
    })
  }
  
  module.exports = {
    getMerchants,
    createMerchant,
    deleteMerchant,
    updateMerchant,
    searchMerchants,
    addUniqueColumn
  }