import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./features/gadgetSlice";

export default configureStore({
  reducer: {
    notes: notesReducer,
  },
});
