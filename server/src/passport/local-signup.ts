import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../db/models/user';

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
  async (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      name: req.body.name.trim(),
      password: password.trim(),
    };
    const user = await User.create(userData).catch(done);
    done(null, user);
  },
);
