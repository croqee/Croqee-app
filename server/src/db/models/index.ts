import mongoose from 'mongoose';
import { Score } from './score';
import { User } from './user';

export async function connectDb(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri, { useFindAndModify: false });
    // load models
    await Promise.all([User.init(), Score.init()]);
  } catch (error) {
    console.error(`Mongoose connection error: ${error.message}`);
    process.exit(1);
  }
}
