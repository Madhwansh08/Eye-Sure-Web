// src/redux/slices/annotationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialReportState = () => ({
  leftImageAnnotations: [],
  rightImageAnnotations: [],
  leftHistory: [],
  rightHistory: [],
  leftFuture: [],
  rightFuture: [],
  currentTool: null  // default tool is now null
});

const initialState = {
  byReportId: {}
};

const annotationSlice = createSlice({
  name: "annotation",
  initialState,
  reducers: {
    initReportState: (state, action) => {
      // payload: { reportId, leftAnnotations, rightAnnotations }
      const { reportId, leftAnnotations, rightAnnotations } = action.payload;
      state.byReportId[reportId] = {
        ...getInitialReportState(),
        leftImageAnnotations: leftAnnotations || [],
        rightImageAnnotations: rightAnnotations || []
      };
    },
    setTool: (state, action) => {
      // payload: { reportId, tool }
      const { reportId, tool } = action.payload;
      if (!state.byReportId[reportId]) {
        state.byReportId[reportId] = getInitialReportState();
      }
      state.byReportId[reportId].currentTool = tool;
    },
    addAnnotation: (state, action) => {
      // payload: { reportId, side, annotation }
      const { reportId, side, annotation } = action.payload;
      if (!state.byReportId[reportId]) {
        state.byReportId[reportId] = getInitialReportState();
      }
      if (side === "left") {
        state.byReportId[reportId].leftHistory.push([
          ...state.byReportId[reportId].leftImageAnnotations
        ]);
        state.byReportId[reportId].leftFuture = [];
        state.byReportId[reportId].leftImageAnnotations.push(annotation);
      } else {
        state.byReportId[reportId].rightHistory.push([
          ...state.byReportId[reportId].rightImageAnnotations
        ]);
        state.byReportId[reportId].rightFuture = [];
        state.byReportId[reportId].rightImageAnnotations.push(annotation);
      }
    },
    undoAnnotation: (state, action) => {
      // payload: { reportId, side }
      const { reportId, side } = action.payload;
      if (!state.byReportId[reportId]) return;
      const data = state.byReportId[reportId];
      if (side === "left" && data.leftHistory.length > 0) {
        const previous = data.leftHistory.pop();
        data.leftFuture.push([...data.leftImageAnnotations]);
        data.leftImageAnnotations = previous;
      } else if (side === "right" && data.rightHistory.length > 0) {
        const previous = data.rightHistory.pop();
        data.rightFuture.push([...data.rightImageAnnotations]);
        data.rightImageAnnotations = previous;
      }
    },
    redoAnnotation: (state, action) => {
      // payload: { reportId, side }
      const { reportId, side } = action.payload;
      if (!state.byReportId[reportId]) return;
      const data = state.byReportId[reportId];
      if (side === "left" && data.leftFuture.length > 0) {
        const next = data.leftFuture.pop();
        data.leftHistory.push([...data.leftImageAnnotations]);
        data.leftImageAnnotations = next;
      } else if (side === "right" && data.rightFuture.length > 0) {
        const next = data.rightFuture.pop();
        data.rightHistory.push([...data.rightImageAnnotations]);
        data.rightImageAnnotations = next;
      }
    },
    resetAnnotations: (state, action) => {
      // payload: { reportId, side? }
      const { reportId, side } = action.payload;
      if (!state.byReportId[reportId]) return;
      const data = state.byReportId[reportId];
      if (!side) {
        data.leftHistory = [];
        data.rightHistory = [];
        data.leftFuture = [];
        data.rightFuture = [];
        data.leftImageAnnotations = [];
        data.rightImageAnnotations = [];
      } else if (side === "left") {
        data.leftHistory = [];
        data.leftFuture = [];
        data.leftImageAnnotations = [];
      } else if (side === "right") {
        data.rightHistory = [];
        data.rightFuture = [];
        data.rightImageAnnotations = [];
      }
    }
  }
});

export const {
  initReportState,
  setTool,
  addAnnotation,
  undoAnnotation,
  redoAnnotation,
  resetAnnotations
} = annotationSlice.actions;
export default annotationSlice.reducer;
