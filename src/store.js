import { configureStore } from "@reduxjs/toolkit";
import inputReducer from "./slice";

export default configureStore({
  reducer: {
    userInput: inputReducer,
  },
});
