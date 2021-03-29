import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';

type Decoded = string | { sub?: string };

export function getIdFromToken(token: string): Promise<string> {
  return new Promise((resolve, reject) =>
    jwt.verify(token, jwtSecret, (err, decoded: Decoded) => {
      if (err) return reject(err);
      const id = typeof decoded == 'string' ? decoded : decoded?.sub ?? '';
      resolve(id);
    }),
  );
}
