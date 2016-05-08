import mongoose from 'mongoose';
import connection from '../database';
import autoIncrement from 'mongoose-auto-increment';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;
const { ObjectId } = Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  passwordChanged: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    required: true,
    enum: [ 'Admin', 'Staff', 'Client', 'Doctor', 'Assessor', 'Nurse']
  },

  client: {
    type: ObjectId,
    ref: 'Client'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date
  }
}, { strict: false });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(this.password, salt, (err, hash) => {
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

UserSchema.pre('update', function(next) {
  this.lastLogin = Date.now;
  next();
});

UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'id' });

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


/**
 * Static Methods
 */
UserSchema.statics = {
};

// specify the user schema option
if (!UserSchema.options.toObject) {
  UserSchema.options.toObject = { virtuals: true };
}

// Takes 3 arguments (doc, ret, options)
UserSchema.options.toObject.transform = (doc, ret) => {
  // remove __v of every document before returning the result
  delete ret.__v;
};

 export default connection.model('User', UserSchema);
