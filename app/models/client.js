import mongoose from 'mongoose';
import relationship from 'mongoose-relationship';
import connection from '../database';

const { Schema } = mongoose;
const { ObjectId } = Schema;

const ClientSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  dob: {
    type: Date,
    required: true
  },

  gender: {
    type: String,
    required: true,
    enum: [ 'Male', 'Female', 'Other']
  },

  ssn: {
    type: String
  },

  language: {
    type: Number
  },

  race: {
    type: Number
  },

  ethnicity: {
    type: Number
  },

  email: {
    type: String,
    required: true
  },

  insurance: {
    type: Number
  },

  phone1: {
    required: true,
    type: String
  },

  phone2: {
    type: String
  },

  address1: {
    required: true,
    type: String
  },

  address2: {
    type: String
  },

  city: {
    required: true,
    type: String
  },

  state: {
    required: true,
    type: Number
  },

  zip: {
    required: true,
    type: String
  },

  country: {
    type: String,
    default: 'United States'
  },

  agency: {
    type: ObjectId,
    ref: 'Agency'
  },

  user: {
    type: ObjectId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date
  }

}, { strict: false });

ClientSchema.pre('update', function(next) {
  this.updatedAt = Date.now;
  next();
});

 export default connection.model('Client', ClientSchema);
