const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reportSchema = require('./report');

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  contactNo: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Array of report objects related to the patient
  reports: [reportSchema]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
