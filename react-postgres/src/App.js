import React, {useState, useEffect} from 'react';
import './App.css';
import store from './app/store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { assignTable, assignTableName, addRow, addToDelete, addToNew, addToEdit, replaceEditRow, clearDeleteTray, clearNewTray, clearEditTray, removeFromDelete } from './features/tableSlice'

const Entry = ({dataProps, args}) => {
  const editTray = useSelector((state) => state.table.editTray)
  const newTray = useSelector((state) => state.table.newTray)
  
  const deleteTray = useSelector((state) => state.table.deleteTray)
  const dispatch = useDispatch()
  useEffect(() => {

  }, [])
  const [data, setData] = useState({})
  const [edited, setEdited] = useState({})
  const [status, setStatus] = useState("default")
  
  
  useEffect(() => {
    setEdited({})
    setData(dataProps)
    console.log(newTray.includes(dataProps.rownum))
  }, [])

  useEffect(() => {
    updateMerchant()
  }, [edited])

  function updateMerchant() {
    console.log(data)
    let res = editTray.filter((row) => {
      return row.rownum === data.rownum
    })
    if(res.length === 0) {
      dispatch(addToEdit(edited))
    }
    else {
      dispatch(replaceEditRow(data.rownum))
      dispatch(addToEdit(edited))
    }
    
  }
  const deleteMerchant = () => {
    console.log(deleteTray)
    if(status === "delete") {
      setStatus("default")
      console.log("ye")
      dispatch(removeFromDelete(data.rownum))
    }
    else {
      console.log(data)
      setStatus("delete")
      dispatch(addToDelete(data.rownum))
    }
  }
  const handleInputChange = (e, field) => {
    let newEdited = {
      ...edited,
      rownum: data.rownum,
      id: data[args.keyColumn]
    }
    newEdited[field] = e
    console.log(newEdited)
    setEdited(newEdited)
    // error because this is not accurate until next call
    console.log(edited)

    setStatus("edit")
  }
  const styles = {
    edit: {
      background: "#FAC898"
    },
    delete: {
      background: "#FF5733"
    },
    new: {
      background: "green"
    },
    default: {
      background: "white"
    }
  }
  return (
      <tr onClick={() => console.log(edited)} style={styles[newTray.includes(data.rownum) ? styles.new : status]}>
      
      <td>
        {/*<button onClick={updateMerchant}>Update Local State</button>*/}
        <input onClick={deleteMerchant}type="checkbox"/>
        <p>Delete </p>
        <img style={{width: "20px", height: "20px"}} src = {require("./IMG_3061.jpg")} />
      </td>
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

const Column = ({rowname, args, setBlankColumn}) => {

  const dispatch = useDispatch()
  const tableRedux = useSelector((state) => state.table.value)
  const [uniques, setUniques] = useState([])
  const [search, setSearch] = useState("")
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(search)
    searchColumns(search)
  }
  const gatherUniques = (colname) => {
    console.log("yuh")
    let table = args.table
    let body = {table, rowname}
    console.log(body)
     fetch('http://localhost:3001/filterColumn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({table, colname}),
    })
    .then(response => {
      return response.text()
    })
    .then(data => {
      let uniqueList = (JSON.parse(data))
      for(let i = 0; i < uniqueList.length; i++) {
        console.log(uniqueList[i][rowname])
      }
      setUniques(uniqueList)
    })
  
  }
  const searchColumns = (colname) => {
    let body = {
      table: args.table,
      key_column: rowname,
      value: colname
    }
    dispatch(assignTable([]))
    console.log(body)
    fetch('http://localhost:3001/searchColumn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => {
      return response.text();
    }).then(data => {
      console.log(data)
      let merchList = (JSON.parse(data))
      console.log(merchList)
      if(merchList.length !== 0){
        
        for (let i = 0; i < merchList.length; i++) {
          merchList[i].rownum = i
          dispatch(addRow(merchList[i]))
        }
          
          
        const blankColumn =(Object.keys(merchList[0])[0])
        setBlankColumn(blankColumn)
        console.log(tableRedux)
      }

    });
  }
  
  return(
    <div>
      <p>{rowname}</p>
      {
        rowname !== "rownum" ?
        <div class="dropdown">
        <form onMouseEnter={() => gatherUniques(rowname)} onSubmit={handleSubmit}>
          <label>
            <input type="text" values={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </form>
        {/* <button className = 'nav' onClick={() => gatherUniques(rowname)}>Gather unique values</button> */}
        <div class="dropdown-content">
          {uniques.map((unique) => (
            <p onClick={() => searchColumns(unique[rowname])}>{unique[rowname]}</p>
          ))}
        </div>
      </div> :
      null
      }
      
    </div>
  )
}
const Table = ({itemArrayProps, args, setBlankColumn}) => {
  const itemArray = Array.from(itemArrayProps).reverse();
  return (
    <div>
    <table className = 'table'>
      <tbody>
        <tr className='rownames'>
          
          :
          {itemArray[0] ? 
            Object.keys(itemArray[0]).map((field) => (
            <td><Column rowname = {field} args = {args} setBlankColumn={setBlankColumn}/></td>
          )) 
          : 
          null}
        </tr>
      {itemArray.map((user) => (
        <Entry dataProps = {user} args = {args}/>
      ))}
      </tbody>
    </table>
    </div>
  )
}

const TableButton = ({tableName, changeTableFunc}) => {
  return(
    <div>
      <a onClick={() => changeTableFunc(tableName)}>{tableName}</a>
    </div>
  )
}
const MenuButton = ({className, clickFunction, title}) => {
  return (
    <button className={className} onClick={clickFunction}>{title}</button>
  )
}
const MainApp = () => {
  const tableRedux = useSelector((state) => state.table.value)
  const tableName = useSelector((state) => state.table.tableName)
  const deleteTray = useSelector((state) => state.table.deleteTray)
  const newTray = useSelector((state) => state.table.newTray)
  const editTray = useSelector((state) => state.table.editTray)
  const dispatch = useDispatch()
  
  const [tableList, setTableList] = useState([])
  const [merchants, setMerchants] = useState(false);
  const [pagenum, setpagenum] = useState(0)
  const [rows, setRows] = useState(200)
  const [table, setTable] = useState("merchants")
  const [keyColumn, setKeyColumn] = useState("id")
  const [blankColumn, setBlankColumn] = useState("id")
  const [page, setPage] = useState(0)
  const [searchColumn, setSearchColumn] = useState("id")
  const [time, setTime] = useState("")
  const args = {
    rows: rows,
    table: table,
    keyColumn: keyColumn,
    page: pagenum
  }
  useEffect(() => {
    setTimeout(() => {
      pageRefresh()
      getTables()
      getTime()
    }, 1000);
    dispatch(assignTableName(table))
  }, []);

  const getTables = () => {
    fetch('http://localhost:3001/getTables/')
      .then(response => {
        return response.text()
      })
      .then(data => {
        console.log(data)
        let merchList = (JSON.parse(data))
        console.log(merchList)
        let tableList = []
        if(merchList.length !== 0) {
        for(let i = 0; i < merchList.length; i++) {
          tableList.push(merchList[i].table_name)
        }
        console.log(tableList)
        setTableList(tableList)

      }
              
    })
  }
  const addNewRow = () => {
    let firstEntry = Object.keys(tableRedux[0])
    console.log(firstEntry)
    console.log("bleep")
    let newRow = {}

    for (const key of firstEntry) {
      newRow[key] = ""
    }
    newRow = {
      ...newRow,
      rownum: tableRedux.length + 1 }
    dispatch(addToNew(newRow.rownum))
    dispatch(addRow(newRow))
  }
  const handleTableChange = () => {
    let tableName = prompt("Enter new table name")
    setTable(tableName)
  }
  const pageRefresh = () => {
    getTime()
    dispatch(assignTable([]))
    fetch(`http://localhost:3001/?table=${table}&page=${pagenum}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        if(data !== []) {
          dispatch(assignTable([]))
          let merchList = (JSON.parse(data))
          if (merchList.length !== 0) {
            for (let i = 0; i < merchList.length; i++) {
              merchList[i].rownum = i
              dispatch(addRow(merchList[i]))
            }

            if(merchList[0]){
              const blankColumn =(Object.keys(merchList[0])[0])
              setBlankColumn(blankColumn)
              console.log(tableRedux)
            }
            
          }
        }
        
      });
  }
  const searchColumns = () => {
    let searchValue = prompt("Enter desired search value")
    let body = {
      table: table,
      key_column: searchColumn,
      value: searchValue
    }
    dispatch(assignTable([]))
    fetch('http://localhost:3001/searchColumn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(response => {
      return response.text();
    }).then(data => {
      console.log(data)
      let merchList = (JSON.parse(data))
      if(merchList.length !== 0){
        
        for (let i = 0; i < merchList.length; i++) {
          merchList[i].rownum = i
          dispatch(addRow(merchList[i]))
        }
          
          
        const blankColumn =(Object.keys(merchList[0])[0])
        setBlankColumn(blankColumn)
        console.log(tableRedux)
      }

    });
  }
  const commitNewRow = (row) => {
    console.log("yuh")
     let fields = Object.keys(row)
     let values = Object.values(row)
     fields.pop()
     values.pop()
     for(let i = 0; i < fields.length; i++) {
      fields[i] = "\"" + fields[i] + "\"" 
      values[i] = "\'" + values[i] + "\'" 
     }
     let bodyJSON = JSON.stringify({table, fields, values})
     console.log(bodyJSON)

     fetch('http://localhost:3001/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({table, fields, values}),
    })
    .then(response => {
      return response.text()
    })
    .then(data => {
      alert(data)
    })
  
  }
  const commitNewRows = () => {
    for (let i = 0; i < newTray.length; i++) {
      commitNewRow(newTray[i])
    }
    setTimeout(() => {
      pageRefresh()
    }, 3000);
  }
  const commitNewEdit = (index) => {
    let curr = {
      ...editTray[index]
    }
    delete curr.rownum
    let fields = Object.keys(curr)
    let values = Object.values(curr)

     console.log(fields[0])
    let bodyJSON = JSON.stringify({table, fields, values})
    console.log(bodyJSON)

    for(let i = 0; i < fields.length; i++) {
      fetch('http://localhost:3001/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({table, fields: fields[i], values: values[i], key_column: keyColumn, id: curr[keyColumn]}),
      })
    }

     
  
  }
  const commitAllEdits = () => {
    for (let i = 0; i < editTray.length; i++) {
      commitNewEdit(i)
      setTimeout(() => {
        pageRefresh()
      }, 3000);
    }
  }
  const deleteRow = (rownum) => {
    const result = tableRedux.filter(function(row) {
      return row.rownum === rownum
    })
    console.log(result[0])
    let body = {
      table: table,
      key_column: keyColumn,
      target: result[0][keyColumn]

    }
    fetch('http://localhost:3001/deleteRow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    console.log(body)
  }
  const commitDeletes = () => {
    for (let i = 0; i < deleteTray.length; i++) {
      deleteRow(deleteTray[i])
      console.log(deleteTray[i])
    }
    setTimeout(() => {
      pageRefresh()
    }, 3000);
  }
  const commitAllChanges = () => {
    if (newTray.length != 0) {
      commitNewRows()
    }
    if (deleteTray.length != 0) {
      commitDeletes()
    }
    if (editTray.length != 0) {
      commitAllEdits()
    }

    dispatch(clearNewTray())

    dispatch(clearDeleteTray())
    dispatch(clearEditTray())
    alert("Changes have been saved to the database.")
  }
  const changeSearchColumn = () => {
    let search = prompt("Assign search column")
    setSearchColumn(search)
  }
  function setRowsPerPage() {
    let rowsPerPage = prompt("Enter rows per page");
    setRows(rowsPerPage)
    setTimeout(() => {
      pageRefresh()
    }, 3000);
  }
  function handleNextPage() {
    let newpage = pagenum + 1
    

    fetch(`http://localhost:3001/?table=${table}&page=${newpage}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log(data)
        if(data !== []) {
          
          let merchList = (JSON.parse(data))
          if(merchList.length !== 0) {
            dispatch(assignTable([]))
            for (let i = 0; i < merchList.length; i++) {
              merchList[i].rownum = i
              dispatch(addRow(merchList[i]))
            }
          }
          if (merchList[0]) {
            
            const blankColumn =(Object.keys(merchList[0])[0])
            setpagenum(newpage)
            setBlankColumn(blankColumn)
            setMerchants(merchList);
          }
          
        }
        
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
        dispatch(assignTable([]))
        let merchList = (JSON.parse(data))
        const blankColumn =(Object.keys(merchList[0])[0])
        for (let i = 0; i < merchList.length; i++) {
          merchList[i].rownum = i
          dispatch(addRow(merchList[i]))
        }
        setBlankColumn(blankColumn)
      });
    }
  }
  const getTime = () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setTime(time)
  }
  return (
    <div>
      <div class="dropdown" onMouseEnter={getTables}>
        <button class="dropbtn">{table}▼</button>
        <div class="dropdown-content">
          {tableList.map((tableName) => (
            <TableButton tableName = {tableName} changeTableFunc = {setTable}/>
          ))}
        </div>
      </div>

      <MenuButton className = 'nav' clickFunction={pageRefresh} title = "Page Refresh"/>
      <p>Table Name: {table}</p>
      <p>Last Refresh: {time}</p>
     
      <p>Page {pagenum} with {rows} rows per page</p> <div> 
      </div>
      <hr />
      {/*
      <div>
        <h2>Legend</h2>
        <p>All cells are editable.</p>
        <p>Once you start editing, the row being edited will be highlighted yellow</p>
        <p>Selecting delete will highlight the row as red</p>
      </div>
      <div>
        <h2>Constraints</h2>
        <p>User should not be allowed to save an empty row (after insertion) - a popup will br thrown as an error</p>
        <p></p>
        <p>Selecting delete will highlight the row as red</p>
      </div>
      */}
      {/*<button className = 'nav' onClick={commitDeletes}>Commit Deletion</button> */}
      {/*<button className = 'nav' onClick={commitAllEdits}>Commit New Edits</button> */}
      <button className = 'nav' onClick={addNewRow}>Add Blank Row</button>
      {/*<button className = 'nav' onClick={commitNewRows}>Commit New Rows</button>*/}
      <button className = 'nav' onClick={commitAllChanges}>Commit All Changes</button>
      <hr />
      
      
      {/* <p>New Tray: {newTray}</p>
      <p>Delete Tray: {deleteTray}</p> */}
      <div>
        
        <button className = 'navButtons' onClick={handlePrevPage}>◀ Previous</button>
        <button className = 'rpp' onClick={setRowsPerPage}>Set Rows Per Page</button>
        <button className = 'navButtons' onClick={handleNextPage}>Next ▶</button>
      </div>
      <Table itemArrayProps = {tableRedux} args = {args} setBlankColumn = {setBlankColumn}/>
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
