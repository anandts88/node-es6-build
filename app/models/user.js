import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import moment from 'moment';
import connection from '../database';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../utility/constants';
import clientSchema from '../client/schema';
import doctorSchema from '../doctor/schema';
import assessorSchema from '../assessor/schema';
import staffSchema from '../staff/schema';
import nurseSchema from '../nurse/schema';

const {
  DATE_FORMAT,
  GENDERS,
  ROLES,
  USER_STATUSES
} = constants;

const { Schema } = mongoose;

const UserSchema = new Schema({
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
    maxlength: 150,
    unique: true
  },

  gender: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    enum: GENDERS
  },

  dob: {
    type: Date,
    required: true
  },

  phone1: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },

  phone2: {
    type: String,
    trim: true,
    maxlength: 10
  },

  address1: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 250
  },

  address2: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 250
  },

  state: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 2
  },

  city: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 150
  },

  zip: {
    type: String,
    required: true,
    trim: true,
    maxlength: 11
  },

  country: {
    type: String,
    default: 'United States'
  },

  timezone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  password: {
    type: String,
    trim: true,
    maxlength: 30
  },

  passwordchanged: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    required: true,
    uppercase: true,
    enum: ROLES
  },

  status: {
    type: String,
    enum: USER_STATUSES,
    uppercase: true,
    maxlength: 250
  },

  agency: {
    type: Number,
    ref: 'Agency'
  },

  client: clientSchema,
  doctor: doctorSchema,
  assessor: assessorSchema,
  staff: staffSchema,
  nurse: nurseSchema,

  createdAt: {
    type: Date,
    default: Date.now
  },

  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function(next) {
  let {
    password,
    lastName,
    dob
  } = this;
  let firstInitial;
  let dobformatted;

  this.modifiedAt = Date.now();

  // If the account is newly created then password will be
  // First Initial of last name followed by DOB in format YYYYMMDD.
  if (this.isNew) {
    firstInitial = lastName.substr(1);
    dobformatted = moment(dob).format(DATE_FORMAT.DATE1);
    password = `${firstInitial}${dobformatted}`;
  }

  if (this.isNew || this.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }

        this.password = hash;
        next();
      });
    });

  } else {
    next();
  }
});

UserSchema.plugin(autoIncrement.plugin, 'Agency');

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * Compare the password entered by the user, encrypt the entered password
   * with the password in the database. (Note: Password in the database is
   * already encyrpted with the same algorithm)
   */
  comparePassword(password, callback) {
    bcrypt.compare(password, this.password, (err, matched) => {
      if (err) {
        return callback(err);
      }

      callback(undefined, matched);
    });
  }
};

if (!UserSchema.options.toJSON) {
  UserSchema.options.toJSON = {};
}

UserSchema.options.toJSON.transform = (doc, ret) => {
  // remove the _id of every document before returning the result
  delete ret.__v;
};

export default connection.model('User', UserSchema);
