import { model } from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';

const User = model('User');

/**
 * Return the Passport Local Strategy object.
 */
export const localSignupStrategy = new LocalStrategy(
  {
    passReqToCallback: true,
    passwordField: 'password',
    session: false,
    usernameField: 'email',
  },
  (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      name: req.body.name.trim(),
      password: password.trim(),
    };

    const newUser = new User(userData);
    newUser.save((err) => {
      if (err) {
        return done(err);
      }

      return done(null);
    });
  },
);
