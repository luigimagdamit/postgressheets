import React, {useState, useEffect} from 'react';
import './App.css';
const Entry = (props) => {
  const [data, setData] = useState({})
  const [edited, setEdited] = useState({})

  useEffect(() => {
    setEdited({})
    setData(props.data)
    console.log(edited)
  }, [])

  function updateMerchant(id, field, newval) {
    fetch(`http://localhost:3001/merchants/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, field, newval}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {

      });
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
      console.log(fieldsArray[i])
      console.log(valuesArray[i])

      updateMerchant(data.id, fieldsArray[i], valuesArray[i])
    }
    alert("Attempted update");
    // editMerchant(fieldsString, valuesString)

    // NEED TO DO UPSERT IN SERVER FUNCTION
  }
  return (
        <tr>
          <button onClick={() => console.log(data)}>Print State</button>
          <button onClick={() => onSubmit("DAY_OF_MONTH_NUM")}>Submit Changes</button>
          {Object.keys(data).map((field) => (
            <td>
              <div contenteditable="true" onInput={(e) => handleInputChange(e.currentTarget.textContent, field)}>{props.data[field]}</div>
              </td>
          ))}
        </tr>

  )
}
const Table = (props) => {
  const itemArray = Array.from(props.itemArray);
  const [first, setFirst] = useState(itemArray[0])
  console.log(first)
  return (
    <div>
    <table>
      <tbody>
        <tr className='rownames'>
          <button>hey</button>
          {itemArray[0] ? Object.keys(itemArray[0]).map((field) => (
            <td>{field}</td>
          )) : null}
        </tr>
      {itemArray.map((user) => (
        <Entry data = {user}/>
      ))}
      </tbody>
    </table>
    </div>
  )
}


function App() {
  const [merchants, setMerchants] = useState(false);
  const [pagenum, setpagenum] = useState(0)
  const [rows, setRows] = useState(10)
  useEffect(() => {
    getMerchant();
  }, []);
  function getMerchant() {
    fetch('http://localhost:3001')
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
        console.log(merchants)
      });
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
  function searchMerchants() {
    let id = prompt("enter id")
    fetch(`http://localhost:3001/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        let merchList = (JSON.parse(data))
        setMerchants(merchList);
      });
  }
  function createMerchant() {
    let fields = prompt('Enter fields');
    let values = prompt('enter values');
    fetch('http://localhost:3001/merchants', {
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
        getMerchant();
      });
  }
  function updateMerchant() {
    let id = prompt('Enter merchant id');
    let field = prompt('Enter field');
    let newval = prompt('Enter new value');
    fetch(`http://localhost:3001/merchants/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, field, newval}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
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

  function deleteMerchant() {
    let id = prompt('Enter merchant id');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }
  return (
    <div>
      <h1>PostgreSQL Record Manager</h1>
      <hr />
      <p>Page {pagenum} with {rows} rows per page</p>
      <button onClick={searchMerchants}>Search</button>
      <button onClick={handleRowChange}>Set Rows Per Page</button>
      <button onClick={createMerchant}>Add entry</button>
      <button className = 'update' onClick={updateMerchant}>Update entry</button>
      <button className = 'delete' onClick={deleteMerchant}>Delete entry</button>
      <button className = 'nav' onClick={handleNextPage}>Next page</button>
      <button className = 'nav' onClick={handlePrevPage}>Previous page</button>
      <button className = 'addID' onClick={addID}>add unique ids</button>
      <Table itemArray = {merchants}/>
    </div>
  );
}
export default App;