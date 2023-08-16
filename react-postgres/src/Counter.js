import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { assignTable, addRow } from './features/tableSlice'

export function Counter() {
  const table = useSelector((state) => state.table.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        {table.map((row) => {
            return <p>{row.name}</p>
        })}
        <button
          aria-label="Increment value"
          onClick={() => dispatch(assignTable(["yuh"]))}
        >
          Change Table
        </button>

        <button
          aria-label="Increment value"
          onClick={() => dispatch(addRow(["yuhsss"]))}
        >
          add row
        </button>
      </div>
    </div>
  )
}

export default Counter;