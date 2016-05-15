import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import doctorWorkHoursSchema from './doctor-work-hours';

const { Schema } = mongoose;

const DoctorSchema = new Schema({
  npi: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
    maxlength: 10
  },

  medicaid: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 13
  },

  medicare: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 13
  },

  ein: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 10
  },

  dea: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 9
  },

  surgeon: {
    type: Boolean,
    default: false
  },

  speciality: {
    type: Number
  },

  practiseType: {
    type: Number
  },

  practiseYear: {
    type: Number
  },

  graduationInstitution: {
    type: String,
    trim: true,
    uppercase: true
  },

  graduationYear: {
    type: Number
  },

  serviceCharge: {
    type: Number
  },

  insurance: [Number],
  treatment: [Number],

  workHours: [doctorWorkHoursSchema]
}, { strict: false });

DoctorSchema.plugin(autoIncrement.plugin, 'Doctor');

export default DoctorSchema;
