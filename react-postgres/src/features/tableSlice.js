import { createSlice } from '@reduxjs/toolkit'

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
    deleteTray: [],
    editTray:[],
    newTray: []
  },
  reducers: {
    assignTable: (state, action) => {
      state.value = action.payload
    },
    addRow: (state, action) => {
      state.value.push(action.payload)
    },
    addToDelete: (state, action) => {
      state.deleteTray.push(action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { assignTable, addRow, addToDelete } = tableSlice.actions

export default tableSlice.reducer