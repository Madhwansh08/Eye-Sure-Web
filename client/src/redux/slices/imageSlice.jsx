import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leftImage: null,
  rightImage: null,
  croppingImage: null,
  croppingSide: null, // "left" or "right"
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setCroppingImage: (state, action) => {
      state.croppingImage = action.payload.image;
      state.croppingSide = action.payload.side;
    },
    clearCroppingImage: (state) => {
      state.croppingImage = null;
      state.croppingSide = null;
    },
    setLeftImage: (state, action) => {
      state.leftImage = action.payload;
    },
    setRightImage: (state, action) => {
      state.rightImage = action.payload;
    },
  },
});

export const { setCroppingImage, clearCroppingImage, setLeftImage, setRightImage } = imageSlice.actions;
export default imageSlice.reducer;
