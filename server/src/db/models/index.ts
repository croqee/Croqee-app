import * as mongoose from 'mongoose';

export async function connect(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error(`Mongoose connection error: ${error.message}`);
    process.exit(1);
  }
  // load models
  //require("./image-schema");
  require('./user');
  require('./score');
}
