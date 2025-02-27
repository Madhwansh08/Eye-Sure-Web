import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import annotationReducer from "./slices/annotationSlice";

const store = configureStore({
  reducer: {
    images: imageReducer,
    annotation: annotationReducer,
  },
});

export default store;
