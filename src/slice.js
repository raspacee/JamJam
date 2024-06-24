import { createSlice } from "@reduxjs/toolkit";

export const inputSlice = createSlice({
  name: "userInput",
  initialState: {
    source: "",
    destination: "",
  },
  reducers: {
    changeInput: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeInput } = inputSlice.actions;

export default inputSlice.reducer;
