import * as jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import * as config from '../config';
import { User } from '../db/models/user';

async function login(email: string, password: string) {
  // find a user by email address
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Incorrect email or password');
    error.name = 'IncorrectCredentialsError';
    throw error;
  }

  // check if a hashed user's password is equal to a value saved in the database
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error('Incorrect email or password');
    error.name = 'IncorrectCredentialsError';
    throw error;
  }

  const payload = { sub: user.id };

  // create a token string
  const token = jwt.sign(payload, config.jwtSecret);
  const data = { name: user.name };

  return { data, token };
}

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
  (_req, email, password, done) =>
    login(email.trim(), password.trim())
      .catch(done)
      .then((user) => done(null, user)),
);
