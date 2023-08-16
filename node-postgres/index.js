const express = require('express')
const app = express()
const port = 3001
const react_port = 3002
const react_url = `http://localhost:${react_port}`
const merchant_model = require('./merchant_model')
let page = 0
let rows = 5
app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', react_url);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


// initial fetch function to grab data from postgres database
app.get('/', (req, res) => {
  let table = req.query.table
  let page = req.query.page
  let limit = req.query.limit
  
  body = {table, page, limit}
  console.log(body)
  merchant_model.getMerchants(body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/merchants/unique', (req, res) => {
  merchant_model.addUniqueColumn()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

// use the req.body as the input
// req.body will have fields like name, id, etc
app.post('/create', (req, res) => {
  console.log(req.body)
  merchant_model.createRow(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/json', (req, res) => {
  console.log(req.body)
  let fields = (req.body.fields.toString())
  let values = (req.body.values.toString())
  console.log(fields)
  console.log(values)
  merchant_model.createBlankRow(
    {
      table: "merchants",
      fields: fields,
      values: values
    }

  )
})
app.post('/update', (req, res) => {
  console.log(req.body)
  merchant_model.createRow(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
// different from above function where the specific fields are inputted into the function
app.post('/nextpage', (req, res) => {
  console.log(req.body)
  merchant_model.getMerchants(req.body.pagenum, req.body.rows)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/search', (req, res) => {
  console.log(req.body)
  merchant_model.searchMerchants(req.body.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/searchColumn', (req, res) => {
  console.log(req.body)
  merchant_model.searchColumn(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/deleteRow', (req, res) => {
  console.log(req.body)
  merchant_model.deleteRow(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/merchants/update/:id', (req, res) => {
    merchant_model.updateMerchant(req.body)
    .then(response => {
        res.status(200).send(response);
    })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/merchants/:id', (req, res) => {
console.log(req.params)
  merchant_model.deleteMerchant(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.post('/merchants/query', (req, res) => {
  console.log(req.body.query)
    merchant_model.processQuery(req.body.query)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})