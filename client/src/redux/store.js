import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slices/imageSlice";
import annotationReducer from "./slices/annotationSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    images: imageReducer,
    annotation: annotationReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;
