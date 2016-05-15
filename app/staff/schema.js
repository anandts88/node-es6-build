import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const { Schema } = mongoose;

const StaffSchema = new Schema({
  employeeId: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 10
  }
}, { strict: false });

StaffSchema.plugin(autoIncrement.plugin, 'Staff');

export default StaffSchema;
