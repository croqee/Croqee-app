import { RequestHandler } from 'express';
import { User } from '../db/models/user';
import { getIdFromToken } from '../lib/jwt';

/**
 *  The Auth Checker middleware function.
 */
export const authMiddleware: RequestHandler = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.replace(/bearer\s+/i, '');

  try {
    const userId = await getIdFromToken(token);
    const user = await User.findById(userId).exec();
    // pass user details onto next route
    req.user = user;
  } catch {
    // the 401 code is for unauthorized status
    return res.status(401).end();
  }
};
