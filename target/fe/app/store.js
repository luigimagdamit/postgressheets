import { configureStore } from '@reduxjs/toolkit'
import tableReducer from '../features/tableSlice'
export default configureStore({
  reducer: {
    table: tableReducer,
  },
})