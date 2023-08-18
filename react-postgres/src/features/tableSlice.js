import { createSlice } from '@reduxjs/toolkit'

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
    tableName: "",
    deleteTray: [],
    editTray:[],
    newTray: []
  },
  reducers: {
    assignTable: (state, action) => {
      state.value = action.payload
    },
    assignTableName: (state, action) => {
      state.value = action.payload
    },
    clearDeleteTray: (state, action) => {
      state.deleteTray = []
    },
    clearNewTray: (state, action) => {
      state.newTray = []
    },
    clearEditTray: (state, action) => {
      state.editTray = []
    },
    addRow: (state, action) => {
      state.value.push(action.payload)
    },
    addToDelete: (state, action) => {
      state.deleteTray.push(action.payload)
    },
    addToNew: (state, action) => {
      state.newTray.push(action.payload)
    },
    addToEdit: (state, action) => {
      state.editTray.push(action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { assignTable, assignTableName, addRow, addToDelete, addToNew, clearDeleteTray, addToEdit, clearEditTray, clearNewTray } = tableSlice.actions

export default tableSlice.reducer