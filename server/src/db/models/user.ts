import * as bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

const ImageSchema = new Schema({
  image_data: {
    type: String,
  },
});

// define the User model schema
const UserSchema = new Schema({
  behance: String,
  birthDate: {
    type: Date,
  },
  city: {
    type: String,
  },
  email: {
    index: { unique: true },
    type: String,
  },
  facebook: String,
  fbId: {
    index: { unique: true },
    type: String,
  },
  googleId: {
    index: { unique: true },
    type: String,
  },
  img: ImageSchema,
  instagram: String,
  name: String,
  password: String,
  resetPasswordExpires: String,
  resetPasswordToken: String,
  website: String,
});

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(
  password,
  callback,
) {
  bcrypt.compare(password, this.password, callback);
};

/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

export const Image = model('Image', ImageSchema);
export const User = model('User', UserSchema);
