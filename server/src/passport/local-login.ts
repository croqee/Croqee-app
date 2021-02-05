import * as jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import * as config from '../config';
import { User } from '../db/models/user';

/**
 * Return the Passport Local Strategy object.
 */
export const localLoginStrategy = new LocalStrategy(
  {
    passReqToCallback: true,
    passwordField: 'password',
    session: false,
    usernameField: 'email',
  },
  async (_req, email, password) => {
    const userData = {
      email: email.trim(),
      password: password.trim(),
    };

    // find a user by email address
    return User.findOne({ email: userData.email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      // check if a hashed user's password is equal to a value saved in the database
      return user.comparePassword(
        userData.password,
        (_passwordErr, isMatch) => {
          if (err) {
            return done(err);
          }

          if (!isMatch) {
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';

            return done(error);
          }

          const payload = {
            sub: user._id,
          };

          // create a token string
          const token = jwt.sign(payload, config.jwtSecret);
          const data = {
            name: user.name,
          };

          return done(null, token, data);
        },
      );
    });
  },
);
