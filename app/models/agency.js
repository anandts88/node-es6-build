import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import mongooseHidden from 'mongoose-hidden';
import connection from '../database';

const { Schema } = mongoose;

const AgencySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date
  }

}, { strict: false });

AgencySchema.plugin(autoIncrement.plugin, {
  model: 'Agency',
  startAt: 1
});

AgencySchema.pre('update', function(next) {
  this.updatedAt = Date.now;
  next();
});

AgencySchema.plugin(mongooseHidden, {
  defaultHidden: {
    __v: true
  }
});

 export default connection.model('Agency', AgencySchema);
