const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  reannotationLabel: {
    type: String,
    trim: true
  },
  reannotationCoordinates: {
    type: [Number],
  },
  explainableAiLeftFundusImage: {
    type: String,
    trim: true
  },
  explainableAiRightFundusImage: {
    type: String,
    trim: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
}, { timestamps: true });

// Compile the schema into a model and export it.
module.exports = mongoose.model('Report', reportSchema);
