import mongoose from 'mongoose';
import connection from '../database';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../utility/constants';

const { Schema } = mongoose;
const {
  AGENCY_STATUSES,
  AGENCY_STATUS
} = constants;

const AgencySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 200
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 150
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 150
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 150
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },

  comment: {
    type: String,
    trim: true,
    maxlength: 250
  },

  status: {
    type: String,
    enum: AGENCY_STATUSES,
    default: AGENCY_STATUS.REQUESTED
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

AgencySchema.pre('save', function(next) {
  this.modifiedAt = Date.now();
  next();
});

AgencySchema.plugin(autoIncrement.plugin, 'Agency');

if (!AgencySchema.options.toJSON) {
  AgencySchema.options.toJSON = {};
}

AgencySchema.options.toJSON.transform = (doc, ret) => {
  // remove the _id of every document before returning the result
  delete ret.__v;
};

export default connection.model('Agency', AgencySchema);
