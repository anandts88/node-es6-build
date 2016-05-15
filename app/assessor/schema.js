import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const { Schema } = mongoose;

const AssessorSchema = new Schema({
  employeeId: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 10
  },

  raterId: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 10
  }
}, { strict: false });

AssessorSchema.plugin(autoIncrement.plugin, 'Assessor');

export default AssessorSchema;
