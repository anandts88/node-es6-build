import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const { Schema } = mongoose;

const ClientSchema = new Schema({
  ssn: {
    type: String,
    trim: true,
    maxlength: 11
  },

  race: {
    type: Number
  },

  ethnicity: {
    type: Number
  },

  insurance: {
    type: Number
  }
}, { strict: false });

ClientSchema.plugin(autoIncrement.plugin, 'Client');

export default ClientSchema;
