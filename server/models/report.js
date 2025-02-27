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
    required: true,
    trim: true
  },
  reannotationCoordinates: {
    type: [Number],
    required: true
  },
  explainableAiLeftFundusImage: {
    type: String,
    required: true,
    trim: true
  },
  explainableAiRightFundusImage: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = reportSchema;
