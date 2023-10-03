import React, {useState, useEffect} from 'react';
import './App.css';
import store from './app/store'
import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { assignTable, assignTableName, assignColumnTypes, addRow, addToDelete, addToNew, addToEdit, replaceEditRow, clearDeleteTray, clearNewTray, clearEditTray, removeFromDelete, editRow, replaceRow, addToEditID, clearEditID } from './features/tableSlice'

const port = "3001"
const backend = `http://localhost:${port}`

const Entry = ({dataProps, args}) => {
  const editTray = useSelector((state) => state.table.editTray)
  const newTray = useSelector((state) => state.table.newTray)
  const deleteTray = useSelector((state) => state.table.deleteTray)
  const tableRedux = useSelector((state) => state.table.value)
  const dispatch = useDispatch()
  useEffect(() => {

  }, [])
  const [data, setData] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [edited, setEdited] = useState({})
  const [status, setStatus] = useState("default")
  
  
  useEffect(() => {
    if(loaded === false) {
      setData(dataProps)
    }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if(loaded === false) {
      setData(dataProps)
    }
    setLoaded(true)
  }, [tableRedux])

  useEffect(() => {
    if (status !== "default") {

      updateMerchant()
    }
  }, [edited])

  function updateMerchant() {
    console.log(data)
    let res = editTray.filter((row) => {
      return row.rownum === data.rownum
    })
    if(res.length === 0) {
      dispatch(addToEdit(edited))
      dispatch(addToEditID(data.rownum))
    }
    else {
      dispatch(replaceEditRow(data.rownum))
      dispatch(addToEdit(edited))
    }
    
  }
  const handleDelete = () => {
    let confirm = prompt("Confirm delete? (y/n)")
    if(confirm === "y") {
      deleteMerchant()
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
      console.log(data.rownum + " added to delete")
    }
  }
  const handleInputChange = (e, field) => {
    let newEdited = {
      ...edited,
      rownum: data.rownum,
      id: data[args.keyColumn]
    }
    let newData = {
      ...data,
      ...edited,
      rownum: data.rownum,
    }
    newEdited[field] = e
    setEdited(newEdited)
    setData(newData)
    console.log(newEdited)
    // error because this is not accurate until next call

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
      <tr onClick={() => console.log(edited)} style={styles[status]}>
      <td onClick={() => console.log(newTray, editTray)}>
        {/*<button onClick={updateMerchant}>Update Local State</button>*/}
        <input onClick={handleDelete}type="checkbox"/>
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

const Column = ({rowname, args, dataType, setBlankColumn}) => {

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
     fetch(`${backend}/filterColumn`, {
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
    fetch(`${backend}/searchColumn`, {
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
      <p>-{dataType}-</p>
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
const Table = ({itemArrayProps, args, setBlankColumn, columnTypes}) => {

  const tableRedux = useSelector((state) => state.table.value)
  const [itemArray, setItemArray] = useState([])
  useEffect(() => {
    console.log(itemArray)
    let newArr = [
      ...tableRedux
    ].reverse()
    
    setItemArray(newArr)
  }, [tableRedux])
  return (
    <div className = "tableDiv">
    <table className = 'table'>
      <tbody>
        <tr className='rownames'>
          
          :
          {itemArray[0] ? 
            Object.keys(itemArray[0]).map((field) => (
            <td><Column dataType = {columnTypes[field]} rowname = {field} args = {args} setBlankColumn={setBlankColumn}/></td>
          )) 
          : 
          null}
        </tr>
      {itemArray.map((user) => (
        <Entry key = {user.rownum} dataProps = {user} args = {args}/>
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
  const columnTypes = useSelector((state) => state.table.columnTypes)
  const editTrayID = useSelector((state) => state.table.editTrayID)
  const dispatch = useDispatch()
  
  const [tableList, setTableList] = useState([])
  const [merchants, setMerchants] = useState(false);
  const [pagenum, setpagenum] = useState(0)
  const [rows, setRows] = useState(200)
  const [table, setTable] = useState("merchants")
  const [keyColumn, setKeyColumn] = useState("id")
  const [blankColumn, setBlankColumn] = useState("id")
  const [showDebug, setShowDebug] = useState(false)
  const [time, setTime] = useState("")
  const [debugMessages, setDebugMessages] = useState([])
  const [refresh, setRefresh] = useState(false);
  const args = {
    rows: rows,
    table: table,
    keyColumn: keyColumn,
    page: pagenum
  }
  useEffect(() => {
    console.log("bruh")
    console.log(tableRedux)
  }, []);
  useEffect(() => {
    setTimeout(() => {
      pageRefresh();
    }, "1000")
  }, [refresh])
  const getTables = () => {
    fetch(`${backend}/getTables/`)
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
  const getColumnTypes = () => {
    fetch(`${backend}/getColumnTypes?table=${table}`)
      .then(response => {
        return response.text()
      })
      .then(data => {
        console.log(data)
        let merchList = (JSON.parse(data))
        let tableList = {}
     
        if(merchList.length !== 0) {
          for(let i = 0; i < merchList.length; i++) {
            tableList[merchList[i].column_name] = merchList[i].data_type 
            //tableList.push(merchList[i].data_type)
          }
        }
        console.log(tableList)
        dispatch(assignColumnTypes(tableList))
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
    console.log(tableRedux.length)
    newRow = {
      ...newRow,
      rownum: tableRedux.length }

    dispatch(addToNew(newRow.rownum))
    dispatch(addRow(newRow))
  }
  const pageRefresh = () => {
    dispatch(clearNewTray)
    dispatch(clearEditTray)
    dispatch(clearDeleteTray)
    dispatch(clearEditID)
    dispatch(assignTable([]))
    fetch(`${backend}/?table=${table}&page=${pagenum}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        if(data !== []) {
          dispatch(assignTable([]))
          let merchList = (JSON.parse(data))
          merchList.sort((a, b) => (a[blankColumn]> b[blankColumn]) ? 1 : -1)
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
    getColumnTypes()
    setRefresh(false)
  }
  
  const commitNewRow = (row) => {
    console.log("yuh")
    let rowCopy = {
      ...row
    }
     delete rowCopy["id"]
     let fields = Object.keys(rowCopy)
     let values = Object.values(rowCopy)
     fields.pop()
     values.pop()
     for(let i = 0; i < fields.length; i++) {
      fields[i] = "\"" + fields[i] + "\"" 
      values[i] = "\'" + values[i] + "\'" 
     }
     let bodyJSON = JSON.stringify({table, fields, values})
     console.log(bodyJSON)

     fetch(`${backend}/json`, {
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
      const result = editTray.filter(row => row.rownum === newTray[i])
      console.log(result)
      //commitNewRow(newTray[i])
    }
  }
  const commitNewEdit = (index) => {
    let curr = {
      ...editTray[index]
    }
    console.log(curr)
    delete curr.rownum
    let fields = Object.keys(curr)
    let values = Object.values(curr)

     for(let i = 0; i < fields.length; i++) {
      fields[i] = "\"" + fields[i] + "\"" 
      values[i] = "\'" + values[i] + "\'" 
     }
     console.log(fields[0])
    let bodyJSON = JSON.stringify({table, fields, values, key_column: keyColumn, id: curr.id})
    console.log(bodyJSON.id)

    
      fetch(`${backend}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyJSON 
      })
     
  
  }
  const commitAllEdits = () => {

    addDebugMessage(`[${time}] - EDIT: SENDING EDIT BACKEND REQUEST FOR: ` + JSON.stringify(editTray))
    for (let i = 0; i < editTray.length; i++) {
      let curr = {
        ...editTray[i]
      }
      console.log(curr)
      if(newTray.includes(curr.rownum)) {
        commitNewRow(curr)
      }
      else {
        commitNewEdit(i)
      }

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
    fetch(`${backend}/deleteRow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    console.log(body)
  }
  const commitDeletes = () => {

    addDebugMessage(`[${time}] - DELETE: SENDING DELETE REQUEST TO SERVER FOR: ` + JSON.stringify(deleteTray))
    for (let i = 0; i < deleteTray.length; i++) {
      deleteRow(deleteTray[i])
      console.log(deleteTray[i])
    }
  }
  const commitAllChanges = () => {
    if (editTray.length != 0) {
      commitAllEdits()
    }
    if (deleteTray.length != 0) {
      commitDeletes()
    }
    commitNewRows()

    dispatch(clearNewTray())

    dispatch(clearDeleteTray())
    dispatch(clearEditTray())
    dispatch(clearEditID())
    getTime()
    setTimeout(() => {
      pageRefresh()
    }, 3000)

    alert("Changes have been saved to the database.")
  }
  function setRowsPerPage() {
    let rowsPerPage = prompt("Enter rows per page");
    setRows(rowsPerPage)
  }
  const nextPageOps = () => {
    handleNextPage();
    setRefresh(true)
  }
function handleNextPage() {
    let newpage = pagenum + 1
    

    fetch(`${backend}/?table=${table}&page=${newpage}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        console.log(data)
        if(data !== []) {
          
          
          let merchList = (JSON.parse(data))
          
          merchList.sort((a, b) => (a[blankColumn]> b[blankColumn]) ? 1 : -1)
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
      fetch(`${backend}/?table=${table}&page=${newpage}&limit=${rows}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        dispatch(assignTable([]))
        let merchList = (JSON.parse(data))

        merchList.sort((a, b) => (a[blankColumn]> b[blankColumn]) ? 1 : -1)
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
  const debugMenu = () => {
    return (
      <div className = "debugMenu">
        <h1>Debug Menu</h1>
        <h2>Table Name: {table}</h2>
        <h2>Blank Column: {blankColumn}</h2>
        <h2>Edit Tray:</h2>

        {editTrayID.map((rowDebug) => (<p>{JSON.stringify(rowDebug)}</p>))}
        <h2>New Tray: </h2>

        {newTray.map((rowDebug) => (<p>{JSON.stringify(rowDebug)}</p>))}
        <h2>Delete Tray: </h2>

        {deleteTray.map((rowDebug) => (<p>{JSON.stringify(rowDebug)}</p>))}
        <h2>Edits</h2>
        {editTray.map((rowDebug) => (<p>{JSON.stringify(rowDebug)}</p>))}
        {debugMessages.map((message) => (<p>{message}</p>))}
      </div>
    )
  }
  const debugToggle = () => {
    setShowDebug(!showDebug)
  }
  const addDebugMessage = (message) => {
    setDebugMessages([
      ...debugMessages,
      message
    ])
  }
  return (
    <div className="App">
      <h1 className = "title">ORI Data Management System</h1>
      {showDebug ? debugMenu() : undefined}
      <button onClick={() => console.log(columnTypes)}>CLICK</button>
      <div className="areas">
        ``
      <div className="area2">
        <p>Last Refresh: {time}</p>
        <div class="dropdown" onMouseEnter={getTables}>
          <button class="dropbtn">{table}▼</button>
          <div class="dropdown-content">
            {tableList.map((tableName) => (
              <TableButton tableName = {tableName} changeTableFunc = {setTable}/>
            ))}
          </div>
        </div>
      </div>
      <hr />
      
      <div className="area1">
        <MenuButton className = 'nav' clickFunction={pageRefresh} title = "Page Refresh"/>
        <button onClick={getColumnTypes}>BRUH</button> 
        <button className = 'nav' onClick={addNewRow}>Add Row</button>
        <button className = 'rpp' onClick={setRowsPerPage}>Set Rows Per Page</button>
        <button className = 'nav' onClick={commitAllChanges}>Save</button>
      </div>
      
      </div>
      <hr />
      <div>
      </div>
      <Table columnTypes = {columnTypes} itemArrayProps = {tableRedux} args = {args} setBlankColumn = {setBlankColumn}/>
      <p>Page {pagenum} with {rows} rows per page</p> 
      <button className = 'navButtons' onClick={handlePrevPage}>◀ Previous</button>
      <button className = 'navButtons' onClick={nextPageOps}>Next ▶</button>
      <button onClick={debugToggle}>Toggle Debug Menu</button>
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
