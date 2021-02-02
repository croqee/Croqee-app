import { model, Schema } from 'mongoose';

const ScoreSchema = new Schema({
  date: Date,
  modelId: String,
  score: Number,
  userId: String,
});

export const Score = model('Score', ScoreSchema);
