import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const { Schema } = mongoose;

const NurseSchema = new Schema({
  employeeId: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 10
  }
}, { strict: false });

NurseSchema.plugin(autoIncrement.plugin, 'Nurse');

export default NurseSchema;
