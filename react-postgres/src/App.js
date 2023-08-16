import React, {useState, useEffect} from 'react';
import './App.css';
import store from './app/store'
import { Provider } from 'react-redux'
import { Counter } from './Counter'
import { useSelector, useDispatch } from 'react-redux'
import { assignTable, addRow, addToDelete } from './features/tableSlice'
const routes = {
  query: "http://localhost:3001/merchants/query"
}

const Entry = ({dataProps, setMerchants, args}) => {
  const dispatch = useDispatch()
  useEffect(() => {
  }, [])
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
    // const query = `DELETE FROM ${args.table} WHERE "${args.keyColumn}" = '${data.id}';`

    // let confirmation = prompt("Are you sure you want to delete this?")
    // if(confirmation === "yes"){
    //   actions.sendQuery(setMerchants, query)
    // }
    dispatch(addToDelete(data.rownum))
    
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
          :
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
const MainApp = () => {
  const tableRedux = useSelector((state) => state.table.value)
  const deleteTray = useSelector((state) => state.table.deleteTray)
  const dispatch = useDispatch()

  const [merchants, setMerchants] = useState(false);
  const [pagenum, setpagenum] = useState(0)
  const [rows, setRows] = useState(200)
  const [table, setTable] = useState("merchants")
  const [keyColumn, setKeyColumn] = useState("id")
  const [blankColumn, setBlankColumn] = useState("id")
  const [page, setPage] = useState(0)
  const args = {
    rows: rows,
    table: table,
    keyColumn: keyColumn,
    page: page
  }
  useEffect(() => {
    pageRefresh()
  }, []);
  const addToDelete = (rownum) => {

  }
  const addNewRow = () => {

    let fields = Object.keys(merchants[0])[0]
    let values = ""
    
    fetch('http://localhost:3001/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({table, fields, values}),
    })
      .then(response => {
        return response.text();
      })
      setTimeout(() => {
        pageRefresh()
      }, 3000);
    setTimeout(() => {
  console.log('Hello, World!')
}, 3000);
    
  }
  const handleTableChange = () => {
    let tableName = prompt("Enter new table name")
    setTable(tableName)
  }
  const pageRefresh = () => {
    fetch(`http://localhost:3001/?table=${table}&page=${pagenum}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        dispatch(assignTable([]))
        let merchList = (JSON.parse(data)).reverse()
        for (let i = 0; i < merchList.length; i++) {
          merchList[i].rownum = i
          dispatch(addRow(merchList[i]))
        }
        
        const blankColumn =(Object.keys(merchList[0])[0])
        setBlankColumn(blankColumn)
        setMerchants(merchList.reverse());
        console.log(tableRedux)
      });
  }
  function setRowsPerPage() {
    let rowsPerPage = prompt("Enter rows per page");
    setRows(rowsPerPage)
    pageRefresh()

  }
  function handleRowChange() {
    setRowsPerPage()
    

  }
  function handleNextPage() {
    let newpage = pagenum + 1
    setpagenum(newpage)

    fetch(`http://localhost:3001/?table=${table}&page=${newpage}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        const blankColumn =(Object.keys(merchList[0])[0])
        setBlankColumn(blankColumn)
        setMerchants(merchList);
      });
    // nextPage(newpage)
  }
  function handlePrevPage() {
    let newpage = pagenum - 1
    if (newpage >= 0){
      setpagenum(newpage)
      fetch(`http://localhost:3001/?table=${table}&page=${newpage}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        const blankColumn =(Object.keys(merchList[0])[0])
        setBlankColumn(blankColumn)
        setMerchants(merchList);
      });
    }
  }

  return (
    <div>
      <h1>PostgreSQL Record Manager</h1>
      Using table: {table}
      Delete Tray: {deleteTray}
      <hr />
      <p>Page {pagenum} with {rows} rows per page</p>
      <div>
        <MenuButton clickFunction={addNewRow} title = "Add new row" />
        <MenuButton clickFunction={handleTableChange} title = "Change Table"/>
        <MenuButton clickFunction={pageRefresh} title = "Page Refresh"/>
      </div>
      <MenuButton className='search' clickFunction={() => actions.searchData(setMerchants, table, keyColumn)} title = "Search"/>
      <button onClick={handleRowChange}>Set Rows Per Page</button>
      <MenuButton className='delete' clickFunction={() => actions.deleteData(setMerchants, table, keyColumn)} title = "Delete"/>
      <div>
        <button className = 'nav' onClick={handleNextPage}>Next page</button>
        <button className = 'nav' onClick={handlePrevPage}>Previous page</button>
      </div>
      {/* <MenuButton clickFunction={() => actions.sendQuery(setMerchants)} title = "Send Query" /> */}
      <Table itemArrayProps = {tableRedux} setMerchants={setMerchants} args = {args}/>
    </div>
  );
}

const App = () => {
  return(
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}
export default App;