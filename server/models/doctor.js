const mongoose=require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
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
    password: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
    },
    specialization:{
        type: String,
    },
    gender:{
        type: String,
    },
    clinicAddress:{
        type: String,
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    role: {
        type: String,
        default: 'doctor'
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);