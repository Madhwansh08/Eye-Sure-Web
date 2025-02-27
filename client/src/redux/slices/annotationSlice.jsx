// src/redux/slices/annotationSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leftImageAnnotations: [],
  rightImageAnnotations: [],
  currentTool: null, // e.g. "rectangle", "oval", "point"
  leftHistory: [],
  rightHistory: [],
  leftFuture: [],
  rightFuture: [],
};

const annotationSlice = createSlice({
  name: "annotation",
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.currentTool = action.payload;
    },
    addAnnotation: (state, action) => {
      // payload = { side: "left" | "right", annotation: {...} }
      const { side, annotation } = action.payload;
      if (side === "left") {
        state.leftHistory.push([...state.leftImageAnnotations]);
        state.leftFuture = [];
        state.leftImageAnnotations.push(annotation);
      } else if (side === "right") {
        state.rightHistory.push([...state.rightImageAnnotations]);
        state.rightFuture = [];
        state.rightImageAnnotations.push(annotation);
      }
    },
    undoAnnotation: (state, action) => {
      // payload = { side: "left" | "right" }
      const { side } = action.payload;
      if (side === "left" && state.leftHistory.length > 0) {
        const previous = state.leftHistory.pop();
        state.leftFuture.push([...state.leftImageAnnotations]);
        state.leftImageAnnotations = previous;
      } else if (side === "right" && state.rightHistory.length > 0) {
        const previous = state.rightHistory.pop();
        state.rightFuture.push([...state.rightImageAnnotations]);
        state.rightImageAnnotations = previous;
      }
    },
    redoAnnotation: (state, action) => {
      // payload = { side: "left" | "right" }
      const { side } = action.payload;
      if (side === "left" && state.leftFuture.length > 0) {
        const next = state.leftFuture.pop();
        state.leftHistory.push([...state.leftImageAnnotations]);
        state.leftImageAnnotations = next;
      } else if (side === "right" && state.rightFuture.length > 0) {
        const next = state.rightFuture.pop();
        state.rightHistory.push([...state.rightImageAnnotations]);
        state.rightImageAnnotations = next;
      }
    },
    resetAnnotations: (state) => {
      state.leftHistory.push([...state.leftImageAnnotations]);
      state.rightHistory.push([...state.rightImageAnnotations]);
      state.leftImageAnnotations = [];
      state.rightImageAnnotations = [];
      state.leftHistory = [];
      state.rightHistory = [];
      state.leftFuture = [];
      state.rightFuture = [];
    },
  },
});

export const { setTool, addAnnotation, undoAnnotation, redoAnnotation, resetAnnotations } = annotationSlice.actions;
export default annotationSlice.reducer;
