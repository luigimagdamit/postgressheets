import React, {useState, useEffect} from 'react';
import './App.css';

const routes = {
  query: "http://localhost:3001/merchants/query"
}

const Entry = ({dataProps, setMerchants, args}) => {
  const [data, setData] = useState({})
  const [edited, setEdited] = useState({})
  
  useEffect(() => {
    setEdited({})
    setData(dataProps)
  }, [])

  function updateMerchant(id, field, newval) {
    const table = args.table
    const key_column = args.keyColumn
    const query = `UPDATE ${table} SET "${field}" = '${newval}' WHERE "${key_column}" = '${id}';`
    actions.sendQuery(setMerchants, query)
  }
  const deleteMerchant = () => {
    const query = `DELETE FROM ${args.table} WHERE "${args.keyColumn}" = '${data.id}';`

    let confirmation = prompt("Are you sure you want to delete this?")
    if(confirmation === "yes"){
      actions.sendQuery(setMerchants, query)
    }
    
  }
  const handleInputChange = (e, field) => {
    let newEdited = {
      ...edited
    }
    newEdited[field] = e
    setEdited(newEdited)
    console.log(edited)
  }
  const onSubmit = (field) => {
    
    const newData = {
      ...data,
      ...edited
    }
    setData(newData)
    // changes are only visible after the function ends
    //
    const fieldsArray = (Object.keys(newData))
    const valuesArray = Object.values(newData)

    // send a new update request for every item in the arrays
    for (let i = 0; i < fieldsArray.length; i++) {
      updateMerchant(data.id, fieldsArray[i], valuesArray[i])
    }
    alert("Attempted update");
    // NEED TO DO UPSERT IN SERVER FUNCTION
  }
  return (
        <tr>
          <button onClick={() => console.log(data)}>Print State</button>
          <button onClick={() => onSubmit("DAY_OF_MONTH_NUM")}>Submit Changes</button>
          <button onClick={deleteMerchant}>Delete Item</button>
          {Object.keys(data).map((field) => (
            <td>
              <div 
                contenteditable="true" 
                onInput={(e) => 
                  handleInputChange(e.currentTarget.textContent, field)
                }
              >
                {dataProps[field]}
              </div>
              </td>
          ))}
        </tr>

  )
}
const Table = ({itemArrayProps, setMerchants, args}) => {
  const itemArray = Array.from(itemArrayProps);
  return (
    <div>
    <table>
      <tbody>
        <tr className='rownames'>
          <button>hey</button>
          {itemArray[0] ? 
            Object.keys(itemArray[0]).map((field) => (
            <td>{field}</td>
          )) 
          : 
          null}
        </tr>
      {itemArray.map((user) => (
        <Entry dataProps = {user} setMerchants={setMerchants} args = {args}/>
      ))}
      </tbody>
    </table>
    </div>
  )
}

const actions = {
  getData:  function getMerchant(setMerchants) {
    const query = "SELECT * from merchants;"
    fetch(routes.query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  },
  searchData: function searchMerchants(setMerchants, table, key_column) {
    let val = prompt("enter search value")
    const query = `SELECT * FROM ${table} WHERE "${key_column}" = '${val}';`
    fetch(routes.query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log(data)
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  
  },
  createData: function createMerchant(setMerchants) {
    let fields = prompt('Enter fields');
    let values = prompt('enter values');
    fetch(routes.query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({fields, values}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        actions.getData(setMerchants);
      });
  },
  deleteData: function deleteMerchant(setMerchants, table, key_column) {
    let id = prompt('Enter merchant id');
    const query = `DELETE FROM ${table} WHERE "${key_column}" = '${id}'`
    actions.sendQuery(setMerchants, query)
  },
  sendQuery: function sendQuery(setMerchants, query) {
    console.log(query)
    fetch(routes.query, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        actions.getData(setMerchants);
      });
  },

}

const MenuButton = ({className, clickFunction, title}) => {
  return (
    <button className={className} onClick={clickFunction}>{title}</button>
  )
}
const App = () => {
  const [merchants, setMerchants] = useState(false);
  const [pagenum, setpagenum] = useState(0)
  const [rows, setRows] = useState(200)
  const [table, setTable] = useState("merchants")
  const [keyColumn, setKeyColumn] = useState("id")
  const [page, setPage] = useState(0)
  const args = {
    rows: rows,
    table: table,
    keyColumn: keyColumn,
    page: page
  }
  useEffect(() => {
    getData()
  }, []);
  const getData = () => {
    const query = `SELECT * from ${table};`
    fetch('http://localhost:3001/merchants/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  }
  const handleTableChange = () => {
    let tableName = prompt("Enter new table name")
    setTable(tableName)
    getData();
  }
  const pageRefresh = () => {
    getData();
  }
  function addID() {
    fetch('http://localhost:3001/merchants/unique')
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
        console.log(merchants)
      });
  }
  function setRowsPerPage() {
    let rowsPerPage = prompt("Enter rows per page");
    setRows(rowsPerPage)

  }
  function handleRowChange() {
    setRowsPerPage()
    nextPage(pagenum)

  }
  function nextPage(pagenum) {
    fetch(`http://localhost:3001/nextpage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pagenum, rows }),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  }
  function handleNextPage() {
    let newpage = pagenum + 1
    setpagenum(newpage)
    console.log(newpage)

    nextPage(newpage)
  }
  function handlePrevPage() {
    let newpage = pagenum - 1
    if (newpage >= 0){
      setpagenum(newpage)
      console.log(newpage)
      prevPage(newpage)
    }
    

    prevPage(newpage)
  }
  function prevPage() {
    fetch(`http://localhost:3001/nextpage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pagenum, rows }),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  }

  return (
    <div>
      <h1>PostgreSQL Record Manager</h1>
      {table}
      <hr />
      <p>Page {pagenum} with {rows} rows per page</p>
      {/* <button onClick={() => actions.searchData(setMerchants)}>Search</button> */}
      <div>

      </div>
      <MenuButton clickFunction={handleTableChange} title = "Change Table"/>
      <MenuButton clickFunction={pageRefresh} title = "Page Refresh"/>
      <MenuButton clickFunction={() => actions.sendQuery(setMerchants)} title = "Send Query" />
      <MenuButton className='search' clickFunction={() => actions.searchData(setMerchants, table, keyColumn)} title = "Search"/>
      <button onClick={handleRowChange}>Set Rows Per Page</button>

      <MenuButton className='Add Entry' clickFunction={() => actions.createData(setMerchants)} title = "Add Entry"/>
      <MenuButton className='delete' clickFunction={() => actions.deleteData(setMerchants, table, keyColumn)} title = "Delete"/>
      <button className = 'nav' onClick={handleNextPage}>Next page</button>
      <button className = 'nav' onClick={handlePrevPage}>Previous page</button>
      <button className = 'addID' onClick={addID}>add unique ids</button>
      <Table itemArrayProps = {merchants} setMerchants={setMerchants} args = {args}/>
    </div>
  );
}
export default App;