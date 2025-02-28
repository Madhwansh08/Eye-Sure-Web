const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reportSchema = require('./report');

const patientSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  age: {
    type: Number, 
  },
  gender: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  contactNo: {
    type: String,
    trim: true
  },
  // Add a reference to the Doctor model
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  // Array of report objects related to the patient
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
