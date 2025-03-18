const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const annotationSchema = new mongoose.Schema(
  {
    type: String,     // "rectangle", "oval", "point"
    x: Number,
    y: Number,
    width: Number,    // rectangle
    height: Number,   // rectangle
    radiusX: Number,  // oval
    radiusY: Number,  // oval
    radius: Number,   // point
    fill: String,     // point color
    stroke: String,
    strokeWidth: Number,
    label: String,
    id: String,
  },
  { _id: false }
);

const reportSchema = new Schema({
  leftFundusImage: {
    type: String,
    required: true,
    trim: true
  },
  rightFundusImage: {
    type: String,
    required: true,
    trim: true
  },
  analysisType: {
    type: String,
    required: true,
    trim: true
  },
  // Change annotation fields to store an array of annotation objects
  leftFundusAnnotationCoordinates: {
    type: [annotationSchema],
    default: []
  },
  rightFundusAnnotationCoordinates: {
    type: [annotationSchema],
    default: []
  },
  explainableAiLeftFundusImage: {
    type: String,
    trim: true
  },
  explainableAiRightFundusImage: {
    type: String,
    trim: true
  },
  contorLeftFundusImage: { type: String, trim: true },
  contorRightFundusImage: { type: String, trim: true },
  contorLeftVCDR: { type: Number },
  contorRightVCDR: { type: Number },
  contorLeftGlaucomaStatus: { type: String, trim: true },
  contorRightGlaucomaStatus: { type: String, trim: true },
  leftEyeClahe: {
    type: String,
    trim: true
  },
  rightEyeClahe: {
    type: String,
    trim: true
  },
  leftFundusPrediction: {
    type: Schema.Types.Mixed,
  },
  rightFundusPrediction: {
    type: Schema.Types.Mixed,
  },
  leftFundusArmdPrediction: {
    type: String,
    trim: true
  },
  rightFundusArmdPrediction: {
    type: String,
    trim: true
  },
  note:{
    type:String,
    trim:true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
}, { timestamps: true });

// Compile and export the model
module.exports = mongoose.model('Report', reportSchema);
