import { createSlice } from '@reduxjs/toolkit'

export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
    tableName: "",
    deleteTray: [],
    editTray:[],
    editTrayID: [], 
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
    clearEditID: (state, aciton) => {
      state.editTrayID = []
    },
    replaceEditRow: (state, action) => {
      // ask for input that is rownum
      state.editTray = state.editTray.filter(row => row.rownum != action.payload)
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
    },
    addToEditID: (state, action) => {
      state.editTrayID.push(action.payload)
    },
    replaceRow: (state, action) => {
      state.value = state.value.map(row => {
        if(row.rownum === action.payload.rownum) {
          return action.payload
        }
        return row
      })
    },
    removeFromDelete: (state, action) => {
      return {
        ...state,
        deleteTray: state.deleteTray.filter(item => item !== action.payload)
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { assignTable, assignTableName, addRow, addToDelete, addToNew, replaceEditRow, clearDeleteTray, addToEdit, clearEditTray, clearNewTray, removeFromDelete, replaceRow, addToEditID, clearEditID } = tableSlice.actions

export default tableSlice.reducer
