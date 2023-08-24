const table = "merchants";
const key_column = "name"

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

const getTables = () => {
 return new Promise(function(resolve, reject) {
    
    q2 = `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    console.log(q2)
    pool.query(q2, (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}
const processQuery = (query) => {
  return new Promise(function(resolve, reject) {
    
    console.log(query)
    pool.query(query, (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const getMerchants = (body) => {
    return new Promise(function(resolve, reject) {
      q2 = `SELECT * FROM ${body.table} LIMIT ${body.limit} OFFSET ${body.page}*${body.limit}`
      console.log(q2)
      pool.query(q2, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const createRow = (body) => {
    return new Promise(function(resolve, reject) {
      let q = `INSERT INTO ${body.table} () VALUES ()`
      console.log(q)
      pool.query(q, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve("Attempted to create row")
      })
    })
  }
  const createBlankRow = (body) => {
    return new Promise(function(resolve, reject) {
      let q = `INSERT INTO ${body.table} VALUES (NULL)`
      console.log(q)
      pool.query(q, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve("Attempted to Create Blank Row")
      })
    })
  }
  const updateRow = (body) => {
    let q2 = `UPDATE ${body.table} SET "${body.fields}" = '${body.values}' WHERE "${body.key_column}" = '${body.id}';`
    console.log(q2)
    return new Promise(function(resolve, reject) {
      
      console.log(q2)
      pool.query(q2, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve("Attempted update")
      })
    })
  }
  const searchColumn = (body) => {
    return new Promise(function(resolve, reject) {
      q2 = `SELECT * FROM "${body.table}" WHERE "${body.key_column}" = '${body.value}'`
      console.log(q2)
      pool.query(q2, (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }
  const filterColumn = (body) => {
    return new Promise(function(resolve, reject) {
      q2 = `SELECT DISTINCT "${body.colname}" FROM ${body.table}`
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
  const deleteRow = (body) => {
    return new Promise(function(resolve, reject) {
      let q = `DELETE FROM ${body.table} WHERE "${body.key_column}" = '${body.target}'`
      console.log(q)
      pool.query(q, (error, results) => {
        console.log(results)
        if (error) {
        console.log("bruh")
          reject(error)
        }
        resolve("Deletion attempted")
      })
    })
  }
  module.exports = {
    getMerchants,
    createMerchant,
    deleteMerchant,
    updateMerchant,
    searchMerchants,
    addUniqueColumn,
    processQuery,
    createRow,
    searchColumn,
    deleteRow,
    createBlankRow,
    updateRow,
    filterColumn,
    getTables 
  }
