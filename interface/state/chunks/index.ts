import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const chunksSlice = createSlice({
  name: "chunks",
  initialState,
  reducers: {},
});

const chunksReducer = chunksSlice.reducer;

export default chunksReducer;
