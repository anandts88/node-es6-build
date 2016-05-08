import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
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

// specify the user schema option
if (!AgencySchema.options.toObject) {
  AgencySchema.options.toObject = { virtuals: true };
}

// Takes 3 arguments (doc, ret, options)
AgencySchema.options.toObject.transform = (doc, ret) => {
  // remove __v of every document before returning the result
  delete ret.__v;
};

 export default connection.model('Agency', AgencySchema);
