import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const { Schema } = mongoose;

const DoctorWorkHoursSchema = new Schema({
  day: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    required: true
  },

  start: {
    type: String,
    required: true,
    trim: true
  },

  end: {
    type: String,
    required: true,
    trim: true
  }
}, { strict: false });

DoctorWorkHoursSchema.plugin(autoIncrement.plugin, 'DoctorWorkHours');

export default DoctorWorkHoursSchema;
