import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import mongooseHidden from 'mongoose-hidden';
import connection from '../database';

const { Schema } = mongoose;

const AdminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  dob: {
    type: Date,
    required: true
  },

  gender: {
    type: String,
    required: true,
    trim: true,
    enum: [ 'Male', 'Female', 'Other']
  },

  ssn: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone1: {
    required: true,
    type: String,
    trim: true,
  },

  phone2: {
    type: String,
    trim: true,
  },

  address1: {
    required: true,
    type: String,
    trim: true,
    uppercase: true
  },

  address2: {
    type: String,
    trim: true,
    uppercase: true
  },

  city: {
    required: true,
    type: String,
    trim: true,
    uppercase: true
  },

  state: {
    required: true,
    type: Number,
    uppercase: true
  },

  zip: {
    required: true,
    type: String,
    uppercase: true
  },

  country: {
    type: String,
    default: 'United States'
  },

  agency: {
    type: Number,
    ref: 'Agency'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date
  }

}, { strict: false });

AdminSchema.plugin(autoIncrement.plugin, {
  model: 'Admin',
  startAt: 1
});

AdminSchema.pre('update', function(next) {
  this.updatedAt = Date.now;
  next();
});

AdminSchema.plugin(mongooseHidden, {
  defaultHidden: {
    _ret: true
  }
});

 export default connection.model('Admin', AdminSchema);
